# Mybizz — Consulting & Services — Development Policy
Created: 2026-03-16
Updated: 2026-03-16

---

## Purpose of This Document

This document defines the governing standards and decisions that apply to all
development work on the Mybizz Consulting & Services platform. It is written for the
developer and the author — not for the agent. It describes what standards must be met,
why they exist, and where the detailed rules live.

It does not reproduce the rules files. Where a rule is fully specified in a rules file,
this document names the rule, states its purpose, and points to the authority. The rules
files are the implementation reference; this document is the policy record.

---

## 1. The Anvil-First Mandate

Mybizz is an Anvil application. Every technical decision defaults to the Anvil way of
doing things. Where Anvil provides a facility — authentication, data persistence,
background tasks, email, secrets — that facility is used. Custom alternatives are not
introduced unless Anvil's facility is genuinely inadequate for the specific need.

This is not a preference. It is the governing constraint of the entire build. Anvil
manages hosting, scaling, HTTPS, backups, and the client-server execution model.
Working with Anvil's model keeps the codebase lean and maintainable. Working against it
creates friction that compounds over time.

The approved exception to this mandate is The Vault. Client API keys cannot go in Anvil
Secrets because doing so would require giving clients IDE access to the application,
which would expose the entire codebase. The Vault is an application-level encrypted
secrets store that provides the same security guarantees without that exposure. This
exception is documented in `spec_vault.md §0` and must not be extended further without
a documented decision.

### Before implementing any feature, check in this order:

1. Anvil's built-in components and services
2. Anvil documentation for native solutions
3. Anvil's example apps for established patterns
4. Anvil community forum for community approaches
5. Only then consider a custom implementation — and document the justification

**Resources to check first:**
- Anvil Documentation: https://anvil.works/docs
- M3 Standard: https://anvil.works/docs/ui/app-themes/material-3
- Anvil API Reference: https://anvil.works/docs/api
- HTTP APIs: https://anvil.works/docs/http-apis
- Example Apps: https://anvil.works/learn/tutorials
- Community Forum: https://anvil.works/forum
- Local Anvil Codes of Practice: `C:\_Data\MyBizz\mybizz-core\theme\assets\dev-docs\Anvil_Methods`

**Authority:** `policy_development.md §1`

---

## 2. The UI Standard — Material Design 3

All user interface work uses Material Design 3 (M3) exclusively. No Anvil Extras
components, no legacy Anvil components, no third-party UI libraries. The M3 theme
dependency (`4UK6WHQ6UX7AKELK`) is the only UI framework in use.

This is a hard constraint. Mixing M3 with legacy components or Anvil Extras produces CSS
conflicts that are difficult to diagnose and expensive to fix. The constraint is
maintained absolutely.

The M3 component set covers every UI requirement in the platform. If a component appears
absent, the solution is to compose from available M3 primitives — not to import
something from outside the M3 system.

Specific components from Anvil Extras are explicitly blocked: Tabs, MultiSelectDropDown,
Autocomplete, Quill, Switch, Slider, RadioGroup, CheckBoxGroup, Popover. M3 alternatives
exist for all of them.

**Typography, colour, button hierarchy, and input standards** are all defined and
non-negotiable. Colour always uses the `theme:` prefix — never hardcoded hex or RGB
values. Typography roles map to M3 role names. Inputs are always `outlined` style.
Validation failure state uses `outlined-error` with the error in the placeholder.

**Authority:** `policy_development.md §2`, `ref_anvil_components.md`,
`spec_ui_standards.md`, `policy_nomenclature_components.md`

---

## 3. Navigation

One navigation system is used in the platform for all authenticated areas.

**Custom HtmlTemplate layouts with plain Link components** handle all authenticated
area navigation — the admin panel and the customer portal. Navigation items are built
programmatically using Link components. Click handlers use lambda expressions with
mandatory loop variable capture:

```python
lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a)
```

