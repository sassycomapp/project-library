# Mybizz — Consulting & Services — Architectural Specification
# Part A of D: Sections 1–4
Created: 2026-03-17
Updated: 2026-03-18 (navigation pattern corrected — lambda/open_form standard)

---

## Purpose of This Document

This document describes how the Mybizz Consulting & Services platform is built — the
technical decisions that govern its structure, the patterns that have been established
through actual development work, and the reasoning behind both. It is written for the
developer and the author, not for the agent.

It does not contain database schema (handled separately in spec_database.md and
spec_database_schema.md), build instructions, code examples intended for agent
consumption, or numbered task sequences. Those belong in the rules files and prompt
system. This document is the architectural record — the technical equivalent of the
conceptual design's product record.

It should be read at the start of any session involving prompt writing, rules file
maintenance, or architectural decisions.

**Timestamp standard:** All timestamps in this document and across the reference system
use the format `YYYY-MM-DD HH:MM` (UTC+2, 24-hour). Backup filenames use the compact
form `YYYYMMDD-HHMM` as a filename convention only — not a timestamp format.

**This document is in four parts:**
- Part A (this file): Sections 1–4 — Platform Model, Package Structure, Navigation Architecture, UI Standards
- Part B: Sections 5–7 — Code Standards, Secrets and Encryption Architecture, RBAC and Security Architecture
- Part C: Sections 8–10 — Integration Architecture, Domain and Provisioning Architecture, Testing Architecture
- Part D: Sections 11–13 — Performance Standards, Regulatory Compliance, Architectural Decisions Record

---

## 1. Platform Model

Mybizz is built around a single published dependency that all client instances share.
Understanding this model is the prerequisite for understanding every other architectural
decision in the platform.

### 1.1 The Three Applications

Three distinct Anvil applications make up the Mybizz platform. They are architecturally
separate and must never be conflated.

**master_template_dev** is the development workspace. All feature work happens here.
It is the single source of truth for application code. When a feature set is complete
and tested, this app is published as a new versioned release of master_template. It
lives in the Mybizz founder's Anvil account.

**master_template** is the published dependency. It is a frozen, versioned snapshot
of master_template_dev at a point in time. Client instances do not contain any
application code — they depend entirely on master_template for all functionality. When
a new version is published, clients are notified and choose when to adopt it. Updates
are pull-based: Mybizz never pushes a code change into a running client instance.

**Mybizz_management** is the platform operator's internal tooling — client
provisioning, health monitoring, billing automation, update distribution. It is a
separate Anvil application and is never part of master_template. It is not included in
any client instance. It does not get built until the master template has reached Phase 7
and the first client has been manually onboarded. Until then, provisioning is done by
hand.

### 1.2 Client Instances

Each subscriber receives their own independent Anvil application. This application —
the client instance — contains no code of its own. It depends on master_template as a
versioned library. All features, all forms, all server functions live in master_template.
The client instance contains only the client's Data Tables and their configuration.

This architecture has consequences that must be understood before writing any code or
prompt:

Data isolation is structural, not policy. Each client instance is a separate Anvil app
with a separate database. `app_tables` always resolves to the current client's own Data
Tables. There is no mechanism by which one client's data can be accessed from another
client's instance — it is architecturally impossible, not merely forbidden.

The master template is stateless. It contains zero client data. All state lives in the
client's Data Tables. The same server function, running in two different client
instances, operates against two completely separate databases. This is the foundation
of multi-tenancy in Mybizz and must never be broken by introducing state into
master_template code.

Clients never see source code. The master template is published as a compiled
dependency. Client owners cannot inspect, modify, or copy platform code.

### 1.3 The Development Workspace

All build work takes place in master_template_dev. This is connected to a GitHub
repository, which serves as the shared source of truth between Anvil.works and VS Code.
The workflow is:

Changes made in VS Code are pushed to GitHub. Anvil syncs from GitHub. Changes made in
the Anvil Designer — UI builds, component changes — are pulled from Anvil into VS Code
before any code draft prompt is run. The practical implication is that Designer work
must always precede code work for any given form, and the VS Code repository must be
current before the agent runs.

### 1.4 Deployment Pipeline

The path from development to production follows three stages:

master_template_dev is where active development and testing occur. Feature branches are
created here. When a feature set is complete and the test suite passes, the app is
published.

master_template_staging is a clone of master_template_dev used for pre-production and
user acceptance testing. It is the gate between development and publication.

