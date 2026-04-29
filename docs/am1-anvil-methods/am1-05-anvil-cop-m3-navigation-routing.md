# Anvil Navigation & Routing Code of Practice (M3)

**Version:** 3.1  
**Date:** January 26, 2026  
**Purpose:** Define navigation standards for mybizz using M3 and Routing  
**Authority:** [Anvil M3 Docs](https://anvil.works/docs/ui/app-themes/material-3) | [Routing Docs](https://anvil.works/docs/client/navigation/routing) | ADR-002

---

## Core Architecture

mybizz uses **two navigation systems**:

1. **Lambda + Link Components** - Internal SPA navigation with custom HtmlTemplate (authenticated areas)
2. **Routing Dependency** - URL-based navigation (public pages, shareable content)

---

## 1. Internal Navigation — Mybizz Standard (ADR-002)

**Use For:** Authenticated admin/customer interfaces where URLs are not needed

> **Mybizz ruling (ADR-002):** AdminLayout and CustomerLayout use a custom `HtmlTemplate` layout,
> not `NavigationDrawerLayoutTemplate`. All sidebar navigation uses plain `Link`
> components with lambda click handlers. `navigate_to` is never used. See §5.1.

### 1.1 Implementation (Mybizz standard)

```python
# AdminLayout / CustomerLayout — lambda pattern
class AdminLayout(AdminLayoutTemplate):  # custom HtmlTemplate layout
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

Loop variable capture (`fn=form_name, a=attr_name`) is mandatory. Without it, all
lambdas in the loop resolve to the last value of the loop variable.

### 1.2 Link Component Pattern (Mybizz Standard — ADR-002)

| Property | Type | Purpose |
|----------|------|---------|
| `text` | string | Link label |
| `icon` | string | Material icon name |
| `visible` | boolean | Feature flag control |
| `click_event` | lambda | `lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a)` |

The lambda handler pattern with variable capture is mandatory. Without explicit `fn=` and `a=` keyword arguments, all links in the loop resolve to the last value of the loop variable.

### 1.3 Standards (Mybizz — ADR-002)

- Use lambda with `open_form(string)` for all sidebar nav links
- Always capture loop variables: `lambda e, fn=form_name, a=attr_name:`
- Use `nav_` prefix for all nav link attributes (`self.nav_dashboard`, etc.)
- Use plain `Link` components with lambda click handlers (not NavigationLink)
- `navigate_to` is NEVER used — incompatible with custom HtmlTemplate layout
- `NavigationDrawerLayoutTemplate` is NEVER used — always use custom HtmlTemplate

**Reference:** [M3 Link Component Docs](https://anvil.works/docs/ui/app-themes/material-3/components#link)

---

## 2. URL Routing (Routing Dependency)

**Use For:** Public pages, shareable content, bookmarkable URLs, browser history

### 2.1 Installation

**Dependency ID:** `3PIDO5P3H4VPEMPL`

Add via Settings → Dependencies → Third Party

**Reference:** [Routing Installation](https://anvil.works/docs/client/navigation/routing#installation)

### 2.2 Basic Route Definition

```python
# In startup module or layout
from routing import router

# Simple route
@router.route("/")
class HomePage(HomePageTemplate):
    def __init__(self, routing_context, **properties):
        self.init_components(**properties)

# Route with parameters
@router.route("/services/:id")
class ServiceDetail(ServiceDetailTemplate):
    def __init__(self, routing_context, **properties):
        self.service_id = routing_context.params['id']
        self.init_components(**properties)
        self.load_service()
    
    def load_service(self):
        service = anvil.server.call('get_service', self.service_id)
        self.lbl_name.text = service['name']
```

### 2.3 Route Patterns

| Pattern | Example | Use Case |
|---------|---------|----------|
| Static | `/about` | Fixed pages |
| Parameter | `/services/:id` | Dynamic content |
| Query string | `/search?q=yoga` | Filters, search |
| Hash | `/article#comments` | Page sections |

### 2.4 Navigation with Routing

```python
from routing.router import navigate

# Navigate to path
def view_service_click(self, **event_args):
    navigate(path="/services/:id", params={"id": 123})

# Navigate with query
navigate(path="/search", query={"q": "consulting"})

# Replace current URL (no history entry)
navigate(path="/login", replace=True)
```

