# Mybizz CS — Build Plan

**Vertical:** Consulting & Services
**V1 Scope:** Blog, Landing Pages, Campaigns, Segments, Tasks, Homepage Templates, Basic Analytics, Stripe + Paystack
**V2 Deferred:** Client Portal, Advanced Analytics, Complex Task Automation, PayPal
**Schema:** 36 tables
**Architecture:** Dependency-based (master_template → client instances)

---

## Overview

This build plan defines the phased implementation sequence for the Mybizz CS V1 MVP. Each phase has clear deliverables, completion criteria, and inter-process dependencies.

**Key Principles:**
- Build sequentially — each phase depends on the prior phase being complete
- No phase is complete until all its stages pass completion criteria
- Security is woven through from Phase 1 — not bolted on later
- The Vault and authentication are foundational — nothing else builds without them

---

## Phase Structure

| Phase | Focus | Key Deliverables | Dependencies |
|-------|-------|------------------|--------------|
| 1 | Foundation | Auth, RBAC, Vault, navigation, settings | None (starting point) |
| 2 | Transactional Core | Services, bookings, payments, invoicing | Phase 1 complete |
| 3 | CRM + Email | Contacts, campaigns, segments, tasks, landing pages | Phase 2 complete |
| 4 | Content + Website | Blog, public website, homepage templates | Phase 3 complete |
| 5 | Polish + Launch | Analytics, security, compliance, testing | Phase 4 complete |

---

## Phase 1: Foundation

**Goal:** Establish authentication, navigation, settings, and the Vault — the foundation for all subsequent phases.

### Stage 1.1: Project Infrastructure

**Deliverables:**
- Anvil app `mb-3-cs` created with correct package structure
- Dependencies installed: M3 Theme (4UK6WHQ6UX7AKELK), Routing (3PIDO5P3H4VPEMPL)
- GitHub repository linked
- VS Code connected to GitHub

**Completion Criteria:**
- ✅ App runs without errors
- ✅ M3 theme applied and rendering correctly
- ✅ Routing dependency installed and functional
- ✅ GitHub sync working (push/pull)
- ✅ Package structure matches specification

### Stage 1.2: Authentication System

**Deliverables:**
- `users` table extended with `role`, `permissions`, `account_status`, `signed_up`, `email_confirmation_key`, `mfa` fields
- `LoginForm` — email/password login with validation
- `SignupForm` — new user registration with business name capture
- `PasswordResetForm` — password reset flow
- `server_auth/service.py` — authentication server functions
- `server_auth/rbac.py` — role-based access control decorators

**Completion Criteria:**
- ✅ Users can register with email/password
- ✅ Email confirmation flow works
- ✅ Password reset flow works
- ✅ Five roles defined: Owner, Manager, Admin, Staff, Customer
- ✅ RBAC decorators functional
- ✅ Rate limiting implemented (10 req/min unauthenticated, 100 req/min authenticated)
- ✅ Session management working (30-minute inactivity timeout)
- ✅ Audit logging for authentication events

### Stage 1.3: Dashboard & Navigation

**Deliverables:**
- `AdminLayout` — custom HtmlTemplate layout with navigation
- `DashboardForm` — main admin dashboard with metrics
- Navigation structure implemented (Dashboard, Sales & Operations, Customers & Marketing, Content & Website, Finance & Reports, Settings)
- `shared/navigation_helpers.py` — navigation utility functions

**Completion Criteria:**
- ✅ AdminLayout renders with M3 styling
- ✅ Navigation sidebar functional with all items
- ✅ Lambda click handlers working with variable capture
- ✅ Dashboard displays metrics (revenue, bookings, customers — initially static)
- ✅ Navigation visibility respects RBAC (Settings Owner/Manager only)
- ✅ Mobile responsive layout working
- ✅ Sign out link present at bottom of sidebar

### Stage 1.4: Settings & Configuration

**Deliverables:**
- `business_profile` table populated with business information
- `config` table for key-value configuration
- `email_config` table for email settings
- `payment_config` table for payment gateway settings
- `theme_config` table for M3 theme customization
- `SettingsForm` — main settings form with sections:
  - Business Profile
  - Feature Activation
  - Theme Customization
  - Currency
  - Users & Permissions

