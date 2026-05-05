# Mybizz CS — Scaffold Specification

**Vertical:** Consulting & Services
**Platform:** Anvil.works with Material Design 3 (M3)
**Schema:** 36 tables
**Purpose:** Exact package, form, and module specifications for Anvil scaffolding

---

## Overview

This document specifies the exact package structure, forms, and modules to create in Anvil for the `mb-3-cs` app. Follow this specification precisely when scaffolding the app.

**M3 Compliance:** All UI work uses Material Design 3 exclusively. No Anvil Extras components.

---

## Package Structure

### Client Code Packages

```
client_code/
├── auth/
│   ├── LoginForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── SignupForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   └── PasswordResetForm/
│       ├── form_template.yaml
│       └── __init__.py
│
├── dashboard/
│   ├── DashboardForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   └── components/
│       ├── MetricCard/
│       │   ├── form_template.yaml
│       │   └── __init__.py
│       └── ActivityFeed/
│           ├── form_template.yaml
│           └── __init__.py
│
├── settings/
│   ├── SettingsForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── VaultForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── EmailSetupForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── PaymentGatewayForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── ThemeConfigForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   └── UserManagementForm/
│       ├── form_template.yaml
│       └── __init__.py
│
├── layouts/
│   ├── AdminLayout/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── CustomerLayout/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── BlankLayout/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   └── ErrorLayout/
│       ├── form_template.yaml
│       └── __init__.py
│
├── services/
│   ├── ServiceListForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── ServiceEditorForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── ServiceViewerForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   └── ServiceCategoriesForm/
│       ├── form_template.yaml
│       └── __init__.py
│
├── bookings/
│   ├── BookingCalendarForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── BookingListForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── BookingEditorForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── BookingViewerForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── AvailabilitySettingsForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   └── TimeEntriesForm/
│       ├── form_template.yaml
│       └── __init__.py
│
├── crm/
│   ├── ContactListForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── ContactEditorForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── ContactViewerForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── SegmentManagerForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── TaskListForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── EmailCampaignListForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── EmailCampaignEditorForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── EmailBroadcastForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   └── LeadCaptureForm/
│       ├── form_template.yaml
│       └── __init__.py
│
├── invoices/
│   ├── InvoiceListForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── InvoiceEditorForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   └── InvoiceViewerForm/
│       ├── form_template.yaml
│       └── __init__.py
│
├── blog/
│   ├── BlogListForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── BlogPostForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── BlogEditorForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   └── CategoryManagementForm/
│       ├── form_template.yaml
│       └── __init__.py
│
├── public_pages/
│   ├── HomePage/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── AboutPage/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── ContactPage/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── PrivacyPolicyPage/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   ├── TermsConditionsPage/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   └── LandingPage/
│       ├── form_template.yaml
│       └── __init__.py
│
├── analytics/
│   ├── DashboardAnalyticsForm/
│   │   ├── form_template.yaml
│   │   └── __init__.py
│   └── RevenueReportForm/
│       ├── form_template.yaml
│       └── __init__.py
│
└── shared/
    ├── navigation_helpers.py
    ├── validation_utils.py
    └── formatting_utils.py
```

### Server Code Packages

```
server_code/
├── server_auth/
│   ├── service.py
│   └── rbac.py
│
├── server_dashboard/
│   └── service.py
│
├── server_settings/
│   ├── service.py
│   ├── encryption_service.py
│   ├── vault_service.py
│   └── vault_totp_service.py
│
├── server_services/
│   └── service.py
│
├── server_bookings/
│   ├── service.py
│   ├── availability_service.py
│   ├── time_service.py
│   └── metadata_service.py
│
├── server_customers/
│   ├── contact_service.py
│   └── segment_service.py
│
├── server_marketing/
│   ├── campaign_service.py
│   ├── broadcast_service.py
│   ├── task_service.py
│   ├── lead_capture_service.py
│   └── brevo_campaigns_integration.py
│
├── server_payments/
│   ├── stripe_service.py
│   ├── paystack_service.py
│   ├── paypal_service.py
│   ├── invoice_service.py
│   └── webhook_handlers.py
│
├── server_blog/
│   └── service.py
│
├── server_analytics/
│   └── reporting_service.py
│
└── server_shared/
    ├── utilities.py
    ├── validators.py
    ├── encryption.py
    ├── config.py
    └── constants.py
```

