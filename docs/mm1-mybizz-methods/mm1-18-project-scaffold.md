---
layer: scaffold
alwaysApply: true
format: markdown
version: 2.0
source: "set1-12-project-scaffold.md (actual codebase structure)"
lastUpdated: 2026-04-10
---

# MyBizz Project Scaffold

**Current Status:** Active Codebase  
**Architecture:** Anvil.works (Python) — Master template with client and server code separation  
**Technology Stack:** Python (server), YAML-based UI templates (client), Material Design 3

---

## Client Code Structure

### Authentication Module (`client_code/auth/`)

**Forms:**
- `LoginForm` — User login interface
  - `form_template.yaml` — UI template
  - `__init__.py` — Form logic
- `SignupForm` — New user registration
  - `form_template.yaml` — UI template
  - `__init__.py` — Form logic
- `PasswordResetForm` — Password recovery
  - `form_template.yaml` — UI template
  - `__init__.py` — Form logic

**Shared utilities:**
- `ui_helpers.py` — Common UI helper functions
- `validation.py` — Input validation logic

---

### Blog Module (`client_code/blog/`)

**Forms:**
- `BlogEditorForm` — Create/edit blog posts
  - `form_template.yaml`
  - `__init__.py`
- `BlogListForm` — Display all blog posts
  - `form_template.yaml`
  - `__init__.py`
  - **Row Template:** `BlogPostRowTemplate`
    - `form_template.yaml`
    - `__init__.py`
- `BlogPostDetailForm` — Single post view
  - `form_template.yaml`
  - `__init__.py`
- `CategoryEditorModal` — Manage blog categories
  - `form_template.yaml`
  - `__init__.py`
- `CategoryManagementForm` — Category list & management
  - `form_template.yaml`
  - `__init__.py`
  - **Row Template:** `CategoryRowTemplate`
    - `form_template.yaml`
    - `__init__.py`
- `PublicBlogForm` — Public-facing blog page
  - `form_template.yaml`
  - `__init__.py`
  - **Row Templates:**
    - `PublicCategoryTemplate` — Category display
    - `PublicPostCardTemplate` — Post card layout

---

### Bookings Module (`client_code/bookings/`)

**Forms:**
- `AppointmentSchedulerForm` — Schedule appointments
  - **Row Template:** `TimeSlotRadioRowTemplate`
- `BookingAnalyticsWidget` — Booking metrics display
  - **Row Template:** `TopResourceRowTemplate`
- `BookingCalendarComponent` — Calendar view
- `BookingCreateForm` — New booking creation
- `BookingListForm` — All bookings list
  - **Row Template:** `BookingRowTemplate`
- `ClientNotesForm` — Client notes management
  - **Row Template:** `ClientNoteRowTemplate`
    - **Nested:** `ItemTemplate1`
- `ManualTimeEntryModal` — Manual time entry
- `MultiResourceCalenderForm` — Multi-resource calendar
- `PublicBookingWidget` — Public booking interface
  - **Row Template:** `TimeSlotRowTemplate`
- `ServiceEditorModal` — Service management
- `ServiceManagementForm` — Service list & administration
  - **Row Template:** `ServiceRowTemplate`
- `TimeTrackerForm` — Time tracking interface
  - **Row Template:** `TimeEntryRowTemplate`

**Utilities:**
- `booking_ui_helpers.py` — Booking-specific UI helpers

---

### CRM Module (`client_code/crm/`)

**Forms:**
- `ContactDetailForm` — Individual contact view
  - **Row Template:** `ContactTimelineRowTemplate`
- `ContactEditorForm` — Create/edit contact
- `ContactImportForm` — Bulk contact import
- `ContactListForm` — All contacts view
  - **Row Template:** `ContactRowTemplate`
- `CampaignMetricComponent` — Campaign performance metrics
- `EmailBroadcastForm` — Email broadcast to segments
- `EmailCampaignEditorForm` — Create email campaigns
  - **Row Template:** `EmailSequenceRowTemplate`