**Completion Criteria:**
- ✅ Business profile can be saved and retrieved
- ✅ Feature flags functional (bookings_enabled, services_enabled, etc.)
- ✅ Theme customization persists and applies correctly
- ✅ Currency selection working (immutable after first transaction)
- ✅ User management functional (invite, edit role, deactivate)
- ✅ All config tables initialized via `create_initial_config()`

### Stage 1.5: The Vault

**Deliverables:**
- `vault` table created with encrypted secrets storage
- `encryption_key` set in Anvil Secrets
- `server_shared/encryption_service.py` — encryption/decryption functions
- `server_shared/vault_service.py` — Vault CRUD functions
- `server_shared/vault_totp_service.py` — TOTP step-up authentication
- `settings/VaultForm` — owner-only Vault UI with TOTP gate

**Completion Criteria:**
- ✅ `encryption_key` set in Anvil Secrets (only item there)
- ✅ VaultForm requires TOTP step-up on every open
- ✅ No grace period — TOTP required each time
- ✅ Email notification sent to Owner on every Vault access
- ✅ Secret keys stored encrypted in `vault` table
- ✅ `get_vault_secret()` retrieves secrets correctly
- ✅ Payment config uses Vault for secret keys (not stored in `payment_config` table)
- ✅ Secret masking in `get_payment_config()` returns `'***'` for secrets

### Stage 1.6: AdminLayout Navigation Refinement

**Deliverables:**
- Finalized navigation structure with feature flag visibility
- CustomerLayout created (deferred to V2 — stub for now)
- Navigation consistency verified across all forms

**Completion Criteria:**
- ✅ All navigation items have correct visibility rules
- ✅ Feature flags control navigation item visibility
- ✅ Navigation works correctly on mobile
- ✅ Active link highlighting working
- ✅ No navigation errors or broken links

---

## Phase 2: Transactional Core

**Goal:** Implement services, bookings, payments, and invoicing — the core commercial functions.

**Dependency:** Phase 1 must be complete (Foundation, Vault, Auth, Navigation, Settings)

### Stage 2.1: Service Catalogue

**Deliverables:**
- `services` table populated with service offerings
- `services` package:
  - `ServiceListForm` — service listing with filters
  - `ServiceEditorForm` — create/edit services
  - `ServiceViewerForm` — read-only service detail
- `server_services/service.py` — service server functions

**Completion Criteria:**
- ✅ Services can be created with both `duration` and `unit` pricing models
- ✅ Service categories functional (create, edit, reorder)
- ✅ Provider assignment working (Staff users)
- ✅ Meeting types configured (In-Person, Video Call, Phone Call)
- ✅ Service images and video URL supported
- ✅ Public service listing functional
- ✅ Service detail page functional

### Stage 2.2: Availability Management

**Deliverables:**
- `availability_rules` table — recurring availability schedules
- `availability_exceptions` table — holiday/special closures
- `availability/AvailabilitySettingsForm` — availability configuration UI

**Completion Criteria:**
- ✅ Business hours configured by day of week
- ✅ Blocked dates (holidays, closures) working
- ✅ Provider-specific availability schedules
- ✅ Buffer time between appointments configurable
- ✅ Advance booking window configurable
- ✅ Availability conflicts detected and blocked

### Stage 2.3: Booking System

**Deliverables:**
- `bookings` table populated
- `booking_metadata_schemas` table for dynamic forms
- `bookings/` package:
  - `BookingCalendarForm` — month/week/day views
  - `BookingListForm` — booking listing
  - `BookingEditorForm` — create/edit bookings
  - `BookingViewerForm` — booking detail
- `server_bookings/service.py` — booking server functions

**Completion Criteria:**
- ✅ Calendar views functional (month, week, day)
- ✅ Booking creation flow working (service → provider → date/time → payment)
- ✅ Recurring appointments working (weekly, bi-weekly, monthly)
- ✅ Video call link generation for Video Call bookings
- ✅ Booking status workflow (PENDING → CONFIRMED → COMPLETED/CANCELLED)
- ✅ Contact auto-created from booking if not exists
- ✅ Booking metadata schemas functional for intake forms

### Stage 2.4: Payment Integration

**Deliverables:**
- Payment gateway integration (Stripe + Paystack):
  - `server_payments/stripe_service.py`
  - `server_payments/paystack_service.py`
  - `server_payments/paypal_service.py` (deferred to V2)
- Webhook handlers for payment verification
- `payment_config` updated to use Vault for secrets

