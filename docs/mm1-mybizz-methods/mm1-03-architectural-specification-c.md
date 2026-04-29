# Mybizz — Consulting & Services — Architectural Specification
# Part C of D: Sections 8–10
Created: 2026-03-17
Updated: 2026-03-22

---

# Part C continues from cs-architectural-specification-B.md
# Sections 1–4 are in Part A.
# Sections 5–7 are in Part B.
# Sections 11–13 are in Part D.

---

## 8. Integration Architecture

### 8.1 The Gateway-Agnostic Payment Layer

Three payment gateways are supported. The client instance uses one gateway, configured
at onboarding. All three gateways handle one-time payments — the platform does not
implement subscription billing for client businesses. Subscription billing for Mybizz's
own clients is handled separately in Mybizz_management and is not part of the master
template.

Stripe is the Anvil-native gateway and the primary international option. It is broadly
accepted globally and straightforward to implement with Anvil's built-in Stripe support.

Paystack is the appropriate gateway for South African and African clients. Stripe does
not operate in South Africa. Paystack covers South Africa and the broader African market.

PayPal is included as a globally recognised payment standard with wide consumer
acceptance.

The critical architectural point is that client code never calls a gateway directly.
All payment operations go through a gateway-agnostic service layer in server_payments/.
The service layer determines which gateway to call based on the `active_gateway` value
in `payment_config`. This means client forms are identical regardless of which gateway
the client uses, and adding or changing gateway support requires changes only in
server_payments/, not in client code.

All gateway credentials (secret keys, webhook secrets) are stored in the Vault and
retrieved via `get_vault_secret()` at runtime. They are never in code, never in Data
Tables, never in Anvil Secrets.

Webhooks from all three gateways are received at dedicated HTTP endpoints and verified
by signature before processing. Payment events are logged to `webhook_log`.

Payment is integrated into the booking flow. There is no separate checkout process. The
payment model is central-account only — all payments go to the business's single
account. Per-provider payment accounts are not supported.

System currency is set at onboarding and is immutable after the first transaction. All
calculations and reporting use the system currency. An optional display currency for
customer-facing prices may be configured separately.

### 8.2 The Three-Tier Email Architecture

Three email systems serve different purposes and must not be mixed. Mixing them would
compromise deliverability, exceed quotas, and blur the distinction between system
notifications and business communications.

**Anvil built-in email** is used for system-level platform events: login confirmations,
password reset links, account notifications, and any email that originates from the
Mybizz platform rather than from the client's business identity. Each client instance
has approximately 1,000 emails per month via this service. Emails sent via this service
come from an Anvil-hosted address. It is accessed via `anvil.email.send()` and handled
by `system_email_service.py` in server_emails/.

**Brevo SMTP** handles transactional business emails — booking confirmations,
appointment reminders, invoice delivery, contact form auto-replies. These emails
originate from the client's business identity and land in the recipient's inbox as
business correspondence. The SMTP key is stored in the Vault as `brevo_smtp_key`. The
from address and from name are stored in `email_config`. SMTP connection constants are
hardcoded in `transactional_email_service.py`: host `smtp-relay.brevo.com`, port 587,
STARTTLS. This is handled by `transactional_email_service.py` in server_emails/. Email
template management is in `email_templates.py` in the same package.

Brevo is client-connected: each client creates their own Brevo account (free tier
available from day one), stores their SMTP key in the Vault, and manages their own plan
and sending limits. Mybizz has no involvement in the client's Brevo account. The free
tier provides 300 emails/day and includes SMTP access.

**Brevo campaigns** handles all marketing email — campaign sequences, broadcast emails,
newsletter communications. These are subject to unsubscribe management, open and click
tracking, and the expectations of marketing email recipients. The Brevo API key is
stored in the Vault as `brevo_api_key`. This is separate from the SMTP key — two
distinct Vault credentials per client.

Brevo consolidates what was previously two separate integrations (Zoho Mail SMTP +
Zoho Campaigns) into a single platform with one account per client. The `email_config`
table stores only the non-sensitive email identity fields: `from_email`, `from_name`,
`configured` (bool), `configured_at` (datetime), `sender_domain_verified` (bool).
All Brevo credentials live exclusively in the Vault.

**Full implementation detail:** `@devref/brevo-email-reference.md`

### 8.3 Brevo CRM Integration

The Brevo CRM integration is an optional convenience provided to clients, not a service
Mybizz sells or administers. The integration is present in the codebase
(`brevo_crm_sync.py` in server_crm_sync/). Clients who want it connect their own Brevo
account. Clients who do not want it leave it unconnected — Mybizz CRM functions
independently as a local contact store in that case.

