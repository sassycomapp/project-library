# Mybizz — Consulting & Services — Architectural Specification
# Part D of D: Sections 11–13
Created: 2026-03-17
Updated: 2026-03-18 (navigation ADR corrected — lambda/open_form standard)

---

# Part D concludes the architectural specification.
# Sections 1–4 are in Part A.
# Sections 5–7 are in Part B.
# Sections 8–10 are in Part C.

---

## 11. Performance Standards

List queries are always paginated. The default page size is fifty rows. Unbounded search
results are never returned to the client. Sorting is always done server-side using
`tables.order_by()` — never client-side.

Server calls are batched where possible. Multiple `anvil.server.call()` invocations in
a loop are a performance anti-pattern. Batch calls that require N operations should be
a single call passing a list.

Operations expected to exceed 22 seconds must use background tasks (75% of Anvil's
30-second hard server timeout). This includes email campaign processing, nightly
analytics jobs, bulk data operations, and report generation.

The platform ceiling for V1.x is one hundred client instances. Each client is a
separate Anvil account with no shared resources. Scaling is linear and provisioning is
manual — approximately two hours per client. Per-client capacity is up to ten thousand
contacts, up to one hundred active campaigns, and unlimited bookings and services within
Anvil storage limits.

Database indexes must be maintained on high-query tables. Critical composite indexes:
contacts on instance_id plus email, contact_events on contact_id plus event_date,
bookings on instance_id plus start_datetime, rate_limits on identifier, vault on name.

---

## 12. Regulatory Compliance

### 12.1 POPIA — Mandatory

Mybizz is based in South Africa and processes South African personal information. POPIA
compliance is mandatory. Registration with the South African Information Regulator as
a Responsible Party is required after launch. This is a legal obligation with severe
penalties — up to R10 million or ten years imprisonment.

Data subject rights under POPIA — access, correction, deletion, objection — must be
implemented. The data export (`export_my_data`) and anonymisation (`delete_my_account`)
functions satisfy both POPIA and GDPR requirements.

### 12.2 GDPR — Applicable if Serving EU Users

GDPR applies if the platform serves EU customers or processes EU residents' data. The
seven core principles — lawfulness and transparency, purpose limitation, data
minimisation, accuracy, storage limitation, integrity and confidentiality,
accountability — govern all personal data processing.

Consent must be explicit opt-in. Unsubscribe links are required in all marketing emails.
Cookie consent banners are required on all public pages.

### 12.3 PCI DSS

Mybizz stores only payment tokens — never raw card numbers. Stripe and Paystack are
both Level 1 PCI-compliant providers. By storing only tokens and never handling raw card
data, Mybizz falls into the lowest PCI DSS scope category (SAQ A). The annual
Self-Assessment Questionnaire SAQ A must be completed. HTTPS is enforced automatically
by the Anvil platform.

### 12.4 Data Retention

Contacts are retained indefinitely unless the data subject requests deletion.
Transactions and invoices are retained for seven years for tax compliance. Audit logs
are retained for two years. Email logs are retained for ninety days. Completed tasks
are auto-deleted after ninety days.

### 12.5 Legal Documents Required Before Launch

A Privacy Policy, Terms of Service, and Cookie Policy must be accurate, complete, and
published before go-live. These are not templates to be filed — they must accurately
describe the actual data processing practices of the platform.

---

## 13. Architectural Decisions Record

This section records decisions made during actual development that are not obvious from
the above and that a future session would benefit from knowing.

### The instance_id Absence Problem

Not all tables have an `instance_id` column. `invoice`, `bookings`, and `time_entries`
use `customer_id` or `staff_id` instead. This is a known architectural reality. Server
functions that query these tables must not assume `instance_id` exists. Assuming it
exists will produce silent zero results — the query will return nothing without raising
an error, because `instance_id` simply doesn't match anything. This is a known issue
in `server_dashboard/service.py` and is deferred to the relevant phase when those
features are fully implemented.

### Single-Row Config Tables

`business_profile`, `email_config`, `payment_config`, and `theme_config` are
single-row tables. They will always have zero or one row, never more. The correct read
pattern checks for the row's existence explicitly and handles the zero-row case. Using
`.get()` on these tables is safe and idiomatic.

### Settings Tab Navigation Pattern

The SettingsForm uses a pure client-side visibility toggle pattern. Four ColumnPanels,
one visible at a time. The active tab button has filled appearance; inactive buttons
have outlined appearance. No server calls occur on tab switching. This is intentional —
fast, simple, appropriate for a settings interface where all content is local.

### The Navigation Pattern — Lambda with open_form(string)

AdminLayout and CustomerLayout use a custom `HtmlTemplate` layout
(`@theme:standard-page.html`), not `NavigationDrawerLayoutTemplate`. Navigation links
are plain `Link` components created programmatically in `build_navigation()`, stored as
`self.nav_*` attributes, and added to `self.sidebar_panel`.

Each link's click handler is set via lambda, capturing the target form name as a string:

```python
nav_link.set_event_handler(
    'click',
    lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a),
)
```

This is the permanent navigation standard. The string resolves at click time — no
ImportError risk from unbuilt forms. Loop variable capture (`fn=form_name`) is
mandatory in every lambda to prevent all handlers resolving to the last loop value.

`navigate_to` is not used. It requires an instantiated Form object and only functions
inside `NavigationDrawerLayoutTemplate` — neither condition applies here.

`open_form(string, param=value)` called directly is the correct pattern for
parameterised navigation from content forms (row clicks, detail forms with IDs).

### Sign Out Placement

