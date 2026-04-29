# Mybizz — 3rd Planning Pass
Created: 2026-03-22 14:03
Updated: 2026-03-22 14:03

**Location:** `@devref`
**Audience:** Author (Claude), Developer (David)
**Purpose:** Corrected build sequence, rules file inventory with role tagging, gap file specifications, and revised stage list. This document supersedes the build-progress-chart.html as the planning authority for build sequence and file mapping.

---

## Part 1 — Corrected Build Sequence

The original sequence had three structural problems: security and vault sat in Phase 6 after phases that depend on them; website and content sat in Phase 2 before CRM and email were in place; and Platform Management was treated as a build phase when it is a separate Anvil application entirely.

The corrected sequence is:

**Phase 1 — Authentication & Administration**
Foundation infrastructure. Nothing else builds without it. Security is woven through from Stage 1.2 — RBAC, the response envelope, and the Vault are established here, not bolted on later.

**Phase 2 — Schema Foundation**
The database is confirmed clean and all tables correct. This is an explicit checkpoint phase, not a feature phase. Its purpose is to verify the full schema before transactional feature work begins.

**Phase 3 — Transactional Core**
Services catalogue, bookings, payments and invoicing. These are the primary commercial activities of the platform. Vault credentials established in Phase 1 are prerequisites for payment gateway integration here.

**Phase 4 — Customer Layer**
CRM, contacts, email and Brevo integration. Depends on Phase 3 — bookings auto-create contacts, and payment events feed the activity timeline.

**Phase 5 — Content Layer**
Website, blog, landing pages, client portal. Depends on Phase 4 — contact forms and lead capture require CRM and email to be in place. The client portal depends on bookings and invoicing from Phase 3.

**Phase 6 — Analytics & Reporting**
Surfaces the data collected across Phases 1–5. Dashboard analytics, revenue reporting, customer analytics. Depends on all prior phases being complete.

**Phase 7 — Launch Preparation**
Comprehensive testing, documentation, production launch. Not a feature phase.

**Phase 8 — Platform Management (separate track)**
`Mybizz_management` — a separate Anvil application. Built only after master template reaches Phase 7. Never part of the mybizz-core build sequence.

---

## Part 2 — Rules File Inventory

Every file tagged by audience role and mapped to its primary build phase. Files marked [NEW] do not yet exist and must be written before their phase begins.

**Role tags:**
- [AGENT] — direct instructions and concrete patterns only. Lives in @agentref.
- [DEVELOPER] — rationale, decisions, context permitted. Lives in @devref.
- [AUTHOR] — supports planning and writing. Lives in @authref.

---

### Foundation — All Phases

| File | Role | Status | Primary Phase |
|---|---|---|---|
| policy_nomenclature.md | [AGENT] | In @backup | All |
| policy_nomenclature_components.md | [AGENT] | In @backup | All |
| ref_anvil_coding.md | [AGENT] | In @backup | All |
| ref_anvil_coding_patterns.md | [AGENT] | In @backup | All |
| policy_development.md | [DEVELOPER] | In @backup | All |
| platform_docmap.md | [AGENT] | In @backup | All |

---

### Phase 1 — Authentication & Administration

| File | Role | Status | Notes |
|---|---|---|---|
| spec_architecture.md | [AGENT] | In @backup | Known corrections required — see refactor plan |
| spec_vault.md | [AGENT] | In @backup | |
| spec_build_plan.md | [DEVELOPER] | In @backup | |
| platform_status.md | [DEVELOPER] | In @backup | |
| platform_overview.md | [AGENT] | In @agentref | Refactored ✓ |
| spec_ui_standards.md | [AGENT] | In @backup | Nav ruling verification required |
| spec_ui_standards_forms.md | [AGENT] | In @backup | Nav ruling verification required |
| ref_anvil_navigation.md | [AGENT] | In @backup | Nav ruling verification required |
| ref_anvil_components.md | [AGENT] | In @backup | |
| ref_anvil_misc.md | [AGENT] | In @backup | |
| ref_anvil_packages.md | [AGENT] | In @backup | |
| policy_security.md | [AGENT] | In @backup | |
| policy_security_compliance.md | [AGENT] | In @backup | |

---

### Phase 2 — Schema Foundation

