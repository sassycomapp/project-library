# Mybizz CS — User Flows

**Authority:** Reference — defines intended behaviour for all user flows

---

## Actors

| Actor | Description |
|---|---|
| New Subscriber | A new client signing up for the Mybizz platform |
| Business Owner | The client instance's Owner-role user |
| Manager | Manager-role user — operational management access |
| Admin / Staff | Day-to-day operational roles |
| Customer | The client's end users — booking appointments, accessing the portal |
| Visitor | An unauthenticated user browsing the public website |
| Campaign Visitor | A visitor arriving from a marketing campaign |

---

## Flow Index

| # | Flow | Actor | Entry Point |
|---|------|-------|-------------|
| 1 | Client Onboarding | New Subscriber | Mybizz marketing site |
| 2 | Services Appointment Booking | Customer | `/services` |
| 3 | Admin Daily Operations | Business Owner / Staff | `/admin` |
| 4 | Content Management | Business Owner / Admin | `/admin/blog` |
| 5 | Customer Support | Customer / Staff | `/contact` |
| 6 | Error Recovery | All Users | Inline |
| 7 | Contact Management | Business Owner | `/admin/customers` |
| 8 | Email Campaign Setup | Business Owner | `/admin/campaigns` |
| 9 | Marketing Dashboard | Business Owner | `/admin/marketing` |
| 10 | Homepage Customisation | Business Owner | `/admin/settings/website` | V1 |
| 11 | Landing Page Creation | Business Owner | `/admin/landing-pages` | V1 |
| 12 | Contact Form Submission | Visitor | `/contact` | V1 |
| 13 | Lead Capture via Landing Page | Campaign Visitor | `/landing/:slug` | V1 |

---

## §1 Client Onboarding

**Two tiers:**
- **Standard (included):** 30-minute guided call. Client does preparatory work; Mybizz imports data during the call.
- **Premium ($200):** Mybizz handles all setup. Client receives a fully operational instance.

**Sequence:**
1. **Payment & Signup** — Business name, email, phone, address, country (sets system currency — IMMUTABLE). Billing: $50/month or $25/month for first 50 beta clients.
2. **Provisioning (Mybizz, 1–2 hours)** — Clone master_template, configure dependency, initialise tables, set currency, issue subdomain, create Owner credentials.
3. **Tier selection** — Standard or Premium.
4A. **Branding** — Logo, brand colours, font, tagline.
4B. **Email setup** — Client creates free Brevo account, provides SMTP key and API key.
4C. **Payment gateway** — Stripe or Paystack: API keys stored in Vault, test transaction, webhook verified.
4D. **Services setup** — Add service categories and individual services.
5. **Go Live checklist** — Branding, email, payment, services, test booking.
6. **Success milestones** — Dashboard progress tracker. Nudge emails at Day 3, 7, 14 if stalled.

---

## §2 Services Appointment Booking

1. Browse service categories.
2. Select service — description, duration, price, provider(s).
3. Select provider (specific or "any available") — photo, specialisations, availability.
4. Select date and time slot — calendar showing available slots.
5. Select meeting type — In-Person / Video Call / Phone Call. Video call link generated automatically.
6. Enter client details. Complete intake form if required.
7. Add appointment notes.
8. Review & payment — configurable: pay now / optional / deposit only.
9. Confirmation — immediate email, 24h reminder, 1h reminder (optional), calendar invite.

**Post-confirmation:** Offer recurring appointment option (weekly / bi-weekly / monthly).

---

## §3 Admin Daily Operations

**Navigation structure:**
```
Dashboard
▼ Sales & Operations: Bookings, Services
▼ Customers & Marketing: Contacts, Campaigns, Broadcasts, Segments, Tasks
▼ Content & Website: Blog, Pages, Media
▼ Finance & Reports: Payments, Invoices, Reports, Analytics, Time Entries
Settings (Owner / Manager only)
Vault (Owner only)
```

**Morning routine:** View today's metrics and alerts → process pending items → check today's calendar.

**Processing a booking:** Open detail → verify details and payment status → Confirm (PENDING → CONFIRMED) → system sends confirmation email and creates calendar event.

---

## §4 Content Management

**Update website content:** Pages → select page → edit text/images inline → Preview → Publish.

**Publish blog post:** Blog → New Post → write with rich text editor → set metadata (excerpt, category, tags, featured image, author) → SEO settings → Publish Now / Save Draft / Schedule.

---

## §5 Customer Support

