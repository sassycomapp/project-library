---
name: Platform Features & User Flows
globs: ["**/forms/**/*.py", "**/*Form*/__init__.py"]
description: Defines all user-facing features and critical user journeys for all actors in the Mybizz platform — Consulting & Services vertical only. Read when understanding what the product does, how users interact with it, or when implementing any customer-facing flow. Reference authority for intended behaviour in all user flows.
alwaysApply: false
---

# Mybizz Platform — Features & User Flows
# STATUS: ACTIVE — C&S VERTICAL ONLY

**Layer:** platform | **Authority:** Reference — defines intended behaviour for all user flows

**Related resources:**
- `platform_sitemap.md` — all routes and form names for every flow
- `spec_ui_standards.md` — M3 component standards governing all UI referenced here
- `spec_crm.md` — CRM architecture underpinning flows 7–9

**Scope:** Consulting & Services vertical only. Covers user-facing features and critical user journeys for Business Owner, Staff, and Customer actors.

---

## Flow Index

| # | Flow | Actor | Entry Point |
|---|------|-------|-------------|
| 1 | Client Onboarding | New Subscriber | Mybizz marketing site |
| 2 | Services Appointment Booking | Client | `/services` |
| 3 | Admin Daily Operations | Business Owner / Staff | `/admin` |
| 4 | Content Management | Content Manager | `/admin/blog` |
| 5 | Customer Support | Customer / Staff | `/contact` |
| 6 | Error Recovery | All Users | Inline |
| 7 | Contact Management | Business Owner | `/admin/customers` |
| 8 | Email Campaign Setup | Business Owner | `/admin/campaigns` |
| 9 | Marketing Dashboard | Business Owner | `/admin/marketing` |
| 10 | Homepage Customisation | Business Owner | `/admin/settings/website` |
| 11 | Landing Page Creation | Business Owner | `/admin/landing-pages` |
| 12 | Contact Form Submission | Website Visitor | `/contact` |
| 13 | Lead Capture | Campaign Visitor | `/landing/:slug` |

---

## §1 Client Onboarding

**Actor:** New Subscriber — **Duration:** 2–4 hours

**Standard Tier (Free):** 30-min guided call, client does pre-work, Mybizz imports data during call.
**Premium Tier ($200):** Mybizz does all setup, client receives fully operational website.

```
1. PAYMENT & SIGNUP — Business name, email, phone, address, country (sets system currency — IMMUTABLE)
   Billing: $50/month or $25/month (first 50 beta clients)
   Gateways: Stripe (global) or Paystack (Africa)

2. PROVISIONING (Mybizz, 1–2 hours) — Clone master_template, configure dependency,
   initialise tables, set currency, subdomain (clientname.mybizz.live), create Owner credentials

3. ONBOARDING TIER SELECTION → Standard (Step 4A) or Premium (Mybizz handles 4A–4C)

4A. BRANDING — Logo, brand colours, font, tagline

4B. EMAIL SETUP — Client creates free Brevo account, provides SMTP key and API key
    Transactional emails: Brevo SMTP (booking confirmations, reminders, invoices)
    Marketing emails: Brevo Campaigns (configured in Brevo, managed via Mybizz)

4C. PAYMENT GATEWAY — Stripe or Paystack: API keys stored in Vault, test transaction, webhook verified
    PayPal available for one-time payments only — cannot handle subscriptions

4D. SERVICES SETUP — Add service categories, individual services (name, description, duration,
    price, provider), configure availability schedule and booking rules

5. GO LIVE CHECKLIST — Branding ✓, email ✓, payment ✓, services ✓, test booking ✓

6. SUCCESS MILESTONES — Dashboard progress tracker. Nudge emails at Day 3, 7, 14 if stalled.
```

**Key decisions:** Country/currency (IMMUTABLE), Onboarding tier, Gateway.

---

## §2 Services Appointment Booking

```
1. Browse service categories (consultation, treatment, class, etc.)
2. Select service → description, duration, price, provider(s)
3. Select provider (or "any available") — photo, specialisations, availability
4. Select date and time — calendar with available slots
5. Meeting type — In-Person / Video Call / Phone Call
6. Enter client details (new or pre-filled), intake form if required by service type
7. Appointment notes — client describes needs for provider preparation
8. Review & payment (configurable: pay now / optional / deposit)
9. Confirmation — immediate email (Brevo SMTP) + 24h reminder + 1h reminder (optional),
   calendar invite. If Video Call: link included in all emails.
```

