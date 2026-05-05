# Mybizz CS — Anvil Methods Reference

**Purpose:** Anvil-specific technical patterns, methods, and discoveries for Mybizz development
**Dependencies:** M3 Theme (4UK6WHQ6UX7AKELK), Routing (3PIDO5P3H4VPEMPL)
**Blocked:** Anvil Extras — never used

---

## 1. Packages and Namespaces

Anvil packages are folders with Python namespacing. They create real Python import namespaces, not just visual grouping.

### Client Packages
Contain Forms and Client Modules. Run in the browser. Cannot access Data Tables or secrets directly.

### Server Packages
Contain Server Modules only. Run on Anvil's Python server. Can access Data Tables, secrets, and enforce security rules. This is a hard security boundary.

### Import Patterns
```python
from .users import user_logic           # Same package
from ..users.user_logic import fn       # Parent package
from ...server_shared.utilities import fn  # Cross-boundary
```

### Recommended Structure
Feature-based organization (not layer-based):
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

---

## 2. Components vs Widgets

### Custom Component (90% of cases)
- Reusable Anvil Form written entirely in Python
- Uses standard Anvil components internally
- Fully supports data bindings, events, properties, Designer configuration
- **Default choice for well-structured Anvil apps**

### Widget (10% of cases)
- Wrapper around HTML/CSS/JavaScript
- Uses the HTML panel
- Only when you must: integrate third-party JS library, access browser APIs, custom DOM-level rendering

### Best Practice Pattern
Custom Component handles layout, data, events, API → Widget (internally, if needed) hidden behind the component interface. Keeps the rest of the app pure Anvil.

---

## 3. Data Tables

### Row Identification
Anvil manages primary keys automatically. Every row has a built-in unique ID accessible via `row.get_id()`. Do not create custom auto-increment columns.

### Table Linking
Store Row objects directly in link columns — not integer IDs:
```python
contact = app_tables.contacts.add_row(instance_id=user, email='jane@example.com')
booking = app_tables.bookings.add_row(instance_id=user, contact=contact)
```

### Data Isolation (Multi-Tenant Security)
Every table MUST have `instance_id` column linked to `users` table. Every query MUST filter by `instance_id`:
```python
@anvil.server.callable
def get_all_contacts():
    user = anvil.users.get_user()
    if not user:
        raise Exception("Not authenticated")
    return app_tables.contacts.search(instance_id=user)
```

### Query Patterns
- `get()` for single record (returns None if not found)
- `search()` for multiple records (returns SearchIterator — lazy-loaded)
- Paginate with slicing: `[:50]`
- Sort with `tables.order_by('field', ascending=False)`
- Query operators: `q.any_of()`, `q.none_of()`, `q.greater_than()`, `q.between()`, `q.full_text_match()`, `q.like()`

### Transactions
Use `@tables.in_transaction` for counter increments and multi-step operations requiring atomicity:
```python
@tables.in_transaction
def get_next_contact_number():
    counter = app_tables.contact_counter.get()
    current = counter['value']
    counter['value'] += 1
    return f"C-{current:05d}"
```

### Column Types
| Anvil Type | Python Type | Use Case |
|---|---|---|
| Text | str | Names, emails, descriptions |
| Number | int, float | Quantities, prices |
| True/False | bool | Flags, toggles |
| Date | datetime.date | Birthdays, deadlines |
| Date and Time | datetime.datetime | Timestamps |
| Simple Object | dict, list | JSON data, settings, tags |
| Media | Media object | Files, images |
| Link (Single) | Row object | Foreign key to one row |
| Link (Multiple) | List of Rows | Many-to-many |

### Permissions
All tables set to "No access" for client code. Access via server functions only.

---

## 4. Navigation & Routing

### Authenticated Areas — Lambda Navigation (ADR-002)
Custom HtmlTemplate layout with plain Link components:
```python
class AdminLayout(AdminLayoutTemplate):
    def build_navigation(self):
        for attr_name, label, icon, form_name in _NAV_STRUCTURE:
            nav_link = Link(text=label, icon=icon)
            nav_link.set_event_handler(
                'click',
                lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a),
            )
            setattr(self, attr_name, nav_link)
            self.sidebar_panel.add_component(nav_link)
```

**Mandatory:** Loop variable capture `fn=form_name, a=attr_name`. Without it, all lambdas resolve to the last loop value.

**Never used:** `NavigationDrawerLayoutTemplate`, `NavigationLink`, `navigate_to`.

### Public Pages — Routing Dependency
```python
from routing import router

@router.route("/")
class HomePage(HomePageTemplate):
    def __init__(self, routing_context, **properties):
        self.init_components(**properties)

@router.route("/services/:id")
class ServiceDetail(ServiceDetailTemplate):
    def __init__(self, routing_context, **properties):
        self.service_id = routing_context.params['id']
        self.init_components(**properties)
```

