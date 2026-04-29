---
name: Build Plan — Mybizz V1.x
globs: []
description: The complete implementation plan for Mybizz V1.x — Consulting & Services vertical only. Read when implementing any feature — gives phase sequence, form creation specs, server function signatures, and completion criteria. Mandatory sequencing — build phases in order. Do not skip ahead without completing prior phase completion criteria.
alwaysApply: false
---

# STATUS: ACTIVE — C&S VERTICAL ONLY

# Mybizz Platform V1.x — Build Plan

**Document Version:** 16.0
**Layer:** spec

**Authority:** Mandatory sequencing — build phases in order. Do not skip ahead without completing prior phase completion criteria.

**Related resources:**
- `policy_development.md` — M3 standards, code quality, error handling — apply to ALL tasks here
- `policy_nomenclature.md` — component naming — apply to ALL forms created here
- `spec_ui_standards.md` — form type standards (list, editor, dashboard)
- `spec_database.md` — full schema — use for all table references here
- `policy_security.md` — security and compliance specifications for Phase 6
- `spec_integrations.md` — integration code patterns for Phases 3, 5
- `spec_vault.md` — Vault architecture — read before Phase 1.5 and Phase 6.2

---

> **Agent instruction:** M3 component standards, naming conventions, and data binding patterns are NOT repeated here. Before implementing any form or server function in this plan, read: `policy_development.md` (governing policy), `policy_nomenclature.md` (naming), `spec_ui_standards.md` (form type standards). All database table field definitions are in `spec_database.md` — this plan notes which tables to create in each phase but does not re-specify fields.

> **Credential rule:** All client API keys and credentials go in the Vault — never in Anvil Secrets. Retrieve via `get_vault_secret()`. See `spec_vault.md` and `spec_integrations.md §0`.

> **Scope:** This plan covers the Consulting & Services vertical only. Phases covering e-commerce, shipping, hospitality vertical optimisation, and platform management provisioning have been removed. If those phases are ever needed they must be rebuilt from scratch against current C&S architecture.

> **Navigation standard:** AdminLayout and CustomerLayout use custom HtmlTemplate layouts with plain `Link` components and lambda click handlers. `NavigationDrawerLayoutTemplate`, `NavigationLink`, and `navigate_to` are not used anywhere in this codebase. See ADR-002 and `ref_anvil_navigation.md`.

> **Email standard:** Transactional email uses Brevo SMTP (`transactional_email_service.py`). Marketing email uses Brevo Campaigns API (`brevo_campaigns_integration.py`). There is no Zoho integration of any kind. See ADR-001 and `brevo-email-reference.md`.

---

## Completion Criteria Summary

| Phase | Complete when |
|---|---|
| 1 | Authentication, dashboard, settings, Vault functional |
| 2 | Public website with blog live |
| 3 | Payments and invoicing operational |
| 4 | Booking system operational |
| 5 | CRM and email marketing integrated |
| 6 | Security and compliance implemented |
| 7 | Analytics and reporting available |
| 8 | Services vertical polished, time tracking and client portal complete |
| 9 | Platform management app operational (separate build) |
| 10 | Platform launched with first clients |

---

## PHASE 1: AUTHENTICATION & ADMINISTRATION

### 1.1 Project Infrastructure

1. Create Anvil app `Mybizz_core_v1_2_dev`
2. Configure app package name as `Mybizz_core`
3. Initialize git repository `Mybizz-master-template`
4. Create packages: `client_code/shared/`, `server_code/shared/`
5. **Add dependencies in Settings → Dependencies → Third Party:**
   - M3 Theme: `4UK6WHQ6UX7AKELK`
   - Routing: `3PIDO5P3H4VPEMPL`
   - Set M3 as default theme
6. Create `server_code/shared/config.py` with environment configuration
7. **Set `encryption_key` in Anvil Secrets** — generate a Fernet key and store it via the Anvil IDE. This is the only item that ever goes in Anvil Secrets. See `spec_vault.md §6`.
8. Test app launch

### 1.2 Authentication System

