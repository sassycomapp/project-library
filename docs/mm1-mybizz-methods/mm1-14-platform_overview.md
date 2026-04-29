---
name: Platform Overview — Consulting & Services
globs: []
description: Defines what Mybizz is — business model, Consulting & Services vertical, revenue model, target scale, data isolation rule, and all core features. Read before working on any feature to confirm scope and alignment.
alwaysApply: false
---

# Mybizz — Consulting & Services Platform Overview

**Vertical:** Consulting & Services
**Architecture:** Single vertical, dependency-based (master_template → client instances)
**UI Theme:** Material Design 3 (M3)
**Platform Capacity:** 100 clients (V1.x)

**Authority:** Mandatory — defines the product. All development work must align with this document.

**Related resources:**
- `spec_architecture.md`
- `spec_crm.md`
- `spec_database.md`
- `policy_security.md`

---

## 1. What Mybizz Is

Mybizz is a complete online business management platform for consulting and services businesses, delivered as a subscription. Each subscription provides a fully operational online presence and business management system — from public website through to CRM, bookings, payments, and reporting.

**Target businesses:** salons, spas, therapists, personal trainers, physiotherapists, consultants, coaches, clinics, studios, and any business that sells services — either as timed appointments or as fixed-price deliverables.

---

## 2. Who It Serves

**Consulting & Services businesses** — any business that sells professional services, appointments, or expertise.

| Business Type | Example Use |
|---|---|
| Day spa / beauty salon | Multiple therapists, own schedules, services, and fees |
| Physiotherapy practice | Appointment booking, intake forms, treatment notes |
| Personal trainer | Session bookings, packages, client progress |
| Independent consultant | Fixed-price deliverable services, invoicing |
| Life coach / therapist | Video, phone, or in-person sessions |
| Legal or accounting firm | Unit-based service pricing, invoicing |

**Solo operators and multi-provider businesses are both supported.** Providers are Staff-role users. Each provider has their own schedule, services, and booking availability.

---

## 3. Core Features

### 3.1 Authentication & Administration

- Email/password login, password reset, optional 2FA
- RBAC roles: Owner, Manager, Admin, Staff, Customer
- Rate-limited login, account lockout, full audit trail
- Dashboard: revenue, booking count, customer totals — with period comparison
- Settings: business profile, theme, currency, user & permissions management
- The Vault: encrypted secrets store for all API keys — owner-only access

### 3.2 Public-Facing Website

**Standard pages:** Home, About, Contact (with enquiry form), Privacy Policy, Terms & Conditions

**Dynamic pages:** Services listing & detail (with images and video), Blog listing & posts

**Home page:** Configurable hero, features section, services showcase, testimonials, call-to-action

**Landing pages:** Lead Capture, Service Promotion, Event Registration

All pages: mobile responsive, SEO optimised, managed from the admin panel.

### 3.3 Service Catalogue

The service catalogue is the commercial heart of the platform for this vertical.

**Two pricing models — both fully supported:**

| Model | Description | Example |
|---|---|---|
| `duration` | Price tied to a time block | 60-minute massage at R450 |
| `unit` | Price tied to a deliverable | Logo design at R3,500 |

**Per service:** name, description, category, provider, pricing model, price, duration (if applicable), images (multiple), video URL, meeting type (in-person / video / phone), intake form (optional), is_active.

### 3.4 Bookings & Appointments

- Service selection → provider selection → date & time → meeting type → intake form → payment → confirmation
- Calendar view: month, week, day
- Availability management: business hours by day, blocked dates, provider-specific availability
- Meeting types: In-Person, Video Call, Phone Call
- Intake forms: configurable per service for client preparation information
- Appointment notes: client describes needs for provider to prepare
- Payment at point of booking: full payment or deposit — configurable per service
- Automatic reminders: 24 hours before and 1 hour before; video call link included
- Recurring appointments: weekly, bi-weekly, monthly

### 3.5 Payments & Invoicing

**Payment gateways:** Stripe (global), Paystack (Africa), or PayPal (global) — one per client instance. All three gateways support single payments only.

**Payment model:** All payments to the business's central account. No per-provider payment accounts. Revenue per provider tracked via reporting.

**No shopping cart.** Payment is integrated into the booking flow — not a separate checkout process.

**Invoicing:** Automatic invoice generation on booking completion — PDF and email delivery. Manual invoice creation also supported.

**Multi-currency:** System currency (set at onboarding, immutable after first transaction) plus optional display currency for customer-facing prices.

### 3.6 CRM & Contacts

- Contact database: Lead / Customer / Inactive status
- Full activity timeline per contact — bookings, emails, notes
- Tags, segmentation, CSV import/export
- Automatic contact creation from bookings and enquiry forms
- Contact detail: lifetime value, total bookings, last contact date
- Quick actions: add note, create booking, send email, enroll in campaign

### 3.7 Email

Three distinct email systems are used. They serve different purposes and must not be conflated.

**Anvil built-in email** — system-level platform messages (login confirmations, password reset links, account notifications). Sent via `anvil.email.send()`. Quota: approximately 1,000 emails/month per client instance, resetting on the 1st of each month. Emails originate from an Anvil-hosted address, not the business's own address. Use only for platform-generated system events.

**Brevo SMTP** — transactional business email sent from the client's own business address. Booking confirmations, reminders, invoices, and contact form auto-replies. Configured per client instance via email settings; credentials stored in the Vault.

