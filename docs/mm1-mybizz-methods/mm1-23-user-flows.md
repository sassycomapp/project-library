# Mybizz — Consulting & Services — User Flows
Created: 2026-03-21
Updated: 2026-03-21

---

## Purpose of This Document

This document defines the intended user flows for all actors in the Mybizz Consulting &
Services platform. It is the planning authority for what the product does and how users
interact with it. It is written for the developer and the author — not for the agent.

The rules file `platform_features.md` is the agent-facing version of this content. This
document is the planning source; `platform_features.md` is the agent implementation
reference. When the two conflict, this document is the authority.

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
| Campaign Visitor | A visitor arriving from a marketing campaign (email, ad, social) |

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
| 10 | Homepage Customisation | Business Owner | `/admin/settings/website` |
| 11 | Landing Page Creation | Business Owner | `/admin/landing-pages` |
| 12 | Contact Form Submission | Visitor | `/contact` |
| 13 | Lead Capture via Landing Page | Campaign Visitor | `/landing/:slug` |

---

## §1 Client Onboarding

**Actor:** New Subscriber — **Estimated duration:** 2–4 hours

**Two onboarding tiers:**

- **Standard (included):** 30-minute guided call. Client does preparatory work;
  Mybizz imports data during the call.
- **Premium ($200):** Mybizz handles all setup. Client receives a fully operational
  instance without touching configuration.

**Onboarding sequence:**

1. **Payment & Signup** — Business name, email, phone, address, country (sets system
   currency — IMMUTABLE after first transaction). Billing: $50/month or $25/month for
   first 50 beta clients. Gateway: Stripe (global) or Paystack (Africa).
2. **Provisioning (Mybizz, 1–2 hours)** — Clone master_template, configure dependency,
   initialise tables, set currency, issue subdomain (`clientname.mybizz.app`), create
   Owner credentials.
3. **Tier selection** — Standard (client handles steps 4A–4D) or Premium (Mybizz
   handles 4A–4C on behalf of client).
4A. **Branding** — Logo, brand colours, font, tagline.
4B. **Email setup** — Client creates free Brevo account, provides SMTP key and API key.
    Transactional emails via Brevo SMTP (booking confirmations, reminders, invoices).
    Marketing emails via Brevo Campaigns configured in Brevo, managed via Mybizz.
4C. **Payment gateway** — Stripe or Paystack: API keys, test transaction, webhook
    verified. PayPal available for one-time payments only.
4D. **Services setup** — Add service categories and individual services (name,
    description, duration, price, provider, availability schedule and booking rules).
5. **Go Live checklist** — Branding ✓, email ✓, payment ✓, services ✓, test booking ✓.
6. **Success milestones** — Dashboard progress tracker. Nudge emails at Day 3, 7, 14
   if stalled.

**Key decisions made at onboarding:** Country/currency (immutable), tier, gateway.

---

## §2 Services Appointment Booking

**Actor:** Customer (self-service) or Admin/Staff (booking on behalf of customer)

1. Browse service categories.
2. Select service — description, duration, price, provider(s).
3. Select provider (specific or "any available") — photo, specialisations, availability.
4. Select date and time slot — calendar showing available slots.
5. Select meeting type — In-Person / Video Call / Phone Call. Video call link generated
   automatically for Video Call bookings and included in all confirmation communications.
6. Enter client details (new entry or pre-filled for known customers). Complete intake
   form if required by service.
7. Add appointment notes — client describes needs for provider preparation.
8. Review & payment — configurable per service: pay now / optional / deposit only.
9. Confirmation — immediate email, 24h reminder, 1h reminder (optional), calendar invite.
   Video Call link included in all communications if applicable.

**Post-confirmation:** Offer recurring appointment option (weekly / bi-weekly / monthly).

**Payment options:** Per-session or package deal, configurable per service.

---

## §3 Admin Daily Operations

**Actor:** Business Owner, Manager, Admin, Staff

**Navigation:** AdminLayout — custom HtmlTemplate with Link components built
programmatically. Lambda click handlers with loop variable capture. `open_form(string)`
is the navigation mechanism. NavigationDrawerLayoutTemplate and NavigationLink are not
used. See ADR in cs-architectural-specification-D.md §13.