master_template is the published dependency. Each publication creates a new versioned
release. Versioning follows semantic conventions: V1.0.0 for initial release, V1.1.0
for backwards-compatible feature additions, V1.0.1 for bug fixes, V2.0.0 for breaking
changes. Breaking changes require advance notice and a migration guide. Security updates
are flagged for immediate adoption.

---

## 2. Package Structure

The application code is organised into Anvil packages using a feature-based structure.
This structure reflects the live application as confirmed from the repository and must
not be reorganised without a documented decision. Packages are never renamed or merged
during active development.

### 2.1 Client Packages

Client packages live in client_code/ and contain Forms and Client Modules only. They
run in the user's browser. They have no access to Data Tables, Anvil Secrets, or the
Vault. All data access flows through server functions.

```
client_code/
  auth/           LoginForm, SignupForm, PasswordResetForm
  dashboard/      DashboardForm, MetricsPanel, ActivityFeed
  bookings/       BookingCalendarForm, BookingListForm, BookingDetailForm,
                  AvailabilitySettings
  services/       ServiceListForm, ServiceEditorForm, ServiceDetailForm
  customers/      ContactListForm, ContactDetailForm, ContactEditorForm,
                  SegmentManagerForm
  crm/            MarketingDashboardForm, EmailCampaignListForm,
                  EmailCampaignEditorForm, EmailBroadcastForm,
                  LeadCaptureEditorForm, TaskListForm, ReferralProgramForm,
                  ReviewSubmissionForm, CampaignMetricComponent,
                  ContactImportForm, PublicKnowledgeBaseForm, ReportsForm,
                  SegmentManagerForm
  blog/           BlogListForm, BlogPostForm, BlogEditorForm
  settings/       SettingsForm, VaultForm, EmailSetupForm, PaymentGatewayForm,
                  WebsiteSettingsForm, HomePageEditorForm, AboutPageEditorForm,
                  and subordinate component forms
  public_pages/   HomePage, ServicesPage, ServiceDetailPage, BookingPage,
                  BlogListPage, BlogPostPage, ContactPage, LandingPage
  layouts/        AdminLayout, CustomerLayout, BlankLayout, ErrorLayout
  shared/         MetricCard, ActivityTimeline, ConfirmationDialog,
                  navigation_helpers.py
```

**Note on the crm/ package:** The live package is named `crm/` — not `marketing/`.
It contains all CRM and marketing-related forms together. This is the authoritative
package name confirmed from the repository.

**Note on the settings/ package:** The settings/ package contains SettingsForm as the
primary navigation destination, plus VaultForm and a set of subordinate editor and
setup forms that are loaded as tabs or sub-panels within the settings area. These are
not separate navigation destinations — they are all accessed through SettingsForm.

Later-phase packages (invoices, analytics, reporting) will be added to client_code/ as
those phases are built, following the same feature-based naming convention.

The public_pages/ package contains all forms served by the Routing dependency. The
layouts/ package contains the four layout forms used throughout the application. The
shared/ package contains reusable components and helpers that are not feature-specific.

`layouts/` and `shared/` are sibling packages under `client_code/`. Layouts are not
nested inside shared/. This is a deliberate structural decision — unnecessary nesting
is avoided.

### 2.2 Server Packages

Server packages live in server_code/ and contain Server Modules only. They run on the
Anvil server. They have full access to Data Tables, Anvil Secrets (encryption_key only),
and the Vault.

```
server_code/
  server_auth/        service.py, rbac.py
  server_settings/    service.py (includes create_initial_config())
  server_dashboard/   service.py
  server_bookings/    booking_service.py, calendar_service.py,
                      availability_service.py
  server_services/    service.py
  server_customers/   contact_service.py, segment_service.py,
                      timeline_service.py
  server_crm_sync/    brevo_crm_sync.py
  server_marketing/   campaign_service.py, broadcast_service.py,
                      task_service.py, lead_capture_service.py,
                      review_service.py, referral_service.py,
                      brevo_campaigns_integration.py
  server_emails/      system_email_service.py, transactional_email_service.py,
                      email_templates.py
  server_payments/    stripe_service.py, paystack_service.py,
                      paypal_service.py, invoice_service.py
  server_blog/        service.py
  server_analytics/   reporting_service.py
  server_shared/      utilities.py, validators.py, encryption_service.py,
                      vault_service.py, config.py
```

**Note on server_emails/:** This package handles all email dispatch — both system-level
platform emails (via `system_email_service.py`) and transactional business emails
(via `transactional_email_service.py`). Email template management lives in
`email_templates.py`. This replaces the previously assumed single-file
`zoho_mail_integration.py` — the actual implementation is a three-file structure
confirmed from the repository.