Note: Brevo CRM is the contact sync integration only. Email (transactional and
marketing) is handled by Brevo. These are integrated within the same platform. A client
uses Brevo for both contact sync and email functions together.

**Per-client org model:**
Each Mybizz client instance connects to its own separate Brevo organisation. Mybizz
does not operate a single shared Brevo org across all clients — that would violate
data isolation. Each client's Brevo credentials are stored in their own Vault.

**Free tier capabilities (verified 2026-03-21):**
- Unlimited user seats for API access. No per-seat limitation.
- 100,000 contacts. This provides substantial capacity for growing clients.
- Full API access with marketing automation workflows, contact history, and pipeline.
- No separate API credit constraints — standard request-based rate limiting applies.

**Upgrade path:**
Clients who require advanced features upgrade directly with Brevo. Mybizz does not need
to change any code when a client upgrades — the API is identical across tiers.

The `brevo_crm_id` field on the contacts table holds the Brevo CRM record ID for sync
operations. All Brevo CRM credentials (API key) are stored in the Vault.

CRM is automatically updated whenever a booking or service transaction is created. No
feature module updates the CRM directly — all CRM updates flow through
contact_service.py's `update_contact_from_transaction()` function.

**Full implementation detail:** `@devref/brevo-crm-reference.md`

### 8.4 Background Tasks

Three scheduled background tasks keep the platform's CRM and marketing data current:

Lifecycle stage updates run daily at 02:00. They recalculate the lifecycle stage (New,
Active, At Risk, Lost) for all contacts based on days since last contact and
transaction history.

Campaign processing runs hourly. It evaluates all active campaign enrollments and sends
the next email in the sequence when timing rules allow.

Automated task generation runs daily at 03:00. It creates follow-up tasks based on
upcoming bookings and other triggers.

Any operation expected to take longer than 22 seconds should use a background task via
`@anvil.server.background_task`. This is the 75% threshold of Anvil's documented 30-
second server function timeout. The 30-second limit is a hard platform constraint —
any function that exceeds it will be terminated by Anvil regardless of its state.
Background tasks have no timeout limit. They are launched from regular callables and
progress can be tracked via `anvil.server.task_state`.

---

## 9. Domain and Provisioning Architecture

### 9.1 Timezone Architecture

Each client instance operates in its own timezone, configured at onboarding and stored
in the `business_profile` table as a `timezone` field (string, IANA timezone name —
e.g. `'Africa/Johannesburg'`, `'Europe/London'`). This field is set during provisioning
and is editable by the Owner through the business profile settings.

All datetimes are stored in the database as UTC. Conversion to the client's local
timezone occurs at display time in server functions that return datetime data for UI
presentation. Client code never handles timezone conversion. Background tasks that run
on schedules (02:00 lifecycle updates, 03:00 task generation) use the client's
configured timezone to determine when to execute in the client's local time, but store
all datetime records in UTC.

The Mybizz master template and development processes operate on UTC+2
(Africa/Johannesburg). This is the developer's local timezone and is used for all
reference system timestamps, devlog entries, and build artefacts. It must not be
confused with client timezone handling — these are independent concerns.

### 9.2 Domain Model

Mybizz owns the domain mybizz.live. Client subdomains are issued from this domain.
Cloudflare is used for all DNS, CDN, and security without exception.

Two scenarios exist at onboarding:

In Scenario A, the client has no domain. They receive a subdomain in the format
`businessname.mybizz.live` for their app URL. Mybizz issues the subdomain and
configures Cloudflare DNS.

In Scenario B, the client brings their own domain. They provide the domain name and
registrar access. Mybizz points nameservers to Cloudflare and configures DNS. The app
lives at the root domain.

Clients on Scenario A can migrate to Scenario B at any time. Mybizz handles the
technical migration — the client's data, configuration, and Vault contents are
untouched throughout.

**Business email** is not provisioned by Mybizz. Clients use whatever email provider
they choose — Google Workspace, Zoho Workplace, Microsoft 365, or any other provider.
Mybizz does not set up, administer, or manage client email accounts. If the client
wants transactional emails to come from their own domain (e.g. hello@sallysspa.com),
they configure DKIM and SPF records in Cloudflare and verify their sender domain in
Brevo. Mybizz can assist with DKIM configuration as part of premium onboarding.

### 9.3 Brevo Account Setup

Each client connects their own Brevo account during onboarding.

**Standard onboarding:** The client creates a free Brevo account at brevo.com, locates
their SMTP and API keys in Brevo account settings, and enters them in Mybizz email and
CRM settings. Mybizz stores the keys in the Vault. The client is responsible for their
own Brevo account, plan, and sending limits.