Navigation is driven by `open_form(string)` called from within `_nav_click`. This is
the permanent standard. `NavigationDrawerLayoutTemplate`, `NavigationLink`, and
`navigate_to` are not used in this project.

**The Routing dependency** (`3PIDO5P3H4VPEMPL`) handles all public website pages.
Public routes are decorated with `@router.route`. This system provides shareable URLs
and browser history for the public-facing website.

The AdminLayout navigation structure is fixed: Dashboard, Sales & Operations
(Bookings, Services), Customers & Marketing (Contacts, Campaigns, Broadcasts,
Segments, Tasks), Content & Website (Blog, Pages, Media), Finance & Reports (Invoices,
Payments, Reports, Analytics), Settings. Navigation item visibility is feature-driven —
items are shown or hidden based on the client's feature configuration, not hardcoded.

Role-based visibility applies to the Vault item (Owner only) and the Settings group
(Owner and Manager only). All role enforcement is server-side — navigation visibility
is a UX convenience only.

**Authority:** `spec_ui_standards.md §1`, `ref_anvil_navigation.md`,
`policy_development.md §2`

---

## 4. Code Quality Standards

These standards apply to every file produced in this project, without exception.

### Server Functions

Every server function returns the response envelope:
`{'success': True, 'data': x}` or `{'success': False, 'error': str(e)}`

No server function returns a bare value, raises an exception to the client, or returns
None. The envelope is the contract between server and client code throughout the entire
platform.

Every server function has a docstring with Args, Returns, and Raises sections
completed. None is an acceptable value for Raises — omission is not. Type hints are
required on all public functions.

Logging uses `logging.getLogger(__name__)` at the top of every server module. `print()`
is forbidden in server code. The five log levels (DEBUG, INFO, WARNING, ERROR,
CRITICAL) are used appropriately. Full tracebacks are captured with `exc_info=True` on
ERROR and CRITICAL entries.

Exception handling uses named exceptions only — `except:` and `except Exception:` as
catch-all handlers are not used unless they follow specific named handlers. The ordering
rule is: specific exceptions first, general exceptions last. `AssertionError` must
always be re-raised before any broader handler — it must never be swallowed.

Authentication is checked at the entry of every server callable. `instance_id` is
always set server-side from `anvil.users.get_user()` — it is never accepted as a
parameter from client code.

### Server State

Global variables must never be used in server modules for state that varies per user or
per request. Global state persists across requests and across users — it is a shared
mutation bug waiting to happen. Any state that is per-user or per-request must be held
in the database, in `anvil.server.session`, or returned to the client. If state is
computed per call and returned immediately, no storage is needed at all. This is not a
style preference — it is a correctness requirement.

### Client Forms

Event handlers contain zero logic. A click handler calls a method; the method contains
the logic. This is an absolute rule — not a preference.

`open_form()` in `__init__` is always followed by `return`. Data Tables are never
accessed from client code. Every `anvil.server.call()` in client code is wrapped in
`try/except` for both `TimeoutError` and `AnvilWrappedError`.

`self.item` is set before `self.init_components()` is called. Write-back is enabled
on all input components that bind to `self.item`. Call `refresh_data_bindings()` when
modifying `self.item` in place. Do not call it after reassigning `self.item =` — that
triggers a refresh automatically.

### Form File Structure

Forms are folders. Code lives in `FormName/__init__.py` — never in `FormName.py`.
`form_template.yaml` is the Designer file and is never modified programmatically.

**Authority:** `policy_development.md §3`, `ref_anvil_coding.md`,
`ref_anvil_coding_patterns.md`

---

## 5. Error Handling

The standard error handling pattern applies to every server function:

```
try:
    validate inputs first — return early on invalid input
    do the work
    return success envelope
except AssertionError:
    raise  # never swallow
except SpecificExpectedException as e:
    log at WARNING level
    return failure envelope with generic user-facing message
except Exception as e:
    log at ERROR level with exc_info=True
    return failure envelope with generic message
```

Named exception handlers return generic user-facing messages — never `str(exc)`.
The full exception detail is in the log, not in the response returned to the client.

