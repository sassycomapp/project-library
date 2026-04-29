# Brevo — Email Architecture Reference
Created: 2026-03-21
Updated: 2026-03-22

This document records the architectural decision to replace Zoho Mail SMTP and Zoho
Campaigns with Brevo as the unified email platform for Mybizz transactional and
marketing email. See cs-architectural-specification-C.md §8.2 for the planning-level
description.

---

## Why This Decision Was Made

The original architecture used Zoho Mail SMTP for transactional email and Zoho
Campaigns for marketing email. This was replaced for the following reasons:

**Zoho Mail SMTP is broken on the free tier.** Zoho Mail's free plan does not include
SMTP access. Every client starts on the free tier. This means the transactional email
layer — booking confirmations, reminders, invoices — would be non-functional for every
new client from day one. That is not a degraded experience; it is a broken one.

**Two separate Zoho integrations created unnecessary complexity.** Zoho Mail SMTP and
Zoho Campaigns are different products with different credentials, different APIs, and
different configuration paths. Maintaining two integrations, two sets of Vault
credentials, and two settings UIs for what is fundamentally one concern (email) is
avoidable complexity.

**Brevo resolves both problems.** Brevo's free tier includes SMTP access and marketing
automation from day one. One integration, one set of credentials, one settings UI. The
free tier is genuinely functional, not a trial-limited stub.

---

## What Brevo Replaces and What Stays

| Previous | Replaced by | Notes |
|---|---|---|
| Zoho Mail SMTP (transactional) | Brevo SMTP | Full replacement |
| Zoho Campaigns (marketing) | Brevo automation + campaigns | Full replacement |
| Anvil built-in email (system) | Unchanged | Login, password reset — stays as-is |
| Zoho CRM sync | Unchanged | Contact sync is separate from email |

---

## Brevo Free Tier (Verified 2026-03-21)

Source: https://www.brevo.com/pricing/

| Feature | Free Tier |
|---|---|
| Daily email send limit | 300 emails/day |
| Monthly email send limit | 9,000 emails/month |
| SMTP access | Included |
| Marketing automation (workflows) | Included |
| Contacts entering automation/month | 2,000 |
| Unsubscribe management | Included |
| Open and click tracking | Included |
| Transactional email logs | Included |
| API access | Included |
| Brevo branding on emails | Yes (free tier) |

**The 300 emails/day limit** applies to transactional and marketing sends combined. For
a small active client (say 30 appointments generating a confirmation + 24h reminder +
1h reminder = 90 emails/day), this is adequate. A busy client approaching 100
appointments per day will hit the limit and should upgrade.

**Brevo branding** appears as a small footer on free tier emails. Clients who want
unbranded email upgrade to a paid plan. This is their decision, not Mybizz's.

---

## Paid Tier Upgrade Path

Clients upgrade directly with Brevo. No Mybizz code changes are required on upgrade —
the SMTP credentials and API key are the same structure regardless of tier. Only the
sending limits change.

| Plan | Monthly emails | Daily limit | Price |
|---|---|---|---|
| Free | 9,000 | 300/day | $0 |
| Starter | 100,000 | No daily limit | From ~$9/month |
| Business | 100,000+ | No daily limit | From ~$18/month |

Starter removes the daily limit and Brevo branding. Business adds advanced automation
and A/B testing. Most Mybizz clients will find Starter sufficient for years.

---

## Sender Identity — From Address

Transactional and marketing emails can send from:

**Option A — Client's own domain (recommended):** The client configures DKIM and SPF
records on their domain via Cloudflare. Brevo authenticates the domain and emails
appear to come from e.g. hello@sallysspa.com. This is the correct professional setup
and is free to configure. Mybizz should guide clients through this during onboarding
or premium setup.

**Option B — Brevo sending domain:** If DKIM is not configured, Brevo sends from a
@brevosend.com address. Emails are delivered reliably but the from address is not the
client's own domain. This is acceptable as a starting point — the client can upgrade
their configuration at any time without Mybizz involvement.

**The from address shown to the recipient** is set in Brevo's sender settings, not in
the SMTP credentials. A client can configure their from name as "Sally's Spa" and from
address as hello@sallysspa.com regardless of whether DKIM is set up — the display
name is always theirs.