**Completion Criteria:**
- ✅ Stripe payment processing working (test mode)
- ✅ Paystack payment processing working (test mode)
- ✅ Payment gateway selection functional via settings
- ✅ Webhook verification working
- ✅ Payment status updated on successful payment
- ✅ Payment ID stored in booking
- ✅ Test/Live mode switching working

### Stage 2.5: Invoicing System

**Deliverables:**
- `invoice` and `invoice_items` tables populated
- `server_payments/invoice_service.py` — invoice server functions
- `invoices/` package:
  - `InvoiceListForm` — invoice listing
  - `InvoiceEditorForm` — create/edit invoices
  - `InvoiceViewerForm` — invoice detail with PDF

**Completion Criteria:**
- ✅ Automatic invoice generation on booking completion
- ✅ Manual invoice creation working
- ✅ Invoice PDF generation functional
- ✅ Invoice email delivery via Brevo SMTP
- ✅ Invoice statuses working (Draft, Sent, Paid, Overdue, Cancelled)
- ✅ Payment recording updates invoice status
- ✅ Multi-currency display working

### Stage 2.6: Time Tracking (V1)

**Deliverables:**
- `time_entries` table populated
- `time_entries/TimeEntriesForm` — time tracking UI
- `server_bookings/time_service.py` — time tracking server functions

**Completion Criteria:**
- ✅ Time entries can be logged against bookings/services
- ✅ Staff attribution working
- ✅ Billable vs non-billable distinction
- ✅ Time entries visible in admin panel
- ✅ Time entries link to bookings correctly

---

## Phase 3: CRM + Email

**Goal:** Implement contacts, campaigns, segments, tasks, and landing pages — the customer engagement layer.

**Dependency:** Phase 2 must be complete (Services, Bookings, Payments, Invoicing)

### Stage 3.1: Contact Management

**Deliverables:**
- `contacts` table populated (unified person record)
- `contact_events` table — activity timeline
- `contact_counter` table — ID generation
- `customers` table (legacy — migrate to contacts)
- `crm/` package:
  - `ContactListForm` — contact listing with search/filter
  - `ContactEditorForm` — create/edit contacts
  - `ContactViewerForm` — contact detail with activity timeline
- `server_customers/contact_service.py` — contact server functions

**Completion Criteria:**
- ✅ Contacts can be created manually or auto-created from bookings/forms
- ✅ Contact activity timeline functional (bookings, emails, notes)
- ✅ Tags and segmentation working
- ✅ CSV import/export functional
- ✅ Contact lifecycle stages working (new, active, at_risk, lost)
- ✅ Lifetime value and transaction counts cached and updated
- ✅ No duplicate contacts (email-based deduplication)

### Stage 3.2: Email Marketing (Brevo Campaigns)

**Deliverables:**
- `email_campaigns` table — campaign definitions
- `contact_campaigns` table — enrollment tracking
- `brevo_campaigns_integration.py` — Brevo API integration
- `marketing/` package:
  - `EmailCampaignListForm` — campaign listing
  - `EmailCampaignEditorForm` — campaign sequence builder
  - `EmailBroadcastForm` — one-off broadcasts
- Hourly background task for campaign processing

**Completion Criteria:**
- ✅ Pre-built campaign sequences functional (New Client Welcome, Appointment Follow-Up, Re-engagement, Referral Request)
- ✅ Campaign editor with configurable delays and triggers
- ✅ Contact enrollment working (event-based and manual)
- ✅ Brevo API integration functional (test mode)
- ✅ Open/click tracking via webhooks working
- ✅ Broadcast emails functional
- ✅ Unsubscribe handling working

### Stage 3.3: Segmentation

**Deliverables:**
- `segments` table — segment definitions
- `crm/SegmentManagerForm` — segment builder UI

**Completion Criteria:**
- ✅ Pre-built segments working (New Leads, Active Customers, Inactive Customers, High Value)
- ✅ Custom segment builder functional (filter by tags, status, spend, booking history)
- ✅ Segment contact counts accurate and cached
- ✅ Segments usable for campaign targeting
- ✅ CSV export per segment working

### Stage 3.4: Tasks & Automation

**Deliverables:**
- `tasks` table — task definitions
- `crm/TaskListForm` — task management UI
- Background task for auto-generated tasks (daily 03:00)