- `EmailCampaignListForm` — Campaign list
- `LeadCaptureEditorForm` — Lead capture form builder
- `MarketingDashboardForm` — Marketing dashboard
- `PublicKnowledgeBaseForm` — Public KB display
- `ReferralProgramForm` — Referral program management
- `ReportsForm` — CRM reports
- `SegmentManagerForm` — Contact segmentation
  - **Row Template:** `SegmentCardRowTemplate`
- `TaskListForm` — Task management
  - **Row Template:** `TaskRowTemplate`

---

### Customers Module (`client_code/customers/`)

**Forms:**
- `ClientPortalForm` — Client-facing portal
  - **Row Templates:**
    - `DocumentRowTemplate` — Document list
    - `InvoiceRowTemplate` — Invoice list
    - `PastAppointmentRowTemplate` — Past appointments
    - `UpcomingAppointmentRowTemplate` — Upcoming appointments
- `CustomerDetailForm` — Individual customer view
  - **Row Template:** `ActivityRowTemplate`
- `CustomerEditorModal` — Edit customer
- `CustomerListForm` — All customers list
  - **Row Template:** `CustomerRowTemplate`
- `MyTicketsForm` — Customer ticket list
  - **Row Templates:**
    - `TicketItemRowTemplate`
  - **Nested Modal:** `NewTicketModal`

---

### Dashboard Module (`client_code/dashboard/`)

**Forms:**
- `DashboardForm` — Main dashboard
- `ActivityFeedWidget` — Recent activity feed
  - **Row Template:** `ActivityRowTemplate`
- `MetricsPanelComponent` — KPI display
- `NotificationComponent` — Notifications
- `StorageWidget` — Storage usage display

---

### Landing Pages Module (`client_code/landing_pages/`)

**Forms:**
- `LandingPageForm` — Landing page editor
- `LandingPage_TemplateEvent` — Event landing page template
- `LandingPage_TemplateLeadCapture` — Lead capture template
- `LandingPage_TemplateVSL` — Video sales letter template

---

### Layouts Module (`client_code/layouts/`)

**Base Layout Forms:**
- `AdminLayout` — Admin interface layout
- `BlankLayout` — Minimal layout
- `CustomerLayout` — Customer-facing layout
- `ErrorLayout` — Error page layout

---

### Public Pages Module (`client_code/public_pages/`)

**Pages:**
- `HomePage` — Main landing page
- `HomePage_TemplateBooking` — Booking-focused home
- `HomePage_TemplateClassic` — Classic home layout
- `HomePage_TemplateMinimalist` — Minimalist home
- `HomePage_TemplateServices` — Services-focused home
- `AboutPage` — About company
- `ServicesPage` — Services listing
- `ServiceDetailPage` — Service detail view
- `BookingPage` — Public booking interface
- `ContactPage` — Contact form page
- `BlogListPage` — Public blog listing
- `BlogPostPage` — Public blog post view
- `PrivacyPolicyPage` — Privacy policy
- `TermsConditionsPage` — Terms & conditions

---

### Routes Module (`client_code/routes/`)

**Route files:**
- `auth_routes.py` — Authentication routing
- `public_routes.py` — Public page routing
- `error404.py` — 404 error handling
- `helpers.py` — Route helper functions

---

### Settings Module (`client_code/settings/`)

**Configuration Forms:**
- `SettingsForm` — Main settings
- `WebsiteSettingsForm` — Website configuration
- `EmailSetupForm` — Email provider setup
- `PaymentGatewayForm` — Payment settings
- `HomePageEditorForm` — Home page customization
- `HomePageTemplateSelectorForm` — Home page template selection
- `LandingPageEditorForm` — Landing page editor
- `LandingPagesListForm` — All landing pages
- `LandingPageTemplateSelectorForm` — LP template selection
- `AboutPageEditorForm` — About page editor
- `ContactPageSettingsForm` — Contact page settings
- `PrivacyPolicyEditorForm` — Privacy policy editor
- `TermsConditionsEditorForm` — Terms editor

**Page Components:**
- `HeroSectionComponent` — Hero section builder
- `FeaturesSectionComponent` — Features section
- `TestimonialsSectionComponent` — Testimonials section
- `CTASectionComponent` — Call-to-action section
- `ContactFormComponent` — Embedded contact form
- `GoogleMapComponent` — Embedded maps