1. Enable Anvil Users service
2. Enable "Allow two-factor reset by email" in Anvil Users settings
3. Extend users table: `role` (text), `permissions` (simpleObject), `account_status` (text), `last_login` (datetime) — full schema: `spec_database.md §3 table 2`
4. Create `client_code/auth/` package
5. **Create `LoginForm`** (BlankLayout):
   - Card (outlined) as form container
   - Heading (headline-large): "Sign In"
   - TextBox (`appearance='outlined'`) for email; TextBox (`appearance='outlined'`, `type='password'` set in Designer) for password
   - Checkbox: "Remember me"; Button (`appearance='filled'`): "Sign In"; Link: "Forgot password?"
   - Validation failure: `error=True` + `supporting_text="message"` on the relevant TextBox; restore: `error=False` + `supporting_text=""`
6. **Create `SignupForm`** (BlankLayout):
   - Card (outlined); Heading (headline-large): "Create Account"
   - TextBox (`appearance='outlined'`) fields: email, password, confirm password, business name
   - Checkbox: "I agree to Terms"; Button (`appearance='filled'`): "Create Account"
7. **Create `PasswordResetForm`** (BlankLayout):
   - Card (outlined); Heading (headline-small): "Reset Password"
   - TextBox (`appearance='outlined'`) for email; Button (`appearance='filled'`): "Send Reset Link"
8. Create `server_code/server_auth/service.py`:
   ```python
   @anvil.server.callable
   def authenticate_user(email, password)
   @anvil.server.callable
   def create_user(email, password, business_name)
   @anvil.server.callable
   def reset_password(email)
   @anvil.server.callable
   def check_permission(user, permission_name)
   ```
9. Create `server_code/server_auth/rbac.py`: permission checking, role validation
10. Startup route: not logged in → LoginForm; logged in → DashboardForm
11. Test complete auth flow

### 1.3 Dashboard & Navigation

1. Create `client_code/dashboard/` and `client_code/shared/` packages
2. **Create `DashboardForm`** (AdminLayout):
   - Heading (headline-large): "Dashboard"
   - LinearPanel (horizontal): 4 × Card (elevated) for revenue, bookings, customers, time entries metrics
   - Each metric card: Heading (headline-small) label + Text (display-medium) value + Text (body-small) change indicator
   - DataGrid for recent activity; Card (outlined) for storage usage widget
3. Create `server_code/server_dashboard/service.py`:
   ```python
   @anvil.server.callable
   def get_dashboard_metrics()
   @anvil.server.callable
   def get_recent_activity()
   @anvil.server.callable
   def get_storage_usage()
   ```
4. Create `client_code/shared/navigation_helpers.py`:
   ```python
   def require_auth()           # Redirect to LoginForm if not authenticated
   def require_admin()          # Check owner/manager/admin role
   def navigate_to_dashboard()  # Route to AdminLayout or CustomerLayout by role
   ```
5. Create `server_code/server_shared/utilities.py`: date formatting, currency formatting, common validators
6. Test dashboard and navigation

### 1.4 Settings & Configuration

1. Create `client_code/settings/` package
2. **Create `SettingsForm`** (AdminLayout) — sections stacked in ColumnPanel, each in Card (outlined):
   - **Business Profile:** TextBox (`appearance='outlined'`) for name/email/phone; FileLoader for logo; TextArea (`appearance='outlined'`) for address; Button (`appearance='filled'`): "Save"
   - **Feature Activation:** Switch per feature (sw_bookings, sw_services, sw_blog); Button (`appearance='filled'`): "Save Features"
   - **Theme Customization:** M3 colour pickers; preview Card; Button (`appearance='filled'`): "Save Theme"
   - **Currency:** DropdownMenu (`appearance='outlined'`) for system currency; Button (`appearance='filled'`): "Save Currency"
   - **Users & Permissions:** DataGrid for user list; Button (`appearance='filled'`): "Add User"; IconButtonMenu for row actions
