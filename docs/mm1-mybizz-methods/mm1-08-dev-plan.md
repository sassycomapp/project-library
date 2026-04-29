# Mybizz — Consulting & Services — Development Plan
Created: 2026-03-16
Updated: 2026-03-16

---

## Purpose & Scope

This document is the master development plan for the Mybizz Consulting & Services platform. It is written for the developer and the author (Claude) — not for the agent. It describes what is to be built in each phase, the intent behind each stage, the key decisions that govern the work, and what completion looks like. It does not contain build recipes, code examples, or agent instructions.

The platform serves consulting and services businesses — salons, spas, therapists, coaches, consultants, clinics, trainers, and any business that sells professional services either as timed appointments or fixed-price deliverables. It is delivered as a subscription SaaS product, with each client receiving their own isolated Anvil app instance depending on a shared master template.

This plan covers the build of `master_template_dev` — the single development workspace from which all client instances derive. Phase 8 (Platform Management) covers the separate `Mybizz_management` app and is treated as a distinct workstream, built only after the master template reaches Phase 7.

---

## Build Conventions

- Each phase is a functional milestone. A phase is not complete until all its stages pass the full task sequence (Tasks 1–7).
- Stages within a phase are built sequentially unless explicitly noted otherwise.
- The task sequence for each stage: UI Scope → UI Build → Code Draft → Code Polish → Local Testing → Uplink Testing → Checks.
- Stages 1.1–1.4 are foundational. Nothing else builds cleanly without them. They are not to be revisited for scope creep once complete.
- Security is not a phase to be bolted on at the end. RBAC, data isolation, and the response envelope pattern are enforced from Stage 1.2 onward.

---

## PHASE 1 — Authentication & Administration

Phase 1 establishes the entire operational foundation of the platform. Every subsequent phase depends on the infrastructure, authentication, navigation, and configuration system built here. It must be solid before any feature work begins.

### 1.1 Project Infrastructure

Sets up the Anvil project structure, package layout, dependencies, and development environment. This stage produces no user-facing features — it produces the scaffold on which everything else is built.

Key work: create and configure `master_template_dev`; establish client_code and server_code package structure per policy; add the M3 theme dependency and routing dependency; configure the Anvil Users service; establish the `@rules` and `@library` folder structure; verify the Continue.dev environment and rules loading.

Completion: the app runs, dependencies resolve, package structure matches the defined layout, and the development environment is confirmed operational.

### 1.2 Authentication System

Implements the full login, registration, and access control system. This is the security perimeter of the application — it must be built correctly and not revisited for fixes later.

Key work: login and signup forms; password reset flow; email verification; RBAC role definitions (Owner, Manager, Admin, Staff, Customer); role enforcement decorators on all server functions; rate-limited login; account lockout after failed attempts; session management; full audit trail for authentication events.

The `instance_id` pattern is established here — always set server-side from `anvil.users.get_user()`, never accepted from the client. The response envelope `{'success': True/False, 'data'/'error': ...}` is enforced on every server function from this stage forward.

Completion: all roles can log in; access to unauthorised areas is correctly blocked; audit trail records all authentication events; rate limiting and lockout function correctly.

### 1.3 Dashboard & Navigation

Implements the main admin layout and the primary dashboard view. This stage establishes the navigational skeleton that all subsequent feature phases slot into.

Key work: M3 NavigationDrawerLayout with NavigationLink components; navigation structure (Dashboard, Sales & Operations, Customers & Marketing, Content & Website, Finance & Reports, Settings); dashboard home with live metrics tiles (revenue, bookings, customer count with period comparison); role-based navigation visibility (Settings visible to Owner and Manager only); mobile drawer collapse to hamburger overlay.

Navigation uses `open_form(string)` via lambda on NavigationLink — not click handlers, not `navigate_to` with string. This pattern is established here and must not deviate in any subsequent stage.

Completion: all navigation links resolve to placeholder forms; dashboard displays metrics (initially static or empty); navigation visibility correctly reflects the logged-in user's role; mobile layout functions correctly.

### 1.4 Settings & Configuration

Implements the full settings system — business profile, theme, currency, user management, and all configuration tables. This stage also introduces The Vault and the payment configuration groundwork.

