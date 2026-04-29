---
name: Nomenclature & Naming Conventions
globs: ["**/*.py", "**/*.md"]
description: Defines all naming standards for Mybizz development — folder/file conventions, component prefixes, form naming, terminology, and module structure. Read before creating any file, form, or module.
alwaysApply: false
---

# Mybizz Nomenclature & Naming Conventions

**Version:** 2.1  
**Last Updated:** February 2, 2026  
**Layer:** policy  
**Purpose:** Define naming standards for Mybizz platform development  

**Authority:** Mandatory — all code, files, forms, and databases must follow these conventions without exception.

---

## File & Folder Naming

### Folders
- **Convention**: `PascalCase_WithUnderscores`
- **Examples**: `Temp_WorkInProgress`, `Client_Forms`, `Server_Modules`

### Files
- **Convention**: `lowercase_with_underscores.ext`
- **Examples**: `backup_strategy_analysis.md`, `customer_service.py`, `booking_form.py`

---

## Version & Release System

| Term | Format | Example |
|------|--------|---------|
| **Phase** | `Phase {number}: {Name}` | Phase 1: Authentication |
| **Stage** | `Stage {phase}.{number}: {Name}` | Stage 1.1: User Auth System |
| **Task** | `T{stage}-{number}: {Action}` | T1.1-001: Create users table |

---

## App Instances

### Development Apps
- **Primary**: `Mybizz_core` (master_template_dev → master_template published)
- **Experiments**: `workshop_experiments`
- **Production**: `master_template` (when V1.0 ready)

### Client Apps
- **Pattern**: `client_{businessname}`
- **Examples**: `client_yogastudio`, `client_janes_consulting`
- **Rules**: Lowercase, underscores only, max ~30 chars

---

## User Terminology

| Term | Definition |
|------|-----------|
| **Client** | Mybizz subscriber (business owner) |
| **Customer** | Client's end user (their customer/patient/student) |
| **Subscriber** | Synonym for Client |
| **Visitor** | Public website visitor (not logged in) |
| **Staff** | Client's staff member (therapist, consultant, etc.) — `Staff` role in RBAC |
| **Owner** | Client's business owner — `Owner` role in RBAC |
| **Manager** | Client's operational manager — `Manager` role in RBAC |
| **Admin** | Client's administrative staff — `Admin` role in RBAC |

---

## Anvil Component Prefixes

### Essential Prefixes (Always Apply)

| Component | Prefix | Example |
|-----------|--------|---------|
| Button | `btn_` | `btn_save`, `btn_cancel` |
| TextBox | `txt_` | `txt_customer_name`, `txt_email` |
| TextArea | `txt_` | `txt_notes`, `txt_description` |
| DropdownMenu | `dd_` | `dd_status`, `dd_category` |
| Label / Text / Heading | `lbl_` | `lbl_page_title`, `lbl_section_header` |
| DatePicker | `dp_` | `dp_booking_date`, `dp_start_date` |
| FileLoader | `fu_` | `fu_upload`, `fu_avatar` |
| Link / Navigation Link | `nav_` | `nav_dashboard`, `nav_bookings` |
| Checkbox | `cb_` | `cb_agree_terms`, `cb_newsletter` |
| RadioButton | `rb_` | `rb_payment_method`, `rb_option_a` |
| Switch | `sw_` | `sw_enabled`, `sw_feature_toggle` |
| Image | `img_` | `img_logo`, `img_hero` |
| ColumnPanel | `col_` | `col_main`, `col_content` |
| LinearPanel | `lp_` | `lp_header`, `lp_actions` |
| FlowPanel | `flow_` | `flow_tags`, `flow_metrics` |
| Card | `card_` | `card_details`, `card_revenue` |
| DataGrid | `dg_` | `dg_customers`, `dg_bookings` |
| RepeatingPanel | `rp_` | `rp_items`, `rp_history` |
| Plot | `plot_` | `plot_revenue`, `plot_trend` |

---

## Form Naming

### Pattern
- **Format**: `{Entity}{Type}Form`
- **Examples**: `CustomerListForm`, `BookingEditorForm`, `DashboardForm`

### Form Types (Suffixes)

| Type | Purpose | Example |
|------|---------|---------|
| `ListForm` | Data listing/browsing with filters | `ContactListForm`, `ServiceListForm` |
| `EditorForm` | Create or edit single record | `ContactEditorForm`, `BookingEditorForm` |
| `ViewerForm` | Read-only detail view | `ContactViewerForm`, `InvoiceViewerForm` |
| `DashboardForm` | Summary view with metrics | `DashboardForm`, `MarketingDashboardForm` |

---

## Module Naming

### Server Modules
- **Format**: `{purpose}_service.py`
- **Examples**: `customer_service.py`, `booking_service.py`, `email_service.py`
- **Alternative**: `{purpose}_integration.py` for external API integrations (e.g., `brevo_integration.py`, `stripe_integration.py`)

### Client Modules
- **Format**: `{purpose}_utils.py` or `{purpose}_helpers.py`
- **Examples**: `validation_utils.py`, `format_helpers.py`, `navigation_helpers.py`

---

## Package Organization

### Server Packages

```
server_code/
├─ server_auth/
│  ├─ service.py           # Authentication service
│  └─ rbac.py              # Role-based access control
├─ server_bookings/
│  ├─ booking_service.py
│  ├─ calendar_service.py
│  └─ availability_service.py
├─ server_customers/
│  ├─ contact_service.py
│  ├─ segment_service.py
│  └─ timeline_service.py
├─ server_marketing/
│  ├─ campaign_service.py
│  ├─ brevo_integration.py
│  └─ task_service.py
├─ server_payments/
│  ├─ stripe_service.py
│  ├─ paystack_service.py
│  └─ invoice_service.py
└─ server_shared/
   ├─ utilities.py
   ├─ validators.py
   ├─ encryption.py
   └─ config.py
```

