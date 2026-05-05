# Mybizz CS — Development Policy

**Authority:** Mandatory — all development work must conform to this policy

---

## 1. The Anvil-First Mandate

Mybizz is an Anvil application. Every technical decision defaults to the Anvil way. Where Anvil provides a facility — authentication, data persistence, background tasks, email, secrets — that facility is used. Custom alternatives are not introduced unless Anvil's facility is genuinely inadequate.

**Before implementing any feature, check in this order:**
1. Anvil's built-in components and services
2. Anvil documentation for native solutions
3. Anvil's example apps for established patterns
4. Anvil community forum for community approaches
5. Only then consider a custom implementation — and document the justification

The approved exception is The Vault. Client API keys cannot go in Anvil Secrets because doing so would require giving clients IDE access. The Vault is an application-level encrypted secrets store.

---

## 2. The UI Standard — Material Design 3

All user interface work uses Material Design 3 exclusively. The M3 theme dependency (`4UK6WHQ6UX7AKELK`) is the only UI framework. Mixing M3 with legacy components or Anvil Extras produces CSS conflicts.

Specific Anvil Extras components are explicitly blocked: Tabs, MultiSelectDropDown, Autocomplete, Quill, Switch, Slider, RadioGroup, CheckBoxGroup, Popover.

Colour always uses the `theme:` prefix — never hardcoded hex or RGB values. Typography uses M3 role names. Inputs are always `outlined` style.

**See:** `ui-standards.md`

---

## 3. Navigation

Authenticated areas use custom HtmlTemplate layouts with plain Link components and lambda click handlers with mandatory loop variable capture:

```python
lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a)
```

Navigation is driven by `open_form(string)`. `NavigationDrawerLayoutTemplate`, `NavigationLink`, and `navigate_to` are not used.

Public website pages use the Routing dependency (`3PIDO5P3H4VPEMPL`) with `@router.route`.

**See:** ADR-002 (Navigation Standard)

---

## 4. Code Quality Standards

### Server Functions

Every server function callable from client code returns the response envelope:
`{'success': True, 'data': x}` or `{'success': False, 'error': str(e)}`

No server function returns a bare value, raises an exception to the client, or returns None.

Every server function has a docstring with Args, Returns, and Raises sections completed. Type hints are required on all public functions.

Logging uses `logging.getLogger(__name__)` at the top of every server module. `print()` is forbidden in server code.

Exception handling: specific exceptions first, general exceptions last. `AssertionError` must always be re-raised before any broader handler — it must never be swallowed.

Authentication is checked at the entry of every server callable. `instance_id` is always set server-side from `anvil.users.get_user()` — never accepted from client code.

### Server State

Global variables must never be used in server modules for state that varies per user or per request. Any state that is per-user or per-request must be held in the database, in `anvil.server.session`, or returned to the client.

### Client Forms

Event handlers contain zero logic. A click handler calls a method; the method contains the logic. This is an absolute rule.

`open_form()` in `__init__` is always followed by `return`. Data Tables are never accessed from client code. Every `anvil.server.call()` in client code is wrapped in `try/except` for both `TimeoutError` and `AnvilWrappedError`.

`self.item` is set before `self.init_components()` is called. Write-back is enabled on all input components that bind to `self.item`.

### Form File Structure

Forms are folders. Code lives in `FormName/__init__.py` — never in `FormName.py`. `form_template.yaml` is the Designer file and is never modified programmatically.

---

## 5. Error Handling

```python
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

Named exception handlers return generic user-facing messages — never `str(exc)`. The full exception detail is in the log, not in the response.

---

## 6. Naming Conventions

**Terminology:** Mybizz subscriber = Client. Client's end user = Customer. Public website visitor = Visitor.

**Forms:** `{Entity}{Type}Form` — ListForm, EditorForm, ViewerForm, DashboardForm.

**Files and folders:** Folders in PascalCase. Files in lowercase_with_underscores. Server modules in snake_case. Database tables in lowercase_snake with no prefix.

**Database columns:** `instance_id`, `created_at`, and `updated_at` are mandatory on every table. Status values use Title Case.

**See:** `nomenclature.md`

---

## 7. Package Structure

```
client_code/
  auth/          layouts/       dashboard/     settings/
  bookings/      services/      customers/     crm/
  blog/          public_pages/  shared/

