# Mybizz CS — Coding Standards

**Authority:** Mandatory — all code must conform

---

## 1. Anvil-First Principle

Default to Anvil's built-in facilities. Custom implementations require documented justification.

---

## 2. Server Function Standards

### Response Envelope
Every server function callable from client code returns:
```python
{'success': True, 'data': result}   # on success
{'success': False, 'error': msg}    # on failure
```

### Docstrings
Every server function has a docstring with Args, Returns, and Raises sections. Google or NumPy style preferred.

### Type Hints
Required on all public functions.

### Logging
```python
import logging
logger = logging.getLogger(__name__)
```
`print()` is forbidden in server code. Five log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL. Full tracebacks with `exc_info=True` on ERROR and CRITICAL.

### Exception Handling
```python
try:
    # validate inputs first
    # do the work
    return {'success': True, 'data': result}
except AssertionError:
    raise  # never swallow
except SpecificExpectedException as e:
    logger.warning(f"Expected error: {e}")
    return {'success': False, 'error': 'User-friendly message'}
except Exception as e:
    logger.error(f"Unexpected error: {e}", exc_info=True)
    return {'success': False, 'error': 'Generic error message'}
```

### Authentication
Check at entry. Derive `instance_id` from `anvil.users.get_user()` server-side. Never accept from client.

---

## 3. Client Code Standards

### Event Handlers
Contain zero logic. Click handlers call methods; methods contain the logic.

### Server Calls
Every `anvil.server.call()` wrapped in `try/except` for both `TimeoutError` and `AnvilWrappedError`.

### Data Binding
`self.item` set before `self.init_components()`. Write-back enabled in Designer. Call `refresh_data_bindings()` when modifying `self.item` in place.

### Form Structure
Forms are folders: `FormName/__init__.py` + `form_template.yaml`. Code in `__init__.py`, Designer config in YAML.

---

## 4. Pure Logic Extraction

Business logic with zero Anvil dependencies:
- No `import anvil` statements
- No Data Tables access
- No server function calls
- No side effects
- Deterministic (same inputs = same outputs)

Server and client modules become thin wrappers around pure logic. Pure logic modules are unit-testable with pytest.

---

## 5. Data Tables Standards

### Row Identification
Use Anvil's built-in Row IDs (`row.get_id()`). Do not create custom auto-increment columns.

### Table Linking
Store Row objects directly in link columns — not integer IDs.

```python
contact = app_tables.contacts.add_row(instance_id=user, email='jane@example.com')
booking = app_tables.bookings.add_row(instance_id=user, contact=contact)
```

### Data Isolation
Every query MUST filter by `instance_id=user`. Never trust client-provided `instance_id`.

### Mandatory Columns
Every table must have: `instance_id` (link → users), `created_at` (datetime), `updated_at` (datetime if mutable).

### Query Patterns
- Use `get()` for single record (returns None if not found)
- Use `search()` for multiple records (returns SearchIterator)
- Paginate with slicing: `[:50]`
- Sort with `tables.order_by()`
- Never convert SearchIterator to list unless necessary

### Transactions
Use `@tables.in_transaction` for counter increments and multi-step operations requiring atomicity.

### Permissions
All tables set to "No access" for client code. Access via server functions only.

---

## 6. Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Folders | PascalCase | `ServerAuth`, `ContactListForm` |
| Files | lowercase_with_underscores | `contact_service.py` |
| Server modules | `{purpose}_service.py` | `booking_service.py` |
| Integration modules | `{purpose}_integration.py` | `brevo_integration.py` |
| Client modules | `{purpose}_utils.py` | `validation_utils.py` |
| Database tables | lowercase_snake | `contacts`, `bookings` |
| Link columns | `{table}_id` or singular name | `contact_id`, `service_id` |

**See:** `nomenclature.md` for full conventions

---

## 7. Constants

No hard-coded URLs, API keys, or magic strings. Use a dedicated `constants.py` module. Sensitive data goes in Anvil Secrets or the Vault.

---

## 8. Global Error Handling

Register a global client-side error handler:
```python
def global_error_handler(err):
    anvil.server.call('log_error_to_server', repr(err))
    alert("An unexpected error occurred. Please try again.", title="System Error")

anvil.set_default_error_handling(global_error_handler)
```

---

*End of file*