---

## Database Schema

Create the following 36 tables in Anvil Data Tables with the exact specifications below.

### Core & Configuration Tables

1. **activity_log**
   - `user_id` (link → users)
   - `action_type` (string)
   - `description` (string)
   - `metadata` (simpleObject)
   - `created_at` (datetime)
   - `ip_address` (string)

2. **business_profile**
   - `business_name` (string)
   - `description` (string)
   - `logo` (media)
   - `contact_email` (string)
   - `phone` (string)
   - `website_url` (string)
   - `tagline` (string)
   - `address_line_1` (string)
   - `address_line_2` (string)
   - `city` (string)
   - `country` (string)
   - `postal_code` (string)
   - `timezone` (string)
   - `social_facebook` (string)
   - `social_instagram` (string)
   - `social_x` (string)
   - `social_linkedin` (string)
   - `created_at` (datetime)
   - `updated_at` (datetime)

3. **config**
   - `key` (string, indexed)
   - `value` (simpleObject)
   - `category` (string)
   - `updated_at` (datetime)
   - `updated_by` (link → users)

4. **email_config**
   - `from_email` (string)
   - `from_name` (string)
   - `configured` (bool)
   - `configured_at` (datetime)
   - `sender_domain_verified` (bool)

5. **files**
   - `path` (string)
   - `file` (media)
   - `file_version` (string)

6. **payment_config**
   - `active_gateway` (string)
   - `stripe_publishable_key` (string)
   - `stripe_connected` (bool)
   - `stripe_connected_at` (datetime)
   - `paystack_connected` (bool)
   - `paystack_connected_at` (datetime)
   - `paypal_client_id` (string)
   - `paypal_connected` (bool)
   - `paypal_connected_at` (datetime)
   - `test_mode` (bool)
   - `configured_at` (datetime)

7. **rate_limits**
   - `identifier` (string, indexed)
   - `count` (number)
   - `reset_time` (datetime)
   - `last_request` (datetime)

8. **theme_config**
   - `primary_color` (string)
   - `accent_color` (string)
   - `font_family` (string)
   - `header_style` (string)
   - `updated_at` (datetime)

9. **users** (Extended Anvil Users)
   - `email` (string, indexed)
   - `enabled` (bool)
   - `last_login` (datetime)
   - `password_hash` (string)
   - `n_password_failures` (number)
   - `confirmed_email` (bool)
   - `role` (string)
   - `account_status` (string)
   - `phone` (string)
   - `permissions` (simpleObject)
   - `created_at` (datetime)
   - `signed_up` (datetime)
   - `email_confirmation_key` (string)
   - `mfa` (simpleObject)

10. **vault**
    - `name` (string, indexed)
    - `value` (string)
    - `created_at` (datetime)
    - `updated_at` (datetime)
    - `updated_by` (link → users)

### Bookings Tables

11. **availability_exceptions**
    - `resource_id` (link → users)
    - `exception_date` (date)
    - `start_time` (string)
    - `end_time` (string)
    - `is_available` (bool)
    - `reason` (string)

12. **availability_rules**
    - `resource_id` (link → users)
    - `day_of_week` (number)
    - `start_time` (string)
    - `end_time` (string)
    - `is_active` (bool)

13. **booking_metadata_schemas**
    - `schema_name` (string)
    - `booking_type` (string)
    - `field_definitions` (simpleObject)
    - `is_active` (bool)

14. **bookings**
    - `booking_id` (string)
    - `contact_id` (link → contacts)
    - `service_id` (link → services)
    - `resource_id` (link → users)
    - `booking_type` (string)
    - `status` (string)
    - `start_datetime` (datetime)
    - `end_datetime` (datetime)
    - `total_price` (number)
    - `payment_status` (string)
    - `payment_id` (string)
    - `special_requests` (string)
    - `metadata` (simpleObject)
    - `booking_number` (string)
    - `created_at` (datetime)
    - `updated_at` (datetime)