The server_shared/ package is where cross-cutting concerns live. vault_service.py and
encryption_service.py are particularly significant — they are the only modules that
ever touch Anvil Secrets, and all other server modules that need client credentials
must import from vault_service rather than calling Anvil Secrets directly.

### 2.3 The Three-Tier Module Pattern

Within server packages, the standard pattern is:

Forms handle presentation only. Event handlers call methods; methods contain no logic
beyond coordination. No business logic in Forms.

Client Modules handle UI coordination, input validation, and server call orchestration.
They prepare data for server calls and interpret responses for the UI.

Server Modules handle all business rules, all persistence, all security enforcement,
and all external API calls. This is where logic lives.

Pure Logic Modules are extracted from server modules for anything that can be expressed
without Anvil imports — calculations, validation rules, decision logic. These are tested
locally with pytest. The server module is a thin wrapper around the pure logic.

This structure is not a preference. It is what makes the testing strategy work and what
makes the agent's task tractable — server functions are small, focused, and testable.

---

## 3. Navigation Architecture

One navigation system is used in the platform for authenticated areas.

### 3.1 Authenticated Areas — Custom HTML Template with Lambda Navigation

AdminLayout and CustomerLayout use a custom `HtmlTemplate` layout
(`@theme:standard-page.html`), not `NavigationDrawerLayoutTemplate`. The sidebar is
built entirely in Python via `build_navigation()`, which creates `Link` components
stored as `self.nav_*` attributes and added to `self.sidebar_panel` (a `ColumnPanel`).

Navigation is handled by attaching a click handler to each `Link` using a lambda that
captures the target form name as a string:

```python
nav_link.set_event_handler(
    'click',
    lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a),
)
```

This is the standard and permanent navigation pattern for all sidebar links in this
codebase. The string form name is resolved at click time, not at import time — forms
that do not yet exist during incremental build cause no ImportError at startup.

The `navigate_to` property on `NavigationLink` components requires an instantiated Form
object (not a string) and is only functional when used inside `NavigationDrawerLayoutTemplate`.
Neither condition applies here — this codebase uses a custom HTML template layout and
builds navigation via plain `Link` components. `navigate_to` is therefore not used.

Loop variable capture in lambdas is mandatory. Always use `fn=form_name, a=attr_name`
in the lambda signature — without explicit capture, all lambdas in a loop point to the
last value of the loop variable.

`open_form(string, param=value)` called directly — not via lambda — is the correct
pattern for parameterised navigation from content forms where a record ID must be
passed (e.g., row clicks opening a detail form).

**Sign out** is a plain `Link` component at the bottom of the sidebar in both layouts,
below the nav links and separated by a spacer. It calls `anvil.users.logout()` then
`open_form('HomePage')`. It is an action, not a navigation destination — always visible
regardless of role.

### 3.2 AdminLayout Navigation Structure

The AdminLayout uses a programmatically-built sidebar with the following fixed
navigation structure, confirmed from the live repository. All items use the `nav_`
prefix convention.

```
Dashboard                          (always visible, all roles)

Sales & Operations
  nav_bookings  — Bookings         (always visible)
  nav_services  — Services         (always visible)

Customers & Marketing
  nav_contacts   — Contacts        (always visible)
  nav_campaigns  — Campaigns       (conditional: marketing_enabled)
  nav_broadcasts — Broadcasts      (conditional: marketing_enabled)
  nav_segments   — Segments        (conditional: marketing_enabled)
  nav_tasks      — Tasks           (conditional: marketing_enabled)

Content & Website
  nav_blog   — Blog                (conditional: blog_enabled)
  nav_pages  — Pages               (always visible)

Finance & Reports
  nav_invoices  — Invoices         (always visible)
  nav_payments  — Payments         (always visible)
  nav_reports   — Reports          (always visible)
  nav_analytics — Analytics        (always visible)
  nav_time      — Time Entries     (always visible)
  nav_expenses  — Expenses         (always visible)

Settings
  nav_settings  — Settings         (Owner and Manager roles only)
  nav_vault     — Vault            (Owner role only)

[Sign out link — bottom of sidebar, all roles]
```

Time Entries and Expenses are confirmed separate navigation items under Finance &
Reports, always visible to all admin roles. Both tables (`time_entries`, `expenses`)
exist in the schema and both have dedicated navigation destinations.

Navigation item visibility is driven by feature configuration and role. The
`build_navigation()` method constructs the sidebar and applies role-based visibility —
`nav_vault` is hidden unless the current user's role is `'owner'`. Feature flag
visibility (marketing, blog) is applied by reading the config at layout load time.