Key work: Settings tab navigation (client-side visibility toggle, no server calls per tab switch); business profile form (name, address, contact, country — country/currency immutable after first transaction); theme configuration (logo, colours, font); user and permissions management (invite, edit role, deactivate); single-row config table pattern for `business_profile`, `email_config`, `payment_config`, `theme_config`; The Vault UI (owner-only, requires 2FA enforcement); payment gateway configuration UI (Stripe / Paystack — keys stored in Vault, never in Data Tables); email configuration UI (Brevo SMTP credentials).

The `create_initial_config()` provisioning utility is established in this stage. It must not be touched in any subsequent polish or rewrite — it is the provisioning contract.

Completion: all settings forms save and reload correctly; config tables initialise on first run via `create_initial_config()`; Vault UI stores and masks secrets correctly; currency is confirmed immutable after first transaction is recorded.

### 1.5 Navigation & Layout System (M3 Compliant)

Consolidates and finalises the M3 navigation and layout implementation across all authenticated areas. This stage ensures the layout system is coherent before feature phases begin populating it.

Key work: verify M3 NavigationDrawerLayout behaviour across all breakpoints; confirm NavigationLink active states and routing; establish layout templates for admin and customer portal areas; confirm mobile responsiveness is consistent and correct; document any Designer property gotchas discovered.

This stage is a consolidation and verification stage, not a feature stage. Its purpose is to ensure the layout foundation is sound.

Completion: layout renders correctly at desktop, tablet, and mobile breakpoints; NavigationLink active states are correct; no layout regressions when new forms are added.

### 1.6 Layout Implementation (M3)

Implements the concrete layout forms and helpers that all subsequent feature forms will use.

Key work: Admin layout form (NavigationDrawerLayout host); Customer layout form (simplified navigation for customer portal); shared navigation helper utilities; mobile responsiveness verified end-to-end across both layouts.

Completion: both layout forms are stable, tested, and ready to host feature forms. Navigation helpers are documented for use in subsequent phases.

---

## PHASE 2 — Website & Content

Phase 2 delivers the complete public-facing website and the client portal. It depends on Phase 1 being complete — routing, authentication, and layout are all prerequisites.

The public website is the business's online presence. It must be fully functional, SEO-ready, and manageable from the admin panel. The client portal is the authenticated area where customers manage their bookings and account.

### 2.1 Public Website — Standard Pages

Implements the fixed public pages: Home (initial version), About, Contact (with enquiry form), Privacy Policy, and Terms & Conditions. All pages use the Routing dependency for public navigation.

Key work: page routing via `@router.route`; responsive layout for all public pages; Contact page with enquiry form (saves to `contact_submissions`, sends owner notification and auto-reply); About page with configurable content; Privacy Policy and Terms pages with managed content; SEO metadata per page (title, description).

Completion: all standard pages render and route correctly; contact form submits and triggers notifications; pages are mobile responsive.

### 2.2 Home Page Templates

Implements the configurable home page system. The home page is the primary marketing surface for the client's business and must be flexible enough to serve different business types within C&S.

Key work: four home page templates (Classic, Services, Booking, Minimalist); configurable sections — hero (headline, subheadline, image, CTA), features section (up to 5 items), services showcase (toggle, count, display style), testimonials (up to 10), final CTA; admin configuration UI under Settings → Website; preview in new tab; auto-save every 30 seconds; configuration stored in the `config` table with `key = 'home_config'`.

Completion: all four templates render correctly with configured content; admin can configure and preview changes; auto-save functions; changes go live immediately on save.

### 2.3 Landing Pages System

Implements the landing page builder for lead capture and service promotion. Landing pages run on a clean BlankLayout with no site navigation — single focused conversion pages.

Key work: three templates (Lead Capture, Event Registration, Video Sales Letter); URL slug management (auto-generated, editable, unique); Draft / Published status; analytics tracking (views, conversions, conversion rate, referrer, device); shareable URL and social sharing on publish; BlankLayout rendering (no header, no footer); auto-save every 30 seconds; data stored in `landing_pages`.

Completion: all three templates render correctly in BlankLayout; slug uniqueness enforced; publish/draft cycle works; analytics tracking records correctly.