**Customer raises ticket:** Help → search knowledge base first → if unresolved, submit ticket (subject, category, priority, description, attachments) → ticket number assigned, confirmation email sent.

**Staff responds:** Ticket queue (colour-coded by priority) → open ticket → write response → Send / Send & Mark Resolved.

---

## §6 Error Recovery

**Payment failure:** Display error → retry same card → if still failing, offer alternative method → hold booking 15 minutes (save as Payment Pending, send payment link) → release slot on expiry.

**Session timeout (30 minutes):** Prompt re-login. Restore user context automatically.

---

## §7 Contact Management

**Entry:** Dashboard → Contacts → ContactListForm

**Overview:** Total contact count, status breakdown, pre-built segments, search bar, contact DataGrid.

**Actions:** View segment, search, view contact (stats, activity timeline, active campaigns, quick actions), add contact, bulk actions (add tag, enroll in campaign, CSV export).

**Automatic contact creation:** Contacts created or updated automatically from bookings, enquiry forms, and landing page lead captures.

---

## §8 Email Campaign Setup

**Entry:** Marketing → Email Campaigns → [+ New Campaign]

1. View campaigns dashboard — active campaigns with enrolled count and performance.
2. Click [+ New Campaign] → EmailCampaignEditorForm.
3. Choose campaign type — pre-built templates: New Client Welcome, Appointment Follow-Up, Re-engagement, Referral Request.
4. Review email sequence — preview each email with configurable delay.
5. Set trigger — event type and delay before first email.
6. Activate — confirm settings → [Activate Campaign].
7. Campaign runs automatically — contacts auto-enrolled, emails sent on schedule, opens/clicks tracked via Brevo webhooks.

**Background process:** Hourly background task processes active enrollments.

---

## §9 Marketing Dashboard

**Metrics:** Total contacts and new this month, revenue (current vs previous), email performance (sent, open rate, click rate, conversions), top lead sources by revenue, actionable alerts.

**Alert logic:** Nightly background task at 2am calculates metrics and generates alerts.

**Actions:** Drill into any metric, one-click enroll contacts from alert, view detailed reports, change time period, export to PDF/CSV/scheduled email.

---

## §10 Homepage Customisation

1. Select homepage template — four options: Classic, Services, Booking, Minimalist.
2. Configure hero — headline, subheadline, hero image, CTA.
3. Configure features — up to 5 items (icon, title, 100-char description).
4. Configure services showcase — toggle, count (1–6), display style.
5. Configure testimonials — up to 10 (name, text, rating, photo).
6. Configure final CTA — headline, subheadline, button text + link.
7. Preview → Save → live immediately.

Auto-saves every 30 seconds. Configuration stored in `config` table with `key = 'home_config'`.

---

## §11 Landing Page Creation

**Three templates:** Lead Capture, Event Registration, Video Sales Letter.

1. Choose template.
2. Set basic settings — title, URL slug (auto-generated, unique), status (Draft / Published).
3. Configure template-specific content.
4. Preview (BlankLayout — no header/footer).
5. Publish → validates, saves to `landing_pages`, displays shareable URL.
6. Share — copy URL, send test email, social media, embed, add to email campaign.

Analytics tracked: views, conversions, conversion rate, referrer, device.

---

## §12 Contact Form Submission

**Entry:** `/contact`

**Fields:** Name (required), Email (required), Phone (optional), Message (required, max 1000 chars).

**On submission:** Saves to `contact_submissions`, sends notification to business owner, sends auto-reply to visitor if configured. Form resets on success.

---

## §13 Lead Capture via Landing Page

**Entry:** `/landing/:slug` — BlankLayout

1. Visitor arrives from campaign → page view tracked.
2. Views page content — headline, benefits, hero image, email capture form.
3. Submits email address.
4. System: validates email, creates records in both `leads` and `contacts` simultaneously, sets `leads.converted_to_contact_id` immediately, increments conversion count, triggers welcome email via Brevo Campaigns, enrolls in welcome sequence.
5. Thank you message displayed.
6. Lead receives welcome email with content, CTA, unsubscribe link.

**Business owner:** receives "New lead captured" notification. Lead appears in CRM with status 'new'.

---

## §14 Flow Design Principles

- **Progressive disclosure** — show only relevant info per step
- **Clear CTAs with progress indication**
- **Real-time input validation**
- **Recovery paths for every error** — no dead-ends
- **Automatic progress saving**
- **Email confirmation for all transactions**

---

*End of file*