### 2.5 Navigation Components

```python
from routing.components import NavLink

# In Form designer
self.link_home = NavLink(
    text="Home",
    path="/",
    icon="fa:home"
)

self.link_services = NavLink(
    text="Services",
    path="/services",
    exact_path=False  # Matches /services, /services/123, etc.
)
```

**Reference:** [Routing Navigation Docs](https://routing-docs.anvil.works/navigating/)

---

## 3. Combining Lambda Navigation + Routing

### 3.1 Architecture Pattern

```python
# Authenticated areas: custom HtmlTemplate layout, lambda navigation
AdminLayout (custom HtmlTemplate — AdminLayoutTemplate)
├─ nav_dashboard → open_form('DashboardForm') via lambda
├─ nav_bookings  → open_form('BookingListForm') via lambda
└─ nav_settings  → open_form('SettingsForm') via lambda

# Public areas: Routing (with URLs)
@router.route("/")            → HomePage
@router.route("/services")    → ServicesPage
@router.route("/services/:id") → ServiceDetail
@router.route("/blog/:slug")  → BlogPostPage
@router.route("/contact")     → ContactPage
```

### 3.2 Mixed Navigation Example

```python
# Public homepage with routing
@router.route("/")
class HomePage(HomePageTemplate):
    def __init__(self, routing_context, **properties):
        self.init_components(**properties)
    
    def btn_login_click(self, **event_args):
        user = anvil.users.login_with_form()
        if user:
            open_form('AdminLayout')  # Switch to lambda-based admin nav

# Admin area uses custom layout with lambda navigation
class AdminLayout(AdminLayoutTemplate):  # custom HtmlTemplate layout
    def __init__(self, **properties):
        self.init_components(**properties)
        self.build_navigation()  # creates Link components with lambda handlers
```

### 3.3 Public Navigation with M3 Components

```python
# Use M3 components in routed Forms
from routing import router
import m3.components as m3

@router.route("/services/:id")
class ServiceDetail(ServiceDetailTemplate):
    def __init__(self, routing_context, **properties):
        self.init_components(**properties)
        
        # Use M3 components for styling
        self.card_service = m3.Card(role='outlined')
        self.btn_enquire = m3.Button(text="Enquire Now", role='filled-button')
```

**Reference:** [Routing + Layouts Guide](https://anvil.works/docs/client/navigation/routing/quickstart)

---

## 4. Authentication & Protected Routes

### 4.1 Route Guards

```python
from routing.router import Route, hooks, Redirect

class AuthenticatedRoute(Route):
    @hooks.before_load
    def check_auth(self, **loader_args):
        user = anvil.users.get_user()
        if not user:
            raise Redirect(path="/login")
        return {"user": user}

# Apply to specific routes
class DashboardRoute(AuthenticatedRoute):
    path = "/dashboard"
    form = "DashboardForm"
```

### 4.2 Login Flow

```python
# Public login page (routed)
@router.route("/login")
class LoginForm(LoginFormTemplate):
    def btn_login_click(self, **event_args):
        user = anvil.users.login_with_form()
        if user:
            open_form('AdminLayout')  # switch to lambda-based admin nav

# Admin layout — custom HtmlTemplate, lambda navigation
class AdminLayout(AdminLayoutTemplate):  # custom HtmlTemplate layout
    def __init__(self, **properties):
        user = anvil.users.get_user()
        if not user:
            open_form('LoginForm')
            return
        self.init_components(**properties)
        self.build_navigation()  # Link components with lambda click handlers
```

**Reference:** [Routing Hooks Docs](https://routing-docs.anvil.works/routes/hooks/)

---

## 5. mybizz Navigation Standards (ADR-002)

### 5.1 Admin/Customer Areas

**Use:** Custom HtmlTemplate layout + plain Link components with lambda click handlers

```python
AdminLayout (custom HtmlTemplate — AdminLayoutTemplate)
├─ Dashboard (always)
├─ Sales & Operations
│  ├─ nav_bookings (if bookings_enabled)
│  └─ nav_contacts (always)
├─ Customers & Marketing
│  ├─ nav_contacts (always)
│  └─ nav_campaigns (if marketing_enabled)
└─ Settings (always)
```

All sidebar links are plain `Link` components built via `build_navigation()` with
lambda click handlers. `NavigationDrawerLayoutTemplate` and `navigate_to` are never used.

### 5.2 Public Pages

**Use:** Routing Dependency

```python
Routes:
/                    → HomePage
/services            → ServiceCatalog
/services/:id        → ServiceDetail
/booking             → BookingForm
/blog                → BlogList
/blog/:slug          → BlogPost
/contact             → ContactForm
```

### 5.3 Naming Conventions

**Sidebar Links (Lambda-based):**
- Prefix: `nav_`
- Example: `nav_dashboard`, `nav_bookings`

**Routing NavLinks:**
- Prefix: `link_`
- Example: `link_home`, `link_products`

---

## 6. Parameter Passing

### 6.1 Lambda Navigation (No Parameters)

```python
# Lambda links cannot pass parameters directly
# For parameterized navigation, use open_form() with keyword arguments

def customer_row_click(self, **event_args):
    customer_id = self.item['id']
    open_form('CustomerDetailForm', customer_id=customer_id)
```

### 6.2 Routing (URL Parameters)

```python
# URL parameters
@router.route("/services/:id")
class ServiceDetail(ServiceDetailTemplate):
    def __init__(self, routing_context, **properties):
        self.service_id = routing_context.params['id']

# Query parameters
@router.route("/search")
class SearchResults(SearchResultsTemplate):
    def __init__(self, routing_context, **properties):
        self.query = routing_context.query.get('q', '')
```

---

## 7. Browser History & Back Button

### 7.1 Lambda Navigation

- **No browser history** (SPA navigation)
- **No back button support**
- Acceptable for admin interfaces

### 7.2 Routing

- **Full browser history**
- **Back/forward buttons work**
- **Bookmarkable URLs**
- Required for public pages

---

## 8. Testing Requirements

### 8.1 Sidebar Navigation Tests

- [ ] All nav Link components have lambda click handlers with explicit variable capture
- [ ] Active link highlights correctly via `set_active_link()`
- [ ] Role-based visibility applied (nav_vault owner-only)
- [ ] Feature flag visibility applied (marketing, blog)
- [ ] Sign out link present at bottom of sidebar, all roles

### 8.2 Routing Tests

- [ ] All routes resolve correctly
- [ ] URL parameters parsed properly
- [ ] Browser back/forward buttons work
- [ ] Bookmarked URLs load correctly
- [ ] Protected routes redirect to login
- [ ] 404 handling for invalid routes

---

## 9. Common Patterns

### 9.1 Public Homepage → Admin Dashboard

```python
# Public route
@router.route("/")
class HomePage(HomePageTemplate):
    def btn_login_click(self, **event_args):
        user = anvil.users.login_with_form()
        if user:
            open_form('AdminLayout')  # switch to lambda-based admin nav

# Admin uses custom HtmlTemplate layout with lambda navigation
class AdminLayout(AdminLayoutTemplate):
    def __init__(self, **properties):
        user = anvil.users.get_user()
        if not user:
            open_form('LoginForm')
            return
        self.init_components(**properties)
        self.build_navigation()  # Link components with lambda handlers
```

### 9.2 Admin Viewing Public Page

```python
# In AdminLayout (custom HtmlTemplate layout)
class AdminLayout(AdminLayoutTemplate):
    def btn_view_site_click(self, **event_args):
        # Navigate to public routed page
        navigate(path="/")
```


---

## 10. Decision Matrix

| Requirement | Solution |
|-------------|----------|
| Internal admin navigation | Lambda + `open_form(string)` via Link click handler |
| Internal customer portal nav | Lambda + `open_form(string)` via Link click handler |
| Parameterised nav (row click + ID) | `open_form(string, param=value)` directly |
| Shareable service/content URLs | Routing |
| Bookmarkable blog posts | Routing |
| Browser back/forward support | Routing |
| Public pages (SEO, sharing) | Routing |

---

## 11. Mybizz Navigation Standard (ADR-002)

AdminLayout and CustomerLayout use a custom HtmlTemplate layout. All sidebar
navigation uses plain `Link` components with lambda click handlers.

```python
# ✅ CORRECT — Mybizz standard (ADR-002)
class AdminLayout(AdminLayoutTemplate):  # custom HtmlTemplate, not NavigationDrawerLayoutTemplate
    def build_navigation(self):
        for attr_name, label, icon, form_name in _NAV_STRUCTURE:
            nav_link = Link(text=label, icon=icon)
            nav_link.set_event_handler(
                'click',
                lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a),
            )
            setattr(self, attr_name, nav_link)
            self.sidebar_panel.add_component(nav_link)

# ✅ CORRECT — parameterised navigation from content forms
def row_press(self, **event_args):
    open_form('ContactDetailForm', contact_id=self.item['id'])

# ❌ WRONG — navigate_to requires NavigationDrawerLayoutTemplate (ADR-002: never used)
self.nav_dashboard.navigate_to = 'DashboardForm'

# ❌ WRONG — custom HtmlTemplate layout (ADR-002: not NavigationDrawerLayoutTemplate)
class AdminLayout(NavigationDrawerLayoutTemplate):  # WRONG

# ❌ WRONG — lambda without variable capture (all links open last form)
nav_link.set_event_handler('click', lambda e: open_form(form_name))

# ❌ WRONG — NavigationLink components with navigate_to (ADR-002: plain Link only)
self.nav_dashboard = NavigationLink(navigate_to=DashboardForm())
```

---

## 12. Anti-Patterns

### ❌ Don't Use Routing for Admin Navigation

```python
# ❌ WRONG: Routing in admin area
@router.route("/admin/dashboard")
class DashboardForm...

# ✅ RIGHT: Lambda + open_form in AdminLayout
nav_link.set_event_handler('click', lambda e, fn='DashboardForm', a='nav_dashboard': self._nav_click(fn, a))
```

### ❌ Don't Use navigate_to (ADR-002)

```python
# ❌ WRONG: navigate_to not compatible with custom HtmlTemplate
self.nav_dashboard.navigate_to = 'DashboardForm'
self.nav_dashboard.navigate_to = DashboardForm()

# ✅ RIGHT: Lambda click handler with variable capture
nav_link.set_event_handler('click', lambda e, fn='DashboardForm', a='nav_dashboard': self._nav_click(fn, a))
```

### ❌ Don't Use NavigationDrawerLayoutTemplate

```python
# ❌ WRONG: NavigationDrawerLayoutTemplate not used in Mybizz
class AdminLayout(NavigationDrawerLayoutTemplate):
    pass

# ✅ RIGHT: Custom HtmlTemplate layout
class AdminLayout(AdminLayoutTemplate):  # custom HtmlTemplate
    def build_navigation(self):
        # Link components with lambda handlers
```

### ❌ Don't Forget Lambda Variable Capture

```python
# ❌ WRONG: All links open last form in loop
for attr_name, label, icon, form_name in _NAV_STRUCTURE:
    nav_link.set_event_handler('click', lambda e: open_form(form_name))

# ✅ RIGHT: Explicit capture
for attr_name, label, icon, form_name in _NAV_STRUCTURE:
    nav_link.set_event_handler('click', lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a))
```

---

## 13. References

### Official Documentation
- [Anvil M3 Theme](https://anvil.works/docs/ui/app-themes/material-3)
- [M3 Link Component](https://anvil.works/docs/ui/app-themes/material-3/components#link)
- [M3 Layouts](https://anvil.works/docs/ui/app-themes/material-3/layouts)
- [Routing Dependency](https://anvil.works/docs/client/navigation/routing)
- [Routing Documentation](https://routing-docs.anvil.works/)
- [Navigation Guide](https://anvil.works/docs/client/navigation)

### Mybizz ADR
- [ADR-002: Navigation Standard — Lambda/Link/open_form](../adr/02-navigation-lambda-link-open-form.md)

### GitHub
- [M3 Theme GitHub](https://github.com/anvil-works/material-3-theme)
- [Routing GitHub](https://github.com/anvil-works/routing)

---

**Status:** ✅ MANDATORY (ADR-002 Compliant)  
**Review:** After M3 or Routing major version updates  
**Owner:** mybizz Development Team