3. Create tables: `config`, `currencies` — schema: `spec_database.md §3 tables 4, 6`
4. Create `server_code/server_settings/config_service.py`:
   ```python
   @anvil.server.callable
   def get_config()
   @anvil.server.callable
   def update_config(config_data)
   @anvil.server.callable
   def create_initial_config(business_name)
   ```
5. Call `create_initial_config()` during signup
6. Test settings

### 1.5 The Vault

Full Vault architecture: `spec_vault.md`.

2FA decision: Anvil's built-in MFA is not used for Vault access — it is an app-level login gate and cannot fire as a per-feature step-up mid-session without forcing a full re-login. The Vault uses TOTP step-up via `pyotp` instead (Google Authenticator, RFC 6238).

Build status (2026-03-16): Steps 1–6 complete. Step 7 pending (David action required). Steps 8–11 remaining.

1. ~~Create `vault` table in Anvil.works Data Tables~~ **DONE**
   - Columns: `name` (string), `value` (string), `created_at` (datetime), `updated_at` (datetime), `updated_by` (link → users)
   - Permissions: Client — no access. Server — full access.

2. ~~Create `server_shared/encryption_service.py`~~ **DONE**
   - `encrypt_value(plaintext)` and `decrypt_value(ciphertext)` using `cryptography.fernet.Fernet`
   - Reads `encryption_key` from Anvil Secrets on every call
   - Not callable from client code

3. ~~Create `server_shared/vault_service.py`~~ **DONE**
   - `get_vault_secret(name)` — internal server use only, never callable from client. Raises if not found. Reserved names (prefix `_`) accessible for system use.
   - `set_vault_secret(name, value)` — Owner only. Encrypts and writes. Creates or updates. Rejects reserved names.
   - `delete_vault_secret(name)` — Owner only. Hard delete, unrecoverable. Rejects reserved names.
   - `list_vault_secrets()` — Owner only. Sorted list of names only, never values. Filters reserved names.
   - Reserved convention: names beginning with `_` are system-only (e.g. `_totp_secret`). Hidden from `list_vault_secrets()`.
   - Note: before VaultForm is built, `set_vault_secret` and `delete_vault_secret` need `session_token` parameters added — see step 8.

4. ~~Create `server_shared/vault_totp_service.py`~~ **DONE**
   - `get_vault_totp_setup()` — Owner only. First call: generates TOTP secret via `pyotp.random_base32()`, stores encrypted as `_totp_secret`, returns `otpauth://` URI and base32 secret. Subsequent calls: returns `is_configured: True`, no URI.
   - `verify_vault_totp(token)` — Owner only. Validates 6-digit code with ±1 interval window for clock skew. On success: sends email notification to Owner; issues Fernet-encrypted session token valid 5 minutes (client memory only, never persisted).
   - `require_vault_session(session_token)` — internal guard, not callable from client. Decrypts token, checks email binding and expiry, raises if invalid.

5. ~~Wire `server_settings/service.py` to the Vault~~ **DONE**
   - `save_email_config()` routes `brevo_smtp_key` to the Vault via `set_vault_secret()` — never written to the `email_config` table
   - `test_email_connection()` retrieves `brevo_smtp_key` from the Vault via `get_vault_secret()`
   - `get_email_config()` masks `brevo_smtp_key` by checking Vault presence via `list_vault_secrets()`
   - `save_payment_config()` routes `stripe_secret_key`, `paystack_secret_key`, and `paypal_secret` to the Vault
   - `get_payment_config()` masks all three secret keys

6. ~~`pyotp` installed as Anvil app dependency~~ **DONE**