### 3.3 CustomerLayout Navigation Structure

The CustomerLayout also uses a programmatically-built sidebar. Navigation items
confirmed from the live repository:

```
nav_my_dashboard  — My Dashboard   (always visible)
nav_my_bookings   — My Bookings    (always visible)
nav_my_invoices   — My Invoices    (always visible)
nav_my_reviews    — My Reviews     (always visible)
nav_support       — Support Tickets (always visible)
nav_account       — Account        (always visible)

[Sign out link — bottom of sidebar]
```

The CustomerLayout itself is only accessible to the Customer role — there is no
role-based visibility within the navigation list. All items are always visible to any
authenticated customer.

"Support Tickets" is the correct label for `nav_support` — it maps to
`TicketSubmissionForm`. This aligns with the precise naming convention used throughout
the platform.

### 3.4 Public Website — Routing Dependency

All public-facing pages use the Anvil Routing dependency (ID: `3PIDO5P3H4VPEMPL`).
Public routes are decorated with `@router.route`. This system handles shareable URLs,
browser history, and SEO-friendly page addresses for the customer-facing website.

The standard public route structure for Consulting & Services is: `/` for the home page, `/services` for
the services listing, `/services/:slug` for individual service detail, `/booking` for
the booking flow, `/blog` for the blog listing, `/blog/:slug` for individual posts, and
`/contact` for the contact page. Landing pages use `/landing/:slug`.

The Routing dependency must not be used for authenticated admin navigation. M3
NavigationLink and programmatic Link navigation must not be used for public pages. The
two systems serve different purposes and must be kept separate.

### 3.5 Startup and Authentication Routing

Anvil apps start by instantiating either a Startup Form or a Startup Module. Mybizz
uses a Startup Form — LoginForm in the auth package, as confirmed in anvil.yaml
(`startup: {module: auth.LoginForm, type: form}`). The Startup Form's `__init__` method
runs when the app loads.

The authentication and routing decision happens inside `__init__` before
`init_components()` is called. The pattern is: check whether a user is logged in; if
so, route to the appropriate form based on role and return immediately; if not, proceed
to initialise the login form. Owner, Manager, Admin, and Staff roles route to the admin
panel (DashboardForm with AdminLayout). The Customer role routes to the customer portal.
Calling `open_form()` in `__init__` must always be followed by `return` — the form
must never continue initialising if it is being replaced.

### 3.6 The M3 Sidesheet

The Sidesheet is an official M3 layout feature, available on both NavigationDrawerLayout
and NavigationRailLayout. It is an optional panel that slides in from the side of the
content area, controlled by setting `show_sidesheet = True` on the layout. The
`SidesheetContent` component is the M3 container for sidesheet content.

The Sidesheet is appropriate for secondary content or detail panels that should appear
alongside the main content without replacing it — for example, showing the detail of a
selected list item while the list remains visible. It is distinct from the navigation
drawer, which is the left-side navigation structure.

The NavigationRailLayout with its Sidesheet enabled is well-suited to step-by-step
guided workflows where content at one stage informs the next. The key pattern: pass
accumulated data via `self.item` between steps; submit to the server in a single call
at the final step; do not make server calls between steps.

---

## 4. UI Standards

### 4.1 The M3 Mandate

All UI uses Material Design 3 (M3) exclusively. The M3 theme dependency ID is
`4UK6WHQ6UX7AKELK`. No Anvil Extras components, no legacy Anvil components, no
third-party UI libraries. This is a hard constraint — mixing M3 with legacy components
or Anvil Extras produces CSS conflicts that are difficult to diagnose and expensive to
fix.

Specific Anvil Extras components are explicitly blocked: Tabs, MultiSelectDropDown,
Autocomplete, Quill, Switch, Slider, RadioGroup, CheckBoxGroup, Popover. M3
alternatives exist for all of them.

The M3 component set covers every UI requirement in the platform. When a component
appears absent, the solution is to compose from available M3 primitives — not to import
from outside the M3 system.

### 4.2 Custom Component vs Widget

When a UI element needs to be reused or encapsulates meaningful logic, it is built as
an Anvil Custom Component, not a Widget. Custom Components are Python-only, use Anvil
components internally, support data bindings, and are Designer-friendly. Widgets require
JavaScript, have no data bindings, and should be used only when a third-party JS library
is genuinely required (such as a mapping library or a rich code editor) or when DOM-level
control is necessary. The rule is: if it can be built as a Custom Component, it must be.
Widgets are the ten percent exception.