Sign out is implemented as a Link component at the bottom of the sidebar in both
AdminLayout and CustomerLayout — below the navigation items and separated by a spacer.
It calls `anvil.users.logout()` then `open_form('HomePage')`. It is not a navigation
item in the nav list. It is always visible regardless of role. This placement makes sign
out consistently accessible on every screen without consuming a navigation slot.

### SettingsForm Code Structure Convention

The SettingsForm uses a specific code structure that should be followed in similarly
complex forms: module-level constants (`_TABS`, `_GATEWAY_PANELS`, `_PLACEHOLDERS`)
keep dispatch methods clean and free of hardcoded strings. Tab activation and panel
display use dict iteration rather than if/elif chains. All event handlers are one-liner
delegates — zero logic in handlers. The `__init__` order is: `require_admin()`, then
`init_components()`, then code-only properties (such as LinearPanel orientation), then
`set_active_link()`, then label text, then dropdown items, then `_activate_tab()`, then
data load calls.

### Client Timezone Architecture Decision

Each client instance configures its own timezone at onboarding, stored as an IANA
timezone string in the `business_profile` table (`timezone` field). All datetimes are
stored in the database as UTC. Conversion to the client's local timezone occurs at
display time in server functions that return datetime data for UI presentation. Client
code never handles timezone conversion. Background tasks that schedule based on time
(lifecycle updates, campaign processing, task generation) read the client's configured
timezone and use it to determine when to execute in the client's local time, but store
all datetime records in UTC. The Mybizz platform itself (development, devlog, reference
system) uses UTC+2 (Africa/Johannesburg) as its operational timezone — this is the
developer's timezone and applies to build artefacts only, not to client data handling.

The `timezone` field is not yet present in the `business_profile` schema in anvil.yaml.
A todo item has been raised to add this field and update `create_initial_config()`.

### The crm/ Client Package

The CRM and marketing forms live in `client_code/crm/` — not `marketing/`. This is the
live package name confirmed from the repository. The package name reflects the
integrated nature of CRM and marketing in the C&S vertical. Any future documentation
or prompt that references a `marketing/` client package is using a stale name and
should be corrected to `crm/`.

### The settings/ Package Scope

The settings/ client package contains SettingsForm as the primary navigation
destination plus a set of subordinate editor and setup forms (EmailSetupForm,
PaymentGatewayForm, WebsiteSettingsForm, HomePageEditorForm, AboutPageEditorForm, and
others). These subordinate forms are loaded as tabs or sub-panels within the settings
area — they are not separate navigation destinations. VaultForm is also in this package
and is accessible only to the Owner role.

### Lead Capture: Simultaneous leads + contacts Creation

When a visitor submits a landing page lead capture form, captured leads create records
in both `leads` and `contacts` simultaneously at capture time. The server function
creates both rows in a single operation and sets `leads.converted_to_contact_id` to
link them immediately. The contact is enrolled in the welcome sequence without any
manual conversion step. This is the industry-standard model used by HubSpot, ActiveCampaign,
and similar platforms. It ensures CRM machinery (activity timeline, campaigns, lifecycle
tracking) works from day one.

- `leads` row = the capture event record
- `contacts` row = the person record, created immediately
- `leads.converted_to_contact_id` is set immediately on lead creation and is never null
  for a successfully captured lead

`lead_captures` is the configuration table defining form fields and welcome sequence.
`leads` is the output table of captured submissions. The relationship is: a `lead_captures`
row defines what form fields to show and where to send captured leads; a `leads` row
is a single captured submission that creates a `contacts` record simultaneously.

### Three Tables with Empty Columns — Proposed Definitions (Pending David Confirmation)

The following tables exist in `anvil.yaml` but have no columns defined. The proposed
columns below are based on the flow descriptions in `platform_features.md` and the
existing `lead_captures` table structure. David must confirm these columns before they
are added to `anvil.yaml` or to `spec_database_schema.md`.

**`contact_submissions`** — records enquiries submitted via the public Contact form:
- `submission_id` (string) — unique ID
- `instance_id` (link → users) — client instance
- `name` (string)
- `email` (string)
- `phone` (string)
- `message` (string)
- `submitted_at` (datetime) — stored as UTC
- `status` (string — new / read / replied)
- `auto_reply_sent` (bool)

**`landing_pages`** — holds landing page configurations for the landing page builder:
- `page_id` (string) — unique ID
- `instance_id` (link → users) — client instance
- `title` (string)
- `slug` (string) — URL slug, auto-generated, unique per instance
- `template_type` (string)
- `config` (simpleObject) — template-specific configuration
- `status` (string — draft / published)
- `published_at` (datetime) — stored as UTC
- `views_count` (number)
- `conversions_count` (number)
- `created_at` (datetime) — stored as UTC
- `updated_at` (datetime) — stored as UTC

**`leads`** — captures leads submitted via landing page forms:
- `lead_id` (string) — unique ID
- `instance_id` (link → users) — client instance
- `email` (string)
- `first_name` (string — optional)
- `last_name` (string — optional)
- `source` (string) — origin of the lead
- `landing_page_id` (link → landing_pages)
- `capture_id` (link → lead_captures — optional)
- `status` (string — new / contacted / converted)
- `captured_at` (datetime) — stored as UTC
- `converted_to_contact_id` (link → contacts — set immediately on creation)

---

*End of file — cs-architectural-specification-D.md*
*This is the final part of the architectural specification.*
*Part A: Sections 1–4 | Part B: Sections 5–7 | Part C: Sections 8–10 | Part D: Sections 11–13*