**Authority:** `policy_development.md §4`, `ref_anvil_coding.md §4`

---

## 6. Naming Conventions

All naming follows the documented conventions without deviation.

**Terminology:** Mybizz subscriber = Client. Client's end user = Customer.
Public website visitor = Visitor. This distinction applies throughout all code,
comments, UI labels, and documentation.

**Forms:** `{Entity}{Type}Form` — ListForm for data listings, EditorForm for create
and edit, ViewerForm for read-only detail, DashboardForm for metrics.

**Files and folders:** Folders in PascalCase. Files in lowercase_with_underscores.
Server modules in snake_case. Database tables in lowercase_snake with no prefix.

**Component prefixes** follow the mandatory and good-to-have prefix system. Essential
prefixes (`btn_`, `txt_`, `lbl_`, `col_`, `lp_`, `dd_`, `cb_`, `rb_`, `dp_`, `fu_`,
`dg_`, `rp_`, `nav_`) apply to all forms. Good-to-have prefixes apply in complex forms
with 15 or more components.

**Database columns:** `instance_id`, `created_at`, and `updated_at` are mandatory on
every table. Status values use Title Case. Transaction type values are `appointment`
and `consulting`.

**Authority:** `policy_nomenclature.md`, `policy_nomenclature_components.md`

---

## 7. Package Structure

The package structure is fixed and must not be reorganised without a documented
decision:

```
client_code/
  auth/          layouts/       dashboard/     settings/
  bookings/      services/      customers/     marketing/
  blog/          public_pages/  shared/

server_code/
  server_auth/       server_settings/   server_dashboard/
  server_bookings/   server_services/   server_customers/
  server_marketing/  server_payments/   server_blog/
  server_shared/     server_analytics/
```

New packages may be added as new feature phases are built, following the established
naming pattern. Packages are never renamed or merged during active development.

**Authority:** `policy_development.md §6`

---

## 8. Performance Standards

List queries are always paginated. The default page size is 50 rows. Unbounded search
results are never returned to the client. Sorting is always done server-side using
`tables.order_by()` — never client-side.

Any operation expected to take more than three seconds must run as a background task
using `@anvil.server.background_task`. This applies to Brevo campaign processing,
nightly analytics jobs, and any bulk data operations.

**Authority:** `policy_development.md §5`

---

## 9. Security Standards

Security is enforced from Stage 1.2 onward. It is not a phase to be added later. Every
feature is built secure from the first draft.

### RBAC

Every server function that operates on application data has an RBAC decorator applied.
The five roles — Owner, Manager, Admin, Staff, Customer — are the complete role set.
No new roles are introduced without a documented architectural decision. Role
enforcement is server-side; client-side navigation visibility is a UX convenience only
and does not constitute access control.

### Data Access

All Data Tables have "No access" permission for client code. All data access is
through server functions. Direct client access bypasses `instance_id` filtering,
authentication checks, and input validation.

### Secrets

Two levels of secrets storage are used, and they must never be confused:

**Anvil Secrets** holds one item only: `encryption_key`. This is set by the platform
operator at provisioning and never changed. It is used exclusively inside
`vault_service.py` to protect Vault contents. Nothing else goes in Anvil Secrets.

**The Vault** holds all client credentials: payment gateway keys, email credentials,
CRM tokens, and any other secret the client owner needs to manage. Credentials are
retrieved at runtime via `get_vault_secret(name)`. They are never stored in plain text,
never returned to client code, and never logged.

### Encryption

Sensitive fields use Fernet symmetric encryption via `encryption_service.py`. The
`encryption_key` is retrieved from Anvil Secrets at runtime. Plaintext never persists
in the database. Secret config getter functions (`get_payment_config()`,
`get_email_config()`) return `'***'` for any secret field — they never return the
actual value to client code.

### Authentication Security