15. **services**
    - `service_id` (string)
    - `name` (string)
    - `description` (string)
    - `duration_minutes` (number)
    - `price` (number)
    - `category` (string)
    - `provider_id` (link → users)
    - `meeting_type` (string)
    - `pricing_model` (string)
    - `images` (simpleObject)
    - `video_url` (string)
    - `is_active` (bool)
    - `created_at` (datetime)

16. **contact_submissions**
    - `name` (string)
    - `email` (string)
    - `phone` (string)
    - `message` (string)
    - `submitted_date` (datetime)
    - `status` (string)
    - `client_id` (link → users)
    - `submission_id` (string)
    - `auto_reply_sent` (bool)

### CRM Tables

17. **contacts**
    - `contact_id` (string)
    - `instance_id` (link → users)
    - `first_name` (string)
    - `last_name` (string)
    - `email` (string)
    - `phone` (string)
    - `status` (string)
    - `source` (string)
    - `lifecycle_stage` (string)
    - `tags` (simpleObject)
    - `total_spent` (number)
    - `total_transactions` (number)
    - `average_order_value` (number)
    - `last_contact_date` (datetime)
    - `date_added` (datetime)
    - `created_at` (datetime)
    - `updated_at` (datetime)
    - `internal_notes` (string)
    - `preferences` (simpleObject)

18. **contact_campaigns**
    - `id` (string)
    - `contact_id` (link → contacts)
    - `campaign_id` (link → email_campaigns)
    - `sequence_day` (number)
    - `status` (string)
    - `enrolled_date` (datetime)
    - `last_email_sent_date` (datetime)
    - `completed_date` (datetime)

19. **contact_counter**
    - `value` (number)

20. **contact_events**
    - `event_id` (string)
    - `contact_id` (link → contacts)
    - `event_type` (string)
    - `event_date` (datetime)
    - `event_data` (simpleObject)
    - `related_id` (string)
    - `user_visible` (bool)

21. **email_campaigns**
    - `campaign_id` (string)
    - `instance_id` (link → users)
    - `campaign_name` (string)
    - `campaign_type` (string)
    - `status` (string)
    - `emails_sent` (number)
    - `opens` (number)
    - `clicks` (number)
    - `conversions` (number)
    - `revenue_generated` (number)
    - `campaign_settings` (simpleObject)
    - `created_date` (datetime)
    - `last_run_date` (datetime)

22. **segments**
    - `segment_id` (string)
    - `instance_id` (link → users)
    - `segment_name` (string)
    - `segment_type` (string)
    - `filter_criteria` (simpleObject)
    - `contact_count` (number)
    - `is_active` (bool)
    - `created_date` (datetime)

23. **tasks**
    - `task_id` (string)
    - `instance_id` (link → users)
    - `contact_id` (link → contacts)
    - `task_title` (string)
    - `task_type` (string)
    - `due_date` (datetime)
    - `completed` (bool)
    - `completed_date` (datetime)
    - `notes` (string)
    - `auto_generated` (bool)
    - `created_at` (datetime)

24. **leads**
    - `lead_id` (string)
    - `instance_id` (link → users)
    - `email` (string)
    - `name` (string)
    - `phone` (string)
    - `source` (string)
    - `landing_page_id` (link → landing_pages)
    - `capture_id` (link → lead_captures)
    - `converted_to_contact_id` (link → contacts)
    - `status` (string)
    - `captured_at` (datetime)

25. **lead_captures**
    - `capture_id` (string)
    - `instance_id` (link → users)
    - `capture_name` (string)
    - `capture_type` (string)
    - `trigger_settings` (simpleObject)
    - `form_fields` (simpleObject)
    - `offer_text` (string)
    - `status` (string)
    - `captures_count` (number)
    - `conversions_count` (number)

### Email Tables

26. **email_templates**
    - `template_id` (string)
    - `client_id` (link → users)
    - `name` (string)
    - `subject` (string)
    - `body_html` (string)
    - `body_text` (string)
    - `template_type` (string)
    - `is_active` (bool)