The best practice pattern is to keep the rest of the app clean by hiding a Widget behind
a Custom Component interface when a Widget is unavoidable — the Custom Component handles
layout, data, and events; the Widget handles only the specific DOM or JS requirement.

### 4.3 Component Naming

All components follow the prefix convention defined in policy_nomenclature_components.md.
The essential prefixes that apply to every form are: `col_` for ColumnPanel and
CardContentContainer, `lp_` for LinearPanel, `flow_` for FlowPanel, `btn_` for Button
and IconButton, `lbl_` for Text and Heading, `txt_` for TextBox and TextArea, `dd_` for
DropdownMenu, `cb_` for Checkbox, `rb_` for RadioButton, `dp_` for DatePicker, `fu_`
for FileLoader, `dg_` for DataGrid, `rp_` for RepeatingPanel, and `nav_` for
NavigationLink. Additional good-to-have prefixes apply in complex forms with fifteen
or more components.

### 4.4 Designer-Only Properties

Two categories of properties cannot be set in Python code and must be set in the Anvil
Designer:

The `type='password'` property on TextBox components must be set in the Designer
Properties Panel. Setting it in code is silently ignored. Every password input in every
auth form requires this Designer action.

The Write Back toggle (W) on data-bound input components must be enabled in the Designer
Data Bindings panel. This cannot be set in code. Write back is required for the
`self.item` pattern to work correctly — without it, component changes are not reflected
back to `self.item` on focus loss.

These are known Designer gotchas discovered during actual development. Any prompt that
covers authentication forms or editor forms must include explicit notes about these
requirements.

### 4.5 LinearPanel Orientation

LinearPanel orientation must be set in code, not in the Designer. This is the inverse
of the above — it cannot be set via Designer properties. When setting LinearPanel
orientation in code, a comment must be added explaining why it is set in code rather
than in the Designer. This is an established project convention.

### 4.6 Form Types and Layout Patterns

Four standard form types each have an established component structure:

List forms (ContactListForm, BookingListForm, etc.) are rendered inside AdminLayout
(the custom HtmlTemplate layout). The form content uses a Heading with headline-large
for the page title, a horizontal LinearPanel header with search TextBox and filter
DropdownMenu, a filled Button for the primary "New" action, and a DataGrid for the
list body with IconButton row actions.

Editor forms (ContactEditorForm, ServiceEditorForm, etc.) use Card (outlined) as the
form container, Heading (headline-small) for section headers, outlined TextBox and
TextArea for inputs, outlined DropdownMenu and DatePicker for selections, and a
LinearPanel action row with a filled Save Button and an outlined Cancel Button.

Dashboard forms are rendered inside AdminLayout. The form content uses Heading
(headline-large) for the page title, a FlowPanel for the metrics row holding elevated
Cards, Plot components for charts, and DataGrid for summary tables.

Authentication forms use a Custom Form with no layout wrapper, an outlined Card as the
centred form container, outlined TextBox components for email and password (password
type set in Designer), a filled Button for submit, and Link components for forgot
password, back to sign-in, terms, and privacy policy navigation.

### 4.7 Data Binding — the self.item Pattern

All editor forms use Anvil's data binding system with `self.item` as the data container.
This is the authoritative pattern — spec_ui_standards.md derives its detail from this
document and from Anvil's own documentation.

`self.item` must be set before `self.init_components()` is called. Data bindings are
configured in the Designer: each input component's relevant property (text, checked,
selected_value, date) is bound to a field in `self.item`, and Write Back is enabled via
the W toggle in the Designer Data Bindings panel. With Write Back enabled, the component
automatically updates `self.item` when focus is lost or Enter is pressed — no change
event handlers are needed.

When `self.item` is reassigned entirely (e.g. after a server call returns updated data),
data bindings refresh automatically. When fields of `self.item` are modified in place,
`refresh_data_bindings()` must be called manually.

The practical consequence: an editor form with correctly configured bindings needs one
event handler — the save handler. All intermediate component-to-model updates are
handled automatically by Write Back.

### 4.8 Colour and Typography

All colours use the `theme:` prefix. Hardcoded hex or RGB values are never used
anywhere in the codebase. Typography uses Text and Heading components with M3 style
and scale properties — the legacy Label component is not used in M3 apps.

Button hierarchy follows the M3 pattern: one filled button per screen for the primary
action, outlined buttons for secondary actions, text buttons for tertiary actions.

All form input components use `role='outlined'`. Validation failure state uses
`role='outlined-error'` with the error message written to the placeholder. The field
is restored to `role='outlined'` on valid input.

---

*End of Part A — continues in cs-architectural-specification-B.md*