**Brevo Campaigns** — marketing email. Campaign sequences, broadcast emails, and newsletter communications. Subject to unsubscribe management and open/click tracking. Handled by `brevo_campaigns_integration.py` in `server_marketing/`. Pre-built sequences: New Client Welcome, Appointment Reminder Series, Re-booking Prompt, Re-engagement. Custom campaign builder supported. Lead capture forms enroll contacts automatically and trigger the welcome sequence.

### 3.8 Blog & Content

- Full blog with rich text editor
- SEO control per post: title, meta description, URL slug
- Post statuses: Draft, Published, Archived
- View count tracking

### 3.9 Analytics & Reporting

- Live dashboard: revenue, bookings, customers — with period comparison
- Revenue by period, trend vs previous period
- Revenue by provider (therapist/consultant attribution)
- Customer lifetime value
- Marketing ROI across campaigns and lead sources
- Export: PDF, CSV, scheduled email delivery

### 3.10 Support Tickets & Knowledge Base

- Ticket system: priority levels, staff assignment, full conversation thread
- Customer-facing knowledge base: search before submitting a ticket
- Ticket statuses: Open, In Progress, Resolved, Closed

---

## 4. Technical Stack

| Layer | Technology | Notes |
|---|---|---|
| Platform | Anvil.works | Full-stack Python, built-in hosting & HTTPS |
| UI | Material Design 3 (M3) | Dependency ID: 4UK6WHQ6UX7AKELK |
| Database | Anvil Data Tables | PostgreSQL-backed, automatic backups |
| Authentication | Anvil Users service | Built-in, RBAC via custom decorators |
| Anvil Secrets | `encryption_key` only | One item only — used by vault_service.py to encrypt/decrypt Vault entries. Nothing else goes here. |
| The Vault | All client API keys and credentials | Encrypted store inside each client instance. Retrieved at runtime via `get_vault_secret()`. Never in code, Data Tables, or Anvil Secrets. |
| Transactional email | Brevo SMTP | Via Anvil email service (SMTP) |
| Marketing email | Brevo Campaigns | Sequences, webhooks, native Brevo integration |
| CRM | Brevo (free tier) | Master contact record; Mybizz is wrapper/UI layer |
| Payments | Stripe + Paystack + PayPal | One gateway per client instance |
| Routing | Anvil Routing dependency | ID: 3PIDO5P3H4VPEMPL — public pages |
| Maps | Google Maps API | Optional — contact page |

---

## 5. Architecture

### 5.1 Dependency Model

The platform consists of two distinct applications:

**`master_template`** is the single published Anvil dependency. It contains all features, all forms, and all server functions. Each client instance contains no code — it depends entirely on `master_template` for all functionality. When a new version is published, clients choose when to adopt it. Updates are pull-based — never pushed automatically.

**`Mybizz_management`** is the platform operator's internal tooling for client provisioning, health monitoring, billing, and update distribution. It is a separate Anvil application, architecturally isolated from `master_template`, and is never included in any client instance. It is not built until the master template is complete and the first client has been manually onboarded.

Each client instance is an independent Anvil app containing only the client's Data Tables and configuration. It depends on `master_template` as a versioned library.

- Client never has access to source code
- All API keys stored in the Vault — client-controlled but code-protected
- Pull-based updates — clients choose when to adopt a new version
- Data isolation by architecture — each client is a separate app with a separate database

### 5.2 Data Isolation

Each client instance is a separate Anvil app with its own Data Tables. `app_tables` always resolves to the current client's data. Cross-client data access is architecturally impossible.

### 5.3 Navigation Architecture

| Area | System |
|---|---|
| Admin & customer portal | Custom HtmlTemplate layout + plain Link components + lambda click handlers |
| Public website pages | Anvil Routing dependency (@router.route) |

**Navigation ruling — admin and customer portal:**
- Use plain `Link` components in the sidebar — not `NavigationLink`
- Navigation is triggered via lambda click handlers: `lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a)`
- Loop variable capture is mandatory — always use `fn=` and `a=` keyword arguments in the lambda
- `NavigationDrawerLayoutTemplate` is not used
- `navigate_to` is not used

---

## 6. Provider Model

Providers (therapists, trainers, consultants, practitioners) are **Staff-role users** in the system.

- Solo business: owner is the only provider
- Multi-provider business: each provider has a Staff user account with their own schedule and services
- All payments go to the business's central payment account
- Revenue per provider is tracked on bookings and reported in Analytics

---

## 7. Key Concepts

| Concept | Definition |
|---|---|
| **Master Template** | The published Anvil dependency containing all Mybizz features. Versioned. All client instances depend on it. |
| **Client Instance** | An individual Anvil app for one business. Depends on master_template. Fully isolated data. |
| **Pull-Based Updates** | Clients choose when to adopt a new master_template version. Never pushed automatically. |
| **The Vault** | Encrypted secrets store inside each client instance. All API keys stored here. Owner-only, requires 2FA. |
| **System Currency** | Set once at onboarding. Immutable after first transaction. All reporting uses this currency. |
| **Duration Service** | Service priced by time block — e.g. 60-minute appointment. |
| **Unit Service** | Service priced by deliverable — e.g. fixed-price design project or consultation. |

---

## 8. What Is Not In This Vertical

The following features are explicitly excluded from Consulting & Services:

- Product catalogue, shopping cart, shipping, inventory management
- Room reservations and restaurant table bookings
- Membership tiers, recurring billing, access control flows
- Feature toggle / vertical switching system

If any of these appear in code or other rules files, they are remnants of the earlier open-verticals design and must be flagged.

---

*End of file — `platform_overview.md`*