---

### Shared Module (`client_code/shared/`)

**Analytics:**
- `AnalyticsDashboardForm` — Overall analytics
- `BookingAnalyticsForm` — Booking analytics
- `CustomerAnalyticsForm` — Customer analytics

**Knowledge Base:**
- `KnowledgeBaseForm` — KB management
  - **Row Templates:**
    - `ArticleLinkRowTemplate`
    - `CategoryRowTemplate`
- `KBArticleEditorForm` — Article editor
- `KBArticleDetailForm` — Article view
  - **Row Template:** `RelatedArticleRowTemplate`
- `PublicKnowledgeBaseForm` — Public KB

**Tickets & Support:**
- `NewTicketModal` — Create support ticket
- `TicketSubmissionForm` — Ticket submission
- `TicketManagementForm` — Ticket admin list
  - **Row Template:** `TicketRowTemplate`
- `TicketDetailForm` — Single ticket view
  - **Row Template:** `MessageRowTemplate`
- `TicketItemRowTemplate` — Ticket list item
- `TicketThreadModal` — Ticket conversation
  - **Row Template:** `TicketThreadMessageRowTemplate`

**Reviews & Feedback:**
- `ReviewSubmissionForm` — Submit review
- `ReviewDisplayComponent` — Display reviews
  - **Row Template:** `ReviewRowTemplate`
- `ReviewModerationForm` — Review moderation
  - **Row Template:** `ReviewModerationRowTemplate`

**Other Components:**
- `PageEditorForm` — Generic page editor
  - **Component:** `ComponentEditorComponent`
- `NavigationComponent` — Navigation menu
- `PublicPageForm` — Public page display
- `ReportsForm` — Shared reports interface
- `FAQChatbotWidget` — FAQ chatbot
  - **Row Template:** `ChatMessageRowTemplate`
- `SocialShareComponent` — Social sharing buttons

**Utilities:**
- `component_renderer.py` — Component rendering logic
- `navigation_helpers.py` — Navigation utilities
- `notification_helper.py` — Notification handling

---

## Server Code Structure

### Analytics Service (`server_code/server_analytics/`)

**Services:**
- `booking_service.py` — Booking analytics
- `customer_service.py` — Customer analytics
- `revenue_service.py` — Revenue tracking
- `report_generator.py` — Report generation

---

### Authentication Service (`server_code/server_auth/`)

**Modules:**
- `service.py` — Core auth logic
- `session_manager.py` — Session handling
- `permissions.py` — Permission checks
- `validation.py` — Auth validation

---

### Blog Service (`server_code/server_blog/`)

**Modules:**
- `service.py` — Blog core functionality
- `category_service.py` — Category management
- `seo_service.py` — SEO optimization

---

### Bookings Service (`server_code/server_bookings/`)

**Modules:**
- `service.py` — Booking core logic
- `availability_service.py` — Availability management
- `recurring_service.py` — Recurring bookings
- `appointment_reminders.py` — Reminder scheduling
- `repository.py` — Booking data access
- `ical_generator.py` — iCalendar export
- `metadata_validator.py` — Booking validation

---

### CRM Sync Service (`server_code/server_crm_sync/`)

**Modules:**
- `zoho_crm_sync.py` — Zoho CRM integration *(Note: ADR-001 requires migration to Brevo)*

---

### Customers Service (`server_code/server_customers/`)

**Modules:**
- `service.py` — Customer core logic
- `repository.py` — Data access layer
- `history_service.py` — Activity history tracking

---

### Dashboard Service (`server_code/server_dashboard/`)

**Modules:**
- `service.py` — Dashboard data aggregation

---

### Email Service (`server_code/server_emails/`)

**Modules:**
- `system_email_service.py` — System-generated emails
- `transactional_email_service.py` — Transactional emails
- `email_templates.py` — Email template management

---

### Marketing Service (`server_code/server_marketing/`)