### 2.4 Blog System

Implements the full blog with rich text editing, SEO control, and post management.

Key work: rich text editor for post content; post metadata (excerpt, category, tags, featured image, author, SEO title, meta description, URL slug); post statuses (Draft, Published, Archived); publish now / save draft / schedule; view count tracking; blog listing page (public); blog post detail page (public); admin blog management UI.

Completion: posts can be created, edited, published, and archived; public listing and detail pages render correctly; SEO fields are applied correctly to page metadata; view counts record on each visit.

### 2.5 Client Portal

Implements the authenticated customer-facing area where clients can view their bookings, account details, and history.

Key work: customer login and registration (separate from admin login flow); customer dashboard (upcoming appointments, recent invoices, account summary); booking history and detail view; invoice history and PDF download; account profile management (name, contact details, password change).

Completion: customers can register, log in, view their bookings and invoices, and manage their profile. Data is correctly isolated to the logged-in customer.

---

## PHASE 3 — Payments & Invoicing

Phase 3 implements the payment infrastructure and invoicing system. It depends on Phase 1 (specifically the Vault and payment configuration from Stage 1.4) and is a prerequisite for Phase 4 (Bookings), which integrates payment at point of booking.

Payment gateway credentials are stored in The Vault — never in code or Data Tables. The payment model is central-account only: all payments go to the business's single payment account. No per-provider accounts.

### 3.1 Payment Gateway Integration (Stripe / Paystack / PayPal)

Implements the server-side payment processing layer for all three supported gateways. One gateway is active per client instance, determined at onboarding.

Gateway selection rationale: Stripe is the Anvil-native integration and the primary international gateway — straightforward to implement and broadly accepted globally. Paystack is the appropriate gateway for South African and African clients, where Stripe does not operate. PayPal is included as a globally recognised payment standard with wide consumer acceptance.

Key work: Stripe integration (charge, refund, webhook verification); Paystack integration (charge, refund, webhook verification); PayPal integration (charge, refund, webhook verification); gateway-agnostic payment service layer (client code calls the service layer, not the gateway directly); webhook endpoint and signature verification per gateway; payment event logging; test mode and live mode switching; payment status tracking.

Completion: payments can be processed and refunded via all three gateways in test mode; webhooks are received and verified; payment events are logged; gateway selection works correctly via configuration.

### 3.2 Time Tracking & Billing

Implements time tracking for unit-based and duration-based services, providing the data foundation for accurate billing and provider revenue attribution.

Key work: time entry recording against bookings and services; provider attribution on time entries; billable vs non-billable distinction; time entry management UI (admin); connection to invoicing and revenue reporting.

Completion: time entries record correctly against bookings; provider attribution is accurate; data feeds correctly into invoicing and analytics.

### 3.3 Invoicing System

Implements automatic and manual invoice generation, PDF delivery, and invoice management.

Key work: automatic invoice generation on booking completion; manual invoice creation (for unit-based services and ad hoc billing); invoice PDF generation and email delivery; invoice statuses (Draft, Sent, Paid, Overdue, Cancelled); payment recording against invoices; invoice listing and detail in admin; customer-facing invoice view and PDF download in client portal; multi-currency display (system currency for all calculations, optional display currency for customer-facing prices).

Completion: invoices generate automatically on booking completion; manual invoices can be created and sent; PDFs generate correctly; payment recording updates invoice status; customer can view and download invoices in the client portal.

---

## PHASE 4 — Bookings & Appointments

Phase 4 implements the core transactional engine of the platform. Bookings are the primary commercial activity for all C&S businesses on the platform. This phase depends on Phases 1, 3 (payment integration), and the services data model established here in Stage 4.4.

The booking flow is: service selection → provider selection → date and time → meeting type → intake form (if required) → payment → confirmation. Payment is integrated into the booking flow — there is no separate checkout.

### 4.1 Calendar System

Implements the calendar views used by admin and staff to manage appointments.

Key work: month, week, and day views; appointment display with status colour coding; click-through to booking detail; provider filtering; navigation between periods; print/export view.

Completion: all three views render correctly with real booking data; provider filtering works; navigation is smooth; booking detail accessible from calendar.