**Completion Criteria:**
- ✅ Manual task creation against contacts
- ✅ Basic auto-generated tasks (follow-ups, review requests)
- ✅ Task completion tracking
- ✅ Task due dates and reminders working
- ✅ Tasks visible in admin dashboard

### Stage 3.5: Landing Pages

**Deliverables:**
- `landing_pages` table — landing page definitions
- `leads` table — captured leads
- `lead_captures` table — capture form configurations
- `landing_pages/` package:
  - `LandingPageListForm` — landing page listing
  - `LandingPageEditorForm` — landing page builder (3 templates)
- Simultaneous `leads` + `contacts` creation on capture

**Completion Criteria:**
- ✅ Three landing page templates working (Lead Capture, Event Registration, VSL)
- ✅ URL slug management (auto-generated, unique)
- ✅ Draft/Published status working
- ✅ Analytics tracking (views, conversions, conversion rate)
- ✅ Lead capture creates `leads` and `contacts` simultaneously
- ✅ `leads.converted_to_contact_id` set immediately
- ✅ Welcome campaign auto-enrollment working

---

## Phase 4: Content + Website

**Goal:** Implement blog, public website, and homepage templates — the public-facing layer.

**Dependency:** Phase 3 must be complete (CRM, Email, Landing Pages)

### Stage 4.1: Blog System

**Deliverables:**
- `blog_posts` and `blog_categories` tables populated
- `blog/` package:
  - `BlogListForm` — public blog listing
  - `BlogPostForm` — public blog post detail
  - `BlogEditorForm` — admin blog editor with rich text
  - `CategoryManagementForm` — category management
- `server_blog/service.py` — blog server functions

**Completion Criteria:**
- ✅ Blog posts can be created with rich text editor
- ✅ SEO fields functional (title, meta description, URL slug)
- ✅ Draft/Published/Archived statuses working
- ✅ Blog categories functional (create, edit, reorder)
- ✅ Public blog listing and post pages functional
- ✅ View count tracking working
- ✅ Author attribution working

### Stage 4.2: Public Website Pages

**Deliverables:**
- `pages` table — static page definitions
- `public_pages/` package:
  - `HomePage` — home page with routing
  - `AboutPage` — about page
  - `ContactPage` — contact form page
  - `PrivacyPolicyPage` — privacy policy
  - `TermsConditionsPage` — terms & conditions
- Routing dependency configured for public pages

**Completion Criteria:**
- ✅ All standard pages functional (Home, About, Contact, Privacy, Terms)
- ✅ Contact form submits and creates `contact_submissions` record
- ✅ Contact form notifications working (owner + auto-reply)
- ✅ Privacy and Terms pages editable from admin
- ✅ Mobile responsive
- ✅ SEO meta tags functional

### Stage 4.3: Homepage Templates

**Deliverables:**
- `config` table `home_config` key for template configuration
- `public_pages/HomePage` with four template options:
  - Classic
  - Services
  - Booking
  - Minimalist
- Template configuration UI in Settings

**Completion Criteria:**
- ✅ Four homepage templates rendering correctly
- ✅ Template configuration UI functional
- ✅ Configurable sections (hero, features, services showcase, testimonials, CTA)
- ✅ Auto-save every 30 seconds
- ✅ Preview in new tab working
- ✅ Changes go live immediately on save

---

## Phase 5: Polish + Launch

**Goal:** Implement analytics, security hardening, compliance, and testing — the launch preparation.

**Dependency:** Phase 4 must be complete (Blog, Public Website, Homepage Templates)

### Stage 5.1: Dashboard Analytics

**Deliverables:**
- Enhanced `DashboardForm` with live analytics
- `server_analytics/reporting_service.py` — analytics server functions
- Charts and visualizations using M3 Plot components

**Completion Criteria:**
- ✅ Revenue metrics functional (total, period comparison, trend)
- ✅ Booking metrics functional (count, completion rate, cancellation rate)
- ✅ Customer metrics functional (total, new this month, churn)
- ✅ Period selector working (week, month, quarter, custom)
- ✅ Real-time data refresh working
- ✅ Charts rendering correctly

### Stage 5.2: Security Hardening

**Deliverables:**
- Enhanced RBAC review and testing
- Data encryption verification
- Audit logging review
- Rate limiting verification
- Input validation review