Password requirements: minimum 8 characters, at least one uppercase, one lowercase,
one number. Rate limiting applies to all unauthenticated requests (10 per minute per
IP). Login lockout applies after repeated failures. Session inactivity timeout is 30
minutes.

The Vault requires TOTP step-up authentication on every open with no grace period.
An email notification is sent to the Owner on every Vault access. This fires
regardless of whether the Owner is already logged in.

### Input Validation and Injection Protection

All user-supplied inputs are validated at server function entry. Anvil Data Tables use
parameterised queries — SQL injection is not possible through the Data Tables API. All
HTML inputs are sanitised before storage. File paths are validated to reject traversal
patterns.

### Audit Logging

All significant actions are logged to the audit log with actor, timestamp, and
description: authentication events, data modifications, payment events, permission
changes, and all Vault access. The audit log is Owner and Manager visible only.
Retention period is two years.

**Authority:** `policy_security.md`, `policy_security_compliance.md`, `spec_vault.md`

---

## 10. Regulatory Compliance

The platform operates under three regulatory frameworks. Compliance is not deferred to
a post-launch cleanup — it is built in.

**POPIA (South Africa)** is mandatory. Mybizz is based in South Africa and processes
South African personal information. Registration with the South African Information
Regulator as a Responsible Party is required after launch. Data subject rights (access,
correction, deletion, objection) must be implemented. The penalties for non-compliance
are severe.

**GDPR (European Union)** applies if the platform serves EU customers or processes EU
residents' data. The data subject rights implementation (export and anonymisation
functions) satisfies both GDPR and POPIA requirements.

**PCI DSS** applies to all payment processing. Mybizz stores only payment tokens —
never raw card numbers. Stripe and Paystack are both Level 1 PCI-compliant providers.
The annual Self-Assessment Questionnaire (SAQ A) must be completed.

Required legal documents before go-live: Privacy Policy, Terms of Service, Cookie
Policy. These must be accurate, complete, and reflect the actual data processing
practices of the platform.

**Authority:** `policy_security_compliance.md`

---

## 11. Version Control and Backup

Commit format: `[TYPE] Brief description` where TYPE is one of FEATURE, FIX, REFACTOR,
SECURITY.

Branching strategy:
- `master` — production-ready code
- `dev` — development integration
- `feature/feature-name` — new features
- `fix/bug-description` — bug fixes

Backup protocol: back up before integration tests (safety checkpoint), back up after
tests pass (known good state). Never back up a red or failing state. Backup naming:
`mybizz-core-YYYYMMDD-HHMM-(description)`.

**Authority:** `policy_development.md §8`

---

## 12. Development Tooling

The development environment is VS Code with Continue.dev as the agent. The Anvil app
is connected to GitHub as the shared source of truth. Changes made in VS Code are
pushed to GitHub; Anvil syncs from GitHub. Changes made in the Anvil Designer are
pulled into VS Code before any code draft prompt is run.

The AI model roles are fixed:

| Role | Model |
|---|---|
| All tasks (UI Scope, UI Design, Code Draft, Code Polish, Testing, Checks, Chat) | claude-sonnet-4.6 |
| Tab completion | codestral-2508 |
| Embeddings | text-embedding-3-small |

All substantive work — Tasks 1 through 7 — runs on claude-sonnet-4.6 via OpenRouter.
codestral-2508 handles tab completion only and fires constantly; it must not be used
for any task that requires reasoning or code generation.

**Authority:** `policy_development.md §7`

---

## 13. Enforcement

Policy violations are classified by severity and acted on accordingly:

| Level | Definition | Response |
|---|---|---|
| Critical | Security issue or data loss risk | Immediate fix — do not proceed |
| High | Policy violation | Fix before moving to next task |
| Medium | Best practice deviation | Document and schedule |
| Low | Style or formatting | Fix when convenient |

Security issues are always Critical. RBAC violations, secret handling errors, and
any code that returns sensitive data to the client are treated as Critical regardless
of other context.

**Authority:** `policy_development.md §9`

*End of file — cs-dev-policy.md*