7. **Set `encryption_key` in Anvil Secrets via the Anvil IDE** — PENDING (David action, tracked as todo #87)
   - Generate: `from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())` in a local Python shell
   - Paste into Anvil IDE → Secrets panel, name: `encryption_key`
   - This is the only item that ever goes in Anvil Secrets. Required before any Vault code can run.

8. Add `require_vault_session(session_token)` to `set_vault_secret` and `delete_vault_secret`:
   - Update signatures to `set_vault_secret(name, value, session_token)` and `delete_vault_secret(name, session_token)`
   - Call `require_vault_session(session_token)` as first line after `_require_owner()` in both functions

9. **Create `VaultForm`** (`client_code/settings/VaultForm`, AdminLayout)

   On open — TOTP gate:
   - Call `get_vault_totp_setup()`
   - First time (`is_configured=False`): show QR code screen. Render `otpauth://` URI as QR code via `anvil.js` (e.g. `qrcode.js`). Show base32 secret as plain text for manual entry fallback. Prompt Owner to enter 6-digit code to confirm pairing. Call `verify_vault_totp(token)` — on success proceed to main UI.
   - Subsequent opens (`is_configured=True`): show 6-digit entry prompt immediately. Call `verify_vault_totp(token)` — on failure show inline error and re-prompt. On success: store `session_token` in `self._session_token` and `self._session_expiry`. Proceed to main UI.

   Main vault UI — shown only after a verified session:
   - Heading: "The Vault"
   - Note to user: values are never displayed, names only
   - Repeating panel or DataGrid: one row per secret showing name and last-updated timestamp, no values
   - Add Secret: name and value inputs, calls `set_vault_secret(name, value, self._session_token)`
   - Update (per row): new value only, calls `set_vault_secret(name, new_value, self._session_token)`
   - Delete (per row): confirmation dialog, calls `delete_vault_secret(name, self._session_token)`
   - On expired session response: clear `self._session_token`, return to TOTP entry screen
   - Role enforcement: Owner only — enforced server-side independently of any client-side role check

10. Add `nav_vault → VaultForm` to AdminLayout under Settings divider — Owner role only

11. Test Vault end-to-end:
    - Set `encryption_key` in Anvil Secrets
    - Open VaultForm — confirm TOTP setup screen appears on first open
    - Pair Google Authenticator and verify the first code
    - Add a secret — confirm it appears by name in the list with no value shown
    - Open VaultForm again — confirm TOTP code is required every time, no grace period
    - Confirm email notification arrives on Owner's registered address on each open
    - Save email config with a Brevo SMTP key — confirm test connection retrieves it from the Vault
    - Save a payment gateway secret key — confirm it is retrievable server-side

### 1.6 AdminLayout — Full Navigation Specification

All items are plain `Link` components wired with lambda handlers — see `ref_anvil_navigation.md` for the pattern:

```
nav_dashboard → DashboardForm  (always)

[Divider: "Sales & Operations"]
nav_bookings → BookingListForm   (bookings_enabled)
nav_services → ServiceListForm   (services_enabled)

[Divider: "Customers & Marketing"]
nav_contacts   → ContactListForm       (always)
nav_campaigns  → EmailCampaignListForm (marketing_enabled)
nav_broadcasts → EmailBroadcastForm    (marketing_enabled)
nav_segments   → SegmentManagerForm    (marketing_enabled)
nav_tasks      → TaskListForm          (marketing_enabled)

[Divider: "Content & Website"]
nav_blog  → BlogListForm     (blog_enabled)
nav_pages → PageListForm     (always)
nav_media → MediaLibraryForm (always)

[Divider: "Finance & Reports"]
nav_invoices  → InvoiceListForm   (always)
nav_payments  → PaymentListForm   (always)
nav_reports   → ReportsForm       (always)
nav_analytics → AnalyticsForm     (always)
nav_time      → TimeEntriesForm   (always)
nav_expenses  → ExpensesForm      (always)

[Divider: "Settings"]
nav_settings → SettingsForm (always)
nav_vault    → VaultForm    (owner role only)

[Sign out — bottom of sidebar, all roles]
```

CustomerLayout navigation (custom HtmlTemplate — not NavigationDrawerLayoutTemplate):
```
nav_my_dashboard → My Dashboard    (always)
nav_my_bookings  → My Bookings     (always)
nav_my_invoices  → My Invoices     (always)
nav_my_reviews   → My Reviews      (always)
nav_support      → Support Tickets (always) → TicketSubmissionForm
nav_account      → Account         (always)

[Sign out — bottom of sidebar]
```

---

## PHASE 2: WEBSITE & CONTENT

### 2.1 Public Website — Standard Pages

1. Create `client_code/public/` package; `server_code/server_website/` package
2. **`HomePageForm`:** Hero, features grid, services showcase (if enabled), testimonials, CTA. Template-driven (see §2.2).
   ```python
   @anvil.server.callable
   def get_home_config()
   @anvil.server.callable
   def save_home_config(config_data)
   ```
3. **`AboutPageForm`:** Business story, team, values. Admin editor: rich text + team member management. Config stored in `config` table key `about_config`
4. **`ContactPageForm`:** Contact form (name, email, phone, message), business info, optional map. Create `contact_submissions` — schema: `spec_database.md §3 table 55`
   ```python
   @anvil.server.callable
   def submit_contact_form(form_data)
   @anvil.server.callable
   def get_contact_submissions(status=None)
   ```
   Email notification to owner on submission via Brevo SMTP (`transactional_email_service.py`)
5. **`PrivacyPolicyPage` + `TermsConditionsPage`:** Admin rich text editors; default templates provided. Config keys: `privacy_policy`, `privacy_policy_updated`, `terms_conditions`, `terms_conditions_updated`

### 2.2 Home Page Templates (4)

Classic Business · Services · Booking · Minimalist. Same data, different presentation. Template selection in admin settings. All templates support all C&S features.

### 2.3 Landing Pages System

3 templates: Lead Capture · Event Registration · VSL. Create `landing_pages`, `leads` — schema: `spec_database.md §3 tables 54, 56`. V1.x: template-based creation. Analytics: views, conversions, conversion rate. Lead capture creates records in both `leads` and `contacts` simultaneously at capture time — see ADR-004.

### 2.4 Blog System

1. Create `client_code/blog/` and `server_code/server_blog/` packages
2. **`BlogListForm`** — public listing; **`BlogPostForm`** — individual post view
3. **`BlogEditorForm`** (Admin): rich text, title, excerpt, featured image, categories, tags, SEO fields, publish/draft status
4. Create `blog_posts` — schema: `spec_database.md §3 table 25`
5. Server functions:
   ```python
   @anvil.server.callable
   def get_published_posts(page=1, page_size=10)
   @anvil.server.callable
   def get_post_by_slug(slug)
   @anvil.server.callable
   def create_post(post_data)
   @anvil.server.callable
   def update_post(post_id, post_data)
   ```

---

## PHASE 3: PAYMENTS & INVOICING

### 3.1 Payment Gateway (Stripe / Paystack / PayPal)

All payment operations go through a gateway-agnostic service layer in `server_payments/`. Client forms are identical regardless of which gateway the client uses.

1. Create `server_code/server_payments/` package
2. Implement gateway modules:
   - `stripe_service.py` — primary international gateway
   - `paystack_service.py` — South African and African clients (Stripe does not operate in South Africa)
   - `paypal_service.py` — globally recognised payment standard
3. Service layer determines active gateway from `active_gateway` value in `payment_config`
4. All gateway credentials (`stripe_secret_key`, `paystack_secret_key`, `paypal_secret`) stored in Vault — retrieved via `get_vault_secret()` at runtime. Never in code, never in Data Tables.
5. Webhooks received at dedicated HTTP endpoints, verified by signature before processing. Payment events logged to `webhook_log`.
6. Payment integrated into booking flow — no separate checkout process
7. System currency set at onboarding, immutable after first transaction
8. Test all three gateways in test mode

### 3.2 Invoicing System

1. Create **`InvoiceListForm`** · **`InvoiceEditorForm`** (Admin)
2. Create `server_payments/invoice_service.py`:
   ```python
   @anvil.server.callable
   def create_invoice(invoice_data)
   @anvil.server.callable
   def get_invoice(invoice_id)
   @anvil.server.callable
   def update_invoice_status(invoice_id, status)
   @anvil.server.callable
   def send_invoice(invoice_id)
   ```
3. Invoice delivery via Brevo SMTP (`transactional_email_service.py`)
4. `nav_invoices → InvoiceListForm`; `nav_payments → PaymentListForm` — always visible under Finance & Reports

---

## PHASE 4: BOOKINGS & APPOINTMENTS

### 4.1 Calendar System

1. Create `client_code/bookings/` and `server_code/server_bookings/` packages
2. **`BookingCalendarForm`:** Month/week/day views, availability display, click-to-book
3. Create `bookings` — schema: `spec_database.md §3 table 11` ⚠️ `contact_id` field PENDING — see `DEVELOPER_NOTE_schema_changes_required.md`

### 4.2 Availability Management

1. **`AvailabilitySettingsForm`** (Admin): business hours by day, blocked dates, service-specific availability
2. Create `availability_rules`, `availability_exceptions` — schema: `spec_database.md §3 tables 8–9`
3. Server functions:
   ```python
   @anvil.server.callable
   def get_available_slots(date, service_id)
   @anvil.server.callable
   def check_slot_available(datetime, service_id)
   ```

### 4.3 Booking Creation Flow

1. **`BookingForm`** (Public): service selection, date/time, customer details, payment if required
2. Booking confirmation email via Brevo SMTP — `transactional_email_service.py` in `server_emails/`
3. Admin booking management: manual creation, editing, status updates
4. Server functions:
   ```python
   @anvil.server.callable
   def create_booking(booking_data)
   @anvil.server.callable
   def update_booking_status(booking_id, status)
   @anvil.server.callable
   def get_upcoming_bookings()
   ```

### 4.4 Service Catalogue Management

1. **`ServiceListForm`** (Admin) · **`ServiceEditorForm`** (Admin): name, description, duration, price, category, availability settings
2. Create `services` — schema: `spec_database.md §3 table 12`
3. Display services on public site

---

## PHASE 5: CRM & MARKETING

### 5.1 Contact Management

1. Create `client_code/crm/` and `server_code/server_customers/` packages
2. **`ContactListForm`:** Searchable + filterable by status/segment; import/export CSV
3. **`ContactDetailForm`:** Contact info, activity timeline, notes, tag management
4. Create `contacts`, `contact_events`, `contact_counter` — schema: `spec_database.md §3 tables 47, 47a, 48`
5. Create `server_code/server_customers/contact_service.py`:
   ```python
   @anvil.server.callable
   def get_all_contacts(filters)
   @anvil.server.callable
   def get_contact_detail(contact_id)
   @anvil.server.callable
   def create_contact(contact_data)
   @anvil.server.callable
   def update_contact_from_transaction(email, transaction_data)
   ```

### 5.2 Email Marketing (Brevo Campaigns)

Full integration detail: `spec_integrations.md §3` and `brevo-email-reference.md`.

Brevo API credentials stored in Vault by client Owner before use.

1. Client Owner adds `brevo_api_key` to Vault via VaultForm
2. **`EmailCampaignListForm`** · **`EmailCampaignEditorForm`:** campaign name, email sequence builder, trigger conditions, target segment
3. Create `email_campaigns`, `contact_campaigns` — schema: `spec_database.md §3 tables 49–50`
4. Create `server_code/server_marketing/campaign_service.py`:
   ```python
   @anvil.server.callable
   def create_campaign(campaign_data)
   @anvil.server.callable
   def enroll_contact_in_campaign(contact_id, campaign_id)
   @anvil.server.background_task
   def process_email_campaigns()  # Hourly — sends via Brevo Campaigns API
   ```
5. Create `server_code/server_marketing/brevo_campaigns_integration.py`:
   - `send_campaign_email(contact, campaign, sequence_day)` — via `brevo_api_key` from Vault
   - `sync_contact_to_brevo(contact_data)` — pushes contact updates to Brevo
   - `handle_brevo_webhook(event_data)` — processes open/click/unsubscribe events
6. **`EmailBroadcastForm`:** one-off email to segment via Brevo Campaigns API
7. Test campaigns end-to-end

### 5.3 Segmentation

1. **`SegmentManagerForm`:** pre-built segments + custom segment builder
2. Pre-built: VIP clients · Repeat clients · Inactive contacts · Upcoming appointments
3. Create `segments` — schema: `spec_database.md §3 table 51`
4. Real-time segment calculation with cached counts

### 5.4 Task Automation

1. **`TaskListForm`:** task list by status, due date sorting, assignment
2. Create `tasks` — schema: `spec_database.md §3 table 52`
3. Auto-task generation background task (daily 03:00):
   ```python
   @anvil.server.background_task
   def create_automated_tasks():
       # Check upcoming appointments (7 days out)
       # Generate preparation instruction tasks
       # Generate review request tasks
   ```

---

## PHASE 6: SECURITY & COMPLIANCE

Full specifications: `policy_security.md`

### 6.1 Enhanced RBAC

1. Implement permission decorators:
   ```python
   @require_role(['owner', 'manager'])
   @require_permission('bookings.manage')
   def create_booking(booking_data)
   ```
2. Granular permissions: `bookings.view/manage` · `services.view/manage` · `customers.view/manage` · `settings.view/manage`
3. Test all permission levels

### 6.2 Vault Verification

The Vault is built in Phase 1.5. This step verifies correct integration across all integrations before security sign-off.

- [ ] Confirm `get_vault_secret()` is used in all integration modules — no direct table reads for credentials
- [ ] Confirm no `anvil.secrets.get_secret()` calls exist for client credentials anywhere in the codebase
- [ ] Confirm VaultForm TOTP fires on every open with no grace period
- [ ] Confirm email notification fires on every Vault open
- [ ] Confirm Vault is accessible to Owner role only
- [ ] Test: save a secret, retrieve it via an integration, confirm plaintext never appears in UI or logs

### 6.3 Data Encryption

1. Verify `encryption_service.py` is complete with `encrypt_value()` and `decrypt_value()`
2. Verify `encryption_key` is set in Anvil Secrets and is the only item there
3. Encrypt customer PII fields where required

### 6.4 Audit Logging

1. Create `audit_log` table — spec: `policy_security.md §4`
2. Log: user changes, permission changes, data deletions, payment processing, Vault access
3. Create audit log viewer (Owner/Manager roles only)

### 6.5 Security Hardening

- [ ] Password validation — strength requirements per `policy_security.md §3.1`
- [ ] Session timeout — 30 min inactivity per `policy_security.md §3.3`
- [ ] Rate limiting on all API endpoints — `policy_security.md §4.1`
- [ ] Input validation on all forms — `policy_security.md §4.2`
- [ ] XSS protection — sanitize all HTML inputs
- [ ] Review Anvil security settings
- [ ] Enable MFA for all admin accounts

### 6.6 Compliance Implementation

- [ ] Privacy policy (`/docs/legal/privacy_policy.md`) — GDPR, POPIA, CCPA compliant
- [ ] Terms of service (`/docs/legal/terms_of_service.md`)
- [ ] Cookie consent banner on all public pages
- [ ] `export_my_data` — GDPR Article 15 / POPIA
- [ ] `delete_my_account` anonymisation — GDPR Article 17 / POPIA
- [ ] Data retention policy document
- [ ] Audit logging — `audit_log` + `log_audit_event`
- [ ] **Register with South African Information Regulator (POPIA — MANDATORY)**
- [ ] Complete PCI DSS SAQ A

### 6.7 Backup & Recovery

- [ ] Verify Anvil backup configuration
- [ ] Weekly automated CSV exports
- [ ] Pre-update snapshots
- [ ] Disaster recovery plan document
- [ ] Test backup restore process

### 6.8 Security Testing

- [ ] OWASP Top 10 vulnerability scan
- [ ] Basic penetration testing
- [ ] Review all server functions for security issues
- [ ] Test rate limiting
- [ ] Test session timeout
- [ ] Test Vault TOTP and email notification
- [ ] Security incident response plan

---

## PHASE 7: ANALYTICS & REPORTING

### 7.1 Dashboard Analytics

1. **`AnalyticsDashboardForm`:** revenue metrics, booking metrics, customer metrics, billable hours metrics
2. Date range selector; export reports to PDF/CSV
3. Server: `get_analytics_summary(date_range)`

### 7.2 Revenue Reporting

1. **`RevenueReportForm`:** revenue by day/week/month, by service, by payment method
2. Charts and visualizations (Plot component)
   ```python
   @anvil.server.callable
   def get_revenue_report(date_range, group_by)
   ```

### 7.3 Customer Analytics

1. **`CustomerAnalyticsForm`:** lifetime value, acquisition by source, retention rate, repeat appointment rate
2. **`ServicesReportForm`:** bookings by service, staff utilisation, billable hours, appointment completion rate
3. **`StaffPerformanceForm`** (Admin): per-staff drilldown from analytics dashboard
   - Metrics: billable hours (period-selectable), booking count, appointment completion rate
   - Server: `get_staff_performance(staff_id, date_range)` — resolves via `customer_id`/`staff_id` on `time_entries` and `bookings` tables
   - Note: deferred from Stage 1.4 dashboard work — design and implement during this phase only, do not pull forward

---

## PHASE 8: VERTICAL POLISH

### 8.1 Services Vertical Optimisation

Features: service packages, staff scheduling, appointment reminders, client history. Additional table: `service_packages` (package_name, included_services, discount)

### 8.2 Time Tracking & Billing Polish

1. **`TimeEntriesForm`:** log time against bookings/services; `nav_time → TimeEntriesForm` (always visible, Finance & Reports group)
2. **`ExpensesForm`:** log expenses; `nav_expenses → ExpensesForm` (always visible, Finance & Reports group)
3. Create `time_entries`, `expenses` tables — schema: `spec_database.md`
4. Polish billing integration with invoicing system (Phase 3.2)

### 8.3 Client Portal Polish

1. **CustomerLayout** (custom HtmlTemplate — not NavigationDrawerLayoutTemplate):
   - Plain `Link` components with lambda handlers — same pattern as AdminLayout
   - Navigation items: `nav_my_dashboard`, `nav_my_bookings`, `nav_my_invoices`, `nav_my_reviews`, `nav_support` (→ `TicketSubmissionForm`), `nav_account`
   - All items always visible to authenticated Customer — no feature flag visibility within CustomerLayout
2. Customer role routes to CustomerLayout on login
3. Polish all customer-facing forms for client-ready presentation

---

## PHASE 9: PLATFORM MANAGEMENT

**Separate application — `Mybizz_management`. Do not build until Phase 10 complete and first client manually onboarded.**

Full spec: `@devref/platform_management.md` (todo #86, FROZEN until after Phase 10)

### 9.1 Client Provisioning
### 9.2 Client Monitoring
### 9.3 Update Distribution
### 9.4 Billing Automation

---

## PHASE 10: LAUNCH PREPARATION

### 10.1 Comprehensive Testing

- [ ] Authentication flows
- [ ] Bookings and services end-to-end
- [ ] Payment flows (Stripe + Paystack + PayPal)
- [ ] Brevo transactional email (booking confirmations, reminders, invoices)
- [ ] Brevo Campaigns marketing email (sequences, broadcasts)
- [ ] Vault — TOTP, email notification, encryption, Owner-only access
- [ ] Security features
- [ ] Mobile responsiveness (Chrome, Firefox, Safari)

### 10.2 Documentation

1. User documentation: getting started guide, feature guides, FAQ
2. Video tutorials: platform overview (5 min), first booking (3 min), payments setup (5 min)
3. Onboarding checklist

### 10.3 Production Launch

1. Publish `master_template` V1.0
2. Client Owners configure own API keys via Vault (Stripe, Paystack, PayPal, `brevo_smtp_key`, `brevo_api_key`)
3. Onboard first beta client
4. Set up analytics & monitoring
5. Launch marketing website
6. Activate beta pricing ($25/month for first 50 clients)
7. Begin beta client acquisition
8. Set up support channels

---

*End of file — `spec_build_plan.md`*
