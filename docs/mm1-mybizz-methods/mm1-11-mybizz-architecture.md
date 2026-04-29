# Mybizz Architecture — Discoveries and Decisions
Created at: 2026-03-15 06:15
Updated at: 2026-03-15 06:15

Decisions made and patterns discovered during development. Not general architecture
principles (those are in the rules files) — only things established or discovered
that are not documented elsewhere.

---

## Payment Security Boundary

Stage 1.4 SettingsForm does NOT persist secret keys to the `payment_config` table.
Secret keys are deferred entirely to Stage 1.5 The Vault.
The form shows a note to the user explaining this for each gateway.
**This is a documented architectural boundary — not an oversight or incomplete work.**

Enforcement pattern discovered in Task 3/4 — use this in future stages:
```python
_PAYMENT_SECRET_COLUMNS = frozenset({
    'stripe_secret_key', 'paystack_secret_key', 'paypal_secret'
})
assert not (_PAYMENT_SECRET_COLUMNS & set(data.keys())), (
    f"Secret key columns must not be saved here: "
    f"{_PAYMENT_SECRET_COLUMNS & set(data.keys())}"
)
```
The `assert` raises `AssertionError` — which is a subclass of `Exception` and will
be swallowed by a bare `except Exception` handler. Always add:
```python
except AssertionError:
    raise  # Hard fail — must not be swallowed
```
before any broader exception handler.

---

## Secret Masking Rule

`get_payment_config()` must return `'***'` for any secret key that is set — never plaintext.
Same rule applies to `get_email_config()` for `smtp_password`.
The client should never transmit secret fields even if masked — defence in depth.
`_save_payments()` on the client must not include secret key fields in the outbound dict,
even with `'***'` values.

---

## Single-Row Config Tables

`business_profile`, `email_config`, `payment_config`, `theme_config` are all single-row tables.
These will always have zero or one row — never more.

Read pattern:
```python
rows = list(app_tables.business_profile.search())
row = rows[0] if rows else None
```

---

## instance_id Does Not Exist on All Tables

`invoice`, `bookings`, `time_entries` use `customer_id` or `staff_id` — NOT `instance_id`.
`server_dashboard/service.py` currently queries these with `instance_id=user` which
silently returns zero. Known issue, fix deferred to Phase 3/4/5.
Do not copy this pattern. Check the schema before assuming a table has `instance_id`.

---

## Schema Changes Made in Tasks 3–7

**business_profile:** added `tagline`, `address_line_1`, `address_line_2`, `city`,
`country`, `postal_code`. Old `address` column deleted.

**payment_config:** added `stripe_connected_at`, `paystack_connected_at`,
`paypal_connected_at` (datetime). `stripe_connected` (bool) already existed — confirmed correct.

---

## create_initial_config() Preservation Rule

`create_initial_config()` in `server_settings/service.py` is a provisioning utility —
not a settings service function. Do not touch it in polish passes or future rewrites.
It exists to bootstrap a fresh installation and has a separate purpose from the
settings read/write functions.

---

## test_email_connection() Pattern

Uses `smtplib` directly with STARTTLS.
Exception ordering matters — specific before general:
```python
except smtplib.SMTPAuthenticationError:
    ...
except smtplib.SMTPException:
    ...
```
Returns exact exception strings — not generic messages — so the user knows what failed.

---

## Settings Tab Navigation

Pure client-side visibility toggle. Four ColumnPanels, one visible at a time.
Active tab button = filled appearance. Inactive = outlined appearance.
No server calls for tab switching. Intentional — fast and simple.

---

## Code Structure Pattern — SettingsForm

Module-level constants `_TABS`, `_GATEWAY_PANELS`, `_PLACEHOLDERS` keep logic methods
clean — no hard-coded strings in dispatch methods.
`_activate_tab()` and `_show_gateway_panel()` use dict iteration — no if/elif chains.
All event handlers are one-liner delegates — zero logic in handlers.

`__init__` order:
1. `require_admin()`
2. `init_components()`
3. Code-only properties (e.g. `lp_tab_bar.orientation`)
4. `set_active_link()`
5. Label text
6. Dropdown items
7. `_activate_tab()`
8. Load calls
