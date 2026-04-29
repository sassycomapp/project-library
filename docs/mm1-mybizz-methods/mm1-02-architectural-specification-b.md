# Mybizz — Consulting & Services — Architectural Specification
# Part B of D: Sections 5–7
Created: 2026-03-17
Updated: 2026-03-18

---

# Part B continues from cs-architectural-specification-A.md
# Sections 1–4 are in Part A.
# Sections 8–10 are in Part C.
# Sections 11–13 are in Part D.

---

## 5. Code Standards

### 5.1 The Response Envelope

Every server function that is callable from client code returns the standard response
envelope without exception:

`{'success': True, 'data': result}` on success, or `{'success': False, 'error': 'message'}` on failure.

No server function returns a bare value. No server function raises an exception to the
client. The envelope is the contract between server and client throughout the entire
platform. Client code always checks `result['success']` before using `result['data']`.

### 5.2 Authentication at Entry

Every server callable checks authentication at entry as its first action. `instance_id`
is always derived from `anvil.users.get_user()` server-side. It is never accepted as a
parameter from client code. Accepting `instance_id` from the client is a security
violation — it would allow a client to access another instance's data.

### 5.3 Exception Handling

The exception handling pattern is specific exceptions first, general exceptions last.
AssertionError must always be re-raised before any broader handler — it must never be
swallowed by a bare except clause. Named exception handlers return generic user-facing
messages, never `str(exc)`. The full exception detail is in the log, not in the
response.

The `assert` / `AssertionError` re-raise pattern is used to enforce hard boundaries —
particularly payment security boundaries — where swallowing the exception would
represent a serious architectural violation. The pattern was established during Stage 1.4
work and applies wherever a hard fail is required.

### 5.4 Logging

All server modules use `logging.getLogger(__name__)` at module level. `print()` is
forbidden in server code. The five log levels — DEBUG, INFO, WARNING, ERROR, CRITICAL —
are used appropriately. Full tracebacks are captured with `exc_info=True` on ERROR and
CRITICAL entries. Full email addresses are never written to logs — domain only.

### 5.5 Client Code Rules

Event handlers in client forms contain zero logic. A click handler calls a method; the
method contains the logic. This is an absolute rule, not a preference.

`open_form()` called in `__init__` is always followed by `return`. Data Tables are
never accessed from client code. Every `anvil.server.call()` in client code is wrapped
in try/except for both `TimeoutError` and `AnvilWrappedError`.

`self.item` is set before `self.init_components()` is called. Write-back is enabled on
all input components that bind to `self.item` — this is a Designer action, not a code
action.

### 5.6 Form File Structure

Forms are folders, not single files. Code lives in `FormName/__init__.py`. The
`form_template.yaml` file is the Designer file and is never modified programmatically.

---

## 6. Secrets and Encryption Architecture

This is one of the most important architectural decisions in the platform. The two-level
secrets model must be understood precisely.

### 6.1 Anvil Secrets — One Item Only

Anvil Secrets holds exactly one item: `encryption_key`. This is a Fernet symmetric
encryption key set by Mybizz at provisioning via the Anvil IDE. It never changes after
provisioning. It is used exclusively inside `vault_service.py` to encrypt and decrypt
Vault entries. No other code ever calls `anvil.secrets.get_secret()` directly. No
client credential, no API key, no integration token ever goes in Anvil Secrets.

The reason this constraint exists: in Mybizz's multi-tenant model, each client runs
their own instance of master_template as a cloned Anvil app. Anvil Secrets in each
client instance can only be read or written via the Anvil IDE. Giving a client IDE
access would expose the entire Mybizz codebase. Therefore client-owned credentials
cannot go in Anvil Secrets.

### 6.2 The Vault — All Client Credentials

The Vault is an application-level encrypted secrets store built into every client
instance. It holds all client API keys and credentials. Values are encrypted using
Fernet symmetric encryption before storage in the `vault` Data Table. The
`encryption_key` from Anvil Secrets is used for this encryption. Decryption occurs only
in server code. Plaintext never reaches the client and never persists in the Data Table.

All integration server modules retrieve client credentials by calling
`get_vault_secret(name)` from `vault_service.py`. No integration module ever calls
`anvil.secrets.get_secret()` for a client credential.