**Recurring appointments:** After confirmation, offer weekly / bi-weekly / monthly recurrence.
Payment: per-session or package deal.

---

## §3 Admin Daily Operations

**Navigation:** Custom HtmlTemplate layout with plain Link components and lambda click handlers with mandatory loop variable capture.

```python
lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a)
```

The `fn=` and `a=` keyword arguments in the lambda are not optional. Omitting them causes all nav items to capture the last value of the loop variable — a silent bug.

Do NOT use NavigationDrawerLayoutTemplate. Do NOT use NavigationLink components for sidebar navigation. Do NOT use navigate_to().

**Navigation structure:**
```
Dashboard
▼ Sales & Operations
  Bookings
  Services
▼ Customers & Marketing
  Contacts
  Campaigns        (visible when marketing_enabled = True in config table)
  Broadcasts       (visible when marketing_enabled = True in config table)
  Segments         (visible when marketing_enabled = True in config table)
  Tasks            (visible when marketing_enabled = True in config table)
▼ Content & Website
  Blog             (visible when blog_enabled = True in config table)
  Pages
  Media
▼ Finance & Reports
  Payments
  Invoices
  Time Entries
  Expenses
  Reports
  Analytics
Settings           (Owner / Manager only)
```

**Morning routine:** View today's metrics + alerts → process pending items (upcoming appointments,
pending reviews, support tickets) → check today's calendar.

**Processing a booking:** Open detail → verify details and payment → Confirm (PENDING → CONFIRMED)
→ system sends confirmation email (Brevo SMTP), creates calendar event.

**Parameterised navigation** (row clicks, detail forms with IDs) uses `open_form()` called directly:

```python
open_form('BookingViewerForm', booking_id=row['booking_id'])
```

---

## §4 Content Management

**Update website content:** Pages → select page → edit text/images inline → Preview →
Publish (changes go live immediately).

**Publish blog post:** Blog → New Post → write with rich text editor → set metadata
(excerpt, category, tags, featured image, author) → SEO settings (title, description, slug) →
Publish Now / Save Draft / Schedule → share to social media.

---

## §5 Customer Support

**Customer submits ticket:** Help → search knowledge base first → if unresolved, submit ticket
(subject, category, priority, description, attachments) → ticket number assigned,
confirmation email (Anvil built-in email).

**Staff responds:** Ticket queue (colour-coded by priority) → open ticket → write response →
Send / Send & Mark Resolved. Customer notified by email. Staff monitors until resolved.

---

## §6 Error Recovery

**Payment failure:** Display error → retry same card → if still fails, offer alternative method →
hold booking 15 minutes (save as Payment Pending, send payment link) → release slot on expiry.

**Session timeout (30 min):** Prompt re-login, restore context automatically.

---

## §7 Contact Management

**Entry:** Dashboard → Contacts → ContactListForm

Displays: total count, status breakdown (customers/leads), pre-built segments,
search bar, contact DataGrid (Name, Email, Status, Total Spent, Last Contact).

**Actions:**
- **View segment** — filter list, show metrics, CSV export
- **Search** — real-time filtering
- **View contact** — ContactDetailForm: stats, activity timeline, active campaigns, actions
  (add note, create booking, send email, enroll in campaign)
- **Add contact** — ContactEditorForm: first/last name, email, phone, status, tags
- **Bulk actions** — add tag, enroll in campaign, CSV export

**Integration:** Bookings, forms, and review submissions auto-create/update contacts.

---

## §8 Email Campaign Setup

**Entry:** Marketing → Email Campaigns → `[+ New Campaign]`

```
1. View campaigns dashboard — active campaigns with enrolled count and performance metrics
2. Click [+ New Campaign] → EmailCampaignEditorForm
3. Choose campaign type — pre-built templates for C&S:
   New Client Welcome, Appointment Follow-Up, Re-engagement, Referral Request
4. Review email sequence — preview each email in sequence
5. Set trigger — event type (e.g., appointment completed) and first email delay
6. Activate — confirm campaign settings → [Activate Campaign]
7. Campaign runs automatically — contacts auto-enrolled, emails on schedule,
   opens/clicks tracked via Brevo webhooks
```

**Background process:** Hourly job processes active enrollments. See `spec_crm.md`.

---

## §9 Marketing Dashboard

**Entry:** Marketing → Dashboard