**Navigation structure:**
```
Dashboard
▼ Sales & Operations
  Bookings
  Services
▼ Customers & Marketing
  Contacts
  Campaigns
  Broadcasts
  Segments
  Tasks
▼ Content & Website
  Blog
  Pages
  Media
▼ Finance & Reports
  Payments
  Invoices
  Reports
  Analytics
Settings (Owner / Manager only)
```

Navigation item visibility is feature-driven — items are shown or hidden based on the
client's feature configuration, not hardcoded. Role-based visibility: Settings visible
to Owner and Manager only; Vault accessible to Owner only.

**Typical morning routine:**
- View today's metrics and alerts on Dashboard.
- Process pending items: upcoming appointments, pending reviews, support tickets.
- Check today's calendar.

**Processing a booking:**
- Open booking detail → verify details and payment status → Confirm (PENDING → CONFIRMED).
- System sends confirmation email and creates calendar event.

---

## §4 Content Management

**Actor:** Business Owner / Admin

**Update website content:** Pages → select page → edit text/images inline → Preview →
Publish (changes go live immediately).

**Publish blog post:** Blog → New Post → write with rich text editor → set metadata
(excerpt, category, tags, featured image, author) → SEO settings (title, description,
URL slug) → Publish Now / Save Draft / Schedule → share to social media.

---

## §5 Customer Support

**Actor:** Customer (raises ticket), Staff (responds)

**Customer raises ticket:** Help → search knowledge base first → if unresolved, submit
ticket (subject, category, priority, description, attachments) → ticket number assigned,
confirmation email sent to customer.

**Staff responds:** Ticket queue (colour-coded by priority) → open ticket → write
response → Send / Send & Mark Resolved. Customer notified by email. Staff monitors
ticket until resolved.

---

## §6 Error Recovery

**Actor:** All users

**Payment failure:** Display error → offer retry on same card → if still failing, offer
alternative payment method → hold booking 15 minutes (save as Payment Pending, send
payment link to customer) → release booking slot on expiry.

**Session timeout (30 minutes):** Prompt re-login. Restore user context automatically
after successful login.

---

## §7 Contact Management

**Actor:** Business Owner / Manager / Admin

**Entry:** Dashboard → Contacts → ContactListForm

**Overview displayed:** Total contact count, status breakdown (Customers / Leads),
pre-built segments, search bar, contact DataGrid (Name, Email, Status, Total Spent,
Last Contact date).

**Actions available:**
- **View segment** — filter list by segment, display segment metrics, CSV export.
- **Search** — real-time filtering as the user types.
- **View contact** — ContactDetailForm: stats panel, full activity timeline (bookings,
  emails, notes, form submissions), active campaigns, quick actions (add note, create
  booking, send email, enroll in campaign).
- **Add contact** — ContactEditorForm: first name, last name, email, phone, status, tags.
- **Bulk actions** — add tag, enroll in campaign, CSV export.

**Automatic contact creation:** Contacts are created or updated automatically from
bookings, enquiry form submissions, and landing page lead captures.

---

## §8 Email Campaign Setup

**Actor:** Business Owner / Manager

**Entry:** Marketing → Email Campaigns → [+ New Campaign]

1. View campaigns dashboard — active campaigns with enrolled count and performance metrics.
2. Click [+ New Campaign] → EmailCampaignEditorForm.
3. Choose campaign type — pre-built templates for C&S:
   - New Client Welcome
   - Appointment Follow-Up
   - Re-engagement
   - Referral Request
4. Review email sequence — preview each email with configurable delay between messages.
5. Set trigger — event type (e.g., appointment completed) and delay before first email.
6. Activate — confirm settings → [Activate Campaign].
7. Campaign runs automatically — contacts auto-enrolled on trigger event, emails sent
   on schedule, opens and clicks tracked via Brevo webhooks.

**Background process:** Hourly background task processes active enrollments.

---

## §9 Marketing Dashboard

**Actor:** Business Owner / Manager

**Entry:** Marketing → Dashboard

**Metrics displayed:**
- Total contacts and new contacts this month
- Revenue (current period vs previous period)
- Email performance (sent, open rate, click rate, conversions)
- Top lead sources by revenue
- Actionable alerts (inactive contacts, abandoned appointment enquiries, upcoming
  birthdays, re-booking prompts)

**Alert logic:** Nightly background task at 2am calculates metrics and generates alerts.

**Actions from dashboard:**
- Drill into any metric for detail.
- One-click enroll contacts directly from an alert.
- View detailed reports: Contact Growth, Email Performance, Revenue by Source,
  Customer Activity, Marketing ROI.