**Modules:**
- `service.py` — Marketing core (likely to be deprecated in favor of CRM package per ADR-006)
- `campaign_service.py` — Email campaign management *(Migrate to Brevo per ADR-001)*
- `broadcast_service.py` — Email broadcasts
- `lead_capture_service.py` — Lead capture handling
- `task_service.py` — Task management
- `review_service.py` — Review management
- `referral_service.py` — Referral program
- `zoho_campaigns_integration.py` — Zoho integration *(Migrate to Brevo per ADR-001)*

---

### Payments Service (`server_code/server_payments/`)

**Modules:**
- `stripe_service.py` — Stripe payment processing (global)
- `stripe_webhooks.py` — Stripe webhook handling
- `paystack_service.py` — Paystack processing (Africa)
- `paystack_webhooks.py` — Paystack webhook handling
- `invoice_service.py` — Invoice generation & management
- `invoice_pdf_generator.py` — PDF invoice creation
- `accounting_reports.py` — Financial reports

---

### Settings Service (`server_code/server_settings/`)

**Modules:**
- `service.py` — Configuration management
- `test_helpers.py` — Testing utilities

---

### Shared Service (`server_code/server_shared/`)

**Core Services:**
- `config.py` — Application configuration
- `utilities.py` — General utilities
- `validators.py` — Input validation

**Data & Storage:**
- `vault_service.py` — Secrets management (API keys, credentials)
- `vault_totp_service.py` — 2FA TOTP handling
- `encryption_service.py` — Data encryption
- `backup_service.py` — Backup management
- `audit_logger.py` — Audit logging

**Business Services:**
- `kb_service.py` — Knowledge base management
- `ticket_service.py` — Support ticket system
- `chatbot_service.py` — FAQ chatbot logic
- `page_service.py` — Page management
- `server_review_service.py` — Review management

---

### Dependencies

**`requirements.txt`** — Python package dependencies for server code

---

## Key Architecture Patterns

### Form Structure Pattern

Each form follows:
```
FormName/
  form_template.yaml    # UI template definition
  __init__.py          # Form logic & event handlers
```

### Row Template Pattern

Repeating list items:
```
ParentForm/
  RowTemplateName/
    form_template.yaml
    __init__.py
  form_template.yaml
  __init__.py
```

### Server Service Pattern

Each service module provides:
- Core service logic (`service.py`)
- Data persistence (`repository.py`)
- External integrations (`*_integration.py`)
- Webhook handlers (`*_webhooks.py`)

---

## Module Dependencies & Integration Points

**Auth** → All other modules (session validation)

**Blog** → Shared (KB, reviews, comments)

**Bookings** → Analytics, Emails, Customers, Payments

**CRM** → Marketing, Customers, Analytics

**Customers** → Bookings, Payments, Tickets, Dashboard

**Marketing** → Emails, CRM, Analytics *(Note: To be replaced by CRM package per ADR-006)*

**Payments** → Customers, Invoices, Analytics, Emails

**Dashboard** → Analytics (all services feed metrics)

**Settings** → All (configuration sourced here)

**Email** → Marketing, Customers, Bookings, Payments, Tickets

**Shared** → All modules (common utilities, encryption, audit logging)

---

## Notes for Migration (ADRs)

**ADR-001 (Brevo):** Replace Zoho CRM sync and Campaigns integration with Brevo:
- Update `server_marketing/zoho_campaigns_integration.py` → Brevo Campaigns API
- Update `server_crm_sync/zoho_crm_sync.py` → Brevo contact sync
- Update `server_emails/` to use Brevo SMTP relay

**ADR-006 (CRM Package):** Eventually replace `server_marketing/` with modular CRM package:
- `contacts_service`
- `leads_service`
- `campaigns_service`
- `segments_service`
- `tasks_service`
- `brevo_integration`

**ADR-007 (Continue.dev):** All spec files must have front matter with layer, alwaysApply, format, version, source, lastUpdated

**ADR-009 (Single Vertical):** Current codebase is C&S focused; maintain this scope for all new features

---

**Document Version:** 2.0  
**Last Updated:** 2026-04-10  
**Source:** set1-12-project-scaffold.md (actual codebase)  
**Status:** Active Development Structure