### 4.2 Availability Management

Implements the availability configuration system that governs when bookings can be made.

Key work: business hours configuration by day of week; blocked dates (holidays, closures); provider-specific availability schedules; buffer time between appointments; advance booking window (how far ahead clients can book); minimum notice period; availability conflict detection.

Completion: availability rules correctly control which slots are offered in the booking flow; provider-specific schedules work independently; conflicts are detected and blocked.

### 4.3 Booking Creation Flow

Implements the end-to-end booking flow for both admin-created and customer self-service bookings.

Key work: service selection with description, duration, price, and provider display; provider selection (specific or "any available") with photo and availability; date and time slot selection from available slots; meeting type selection (In-Person, Video Call, Phone Call) — video call link generated automatically for Video Call bookings; intake form display and capture (per service, if configured); client details (new entry or pre-filled for known customers); payment at booking (full payment or deposit, configurable per service); booking confirmation — immediate email, 24h reminder, 1h reminder, calendar invite; recurring appointment option (weekly, bi-weekly, monthly) offered post-confirmation.

Completion: full booking flow completes end-to-end; payment processes correctly; all confirmation and reminder emails send; recurring bookings create correctly; video call links included in all communications for video bookings.

### 4.4 Services Management

Implements the service catalogue — the commercial heart of the platform.

Key work: service categories (create, edit, reorder); individual service creation and editing (name, description, category, pricing model, price, duration, provider assignment, images, video URL, meeting type, intake form toggle, is_active); two pricing models — `duration` (time block, e.g. 60-minute appointment) and `unit` (deliverable, e.g. fixed-price project); provider assignment (one or multiple providers per service); service listing on public website; service detail page (public-facing).

Completion: services of both pricing models can be created, edited, and deactivated; public listing and detail pages display correctly; provider assignment works; services appear correctly in the booking flow.

---

## PHASE 5 — CRM & Marketing

Phase 5 delivers the contact management system and email marketing capability. It depends on Phase 1 (authentication, configuration) and Phase 4 (bookings, which auto-create contacts). The CRM is the Mybizz layer — Brevo holds the master contact record and email capability, and Mybizz is the UI and workflow wrapper.

### 5.1 Contact Management

Implements the full contact database with activity tracking, segmentation, and management tools.

Key work: contact database with Lead / Customer / Inactive statuses; contact detail view (stats, full activity timeline — bookings, emails, notes, form submissions; lifetime value, total bookings, last contact date); contact editor (name, email, phone, status, tags); quick actions from contact detail (add note, create booking, send email, enroll in campaign); bulk actions (add tag, enroll in campaign, CSV export); automatic contact creation and update from bookings, enquiry forms, and landing page submissions; search and real-time filtering; CSV import.

Completion: contacts create automatically from all entry points; activity timeline records all interactions; bulk actions work correctly; CSV import and export function correctly.

### 5.2 Email Marketing (Brevo Campaigns)

Implements the campaign sequence system via Brevo integration.