**Premium onboarding:** Mybizz performs the Brevo account setup on the client's behalf,
configures DKIM authentication on the client's domain via Cloudflare, verifies the
sender domain in Brevo so that transactional emails appear to come from the client's
own address, and configures the API key for CRM sync and campaign integration.

Mybizz does not hold, share, or have visibility into client Brevo credentials after
they are stored in the Vault.

### 9.4 The config Table and Non-Sensitive Settings

The `config` table is a general-purpose key-value store for non-sensitive platform
settings. It uses columns: `key` (string), `value` (simpleObject), `category` (string),
`updated_at` (datetime), `updated_by` (link to users). It is distinct from the
structured single-row config tables (`business_profile`, `email_config`,
`payment_config`, `theme_config`) which hold domain-specific structured settings.

The `config` table is appropriate for: feature flags (`marketing_enabled`,
`blog_enabled`), behavioural settings, platform preferences, and any other non-sensitive
settings that do not warrant a dedicated structured table. Sensitive settings (API keys,
credentials, secrets) never go in the config table — they go in the Vault.

Access to the config table is server-side only. The settings UI reads and writes config
values through server callables in server_settings/service.py.

### 9.5 The create_initial_config() Function

The `create_initial_config()` function in server_settings/service.py is a provisioning
utility. It bootstraps a fresh installation with the correct initial state for all
configuration tables. The function must initialise the following:

- `business_profile` — business name and default timezone (`Africa/Johannesburg`)
- `email_config` — `configured = False`, `sender_domain_verified = False`;
  `from_email` and `from_name` are left empty for the Owner to complete
- `payment_config` — all gateway fields empty, `test_mode = True`, `configured_at` set
- `theme_config` — default colour values and font family

This function has a separate purpose from the settings read/write functions and must not
be modified during normal development, polish passes, or rewrites unless the provisioning
contract itself changes. It is the provisioning contract between Mybizz and a new client
instance.

### 9.6 Offboarding

On offboarding, the client receives a full export of all Data Tables, their
encryption_key, and Vault contents in decrypted form on verified request. Mybizz retains
nothing of the client's data after offboarding is complete. Domain handling depends on
which scenario the client was on — Scenario A subdomains are retired to the mybizz.live
pool; Scenario B domains belong entirely to the client.

---

## 10. Testing Architecture

### 10.1 Three Testing Levels

Testing follows a defined three-level protocol. Levels must be passed in sequence —
Level 2 cannot run with Level 1 failures, and code cannot be merged with Level 3
failures.

Level 1 is pure logic testing with pytest, run locally with no Anvil connection.
Business logic is extracted into pure Python modules with no Anvil imports. These
modules are deterministic and side-effect free. They are tested with standard pytest
patterns. Tests live in `tests/{stage}-{feature}/` and run with
`pytest tests/<stage>-<feature>/ -v`. This level provides immediate, low-risk feedback
on every code change.

Level 2 is integration testing via Anvil Uplink. A Server Uplink script connects to
the live Anvil app and exercises real server functions against real Data Tables. The
Uplink key is stored as the `ANVIL_UPLINK_KEY` environment variable — never hardcoded.
Server Uplink only — the key must begin with `server_`. A backup is required before
Level 2 runs. All test data is marked with `source='Test'` and cleaned up after.
Children are always deleted before parents in cleanup.

Level 3 is Continue.dev Checks — AI-powered code review running on every pull request.
Eleven permanent check files in `.continue/checks/` grow stage by stage, each appending
a new section when a stage is complete. The check files cover security, data integrity,
response envelope, error handling, code quality, M3 compliance, navigation, data
binding, naming conventions, regulatory compliance, and test coverage.

### 10.2 Uplink Architecture

Server Uplink gives a local Python script the same privileges as a Server Module —
full Data Tables access, ability to call `@anvil.server.callable` functions, and
ability to register its own callables. For Mybizz, Uplink is used for Level 2
integration testing and for any data administration task more conveniently run from a
local script.

The connection pattern always uses `try/finally` to ensure `disconnect()` runs even if
a call raises. The key must be validated at startup — if it does not begin with
`server_`, the script raises immediately rather than connecting with insufficient
privileges.

### 10.3 Backup Protocol

A backup is taken before Level 2 integration tests (safety checkpoint) and again after
all tests pass (known good state). A red or failing state is never backed up.

Backup naming uses datetime stamps for serialisation: `mybizz-core-YYYYMMDD-HHMM-(description)`.
Backups of the Anvil app itself are made via Anvil IDE clone and named
`BU mybizz-core YYYYMMDD-HHMM (description)`. The `YYYYMMDD-HHMM` format in filenames
is a compact filename convention — document and log timestamps use the full
`YYYY-MM-DD HH:MM` format.

---

*End of Part C — continues in cs-architectural-specification-D.md*