| File | Role | Status | Notes |
|---|---|---|---|
| ref_anvil_data_tables.md | [AGENT] | In @backup | |
| spec_database.md | [AGENT] | In @backup | Tables 1–31 |
| spec_database_schema.md | [AGENT] | In @backup | Tables 32–58. Brevo correction required — todo #127 |

---

### Phase 3 — Transactional Core

| File | Role | Status | Notes |
|---|---|---|---|
| spec_integrations.md | [AGENT] | In @backup | Brevo correction required — todo #125 |
| spec_services.md | [AGENT] | **[NEW]** | Services catalogue. Write before Phase 3 begins |
| spec_bookings.md | [AGENT] | **[NEW]** | Bookings and appointments. Write before Phase 3 begins |
| spec_payments.md | [AGENT] | **[NEW]** | Payments and invoicing. Write before Phase 3 begins |

---

### Phase 4 — Customer Layer

| File | Role | Status | Notes |
|---|---|---|---|
| spec_crm.md | [AGENT] | In @backup | Brevo corrections required |
| spec_crm_contacts.md | [AGENT] | In @backup | |
| spec_crm_campaigns.md | [AGENT] | In @backup | Brevo correction required — todo #130 |
| spec_crm_segments_tasks.md | [AGENT] | In @backup | |
| spec_domain_email_offboarding.md | [AGENT] | In @backup | Brevo rewrite required — todo #126 |

---

### Phase 5 — Content Layer

| File | Role | Status | Notes |
|---|---|---|---|
| spec_website.md | [AGENT] | **[NEW]** | Website, blog, landing pages, client portal. Write before Phase 5 begins |
| platform_sitemap.md | [AGENT] | In @backup | All routes. Must be updated once all feature specs are confirmed |
| platform_features.md | [AGENT] | In @agentref | Refactored ✓ |

---

### Phase 6 — Analytics & Reporting

| File | Role | Status | Notes |
|---|---|---|---|
| spec_analytics.md | [AGENT] | **[NEW]** | Analytics and reporting. Write before Phase 6 begins |
| spec_performance.md | [AGENT] | In @backup | |

---

### Phase 7 — Launch Preparation

| File | Role | Status | Notes |
|---|---|---|---|
| ref_anvil_testing.md | [AGENT] | In @backup | |
| ref_anvil_testing_integration.md | [AGENT] | In @backup | |
| ref_anvil_uplink.md | [AGENT] | In @backup | |

---

### Phase 8 — Platform Management (separate track)

| File | Role | Status | Notes |
|---|---|---|---|
| platform_management.md | [DEVELOPER] | In @backup | Separate Anvil app. Developer reference only |

---

## Part 3 — Gap File Specifications

Four files need to be written from scratch against @devref as primary source. These are pre-conditions for their phases.

### spec_services.md [NEW — Phase 3]

Covers the services catalogue — the commercial heart of the platform. Must include: service categories (create, edit, reorder); service creation and editing (name, description, category, pricing model, price, duration, provider assignment, images, meeting type, intake form toggle, is_active); two pricing models (duration and unit); provider assignment patterns; service listing on public website; service detail page. Primary source: @devref/cs-architectural-specification-B.md §4.4.

### spec_bookings.md [NEW — Phase 3]

Covers the full booking flow and calendar system. Must include: calendar views (month, week, day); availability management (business hours, blocked dates, provider schedules, buffer time, advance booking window); booking creation flow end-to-end (service → provider → date/time → meeting type → intake form → payment → confirmation); recurring appointments; video call link generation for video bookings; confirmation and reminder emails. Primary source: @devref/cs-architectural-specification-B.md §4.1–4.3.

### spec_payments.md [NEW — Phase 3]

Covers the payment gateway integration and invoicing system. Must include: gateway-agnostic payment service layer; Stripe, Paystack, and PayPal integration patterns; webhook verification per gateway; test mode and live mode switching; automatic and manual invoice generation; invoice PDF generation and email delivery; invoice statuses; payment recording against invoices; time tracking and billing patterns. Primary source: @devref/cs-architectural-specification-B.md §3.1–3.3. Vault credential retrieval patterns from spec_vault.md.

### spec_website.md [NEW — Phase 5]