### Client Packages

```
client_code/
├─ auth/
│  ├─ LoginForm
│  ├─ SignupForm
│  └─ PasswordResetForm
├─ dashboard/
│  └─ DashboardForm
├─ bookings/
│  ├─ BookingCalendarForm
│  ├─ BookingListForm
│  └─ AvailabilitySettingsForm
├─ customers/
│  ├─ ContactListForm
│  └─ ContactEditorForm
├─ crm/
│  ├─ EmailCampaignListForm
│  └─ EmailCampaignEditorForm
├─ blog/
│  ├─ BlogListForm
│  └─ BlogEditorForm
├─ settings/
│  └─ SettingsForm
└─ shared/
   ├─ Layouts/
   │  ├─ AdminLayout
   │  ├─ CustomerLayout
   │  ├─ BlankLayout
   │  └─ ErrorLayout
   └─ components/
      ├─ MetricCard
      └─ ActivityTimeline
```

---

## Database Tables

### Table Naming
- **Format**: Lowercase, underscores
- **Examples**: `customers`, `bookings`, `transactions`, `user_settings`, `email_campaigns`

### Linked Columns
- **Format**: `{table}_link` or `{table}_id`
- **Example**: `customer_link` (links to customers table)
- **Convention**: Anvil automatically creates `{table}_link` when a relationship is created; use this format for explicit foreign keys as well

### System Columns (Present on Most Tables)
- `instance_id` — Client identifier (NOT present on all tables — verify schema before assuming)
- `created_at` — Timestamp when record created
- `updated_at` — Timestamp when record last updated

---

## Transaction Types

| Type | Usage | Example |
|------|-------|---------|
| `appointment` | Timed service booking | 60-minute massage on 2026-04-15 |
| `consulting` | Fixed-price service | Logo design project |

---

## Currency Terms

| Term | Definition |
|------|-----------|
| **System Currency** | Primary currency for client's administration (set at onboarding, immutable after first transaction). All reporting in system currency. |
| **Display Currency** | Optional secondary currency for customer-facing prices (e.g., prices shown in ZAR, but processed in USD). |

---

## Critical Concepts & Terms

### Business Model
- **Grandfathering**: First 50 clients at $25/month lifetime; clients 51-100 at $50/month
- **Platform Capacity**: 100 clients maximum (V1.x)
- **Vertical**: Consulting & Services only (not e-commerce, hospitality, or membership)

### Architecture
- **Master Template**: Published Anvil dependency containing all Mybizz features (zero client data)
- **Client Instance**: Individual Anvil app for one business, depends on master_template
- **Pull-Based Updates**: Clients control when they update master_template; not automatic
- **Data Isolation**: Complete — each client instance is separate Anvil app with separate database

### Security
- **The Vault**: Encrypted secrets store for all client API keys (not Anvil Secrets)
- **RBAC**: Role-Based Access Control with 5 roles (Owner, Manager, Admin, Staff, Customer)

---

## Anvil-Specific Terminology

### Code Organization
- **Server Module**: Backend code, accesses Data Tables, uses Anvil Secrets, runs on Anvil servers
- **Client Module**: Browser code, UI only, cannot access Data Tables directly
- **Server Package**: Named package under `server_code/` containing related server modules
- **Client Package**: Named package under `client_code/` containing related client forms and components

### Decorators & Functions
- **`@anvil.server.callable`** — Makes server function callable from client code
- **`@anvil.server.background_task`** — Background task for long-running operations (>30 seconds)
- **`@anvil.server.route(path)`** — HTTP endpoint for webhooks and routing
- **`@require_role(roles)`** — RBAC decorator to enforce role requirements
- **`@require_permission(permission)`** — RBAC decorator to enforce permission requirements

---

## Common Abbreviations

| Abbrev | Full Term | Usage |
|--------|-----------|-------|
| MVP | Minimum Viable Product | V1.x is the MVP |
| API | Application Programming Interface | Stripe API, Paystack API |
| CRM | Customer Relationship Management | Contact database and campaigns |
| UI | User Interface | Material Design 3 (M3) UI |
| CRUD | Create, Read, Update, Delete | Basic data operations |
| RBAC | Role-Based Access Control | Owner, Manager, Admin, Staff, Customer |
| TOTP | Time-Based One-Time Password | 2FA via authenticator apps |
| GDPR | General Data Protection Regulation | Data subject rights (export, delete) |
| POPIA | Protection of Personal Information Act | South Africa privacy law |
| PCI DSS | Payment Card Industry Data Security Standard | Payment processing compliance |
| SMTP | Simple Mail Transfer Protocol | Email relay (Brevo SMTP) |
| SEO | Search Engine Optimization | Page titles, meta descriptions |

---

## Enforcement

All naming conventions are **mandatory**. Code review must verify:

- [ ] All folders follow `PascalCase_WithUnderscores`
- [ ] All files follow `lowercase_with_underscores.ext`
- [ ] All components use correct prefixes
- [ ] All forms follow `{Entity}{Type}Form` pattern
- [ ] All modules follow `{purpose}_{service|utils|integration}.py` pattern
- [ ] All database tables follow `lowercase_with_underscores` convention
- [ ] All server functions use `@anvil.server.callable` decorator
- [ ] All RBAC-controlled functions use `@require_role()` or `@require_permission()` decorators
- [ ] All terminology matches this document exactly

---

**Maintained By:** Mybizz Development Team  
**Next Review:** After major feature additions or quarterly  
**Authority:** Mandatory — non-compliance is a code review blocker