**Completion Criteria:**
- ✅ All server functions have correct RBAC decorators
- ✅ No secrets exposed to client code
- ✅ All sensitive data encrypted
- ✅ Audit log comprehensive and accurate
- ✅ Rate limiting functional and tested
- ✅ Input validation on all forms
- ✅ Session timeout working correctly

### Stage 5.3: Compliance Implementation

**Deliverables:**
- Privacy Policy page populated
- Terms of Service page populated
- Cookie consent banner on public pages
- `export_my_data()` function — GDPR/POPIA data export
- `delete_my_account()` function — GDPR/POPIA anonymization
- Consent recording on forms and booking flows

**Completion Criteria:**
- ✅ Privacy Policy and Terms pages accurate and published
- ✅ Cookie consent banner functional
- ✅ Data export function working (exports all user data)
- ✅ Account deletion/anonymization working
- ✅ Consent recording on all data collection points
- ✅ Unsubscribe handling from marketing emails

### Stage 5.4: Testing & QA

**Deliverables:**
- Pure logic tests for business logic
- Integration tests via Uplink
- End-to-end testing of critical flows
- Uplink connection configured
- Test data cleanup procedures

**Completion Criteria:**
- ✅ All pure logic tests passing
- ✅ All integration tests passing
- ✅ Critical flows tested (booking, payment, email)
- ✅ Test data cleanup working
- ✅ No critical or high-severity issues
- ✅ Performance acceptable under expected load

### Stage 5.5: Launch Preparation

**Deliverables:**
- Documentation (user guides, admin guides, setup guides)
- Video tutorials (platform overview, first booking, payments setup)
- Onboarding checklist
- Production deployment plan
- Monitoring and alerting configured

**Completion Criteria:**
- ✅ All documentation complete and accurate
- ✅ Video tutorials created
- ✅ Onboarding checklist functional
- ✅ Production deployment plan documented
- ✅ Monitoring and alerting active
- ✅ First beta client ready for onboarding
- ✅ Support channels configured

---

## Inter-Process Dependencies

### Critical Path
```
Phase 1 (Foundation) → Phase 2 (Transactional Core) → Phase 3 (CRM + Email) → Phase 4 (Content + Website) → Phase 5 (Polish + Launch)
```

### Cross-Phase Dependencies
- **Phase 2 depends on Phase 1:** Services need users (providers), bookings need contacts (from Phase 3, but contacts table exists in Phase 1), payments need Vault (Phase 1)
- **Phase 3 depends on Phase 2:** Contacts auto-created from bookings, campaigns triggered by booking events
- **Phase 4 depends on Phase 3:** Blog and landing pages feed contacts, public website uses contact forms
- **Phase 5 depends on Phase 4:** Analytics uses data from all phases, security hardening covers all features

### Data Flow Dependencies
- `users` table (Phase 1) → all other tables
- `contacts` table (Phase 3) → bookings, tasks, campaigns
- `services` table (Phase 2) → bookings, time_entries
- `bookings` table (Phase 2) → invoices, contact_events
- `email_campaigns` table (Phase 3) → contact_campaigns
- `landing_pages` table (Phase 3) → leads → contacts

---

## Completion Criteria Summary

| Phase | Complete When |
|-------|---------------|
| 1 | Auth, dashboard, settings, Vault functional with no errors |
| 2 | Services, bookings, payments, invoicing operational end-to-end |
| 3 | Contacts, campaigns, segments, tasks, landing pages integrated |
| 4 | Blog, public website, homepage templates live and functional |
| 5 | Analytics, security, compliance, testing complete and passing |

---

## Risk Mitigation

### Technical Risks
- **Vault complexity:** Thoroughly test in Phase 1 before proceeding
- **Brevo API rate limits:** Implement throttling in Phase 3
- **Payment webhook idempotency:** Test duplicate webhook scenarios in Phase 2
- **Contact deduplication:** Test edge cases in Phase 3

### Operational Risks
- **Onboarding friction:** Keep Phase 1 simple and intuitive
- **Data migration:** Have clear rollback procedures
- **Testing gaps:** Ensure all critical paths tested before launch

---

## Post-Launch

### V2 Planning

After Phase 5 launch, begin V2 development:
- Client portal (customer self-service)
- Advanced analytics (revenue by service/provider, marketing ROI)
- Complex task automation
- PayPal integration
- Additional homepage templates

---

*End of file — build-plan.md*