27. **email_log**
    - `recipient` (string)
    - `subject` (string)
    - `template_id` (link → email_templates)
    - `sent_at` (datetime)
    - `status` (string)
    - `error_message` (string)

28. **webhook_log**
    - `gateway` (string)
    - `event_type` (string)
    - `payload` (simpleObject)
    - `signature` (string)
    - `verified` (bool)
    - `processed` (bool)
    - `error_message` (string)
    - `received_at` (datetime)

### Content Tables

29. **blog_categories**
    - `category_id` (string)
    - `client_id` (link → users)
    - `name` (string)
    - `slug` (string)
    - `description` (string)

30. **blog_posts**
    - `post_id` (string)
    - `client_id` (link → users)
    - `title` (string)
    - `slug` (string)
    - `content` (string)
    - `excerpt` (string)
    - `featured_image` (media)
    - `author_id` (link → users)
    - `category_id` (link → blog_categories)
    - `status` (string)
    - `published_at` (datetime)
    - `created_at` (datetime)
    - `updated_at` (datetime)
    - `view_count` (number)

31. **landing_pages**
    - `page_id` (string)
    - `instance_id` (link → users)
    - `title` (string)
    - `slug` (string)
    - `template_type` (string)
    - `config` (simpleObject)
    - `status` (string)
    - `created_at` (datetime)
    - `published_at` (datetime)
    - `views_count` (number)
    - `conversions_count` (number)
    - `updated_at` (datetime)
    - `client_id` (link → users)

32. **pages**
    - `name` (string)
    - `slug` (string)
    - `components` (simpleObject)
    - `is_published` (bool)
    - `view_count` (number)
    - `created_at` (datetime)
    - `updated_at` (datetime)
    - `page_name` (string)
    - `page_title` (string)

### Finance Tables

33. **invoice**
    - `invoice_id` (string)
    - `invoice_number` (string)
    - `contact_id` (link → contacts)
    - `invoice_date` (datetime)
    - `due_date` (datetime)
    - `total_amount` (number)
    - `currency` (string)
    - `paid_at` (datetime)
    - `status` (string)
    - `payment_method` (string)
    - `payment_id` (string)
    - `pdf_url` (string)
    - `notes` (string)
    - `created_at` (datetime)

34. **invoice_items**
    - `invoice_id` (link → invoice)
    - `description` (string)
    - `quantity` (number)
    - `unit_price` (number)
    - `amount` (number)

35. **time_entries**
    - `entry_id` (string)
    - `contact_id` (link → contacts)
    - `staff_id` (link → users)
    - `service_id` (link → services)
    - `booking_id` (link → bookings)
    - `start_time` (datetime)
    - `end_time` (datetime)
    - `duration_hours` (number)
    - `hourly_rate` (number)
    - `total_amount` (number)
    - `description` (string)
    - `is_billable` (bool)
    - `is_invoiced` (bool)
    - `created_at` (datetime)

---

## M3 Component Standards

### Form Types

**List Forms:**
- Heading (headline-large) for page title
- LinearPanel (horizontal) header with search TextBox and filter DropdownMenu
- Filled Button for primary action
- DataGrid for list body with IconButton row actions

**Editor Forms:**
- Card (outlined) as container
- Heading (headline-small) for section headers
- Outlined TextBox/TextArea for inputs
- Outlined DropdownMenu/DatePicker for selections
- LinearPanel action row with Filled Save Button and Outlined Cancel Button

**Dashboard Forms:**
- Heading (headline-large)
- FlowPanel for metrics row holding elevated Cards
- Plot components for charts
- DataGrid for summary tables

**Authentication Forms:**
- Custom Form with no layout wrapper
- Card (outlined) as centred container
- Outlined TextBox components (password type set in Designer)
- Filled Button for submit
- Link components for forgot password and terms/privacy navigation

### Component Naming

All components follow the prefix convention:
- Button: `btn_`
- TextBox: `txt_`
- Label: `lbl_`
- DropdownMenu: `dd_`
- DatePicker: `dp_`
- FileLoader: `fu_`
- Link/Navigation: `nav_`
- Checkbox: `cb_`
- RadioButton: `rb_`
- ColumnPanel: `col_`
- LinearPanel: `lp_`
- FlowPanel: `flow_`
- Card: `card_`
- DataGrid: `dg_`
- RepeatingPanel: `rp_`
- Plot: `plot_`