Key work: Brevo API integration; pre-built campaign sequences for C&S (New Client Welcome, Appointment Follow-Up, Re-engagement, Referral Request); campaign editor (sequence of emails with configurable delays and triggers); trigger configuration (event-based — e.g. appointment completed, first booking, inactive for N days); campaign activation and deactivation; enrollment tracking; open and click tracking via Brevo webhooks; hourly background job for enrollment processing; broadcast emails to segments or full list; transactional emails via Brevo SMTP (from the business's own email address).

Completion: campaigns can be created, configured, and activated; contacts enroll automatically on trigger events; emails send on schedule; open/click data returns via webhook; broadcasts send correctly to selected audience.

### 5.3 Segmentation

Implements dynamic contact segmentation for targeted marketing and reporting.

Key work: pre-built segments (New Leads, Active Customers, Inactive Customers, High Value); custom segment builder (filter by status, tags, spend, last contact date, booking history); segment metrics display (count, average spend, engagement rate); segment use in campaign enrollment and broadcast targeting; CSV export per segment.

Completion: pre-built segments populate correctly; custom segments filter accurately; segments are usable as campaign and broadcast audiences; metrics display correctly.

### 5.4 Task Automation

Implements the automated task and alert system that keeps the business owner informed and prompted to act.

Key work: nightly job (2am) calculating contact metrics and generating actionable alerts (inactive contacts, abandoned appointment enquiries, upcoming birthdays, re-booking prompts); alert display on marketing dashboard; one-click action from alert (enroll in campaign, send email, create task); manual task creation against contacts; task list and completion tracking.

Completion: nightly job runs and generates accurate alerts; alerts display on dashboard; one-click actions from alerts work correctly; manual tasks can be created and completed.

---

## PHASE 6 — Security & Compliance

Phase 6 is not purely a build phase — security fundamentals are enforced from Stage 1.2 onward. This phase addresses the more advanced security concerns that require the full feature set to be in place before they can be properly implemented and verified.

### 6.1 Enhanced RBAC

Reviews and strengthens the role-based access control system across all phases completed to this point. With the full feature set now built, access control can be verified end-to-end rather than piecemeal.

Key work: audit all server functions for correct role enforcement; verify client-side navigation visibility by role; confirm that no server function accepts `instance_id` from the client; confirm that all data queries are scoped to the correct instance; test privilege escalation paths.

Completion: all server functions enforce correct roles; no unauthorised access paths exist; full RBAC audit passes.

### 6.2 Data Encryption

Implements encryption for sensitive data fields and verifies the Vault encryption implementation.

Key work: `encryption_key` confirmed in Anvil Secrets (set by David — not automated); `get_vault_secret()` pattern verified across all secret retrievals; sensitive field encryption at rest for fields requiring it; encryption applied correctly in `get_payment_config()` and `get_email_config()` (secrets masked, never returned to client).

Completion: all sensitive fields are encrypted at rest; no secrets are returned to client code; Vault encryption is verified end-to-end.

### 6.3 Audit Logging

Implements comprehensive audit logging across all significant system events.

Key work: audit log table and write pattern; logging of authentication events (login, logout, failed login, lockout); logging of all data modification events (create, update, delete) with actor, timestamp, and before/after values; logging of payment events; audit log viewer (Owner only); log retention policy.

Completion: all specified events log correctly; audit log viewer displays entries correctly; no sensitive data (passwords, secrets) appears in log entries.

### 6.4 GDPR/POPIA Compliance

Implements the data subject rights and compliance features required by GDPR and POPIA.

Key work: privacy policy management; cookie consent (if applicable to the client's jurisdiction); data subject access request workflow (export all data for a contact); right to erasure workflow (delete or anonymise contact data with cascade handling); data retention policy configuration; consent recording on contact forms and booking flows; unsubscribe handling from marketing emails.

Completion: data export and erasure workflows function correctly; consent is recorded at all collection points; unsubscribe requests are processed correctly.

### 6.5 Anvil Secrets / Vault

Consolidates and verifies the full Vault implementation.

Key work: confirm `encryption_key` is the only secret in Anvil Secrets (all client API keys in The Vault only); Vault UI — owner-only access, 2FA enforced; `get_vault_secret(name)` used consistently for all secret retrieval; Vault secret rotation workflow; verify no API keys exist in code, Data Tables, or anywhere outside the Vault.

Completion: Vault holds all client API keys; no keys exist outside the Vault; Vault UI enforces owner-only access; secret rotation can be performed without code changes.

---

## PHASE 7 — Analytics & Reporting

Phase 7 delivers the full analytics and reporting layer. Much of the underlying data is collected during earlier phases — this phase surfaces it in a useful form. It depends on Phases 1–6 being complete.

### 7.1 Dashboard Analytics

Enhances the dashboard introduced in Stage 1.3 with full live analytics.

Key work: revenue metrics (total, period comparison, trend); booking metrics (count, completion rate, cancellation rate); customer metrics (total, new this month, churn); period selector (week, month, quarter, custom); visual charts (revenue trend, booking volume, customer growth); real-time data refresh.

Completion: all dashboard metrics are accurate and reflect live data; period comparison is correct; charts render correctly; data refreshes without full page reload.

### 7.2 Revenue Reporting

Implements detailed revenue reports for business management and financial review.

Key work: revenue by period (daily, weekly, monthly, annual); revenue by service and service category; revenue by provider (therapist/consultant attribution — the primary revenue management tool for multi-provider businesses); revenue by payment gateway; outstanding invoices and overdue amounts; export to PDF, CSV, and scheduled email delivery.

Completion: all reports produce accurate figures; provider attribution is correct; exports generate correctly; scheduled delivery sends on time.

### 7.3 Customer Analytics

Implements customer-focused analytics for marketing and retention management.

Key work: customer lifetime value calculation and ranking; customer acquisition by source (booking origin, lead capture, referral); retention rate and churn analysis; top customers by spend; marketing ROI by campaign and lead source; customer activity heatmap (booking frequency over time).

Completion: all customer metrics are accurate; source attribution is correctly tracked from point of entry; marketing ROI figures tie to campaign and booking data.

---

## PHASE 8 — Platform Management

Phase 8 covers `Mybizz_management` — the platform operator's internal tooling. This is a separate Anvil app, never part of `master_template`. It is built only after the master template has reached Phase 7 and the first client has been onboarded manually.

The separation is architectural and deliberate: management tooling must not be accessible to client instances, and client data must not be accessible from the management app.

### 8.1 Client Provisioning

Implements the tooling to onboard new clients onto the platform.

Key work: new client onboarding workflow (clone master_template, configure routing dependency, initialise config tables, set currency, create subdomain, create owner credentials); provisioning checklist and status tracking; standard vs premium onboarding tier handling; provisioning log.

Completion: a new client instance can be provisioned end-to-end from the management app without manual Anvil IDE intervention for standard steps.

### 8.2 Client Monitoring

Implements the multi-client health and activity monitoring dashboard.

Key work: client health dashboard (active clients, MRR, alerts); per-client status view (last login, booking activity, payment gateway status, outstanding issues); automated health checks (uplink connectivity, config completeness, Vault status); alert generation for anomalies.

Completion: all active clients visible with current health status; alerts generate correctly for anomalies; per-client drill-down shows accurate detail.

### 8.3 Update Distribution

Implements the version management and client notification system for master_template updates.

Key work: version tracking across all client instances (which version each client is on); release notes management; client notification on new version availability (email and in-platform); update adoption tracking; rollback guidance for clients experiencing issues.

Completion: all client versions are tracked accurately; notifications send on new release; adoption rate is visible.

### 8.4 Billing Automation

Implements the subscription billing and account management system for Mybizz as the platform operator.

Key work: Stripe subscription management for client billing ($25/month grandfathered tier, $50/month standard tier); failed payment handling and retry logic; account suspension on non-payment; billing history per client; MRR and revenue reporting for the platform operator.

Completion: subscription billing runs automatically; failed payments are handled and retried; account suspension functions correctly; MRR reporting is accurate.

---

## PHASE 9 — Launch Preparation

Phase 9 prepares the platform for production launch. It is not a feature phase — it is a verification, documentation, and deployment phase. Nothing in Phase 9 adds new functionality.

### 9.1 Comprehensive Testing

End-to-end testing of the complete platform before production launch.

Key work: full regression test suite against all phases; integration testing across the complete booking and payment flow; security penetration review; performance testing under expected load (100 concurrent client instances); cross-browser and cross-device testing; uplink integration test suite passing cleanly.

Completion: all tests pass; no critical or high severity issues outstanding; performance meets targets under load.

### 9.2 Documentation

Produces the documentation required for launch — for clients, for support, and for the platform operator.

Key work: client onboarding guide (standard and premium tiers); admin user guide covering all features; knowledge base articles for common support queries; platform operator runbook (provisioning, monitoring, common issues); API key and gateway setup guides per provider.

Completion: all documentation is complete, accurate, and reviewed against the built product.

### 9.3 Production Launch

Executes the production launch sequence.

Key work: final backup of master_template_dev in known-good state; publish master_template V1.0; provision first client instance (manual onboarding); go-live checklist verified; monitoring and alerting confirmed active; support channels open; post-launch review scheduled for 30 days.

Completion: master_template V1.0 is published; first client is live; monitoring is active; post-launch review is scheduled.

---

*End of file — cs-dev-plan.md*