**Displayed metrics:** Total contacts + new this month, revenue (current vs previous),
email performance (sent, open rate, click rate, conversions), top lead sources by revenue,
actionable alerts (inactive contacts, abandoned appointments, upcoming birthdays).

**Actions:** Drill into any metric, one-click enroll contacts from alert, view detailed reports
(Contact Growth, Email Performance, Revenue by Source, Customer Activity, Marketing ROI),
change time period (week/month/quarter), export PDF/CSV/scheduled email.

**Alert logic:** Nightly job at 2am calculates metrics and generates actionable alerts.

---

## §10 Homepage Customisation

**Entry:** Settings → Website → `/admin/settings/website/homepage`

```
1. Select homepage template (4 options — Classic, Services, Booking, Minimalist)
   Preview opens in new tab
2. Configure hero — headline, subheadline, hero image, CTA button text + link
3. Configure features section — up to 5 items (icon, title, 100-char description), drag to reorder
4. Configure services showcase — toggle, count (1–6), display style (cards/list/carousel)
5. Configure testimonials — up to 10 (name, text 300 chars, rating, photo), drag to reorder
6. Configure final CTA — headline, subheadline, button text + link
7. Preview (new tab) → Save Changes → live immediately
```

Auto-saves every 30 seconds. Saves to `config` table with `key = 'home_config'` (simpleObject value).

---

## §11 Landing Page Creation

**Entry:** Admin → Landing Pages → `[Create New Landing Page]`

**3 templates:** Lead Capture, Event Registration, Video Sales Letter.

```
1. Choose template
2. Set basic settings — title (internal), URL slug (auto-generated, editable, unique),
   status (Draft / Published). Preview URL shown.
3. Configure template-specific content — sections vary by template:
   Event Registration example: event details, benefits list, speaker bio, registration CTA,
   FAQ (optional), limited spots toggle, thank-you message, privacy text
4. Preview (new tab, BlankLayout — no header/footer)
5. Publish → validates, saves to landing_pages table, shows shareable URL + social share buttons
6. Share — copy URL, send test email, social media, embed in website, add to email campaign
```

Auto-saves every 30 seconds. Analytics tracked: views, conversions, conversion rate, referrer, device.

---

## §12 Visitor Contact Form Submission

**Entry:** `/contact` — visible in main website navigation

Form fields: Name (required), Email (required), Phone (optional), Message (required, max 1000 chars).

On submit: saves to `contact_submissions` table, sends notification email to business owner
(Anvil built-in email), sends auto-reply to visitor via Brevo SMTP (if configured).
Form resets on success.

Direct contact alternatives: click-to-call phone number, click-to-email address, Google Maps link.

---

## §13 Lead Capture via Landing Page

**Entry:** `/landing/:slug` — BlankLayout (no navigation, no footer, single focused page)

**Simultaneous Lead and Contact Creation:** When a visitor submits an email capture form, the system creates records in both `leads` (capture event) and `contacts` (person record) simultaneously in a single operation. The `leads.converted_to_contact_id` field is set immediately to link the lead to the newly created contact.

```
1. Visitor arrives from campaign (ad, email, social)
   System: page view tracked (landing_pages.views_count += 1)
2. View page content — headline, benefits, hero image, email capture form
3. Enter email address (single field) → submit
4. System: validate email, create simultaneous records in leads and contacts tables,
   set leads.converted_to_contact_id to link them, track conversion
   (landing_pages.conversions_count += 1),
   trigger welcome email via Brevo Campaigns, enroll in welcome sequence automatically
5. Thank you message shown — success message, instruction to check email,
   optional CTA to main site
6. Lead receives welcome email — content/offer, CTA, unsubscribe link
7. Contact appears in CRM immediately with status 'new' and is active in CRM machinery
   (activity timeline, campaigns, lifecycle tracking) from day one
```

**Business owner:** receives "New lead captured" notification (Anvil built-in email),
lead/contact appears in CRM with status 'new' and is enrolled in welcome sequence automatically.

**Key difference from manual conversion:** No additional conversion step required. The lead is immediately a contact in the CRM system, with all CRM machinery (campaigns, activity tracking, lifecycle calculations) functioning from capture time.

---

## §14 Flow Design Principles

All flows follow these principles: progressive disclosure (show only relevant info per step),
clear CTAs with progress indication, real-time input validation, recovery paths for every error
(never dead-end the user), automatic progress saving, and email confirmation for all transactions.

---

*End of file — platform_features.md*