### M3 Requirements

- All colours use `theme:` prefix — never hardcoded hex
- All inputs use `role='outlined'`
- Validation failure: `role='outlined-error'` with error in placeholder
- Button hierarchy: one filled button per screen (primary), outlined (secondary), text (tertiary)
- TextBox password masking: `hide_text = True` in Designer
- Write Back toggle (W): enabled in Designer Data Bindings panel

---

## Navigation Architecture

### AdminLayout (Custom HtmlTemplate)

```
Dashboard                          (always)
▼ Sales & Operations
  nav_bookings  — BookingListForm   (bookings_enabled)
  nav_services  — ServiceListForm   (services_enabled)
▼ Customers & Marketing
  nav_contacts   — ContactListForm       (always)
  nav_campaigns  — EmailCampaignListForm (marketing_enabled)
  nav_broadcasts — EmailBroadcastForm    (marketing_enabled)
  nav_segments   — SegmentManagerForm    (marketing_enabled)
  nav_tasks      — TaskListForm          (marketing_enabled)
▼ Content & Website
  nav_blog   — BlogListForm     (blog_enabled)
  nav_pages  — PageListForm     (always)
▼ Finance & Reports
  nav_invoices  — InvoiceListForm   (always)
  nav_payments  — PaymentListForm   (always)
  nav_reports   — ReportsForm       (always)
  nav_analytics — AnalyticsForm     (always)
  nav_time      — TimeEntriesForm   (always)
▼ Settings
  nav_settings  — SettingsForm (always)
  nav_vault     — VaultForm    (owner role only)
[Sign out — bottom of sidebar, all roles]
```

**Navigation Pattern:**
- Plain `Link` components — not `NavigationLink`
- Lambda click handlers with mandatory loop variable capture:
  ```python
  lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a)
  ```
- `open_form(string)` for parameterised navigation
- `NavigationDrawerLayoutTemplate` not used
- `navigate_to` not used

### CustomerLayout (Deferred to V2)

```
nav_my_dashboard  — My Dashboard    (always)
nav_my_bookings   — My Bookings     (always)
nav_my_invoices   — My Invoices     (always)
nav_my_reviews    — My Reviews      (always)
nav_support       — Support Tickets (always)
nav_account       — Account         (always)
[Sign out — bottom of sidebar]
```

---

## Startup Configuration

**Startup Form:** `auth.LoginForm`

**Routing:** Anvil Routing dependency (`3PIDO5P3H4VPEMPL`) configured for public pages:
- `/` — HomePage
- `/services` — Services listing
- `/services/:id` — Service detail
- `/booking` — Booking form
- `/blog` — Blog listing
- `/blog/:slug` — Blog post
- `/contact` — Contact page
- `/landing/:slug` — Landing page

---

## Dependencies

**Installed Dependencies:**
1. M3 Theme: `4UK6WHQ6UX7AKELK`
2. Routing: `3PIDO5P3H4VPEMPL`

**Set in Anvil Secrets:**
- `encryption_key` — Fernet encryption key (generate once, never change)

---

## Implementation Notes

### Form File Structure
- Forms are folders: `FormName/`
- Code lives in `FormName/__init__.py`
- Designer config in `FormName/form_template.yaml`
- Never modify `form_template.yaml` programmatically

### Data Binding Pattern
- `self.item` set before `self.init_components()`
- Write Back enabled in Designer
- Call `refresh_data_bindings()` when modifying `self.item` in place
- Do NOT use data bindings on settings forms that manage their own server calls

### Server Function Pattern
- Every server function returns response envelope:
  ```python
  {'success': True, 'data': result}   # on success
  {'success': False, 'error': msg}    # on failure
  ```
- Every server function has docstring with Args, Returns, Raises
- Type hints required on all public functions
- Logging via `logging.getLogger(__name__)`
- Authentication check at entry: `user = anvil.users.get_user()`

---

*End of file — scaffold-spec.md*
