# Mybizz CS — Anvil Scaffolding Workflow

**Purpose:** Step-by-step instructions for creating the `mb-3-cs` app in Anvil.works

---

## Overview

This document provides the exact steps to scaffold the `mb-3-cs` app in Anvil.works following the specifications in `scaffold-spec.md`.

**Prerequisites:**
- Anvil.works account
- GitHub account
- Access to `C:\_mb2-cs-app\` directory

---

## Step 1: Create New Anvil App

1. **Log in to Anvil.works**
   - Go to https://anvil.works
   - Log in with your Anvil account

2. **Create New App**
   - Click "Create New App"
   - Name: `mb-3-cs`
   - Description: "Mybizz Consulting & Services Platform"
   - Click "Create"

3. **Set App Package Name**
   - Go to Settings → App Settings
   - Package name: `mb_2_cs`
   - Click "Save"

---

## Step 2: Install Dependencies

1. **Go to Settings → Dependencies**
2. **Install M3 Theme**
   - Click "Install Dependency"
   - Enter: `4UK6WHQ6UX7AKELK`
   - Name: `Material 3 Theme`
   - Click "Install"
3. **Install Routing**
   - Click "Install Dependency"
   - Enter: `3PIDO5P3H4VPEMPL`
   - Name: `Routing`
   - Click "Install"
4. **Set M3 as Default Theme**
   - Go to Settings → App Settings
   - Theme: `Material 3 Theme`
   - Click "Save"

---

## Step 3: Create Database Tables

Follow the exact specifications in `scaffold-spec.md` to create all 36 tables.

### Table Creation Order

**Create tables in this order** to respect foreign key dependencies:

1. **Core Tables** (create first, no dependencies):
   - `users` (extend Anvil Users)
   - `activity_log`
   - `business_profile`
   - `config`
   - `email_config`
   - `files`
   - `payment_config`
   - `rate_limits`
   - `theme_config`
   - `vault`

2. **Booking Tables**:
   - `availability_rules`
   - `availability_exceptions`
   - `booking_metadata_schemas`
   - `services`
   - `bookings`
   - `contact_submissions`

3. **CRM Tables**:
   - `contacts`
   - `contact_counter`
   - `contact_events`
   - `contact_campaigns`
   - `email_campaigns`
   - `segments`
   - `tasks`
   - `leads`
   - `lead_captures`

4. **Email Tables**:
   - `email_templates`
   - `email_log`
   - `webhook_log`

5. **Content Tables**:
   - `blog_categories`
   - `blog_posts`
   - `landing_pages`
   - `pages`

6. **Finance Tables**:
   - `invoice`
   - `invoice_items`
   - `time_entries`

### Table Creation Instructions

For each table:

1. **Go to Data Tables → Add Table**
2. **Enter Table Name** (exact spelling from spec)
3. **Add Columns** (exact names and types from spec)
4. **Set Permissions**:
   - Client: `No access` (except where specified)
   - Server: `Full access`
5. **Add Indexes**:
   - For `config.key` — indexed
   - For `users.email` — indexed
   - For `vault.name` — indexed
   - For `rate_limits.identifier` — indexed

### Special Table Notes

**users table (Extended Anvil Users):**
- Go to Settings → Users Service
- Click "Add Column" for each field
- Add: `role`, `permissions`, `account_status`, `signed_up`, `email_confirmation_key`, `mfa`

**vault table:**
- This table stores encrypted secrets
- All client API keys stored here (not in Anvil Secrets)
- Encryption key stored in Anvil Secrets (see Step 4)

**config table:**
- Single-row pattern per key
- Will be initialized via `create_initial_config()` function

---

## Step 4: Set Anvil Secrets

1. **Go to Settings → Secrets**
2. **Add New Secret**
   - Name: `encryption_key`
   - Value: Generate using Python:
     ```python
     from cryptography.fernet import Fernet
     print(Fernet.generate_key().decode())
     ```
   - Copy the output (looks like: `Base64EncodedKey...`)
   - Paste as the secret value
   - Click "Save"

**Important:** This is the only item in Anvil Secrets. All other client credentials go in the `vault` table.

---

## Step 5: Create Package Structure

### Client Code Packages

Create the following packages in `client_code/`:

1. **auth/** — `LoginForm`, `SignupForm`, `PasswordResetForm`
2. **dashboard/** — `DashboardForm`, `MetricCard`, `ActivityFeed`
3. **settings/** — `SettingsForm`, `VaultForm`, `EmailSetupForm`, `PaymentGatewayForm`, `ThemeConfigForm`, `UserManagementForm`
4. **layouts/** — `AdminLayout`, `CustomerLayout`, `BlankLayout`, `ErrorLayout`
5. **services/** — `ServiceListForm`, `ServiceEditorForm`, `ServiceViewerForm`, `ServiceCategoriesForm`
6. **bookings/** — `BookingCalendarForm`, `BookingListForm`, `BookingEditorForm`, `BookingViewerForm`, `AvailabilitySettingsForm`, `TimeEntriesForm`
7. **crm/** — `ContactListForm`, `ContactEditorForm`, `ContactViewerForm`, `SegmentManagerForm`, `TaskListForm`, `EmailCampaignListForm`, `EmailCampaignEditorForm`, `EmailBroadcastForm`, `LeadCaptureForm`
8. **invoices/** — `InvoiceListForm`, `InvoiceEditorForm`, `InvoiceViewerForm`
9. **blog/** — `BlogListForm`, `BlogPostForm`, `BlogEditorForm`, `CategoryManagementForm`
10. **public_pages/** — `HomePage`, `AboutPage`, `ContactPage`, `PrivacyPolicyPage`, `TermsConditionsPage`, `LandingPage`
11. **analytics/** — `DashboardAnalyticsForm`, `RevenueReportForm`
12. **shared/** — `navigation_helpers.py`, `validation_utils.py`, `formatting_utils.py`

### Server Code Packages

Create the following packages in `server_code/`:

1. **server_auth/** — `service.py`, `rbac.py`
2. **server_dashboard/** — `service.py`
3. **server_settings/** — `service.py`, `encryption_service.py`, `vault_service.py`, `vault_totp_service.py`
4. **server_services/** — `service.py`
5. **server_bookings/** — `service.py`, `availability_service.py`, `time_service.py`, `metadata_service.py`
6. **server_customers/** — `contact_service.py`, `segment_service.py`
7. **server_marketing/** — `campaign_service.py`, `broadcast_service.py`, `task_service.py`, `lead_capture_service.py`, `brevo_campaigns_integration.py`
8. **server_payments/** — `stripe_service.py`, `paystack_service.py`, `paypal_service.py`, `invoice_service.py`, `webhook_handlers.py`
9. **server_blog/** — `service.py`
10. **server_analytics/** — `reporting_service.py`
11. **server_shared/** — `utilities.py`, `validators.py`, `encryption.py`, `config.py`, `constants.py`

### Package Creation Instructions

For each package:

1. **Right-click on `client_code/` or `server_code/`**
2. **Select "New Package"**
3. **Enter Package Name** (exact spelling from spec)
4. **Click "Create"**

---

## Step 6: Create Forms

### Form File Structure

Each form is a folder:
```
FormName/
├── form_template.yaml
└── __init__.py
```

### Form Creation Instructions

1. **Right-click on the package** (e.g., `auth/`)
2. **Select "New Form"**
3. **Enter Form Name** (e.g., `LoginForm`)
4. **Anvil will create the folder with `form_template.yaml` and `__init__.py`**
5. **Build the UI in the Designer** following M3 standards from `scaffold-spec.md`

### M3 UI Building Checklist

For each form:

**List Forms:**
- [ ] Heading (headline-large) for page title
- [ ] LinearPanel (horizontal) with search TextBox and filter DropdownMenu
- [ ] Filled Button for primary action
- [ ] DataGrid for list body with IconButton row actions

**Editor Forms:**
- [ ] Card (outlined) as container
- [ ] Heading (headline-small) for section headers
- [ ] Outlined TextBox/TextArea for inputs
- [ ] Outlined DropdownMenu/DatePicker for selections
- [ ] LinearPanel action row with Filled Save Button and Outlined Cancel Button

**Dashboard Forms:**
- [ ] Heading (headline-large)
- [ ] FlowPanel for metrics row with elevated Cards
- [ ] Plot components for charts
- [ ] DataGrid for summary tables

**Authentication Forms:**
- [ ] Custom Form with no layout wrapper
- [ ] Card (outlined) as centred container
- [ ] Outlined TextBox components (password type: `hide_text=True` in Designer)
- [ ] Filled Button for submit
- [ ] Link components for forgot password and terms/privacy

### Component Naming

Apply prefix convention to all components:
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

### Designer Properties

**Must be set in Designer:**
- [ ] TextBox password masking: `hide_text = True`
- [ ] Write Back toggle (W): enabled in Data Bindings panel
- [ ] All colours use `theme:` prefix (not hardcoded hex)
- [ ] All inputs use `role='outlined'`

---

## Step 7: Create Server Modules

### Server Module Structure

Each server package contains Python modules:
```
server_package/
├── service.py
├── rbac.py (if applicable)
└── ...
```

### Server Module Creation Instructions

1. **Right-click on the package** (e.g., `server_auth/`)
2. **Select "New Server Module"**
3. **Enter Module Name** (e.g., `service.py`)
4. **Write the server functions** following patterns from `scaffold-spec.md`

### Server Function Checklist

For each server function:
- [ ] Returns response envelope: `{'success': True, 'data': result}` or `{'success': False, 'error': msg}`
- [ ] Has docstring with Args, Returns, Raises
- [ ] Has type hints on all parameters and return value
- [ ] Uses `logging.getLogger(__name__)`
- [ ] Checks authentication at entry: `user = anvil.users.get_user()`
- [ ] Applies RBAC decorator if needed: `@require_role(['owner', 'manager'])`
- [ ] Uses parameterised queries (Anvil Data Tables handles this automatically)
- [ ] Never accepts `instance_id` from client

---

## Step 8: Configure Routing

1. **Go to Settings → Dependencies → Routing**
2. **Configure Public Routes:**
   - `/` — HomePage
   - `/services` — Services listing
   - `/services/:id` — Service detail
   - `/booking` — Booking form
   - `/blog` — Blog listing
   - `/blog/:slug` — Blog post
   - `/contact` — Contact page
   - `/landing/:slug` — Landing page

3. **Add Route Decorators** to public page forms:
   ```python
   from routing import router
   
   @router.route("/")
   class HomePage(HomePageTemplate):
       def __init__(self, routing_context, **properties):
           self.init_components(**properties)
   ```

---

## Step 9: Configure Startup Form

1. **Go to Settings → App Settings**
2. **Startup Form:** `auth.LoginForm`
3. **Click "Save"**

---

## Step 10: Link to GitHub

1. **Go to Settings → GitHub**
2. **Click "Connect to GitHub"**
3. **Authorize Anvil to access your GitHub account**
4. **Create New Repository:**
   - Name: `mb-2-cs`
   - Visibility: Private (recommended) or Public
   - Click "Create Repository"
5. **Anvil will push the app to GitHub**

---

## Step 11: Pull to Local

1. **Clone Repository Locally:**
   ```bash
   cd C:\_mb2-cs-app
   git clone https://github.com/sassycomapp/mb-2-cs.git
   ```

2. **Verify Structure:**
   - `client_code/` contains all client packages
   - `server_code/` contains all server packages
   - `anvil.yaml` contains database schema

---

## Step 12: Verify Scaffolding

### Checklist

- [ ] All 36 tables created in Data Tables
- [ ] All packages created in `client_code/` and `server_code/`
- [ ] All forms built with M3 styling
- [ ] Anvil Secrets has `encryption_key`
- [ ] Routing dependency configured
- [ ] M3 Theme installed and set as default
- [ ] GitHub repository linked
- [ ] Local clone matches Anvil app

### Testing

1. **Test Login:**
   - Try to access the app
   - Should see `LoginForm`
   - Try to register a new user

2. **Test Navigation:**
   - Log in as Owner
   - Verify all navigation items visible
   - Test clicking each navigation item

3. **Test Settings:**
   - Go to Settings
   - Try to save business profile
   - Try to configure theme

---

## Post-Scaffolding

Once scaffolding is complete:

1. **Document any deviations** from the spec
2. **Update `scaffold-spec.md`** if needed
3. **Begin Phase 1 implementation** (coding server functions)

---

## Troubleshooting

### Common Issues

**Issue:** Form not rendering correctly
- **Fix:** Check M3 component hierarchy and styling

**Issue:** Server function not callable
- **Fix:** Verify `@anvil.server.callable` decorator present

**Issue:** Navigation not working
- **Fix:** Verify lambda variable capture pattern

**Issue:** Data not persisting
- **Fix:** Check Write Back toggle enabled in Designer

**Issue:** Routing not working
- **Fix:** Verify `@router.route` decorator and routing dependency installed

---

*End of file — scaffold-workflow.md*