Access to the Vault is restricted to the Owner role and requires TOTP step-up
authentication (Google Authenticator) on every open. There is no grace period — every
Vault access requires a fresh challenge regardless of recent login state. An email
notification is sent to the Owner's registered address on every Vault access. This
notification fires whether or not the Owner initiated the access — it is the detection
mechanism for unauthorised access.

Recovery from lost 2FA access is self-service by email only. Mybizz never resets 2FA
on behalf of clients. There is no backdoor.

### 6.3 The Encryption Service

`encryption_service.py` in server_shared/ provides Fernet encryption and decryption as
utility functions. It is used by vault_service.py and by any server function that needs
to encrypt a sensitive field before storage. The `encryption_key` is retrieved from
Anvil Secrets at runtime inside these functions — it is never stored in a variable at
module level.

### 6.4 Payment Security Boundary

Stage 1.4 establishes a specific security boundary that must not be forgotten: the
SettingsForm does not persist payment gateway secret keys to the `payment_config` table.
Secret keys are handled entirely by the Vault, not by the settings service. The form
shows the user an explanation of this. This is a documented architectural decision, not
an incomplete implementation.

The enforcement pattern uses `assert` to hard-fail if any payment secret column appears
in the data being saved:

```
_PAYMENT_SECRET_COLUMNS = frozenset({'stripe_secret_key', 'paystack_secret_key', 'paypal_secret'})
assert not (_PAYMENT_SECRET_COLUMNS & set(data.keys()))
```

The AssertionError must be re-raised before any broader exception handler. It must
never be swallowed.

### 6.5 Secret Masking

`get_payment_config()` returns `'***'` for any secret key field. `get_email_config()`
returns `'***'` for `smtp_password`. Client code never receives the actual secret value.
The client save methods must not include secret key fields in the outbound dictionary
even with masked `'***'` values — defence in depth.

---

## 7. RBAC and Security Architecture

### 7.1 The Four Security Layers

Security in Mybizz is enforced at four layers simultaneously:

Layer 1 is Anvil platform security — HTTPS/TLS, DDoS protection, server-side execution
sandboxing, built-in CSRF protection. This is provided automatically and requires no
configuration.

Layer 2 is application RBAC enforced via decorator. Every server function that operates
on application data has an `@require_role` or `@require_permission` decorator. Role
enforcement is server-side. Client-side navigation visibility is a UX convenience only
and does not constitute security.

Layer 3 is data encryption. Sensitive fields are encrypted at rest via Fernet symmetric
encryption. Client credentials are stored encrypted in the Vault. Payment tokens are
stored encrypted. Plaintext never persists in the database for any sensitive field.

Layer 4 is audit logging. All significant actions are logged with actor, timestamp, and
description: authentication events, data modifications, payment events, permission
changes, and all Vault access. The audit log is visible to Owner and Manager only.
Retention is two years.

### 7.2 Role Hierarchy

Five roles govern all access. They represent real relationships in a consulting or
services business.

Owner is the business owner — full access including the Vault, financial data, and user
management. One Owner per instance.

Manager has operational management access — full access to bookings, customers,
marketing, and reporting, but no Vault access and no financial configuration access.
Zero to three per instance.

Admin has administrative access — booking and customer management, no access to
financial reporting, settings, or the Vault. Zero to ten per instance.

Staff are practitioners, therapists, or consultants — access to their own calendar and
bookings only. No access to other staff data, financial information, or settings.
Zero to twenty per instance.

Customer is the client's customer — access only to their own bookings, invoices, and
account in the customer portal. Unlimited per instance.

### 7.3 Data Table Permissions

All Data Tables are set to "No access" for client code without exception. All data
access is through server functions. Direct client access bypasses `instance_id`
filtering, authentication checks, and input validation. This is a security requirement,
not a coding style preference.

### 7.4 Rate Limiting

Rate limits are enforced via the `rate_limits` Data Table, not in-memory. The Data
Table implementation survives server restarts and works across Anvil's multi-server
environment. Unauthenticated requests are limited to ten per minute per IP. Authenticated
requests to one hundred per minute per user. A background task cleans up rate limit
records older than 24 hours.

---

*End of Part B — continues in cs-architectural-specification-C.md*