- Change time period (week / month / quarter).
- Export to PDF / CSV / scheduled email delivery.

---

## §10 Homepage Customisation

**Actor:** Business Owner

**Entry:** Settings → Website → Homepage

1. Select homepage template — four options: Classic, Services, Booking, Minimalist.
   Preview opens in new browser tab.
2. Configure hero section — headline, subheadline, hero image, CTA button text and link.
3. Configure features section — up to 5 items (icon, title, 100-character description).
   Drag to reorder.
4. Configure services showcase — toggle visibility, count (1–6), display style
   (cards / list / carousel).
5. Configure testimonials — up to 10 (name, text up to 300 characters, rating, photo).
   Drag to reorder.
6. Configure final CTA — headline, subheadline, button text and link.
7. Preview in new tab → Save Changes → changes go live immediately on save.

**Auto-save:** Configuration saves automatically every 30 seconds.

**Storage:** Configuration stored in the `config` table with `key = 'home_config'`
as a simpleObject.

---

## §11 Landing Page Creation

**Actor:** Business Owner / Manager

**Entry:** Admin → Landing Pages → [Create New Landing Page]

**Three templates available:** Lead Capture, Event Registration, Video Sales Letter.

1. Choose template.
2. Set basic settings — title (internal), URL slug (auto-generated, editable, unique
   per instance), status (Draft / Published). Preview URL shown.
3. Configure template-specific content. Example for Event Registration: event details,
   benefits list, speaker bio, registration CTA, FAQ (optional), limited spots toggle,
   thank-you message, privacy text.
4. Preview in new tab (BlankLayout — no header, no footer, single focused page).
5. Publish — validates content, saves to `landing_pages` table, displays shareable URL
   and social share options.
6. Share — copy URL, send test email, share to social media, embed on website, add to
   email campaign.

**Auto-save:** Content saves automatically every 30 seconds.

**Analytics tracked:** Views, conversions, conversion rate, referrer, device type.

---

## §12 Contact Form Submission

**Actor:** Website Visitor

**Entry:** `/contact` — visible in main website navigation

**Form fields:** Name (required), Email (required), Phone (optional), Message (required,
maximum 1000 characters).

**On submission:**
- Saves to `contact_submissions` table.
- Sends notification email to business owner.
- Sends auto-reply to visitor if auto-reply is configured.
- Form resets on success.

**Alternative contact options on the page:** Click-to-call phone number,
click-to-email address, Google Maps location link.

---

## §13 Lead Capture via Landing Page

**Actor:** Campaign Visitor

**Entry:** `/landing/:slug` — BlankLayout (no navigation, no footer, single conversion-
focused page)

1. Visitor arrives from campaign (paid ad, email, social media).
   System tracks page view (`landing_pages.views_count` incremented).
2. Visitor views page content — headline, benefits, hero image, email capture form.
3. Visitor submits email address (single required field).
4. System:
   - Validates email.
   - Creates records in both `leads` and `contacts` tables simultaneously.
   - Sets `leads.converted_to_contact_id` immediately to link them.
   - Increments `landing_pages.conversions_count`.
   - Triggers welcome email via Brevo Campaigns.
   - Enrolls lead in welcome sequence automatically.
5. Thank you message displayed — success message, instruction to check email, optional
   CTA to main website.
6. Lead receives welcome email — content/download link, main CTA, unsubscribe link.

**Business owner notification:** Receives "New lead captured" notification. Lead appears
in CRM with status 'new' and is immediately active in CRM machinery.

**Ruling (2026-03-21):** Captured leads create records in both `leads` and `contacts`
simultaneously at capture time. Lead is immediately enrolled in welcome sequence. No
manual conversion step required. See cs-architectural-specification-D.md §13 for full
rationale.

---

## §14 Flow Design Principles

All flows follow these principles:

- **Progressive disclosure** — show only the information relevant to the current step.
- **Clear CTAs with progress indication** — users always know where they are and what
  comes next.
- **Real-time input validation** — validation fires as the user fills in the form, not
  only on submission.
- **Recovery paths for every error** — no flow dead-ends the user. Every error state
  has a clear next action.
- **Automatic progress saving** — multi-step flows save progress automatically.
- **Email confirmation for all transactions** — every booking, payment, registration,
  and lead capture triggers an appropriate confirmation email.

---

*End of file — cs-user-flows.md*