### Parameterised Navigation
```python
# From content forms (row clicks, detail views)
open_form('ContactDetailForm', contact_id=self.item['id'])
```

---

## 5. Startup and Authentication

Anvil starts by instantiating a Startup Form (not a Startup Module). The Startup Form is defined in app settings.

```python
class HomePage(HomePageTemplate):
    def __init__(self, **properties):
        user = anvil.users.get_user()
        if user:
            if user['role'] in ['owner', 'manager', 'admin', 'staff']:
                open_form('dashboard.DashboardForm')
                return
            else:
                open_form('customers.ClientPortalForm')
                return
        # If not logged in, continue with HomePage display
        self.init_components(**properties)
```

**Critical:** `open_form()` in `__init__` must always be followed by `return`.

---

## 6. M3 Component Patterns

### Button Hierarchy
- One filled button per screen (primary action)
- Outlined buttons for secondary actions
- Text buttons for tertiary actions

### Input Components
- All inputs use `role='outlined'`
- Validation failure: `role='outlined-error'` with error in placeholder
- TextBox outlined style set via `appearance` property in Designer (not `role`)

### Card Pattern
When you add a Card in Designer, Anvil automatically creates a CardContentContainer inside it. Place all card content inside the CardContentContainer.

### Data Binding — self.item Pattern
```python
class ContactEditorForm(ContactEditorFormTemplate):
    def __init__(self, contact=None, **properties):
        if contact:
            self.item = contact  # Existing record
        else:
            self.item = {}  # New record
        self.init_components(**properties)
    
    def btn_save_click(self, **event_args):
        result = anvil.server.call('save_contact', self.item)
        if result['success']:
            open_form('ContactListForm')
```

Write Back must be enabled in the Designer Data Bindings panel (W toggle). Cannot be set in code.

---

## 7. Designer Gotchas

### Properties That Must Be Set in Code
- **LinearPanel orientation:** Cannot be set in Designer. Must be set in code with a comment explaining why.

### Properties That Must Be Set in Designer
- **TextBox password masking:** `hide_text = True` in Designer. There is no `type` property.
- **TextBox outlined style:** `appearance` property in Designer. Not via `role`.
- **Write Back toggle:** W toggle in Designer Data Bindings panel.

### Patterns That Cause Problems
- **Data bindings on settings forms:** Do NOT use `self.item` write-back on forms that manage their own read/write via server calls.
- **Stray event handlers:** Designer sometimes generates empty event handler stubs in `__init__.py`. Check and delete before code drafts.
- **DropdownMenu items:** Leave empty in Designer. Set in code for dynamic lists.

---

## 8. Uplink

### Setup
```bash
pip install anvil-uplink
export ANVIL_UPLINK_KEY="your-server-uplink-key"
```

### Connection Pattern
```python
import anvil.server, os
anvil.server.connect(os.environ['ANVIL_UPLINK_KEY'])
try:
    result = anvil.server.call('server_function_name')
finally:
    anvil.server.disconnect()
```

### Safety Rules
- Always use Server Uplink (not Client Uplink) for server-side work
- Never hardcode Uplink keys
- Always disconnect after operations
- Use smoke tests before running full integration tasks
- Restart server runtime after changes in Anvil editor

---

## 9. Testing Patterns

### Pure Logic Extraction
Business logic with zero Anvil dependencies:
```python
# order_logic.py — NO Anvil imports
def calculate_order_total(price: float, tax_rate: float, max_total: float) -> dict:
    if price < 0:
        raise OrderLogicError("Price must be non-negative")
    subtotal = price
    tax = subtotal * tax_rate
    total = subtotal + tax
    if total > max_total:
        raise OrderLogicError("Order total exceeds maximum")
    return {"subtotal": subtotal, "tax": tax, "total": total}
```

### Server Module (Thin Wrapper)
```python
@anvil.server.callable
def create_order(customer_email: str, price: float):
    user = anvil.users.get_user()
    if not user:
        raise Exception("Authentication required")
    order_calc = calculate_order_total(price, DEFAULT_TAX_RATE, MAX_ORDER_TOTAL)
    order = app_tables.orders.add_row(
        instance_id=user, total=order_calc["total"], status="pending"
    )
    return order
```

### Test Execution
```bash
# Level 1: Pure logic (local)
python test_order_logic.py

# Level 2: Integration (Uplink)
python test_orders_integration.py
```

---

## 10. Background Tasks

```python
@anvil.server.background_task
def process_email_campaigns():
    """Hourly — sends via Brevo Campaigns API. No timeout limit."""
    campaigns = app_tables.email_campaigns.search(status='active')
    for campaign in campaigns:
        process_enrollments(campaign)
```

Any operation expected to exceed 22 seconds (75% of Anvil's 30-second timeout) must use background tasks.

---

*End of file*