---

## Mybizz Integration Architecture

### Transactional Email

`transactional_email_service.py` in server_emails/ connects to Brevo's SMTP relay.
Connection constants are hardcoded in the module — they do not vary per client and are
not stored in the database:

- SMTP host: `smtp-relay.brevo.com` (constant)
- Port: 587 (constant, STARTTLS)
- Authentication: Brevo SMTP key retrieved from the Vault at `brevo_smtp_key`
- From address / from name: retrieved from `email_config` at send time

The connection pattern (smtplib + STARTTLS) is identical to the previous Brevo SMTP
implementation. The change is the host, port, credentials, and the removal of
smtp_username as a separate field — Brevo authenticates with the SMTP key directly.

### Marketing Email / Campaigns

`brevo_campaigns_integration.py` in server_marketing/ handles all campaign functionality. Brevo's API handles:
- Contact list management (sync with Mybizz contacts table)
- Campaign creation and scheduling
- Automation workflow triggers (booking completed, first visit, inactive contact)
- Broadcast emails to segments
- Webhook callbacks for open/click tracking

The Brevo API key is stored in the Vault as `brevo_api_key`. This is separate from the
SMTP key — two distinct credentials, both in the Vault.

### Credentials in the Vault

| Vault key | Value |
|---|---|
| `brevo_smtp_key` | SMTP key from Brevo account settings |
| `brevo_api_key` | API key from Brevo account settings |

Both are set by the client Owner via the email settings UI. Mybizz never sees or holds
these credentials — they live in each client's own Vault.

---

## The email_config Table

The `email_config` table stores only the non-sensitive email identity fields. It has
five columns:

| Column | Type | Purpose |
|---|---|---|
| `from_email` | string | The sender address shown to recipients |
| `from_name` | string | The sender display name shown to recipients |
| `configured` | bool | Set to True only after a successful Brevo connection test |
| `configured_at` | datetime | Timestamp of last successful test |
| `sender_domain_verified` | bool | Whether DKIM/SPF verification is complete in Brevo |

Brevo credentials (`brevo_smtp_key`, `brevo_api_key`) are never stored in this table.
They live exclusively in the Vault.

The previously present SMTP columns (`email_provider`, `smtp_host`, `smtp_port`,
`smtp_username`, `smtp_password`) have been removed. Host and port are now hardcoded
constants in `transactional_email_service.py`. The SMTP key replaces the
username/password authentication pattern.

---

## What Happens When Brevo Is Not Connected

If a client has not configured Brevo credentials, the email features degrade gracefully:

- Transactional emails (booking confirmations, reminders, invoices): not sent. The
  booking is created successfully; the email is skipped and logged as undelivered.
- Marketing campaigns: inactive. Campaign processing runs but skips send steps.
- System emails (login, password reset via Anvil): unaffected — these use Anvil's
  built-in service, not Brevo.

The platform does not crash or error on missing Brevo credentials. It logs a warning
and continues. This is the correct behaviour for an optional integration.

---

## Onboarding Implications

The onboarding flow is simplified by this change:

**Previous:** Mybizz provisioned 5 Zoho free email addresses, configured DNS MX records
for Zoho, set up the Zoho Mail account, stored SMTP credentials. This was a significant
manual step requiring Zoho admin access and DNS changes.

**New:** The client creates a free Brevo account (2 minutes, no credit card). They find
their SMTP key in Brevo account settings and paste it into Mybizz email settings. Mybizz
stores it in the Vault. Done. The client's business email addresses (if they have them)
are entirely their own concern — Google Workspace, Zoho Workplace, Microsoft 365,
whatever they prefer. Mybizz does not provision or manage business mailboxes.

If the client wants emails to come from their own domain, they configure DKIM in
Cloudflare. Mybizz can guide this as part of premium onboarding but does not require it.

---

## Brevo Resources

- Pricing: https://www.brevo.com/pricing/
- SMTP documentation: https://developers.brevo.com/docs/send-a-transactional-email
- API documentation: https://developers.brevo.com/reference/getting-started-1
- Sender authentication (DKIM): https://help.brevo.com/hc/en-us/articles/208848195

---

*End of file — brevo-email-reference.md*