server_code/
  server_auth/       server_settings/   server_dashboard/
  server_bookings/   server_services/   server_customers/
  server_marketing/  server_payments/   server_blog/
  server_shared/     server_analytics/  server_emails/
```

New packages follow the established naming pattern. Packages are never renamed or merged during active development.

---

## 8. Performance Standards

List queries are always paginated. Default page size is 50 rows. Unbounded search results are never returned. Sorting is always done server-side using `tables.order_by()`.

Any operation expected to take more than 22 seconds (75% of Anvil's 30-second timeout) must run as a background task using `@anvil.server.background_task`. Background tasks have no timeout limit.

---

## 9. Security Standards

### RBAC

Every server function operating on application data has an RBAC decorator. Five roles: Owner, Manager, Admin, Staff, Customer. Role enforcement is server-side; client-side navigation visibility is a UX convenience only.

### Data Access

All Data Tables have "No access" permission for client code. All data access is through server functions.

### Secrets

Two levels of secrets storage:

**Anvil Secrets** holds one item only: `encryption_key`. Set by the platform operator at provisioning. Used exclusively inside `vault_service.py`.

**The Vault** holds all client credentials: payment gateway keys, email credentials, CRM tokens. Retrieved at runtime via `get_vault_secret(name)`. Never stored in plain text, never returned to client code, never logged.

### Encryption

Sensitive fields use Fernet symmetric encryption via `encryption_service.py`. The `encryption_key` is retrieved from Anvil Secrets at runtime. Plaintext never persists in the database.

### Authentication Security

Password requirements: minimum 8 characters, at least one uppercase, one lowercase, one number. Rate limiting: 10 per minute per IP (unauthenticated), 100 per minute per user (authenticated). Session inactivity timeout: 30 minutes.

The Vault requires TOTP step-up authentication on every open with no grace period. An email notification is sent to the Owner on every Vault access.

### Input Validation

All user-supplied inputs are validated at server function entry. Anvil Data Tables use parameterised queries. All HTML inputs are sanitised before storage. File paths are validated to reject traversal patterns.

### Audit Logging

All significant actions are logged to the audit log with actor, timestamp, and description: authentication events, data modifications, payment events, permission changes, and all Vault access. Retention period: two years.

---

## 10. Regulatory Compliance

**POPIA (South Africa)** is mandatory. Registration with the South African Information Regulator as a Responsible Party is required after launch.

**GDPR (European Union)** applies if the platform serves EU customers. Data subject rights implementation (export and anonymisation functions) satisfies both GDPR and POPIA.

**PCI DSS** applies to all payment processing. Mybizz stores only payment tokens — never raw card numbers. Stripe and Paystack are both Level 1 PCI-compliant. Annual Self-Assessment Questionnaire (SAQ A) must be completed.

Required legal documents before go-live: Privacy Policy, Terms of Service, Cookie Policy.

---

## 11. Version Control and Backup

Commit format: `[TYPE] Brief description` where TYPE is one of FEATURE, FIX, REFACTOR, SECURITY.

Branching strategy: `master` (production), `dev` (development integration), `feature/feature-name`, `fix/bug-description`.

Backup protocol: back up before integration tests (safety checkpoint), back up after tests pass (known good state). Never back up a red or failing state.

---

## 12. Development Tooling

Development environment: VS Code with Continue.dev as the agent. The Anvil app is connected to GitHub as the shared source of truth. Changes made in VS Code are pushed to GitHub; Anvil syncs from GitHub. Changes made in the Anvil Designer are pulled into VS Code before any code draft prompt is run.

---

## 13. Enforcement

| Level | Definition | Response |
|---|---|---|
| Critical | Security issue or data loss risk | Immediate fix — do not proceed |
| High | Policy violation | Fix before moving to next task |
| Medium | Best practice deviation | Document and schedule |
| Low | Style or formatting | Fix when convenient |

Security issues are always Critical. RBAC violations, secret handling errors, and any code that returns sensitive data to the client are treated as Critical.

---

*End of file*