Covers the full public website and client portal. Must include: page routing via `@router.route`; standard pages (Home, About, Contact, Privacy, Terms); home page template system (four templates, configurable sections); landing page builder (three templates, BlankLayout, slug management, analytics tracking); blog system (rich text editor, post metadata, statuses, public listing and detail); client portal (customer auth, dashboard, booking history, invoice history, profile management). Primary source: @devref/cs-architectural-specification-B.md §2.1–2.5.

### spec_analytics.md [NEW — Phase 6]

Covers the full analytics and reporting layer. Must include: dashboard analytics (revenue metrics, booking metrics, customer metrics, period selector, charts); revenue reporting (by period, by service, by provider, by gateway, export); customer analytics (lifetime value, acquisition by source, retention rate, churn, marketing ROI). Primary source: @devref/cs-architectural-specification-D.md §7.1–7.3.

---

## Part 4 — Revised Stage List

Flat ordered list of all build stages, with the rules files the agent needs loaded for each. This replaces the first column of build-progress-chart.html.

**Phase 1 — Authentication & Administration**
- 1.1 Project Infrastructure — policy_nomenclature, policy_nomenclature_components, ref_anvil_coding, ref_anvil_coding_patterns, spec_architecture, platform_overview
- 1.2 Authentication System — + policy_security, policy_security_compliance, spec_vault
- 1.3 Dashboard & Navigation — + spec_ui_standards, ref_anvil_navigation, ref_anvil_components
- 1.4 Settings & Configuration — + spec_vault, ref_anvil_data_tables
- 1.5 Navigation & Layout System — spec_ui_standards, spec_ui_standards_forms, ref_anvil_navigation, ref_anvil_components
- 1.6 Layout Implementation — spec_ui_standards, ref_anvil_navigation, ref_anvil_components

**Phase 2 — Schema Foundation**
- 2.1 Schema Verification — ref_anvil_data_tables, spec_database, spec_database_schema

**Phase 3 — Transactional Core**
- 3.1 Services Catalogue — spec_services [NEW], spec_architecture, ref_anvil_coding, spec_ui_standards
- 3.2 Payment Gateway Integration — spec_payments [NEW], spec_integrations, spec_vault
- 3.3 Time Tracking & Billing — spec_payments [NEW], ref_anvil_data_tables
- 3.4 Invoicing System — spec_payments [NEW], spec_integrations
- 3.5 Calendar System — spec_bookings [NEW], spec_ui_standards
- 3.6 Availability Management — spec_bookings [NEW]
- 3.7 Booking Creation Flow — spec_bookings [NEW], spec_payments [NEW], spec_integrations
- 3.8 Services Management — spec_services [NEW], spec_ui_standards

**Phase 4 — Customer Layer**
- 4.1 Contact Management — spec_crm, spec_crm_contacts, ref_anvil_data_tables
- 4.2 Email Marketing — spec_crm_campaigns, spec_integrations, spec_domain_email_offboarding
- 4.3 Segmentation — spec_crm_segments_tasks, spec_crm_contacts
- 4.4 Task Automation — spec_crm_segments_tasks, spec_crm

**Phase 5 — Content Layer**
- 5.1 Public Website — Standard Pages — spec_website [NEW], spec_ui_standards, ref_anvil_navigation
- 5.2 Home Page Templates — spec_website [NEW], spec_ui_standards
- 5.3 Landing Pages System — spec_website [NEW], spec_crm_contacts
- 5.4 Blog System — spec_website [NEW]
- 5.5 Client Portal — spec_website [NEW], spec_bookings [NEW], spec_payments [NEW]

**Phase 6 — Analytics & Reporting**
- 6.1 Dashboard Analytics — spec_analytics [NEW], spec_performance
- 6.2 Revenue Reporting — spec_analytics [NEW]
- 6.3 Customer Analytics — spec_analytics [NEW], spec_crm

**Phase 7 — Launch Preparation**
- 7.1 Comprehensive Testing — ref_anvil_testing, ref_anvil_testing_integration, ref_anvil_uplink, policy_security_compliance
- 7.2 Documentation — platform_features, platform_sitemap, platform_status
- 7.3 Production Launch — spec_build_plan, platform_status

**Phase 8 — Platform Management (separate track)**
- 8.1 Client Provisioning — platform_management [DEVELOPER]
- 8.2 Client Monitoring — platform_management [DEVELOPER]
- 8.3 Update Distribution — platform_management [DEVELOPER]
- 8.4 Billing Automation — platform_management [DEVELOPER]

---

*End of document*
