# Mybizz Platform - Material Design 3 Component Recommendations

**Document Version:** 1.2  
**Date:** January 26, 2026  
**Purpose:** M3-Compliant Component Selection for Mybizz V1.x (Consulting & Services Only)  
**Compliance Level:** Strict Material Design 3 Adherence + ADR-002 Navigation Standard + ADR-009 Single Vertical

---

## Executive Summary

This document provides component recommendations for the Mybizz platform to ensure **100% Material Design 3 compliance**. Based on analysis of your architecture (AdminLayout, CustomerLayout, 40+ forms, CRM, Marketing), these recommendations prioritize M3 components over legacy Anvil and Anvil Extras alternatives.

**Key Principles:**
1. ✅ Use M3 components wherever available
2. ⚠️ Avoid legacy Anvil components when M3 alternatives exist
3. ❌ Minimize Anvil Extras usage (prefer native M3)
4. 🔄 Adopt M3-specific patterns even when different from traditional Anvil
5. 🔐 Consulting & Services vertical only (ADR-009: E-commerce, Hospitality, Membership removed)

---

## 🚨 CRITICAL: Navigation Architecture (ADR-002)

### ✅ Mybizz Navigation Standard: Custom HtmlTemplate + Lambda

**AdminLayout and CustomerLayout** use a custom `HtmlTemplate` layout (`@theme:standard-page.html`),
NOT `NavigationDrawerLayoutTemplate`. Sidebar navigation uses plain `Link` components
created programmatically in `build_navigation()`, with lambda click handlers.

**Why not NavigationDrawerLayoutTemplate? (ADR-002)**
- `NavigationDrawerLayoutTemplate` is not used in Mybizz architecture
- `navigate_to` requires an instantiated Form object, not a string — unsafe during incremental build
- Custom HtmlTemplate gives full control: role-based visibility, group label dividers, `set_active_link()` highlighting
- Lambda + `open_form(string)` resolves at click time — no ImportError risk

**The standard pattern (ADR-002):**
```python
class AdminLayout(AdminLayoutTemplate):  # custom HtmlTemplate layout
  def build_navigation(self):
    for attr_name, label, icon, form_name in _NAV_STRUCTURE:
        nav_link = Link(text=label, icon=icon)  # Plain Link, NOT NavigationLink
        nav_link.set_event_handler(
            'click',
            lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a),  # Lambda with variable capture
        )
        setattr(self, attr_name, nav_link)
        self.sidebar_panel.add_component(nav_link)
```

Loop variable capture (`fn=form_name, a=attr_name`) is **mandatory**. Without it, all
lambdas in the loop resolve to the last value of the loop variable.

**Parameterised navigation** (row clicks, detail forms with IDs) uses `open_form()` directly:
```python
def row_press(self, **event_args):
    open_form('ContactDetailForm', contact_id=self.item['id'])
```

**Key ADR-002 Rules:**
- ✅ Plain `Link` components with lambda click handlers (not NavigationLink)
- ✅ Lambda handlers MUST capture loop variables: `lambda e, fn=form_name, a=attr_name:`
- ✅ Use `open_form(string)` — resolves form name at click time
- ❌ NEVER use `navigate_to` — incompatible with custom HtmlTemplate
- ❌ NEVER use `NavigationDrawerLayoutTemplate` — always custom HtmlTemplate
- ❌ NEVER use NavigationLink for sidebar navigation

---

## 📦 Layout System

### ✅ Mybizz Layout Decisions (ADR-009: Consulting & Services Only)

| Your Need | Layout Used | Notes |
|-----------|-------------|-------|
| **Admin Interface** | Custom `HtmlTemplate` (`AdminLayoutTemplate`) | Sidebar via `build_navigation()` + lambda (ADR-002) |
| **Customer Portal** | Custom `HtmlTemplate` (`CustomerLayoutTemplate`) | Same pattern as AdminLayout (ADR-002) |
| **Auth Pages** | Custom Form (no layout) | Login/signup don't need navigation |
| **Error Pages** | Custom Form (no layout) | Minimal navigation needed |

---

## 🎨 Typography Components

### ✅ ESSENTIAL M3 Components

| Component | Prefix | Use For | M3 Role | Priority |
|-----------|--------|---------|---------|----------|
| **Text** | `lbl_` | Body text, labels | `body-large`, `body-medium` | ✅ ESSENTIAL |
| **Heading** | `lbl_` | Section headers | `headline-small`, `headline-medium` | ✅ ESSENTIAL |
| **Link** | `link_` | Text links | Default styled | 🟡 GOOD TO HAVE |

**M3-Specific Usage:**
```python
# Use M3 typography roles
self.lbl_page_title.role = 'headline-large'
self.lbl_section_header.role = 'headline-small'
self.lbl_body_text.role = 'body-medium'
```

### ⚠️ AVOID: RichText

**Why:** Not every Material 3 component is supported yet. RichText should be used sparingly as it's not a core M3 component.

**Alternative:** Use Text with appropriate typography roles for most content.

---

## 🔘 Button Components

### ✅ ESSENTIAL M3 Button Types

Buttons help people take action. Common buttons prompt most actions in a UI.

| Button Type | M3 Role | Use For | Priority |
|-------------|---------|---------|----------|
| **Button** (Filled) | Default | Primary actions (Save, Submit) | ✅ ESSENTIAL |
| **Button** (Outlined) | `outlined` | Secondary actions (Cancel, Back) | ✅ ESSENTIAL |
| **Button** (Text) | `text-button` | Tertiary actions (Learn More) | 🟡 GOOD TO HAVE |
| **IconButton** | Default | Icon-only actions (Edit, Delete) | ✅ ESSENTIAL |
| **ToggleIconButton** | Default | Toggle states (Favorite, Bookmark) | 🟡 GOOD TO HAVE |

### 🔄 M3 Button Hierarchy (CRITICAL)

**M3 Principle:** Button emphasis decreases from Filled → Outlined → Text

**Your Use Cases:**
```python
# Primary action (Save booking)
self.btn_save.role = 'filled-button'  # or default
self.btn_save.icon = 'fa:save'

# Secondary action (Cancel)
self.btn_cancel.role = 'outlined'
self.btn_cancel.icon = 'fa:times'

# Tertiary action (View Details)
self.btn_details.role = 'text-button'
```

### ⚠️ AVOID: Anvil Extras Switch for Toggle Buttons

**Why:** M3 has native `ToggleIconButton` component.

---

## 🎴 Card Components

Cards display content and actions about a single subject. Cards come in three types: elevated, filled and outlined.

### ✅ ESSENTIAL M3 Card Types

| Card Type | M3 Role | Use For | Priority |
|-----------|---------|---------|----------|
| **Card** (Elevated) | Default | Dashboard metrics, summary cards | ✅ ESSENTIAL |
| **Card** (Filled) | `filled-card` | Content cards with actions | 🟡 GOOD TO HAVE |
| **Card** (Outlined) | `outlined-card` | List items, secondary content | ✅ ESSENTIAL |

### 🔄 M3 Card Pattern

**Your Dashboard Use Case:**
```python
# Revenue metric card (elevated)
self.card_revenue.role = None  # Default is elevated
self.card_revenue.add_component(
  m3.Heading(text="Revenue Today", role='headline-small')
)
self.card_revenue.add_component(
  m3.Text(text="$2,450", role='display-medium')
)

# Contact list item (outlined)
self.card_contact.role = 'outlined-card'
```

### ⚠️ AVOID: Anvil Extras Cards

**Why:** M3 provides native Card components with proper elevation and styling.

---

## 📥 Form Input Components

### ✅ ESSENTIAL M3 Input Components

| Component | Prefix | M3 Type | Use For | Priority |
|-----------|--------|---------|---------|----------|
| **TextBox** | `txt_` | Filled / Outlined | Single-line text input | ✅ ESSENTIAL |
| **TextArea** | `txt_` | Filled / Outlined | Multi-line text input | ✅ ESSENTIAL |
| **DropdownMenu** | `dd_` | Filled / Outlined | Selection from list | ✅ ESSENTIAL |
| **DatePicker** | `dp_` | Filled / Outlined | Date selection | ✅ ESSENTIAL |
| **Checkbox** | `cb_` | Default | Boolean selection | ✅ ESSENTIAL |
| **RadioButton** | `rb_` | Default | Single selection | ✅ ESSENTIAL |
| **Switch** | `sw_` | Default | Toggle on/off | 🟡 GOOD TO HAVE |
| **Slider** | `slider_` | Default | Range selection | 🟡 GOOD TO HAVE |
| **FileLoader** | `fu_` | Default | File upload | ✅ ESSENTIAL |

### 🔄 M3 Text Field Variants (CRITICAL)

Text fields let users enter text into a UI. They typically appear in forms and dialogs.

**M3 provides TWO text field styles:**
1. **Filled** (Default) - Has background fill
2. **Outlined** - Has border outline

**Your Use Case - Form Inputs:**
```python
# Use OUTLINED for dense forms (cleaner look)
self.txt_customer_name.role = 'outlined'
self.txt_email.role = 'outlined'
self.txt_phone.role = 'outlined'

# Use FILLED for prominent search/filter fields
self.txt_search.role = None  # Default filled
```

**Error Handling (M3 Pattern):**
```python
# M3-specific error roles
if not self.txt_email.text:
  self.txt_email.role = 'outlined-error'
else:
  self.txt_email.role = 'outlined'
```

### ⚠️ AVOID: Anvil Extras Components

| Anvil Extras | M3 Alternative | Reason |
|--------------|---------------|--------|
| `MultiSelectDropDown` | DropdownMenu with Chips | ❌ Not M3 standard |
| `Autocomplete` | DropdownMenu with search | ❌ M3 has native patterns |
| `ChipsInput` | FlowPanel + Chip components | ⚠️ Use sparingly |

---

## 🔲 Checkbox & Radio Components

### ✅ ESSENTIAL M3 Selection Components

| Component | Prefix | Use For | Priority |
|-----------|--------|---------|----------|
| **Checkbox** | `cb_` | Multi-select options | ✅ ESSENTIAL |
| **RadioButton** | `rb_` | Single-select options | ✅ ESSENTIAL |
| **RadioGroupPanel** | `rg_` | Grouped radio options | 🟡 GOOD TO HAVE |
| **Switch** | `sw_` | Toggle settings | 🟡 GOOD TO HAVE |

### 🔄 M3 Selection Pattern

**Your Settings Form Use Case:**
```python
# Feature toggles - use Switch
self.sw_bookings_enabled.checked = config['features']['bookings_enabled']

# Notification preferences - use Checkbox
self.cb_email_notifications.checked = user['email_notifications']
self.cb_sms_notifications.checked = user['sms_notifications']

# Single choice - use RadioButton or RadioGroupPanel
self.rg_currency.selected_value = config['system_currency']
```

### ⚠️ AVOID: Anvil Extras RadioGroup/CheckBoxGroup

**Why:** M3 has native `RadioGroupPanel` component with better M3 styling.

---

## 🗂️ Container Components

### ✅ ESSENTIAL M3 Containers

| Container | Prefix | Use For | Priority |
|-----------|--------|---------|----------|
| **ColumnPanel** | `col_` | Vertical stacking (main layout) | ✅ ESSENTIAL |
| **LinearPanel** | `lp_` | Horizontal/vertical layouts | ✅ ESSENTIAL |
| **FlowPanel** | `flow_` | Responsive wrapping (tags, chips) | ✅ ESSENTIAL |
| **CardContentContainer** | `col_` | Content inside Cards | ✅ ESSENTIAL |
| **GridPanel** | `grid_` | CSS grid layouts | 🟡 GOOD TO HAVE |

### 🔄 M3 Container Patterns

**Your Dashboard Layout:**
```python
# Main content area
col_main (ColumnPanel)
├─ lp_header (LinearPanel - horizontal)
│  ├─ lbl_page_title (Heading)
│  └─ btn_new (Button)
├─ lp_metrics (LinearPanel - horizontal)
│  ├─ card_revenue (Card)
│  ├─ card_bookings (Card)
│  └─ card_customers (Card)
└─ dg_recent_activity (DataGrid)
```

### ⚠️ AVOID: XYPanel for Layout

**Why:** XYPanel uses absolute positioning. M3 emphasizes responsive, grid-based layouts using ColumnPanel, LinearPanel, and FlowPanel.

---

## 📊 Data Display Components

### ✅ ESSENTIAL M3 Data Components

| Component | Prefix | Use For | Priority |
|-----------|--------|---------|----------|
| **Data Grid** | `dg_` | Tabular data display | ✅ ESSENTIAL |
| **RepeatingPanel** | `rp_` | Dynamic lists | ✅ ESSENTIAL |
| **DataRowPanel** | - | Data Grid row template | ✅ ESSENTIAL |

### 🔄 M3 DataGrid Pattern

**Your Contact List Use Case:**
```python
# DataGrid with M3 styling
self.dg_contacts.role = None  # Uses M3 default styling
self.dg_contacts.columns = [
  {'id': 'name', 'title': 'Name', 'width': 200},
  {'id': 'email', 'title': 'Email', 'width': 250},
  {'id': 'status', 'title': 'Status', 'width': 100},
]

# DataRowPanel template with M3 components
# (in RowTemplate - inherits from DataRowPanel)
self.lbl_name = m3.Text(role='body-large')
self.lbl_email = m3.Text(role='body-medium')
self.btn_edit = m3.IconButton(icon='fa:edit')
```

### ⚠️ IMPORTANT: DataGrid M3 Behavior

When you drag and drop a Data Grid onto your Form, Anvil creates several components for you. Inside your DataGrid is a RepeatingPanel, and inside that are DataRowPanels.

**M3-Specific:** DataGrid automatically styles with M3 theme. Use M3 components inside DataRowPanel templates for consistency.

---

## 📱 Display Components

### ✅ ESSENTIAL M3 Display Components

| Component | Use For | Priority |
|-----------|---------|----------|
| **Avatar** | User profile images | 🟡 GOOD TO HAVE |
| **Divider** | Visual separation | ✅ ESSENTIAL |
| **LinearProgressIndicator** | Loading state | 🟡 GOOD TO HAVE |
| **CircularProgressIndicator** | Loading spinner | 🟡 GOOD TO HAVE |

### 🔄 M3 Progress Pattern

**Your Booking Form:**
```python
# Show loading during save
self.progress_indicator.visible = True
result = anvil.server.call('create_booking', data)
self.progress_indicator.visible = False
```

### ⚠️ AVOID: Anvil Extras Progress Components

**Why:** M3 has native progress indicators (Determinate/Indeterminate from Anvil Extras are not M3-specific).

---

## 🍔 Menu Components

### ✅ ESSENTIAL M3 Menu Components

| Component | Prefix | Use For | Priority |
|-----------|--------|---------|----------|
| **ButtonMenu** | `menu_` | Menu attached to button | ✅ ESSENTIAL |
| **IconButtonMenu** | `menu_` | Menu attached to icon button | ✅ ESSENTIAL |
| **AvatarMenu** | `menu_` | User profile menu | 🟡 GOOD TO HAVE |
| **MenuItem** | - | Menu list items | ✅ ESSENTIAL |

### 🔄 M3 Menu Pattern

**Your Header User Menu:**
```python
# AvatarMenu for user profile
self.menu_user = m3.AvatarMenu(
  avatar_text=user['name'][0],  # First initial
  menu_items=[
    m3.MenuItem(text="My Account"),
    m3.MenuItem(text="Settings"),
    m3.MenuItem(text="Logout", icon='fa:sign-out'),
  ]
)
```

**Your Actions Menu:**
```python
# IconButtonMenu for actions
self.menu_actions = m3.IconButtonMenu(
  icon='fa:ellipsis-v',
  menu_items=[
    m3.MenuItem(text="Edit", icon='fa:edit'),
    m3.MenuItem(text="Delete", icon='fa:trash'),
  ]
)
```

---

## 🔗 Navigation Components (ADR-002)

### ✅ Mybizz Navigation: Link + Lambda

AdminLayout and CustomerLayout use plain `Link` components with lambda click handlers
for all sidebar navigation. `NavigationLink.navigate_to` is NEVER used.

**The standard pattern (ADR-002):**
```python
# Sidebar nav link - plain Link component
nav_link = Link(text=label, icon=icon)  # NOT NavigationLink
nav_link.set_event_handler(
    'click',
    lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a),  # Lambda with variable capture
)
setattr(self, attr_name, nav_link)
self.sidebar_panel.add_component(nav_link)
```

**Feature-based visibility (ADR-002):**
```python
def build_navigation(self):
    config = anvil.server.call('get_config')
    features = config['features']
    self.nav_campaigns.visible = features.get('marketing_enabled', False)
    self.nav_vault.visible = (self._user.get('role') == 'owner')
```

**Active link highlighting (ADR-002):**
```python
def set_active_link(self, attr_name: str) -> None:
    for name, link in self._nav_links.items():
        link.bold = (name == attr_name)
        link.foreground = 'theme:Primary' if name == attr_name else 'theme:On Surface'
```

---

## 🎭 Special Components

### ✅ OPTIONAL M3 Components (ADR-009: Consulting & Services Only)

| Component | Use For | Priority | Notes |
|-----------|---------|----------|-------|
| **Plot** | Charts/graphs | ✅ ESSENTIAL | Plotly integration |
| **Image** | Logo, service images | 🟡 GOOD TO HAVE | Basic component |
| **Spacer** | Layout spacing | ✅ ESSENTIAL | M3-styled spacing |
| **Google Map** | Location display | 🟡 GOOD TO HAVE | Service location |
| **Canvas** | Custom graphics | ⚪ RARE | Advanced use |

### 🔄 M3 Plotly Integration

**Your Reports/Dashboard:**
```python
import plotly.graph_objects as go

# M3 automatically imports plotly.graph_objects
self.plot_revenue.figure = go.Figure(
  data=[go.Bar(x=dates, y=revenue)],
  layout=go.Layout(
    title="Revenue Trend",
    # Use M3 theme colors
    paper_bgcolor='rgba(0,0,0,0)',
    plot_bgcolor='rgba(0,0,0,0)',
  )
)
```

---

## ❌ COMPONENTS TO AVOID

### 🚫 Anvil Extras Components to Replace

| Anvil Extras Component | M3 Alternative | Reason |
|------------------------|---------------|---------|
| **Tabs** | Use Link + lambda navigation | M3 Links provide better navigation integrated with custom layouts |
| **Pivot** | Custom DataGrid | Not M3 standard |
| **MessagePill** | Text with role | Not M3 pattern |
| **Chip** | Use sparingly | M3 has specific chip types: assist, filter, input, suggestion |
| **Switch** (Extras version) | M3 Switch | Use M3 native Switch |
| **Slider** (Extras version) | M3 Slider | Use M3 native Slider |
| **MultiSelectDropDown** | DropdownMenu + Chips | Not M3 standard |
| **Autocomplete** | DropdownMenu | M3 pattern uses dropdown |
| **Quill** | TextArea | Rich text not core M3 |
| **PageBreak** | Divider | M3 uses Divider |
| **RadioGroup** | RadioGroupPanel | Use M3 native |
| **CheckBoxGroup** | Multiple Checkboxes | Use M3 native |

### 🚫 Legacy Anvil Patterns to Avoid (ADR-002)

| Old Pattern | Mybizz Standard | Reason |
|------------|-----------------|--------|
| `NavigationDrawerLayoutTemplate` | Custom `HtmlTemplate` (AdminLayoutTemplate / CustomerLayoutTemplate) | ADR-002: Mybizz uses custom HtmlTemplate — NavigationDrawerLayoutTemplate is never used |
| `NavigationLink.navigate_to` for sidebar | Plain `Link` + lambda click handler | ADR-002: `navigate_to` requires instantiated Form; lambda resolves at click time |
| NavigationLink components | Plain Link components with `nav_` prefix | ADR-002: Sidebar uses Link components, not NavigationLink |
| Lambda without loop variable capture | `lambda e, fn=form_name, a=attr_name: ...` | ADR-002: Mandatory variable capture prevents closure bug |
| XYPanel for layout | ColumnPanel/LinearPanel/GridPanel | M3 responsive layouts |
| Hardcoded colors | M3 color roles | M3 dynamic theming |
| Generic Label | Text/Heading with typography roles | M3 type scale |

### 🚫 Multi-Vertical Components to Avoid (ADR-009)

| Removed Vertical | Components Removed | Reason |
|------------------|-------------------|--------|
| E-commerce | Product forms, Cart, Orders, Inventory, Easyship, Shipping | ADR-009: Single vertical (C&S only) |
| Hospitality | Room management, Table bookings, Room status | ADR-009: Single vertical (C&S only) |
| Membership | Membership tiers, Subscription access, Recurring billing | ADR-009: Single vertical (C&S only) |

---

## 📋 COMPONENT SELECTION MATRIX (ADR-009: Consulting & Services Only)

### By Form Type

#### **List Forms** (ContactListForm, ServiceListForm, etc.)

| Component | Type | Priority | Notes |
|-----------|------|----------|-------|
| AdminLayout (custom HtmlTemplate) | Layout | ✅ REQUIRED | Rendered inside AdminLayout (ADR-002: not NavigationDrawerLayout) |
| Heading | Typography | ✅ ESSENTIAL | Page title |
| LinearPanel | Container | ✅ ESSENTIAL | Header/filters |
| TextBox (outlined) | Input | ✅ ESSENTIAL | Search |
| DropdownMenu | Input | 🟡 GOOD TO HAVE | Filters |
| Button (filled) | Action | ✅ ESSENTIAL | "New" action |
| DataGrid | Display | ✅ ESSENTIAL | List data |
| IconButton | Action | ✅ ESSENTIAL | Row actions |

#### **Detail Forms** (ContactDetailForm, ServiceDetailForm, etc.)

| Component | Type | Priority | Notes |
|-----------|------|----------|-------|
| AdminLayout (custom HtmlTemplate) | Layout | ✅ REQUIRED | Rendered inside AdminLayout (ADR-002: not NavigationDrawerLayout) |
| Card (elevated) | Container | ✅ ESSENTIAL | Info sections |
| Heading | Typography | ✅ ESSENTIAL | Section headers |
| Text | Typography | ✅ ESSENTIAL | Display values |
| Button (outlined) | Action | ✅ ESSENTIAL | Edit/Delete |
| Divider | Display | ✅ ESSENTIAL | Section separator |

#### **Editor Forms** (ContactEditorForm, ServiceEditorForm, etc.)

| Component | Type | Priority | Notes |
|-----------|------|----------|-------|
| ColumnPanel | Container | ✅ ESSENTIAL | Form layout |
| TextBox (outlined) | Input | ✅ ESSENTIAL | Text fields |
| TextArea (outlined) | Input | ✅ ESSENTIAL | Multi-line |
| DropdownMenu (outlined) | Input | ✅ ESSENTIAL | Selections |
| DatePicker (outlined) | Input | 🟡 GOOD TO HAVE | Dates |
| Checkbox | Input | ✅ ESSENTIAL | Boolean flags |
| FileLoader | Input | 🟡 GOOD TO HAVE | Uploads |
| Button (filled) | Action | ✅ ESSENTIAL | Save |
| Button (outlined) | Action | ✅ ESSENTIAL | Cancel |

#### **Dashboard Forms** (ReportsDashboardForm, etc.)

| Component | Type | Priority | Notes |
|-----------|------|----------|-------|
| AdminLayout (custom HtmlTemplate) | Layout | ✅ REQUIRED | Rendered inside AdminLayout (ADR-002: not NavigationDrawerLayout) |
| Card (elevated) | Container | ✅ ESSENTIAL | Metric cards |
| Heading | Typography | ✅ ESSENTIAL | Card titles |
| Text | Typography | ✅ ESSENTIAL | Metric values |
| Plot | Display | ✅ ESSENTIAL | Charts |
| DataGrid | Display | 🟡 GOOD TO HAVE | Summary table |
| LinearProgressIndicator | Feedback | 🟡 GOOD TO HAVE | Loading |

#### **Authentication Forms** (LoginForm, SignupForm, etc.)

| Component | Type | Priority | Notes |
|-----------|------|----------|-------|
| Custom Form | Layout | ✅ REQUIRED | No navigation |
| Card (outlined) | Container | ✅ ESSENTIAL | Form container |
| Heading | Typography | ✅ ESSENTIAL | Form title |
| TextBox (outlined) | Input | ✅ ESSENTIAL | Email/password |
| Checkbox | Input | 🟡 GOOD TO HAVE | Remember me |
| Button (filled) | Action | ✅ ESSENTIAL | Submit |
| Link | Navigation | 🟡 GOOD TO HAVE | Forgot password |

---

## 🎨 M3 Color & Typography Roles

### Typography Scale (Use These!)

```python
# Display (largest)
self.lbl_hero.role = 'display-large'   # 57sp
self.lbl_hero.role = 'display-medium'  # 45sp
self.lbl_hero.role = 'display-small'   # 36sp

# Headline
self.lbl_page_title.role = 'headline-large'   # 32sp
self.lbl_section.role = 'headline-medium'     # 28sp
self.lbl_card_title.role = 'headline-small'   # 24sp

# Title
self.lbl_list_item.role = 'title-large'   # 22sp
self.lbl_card_header.role = 'title-medium' # 16sp
self.lbl_item.role = 'title-small'        # 14sp

# Body
self.lbl_content.role = 'body-large'   # 16sp
self.lbl_text.role = 'body-medium'     # 14sp
self.lbl_caption.role = 'body-small'   # 12sp

# Label
self.lbl_button.role = 'label-large'   # 14sp
self.lbl_chip.role = 'label-medium'    # 12sp
self.lbl_field.role = 'label-small'    # 11sp
```

### Color Roles (Use These!)

```python
# Set colors using M3 theme colors
self.card.background_color = 'theme:Surface'
self.lbl_text.foreground_color = 'theme:On Surface'

# Primary colors (main actions)
self.btn_save.background_color = 'theme:Primary'
self.btn_save.foreground_color = 'theme:On Primary'

# Secondary colors (less prominent)
self.btn_filter.background_color = 'theme:Secondary'

# Surface colors (cards, containers)
self.card.background_color = 'theme:Surface'
self.card_variant.background_color = 'theme:Surface Variant'

# Error colors (validation)
self.txt_email.role = 'outlined-error'
self.lbl_error.foreground_color = 'theme:Error'
```

---

## 🔄 M3-Specific Usage Patterns

### Pattern 1: Form Validation (M3 Way)

```python
def validate_form(self):
  is_valid = True
  
  # M3 error roles
  if not self.txt_name.text:
    self.txt_name.role = 'outlined-error'
    self.txt_name.placeholder = "Name is required"
    is_valid = False
  else:
    self.txt_name.role = 'outlined'
  
  if not self.txt_email.text or '@' not in self.txt_email.text:
    self.txt_email.role = 'outlined-error'
    self.txt_email.placeholder = "Valid email required"
    is_valid = False
  else:
    self.txt_email.role = 'outlined'
  
  return is_valid
```

### Pattern 2: Navigation Highlighting (ADR-002)

```python
def set_active_link(self, attr_name: str) -> None:
  """Highlight the active sidebar Link component (ADR-002)"""
  for name, link in self._nav_links.items():
      link.bold = (name == attr_name)
      link.foreground = 'theme:Primary' if name == attr_name else 'theme:On Surface'
```

Note: Plain `Link` components are used (not NavigationLink). Active state is set via bold/foreground properties (not NavigationLink.selected which requires NavigationDrawerLayoutTemplate).

### Pattern 3: Loading States (M3 Way)

```python
def save_data(self):
  # Show M3 progress indicator
  self.progress.visible = True
  self.btn_save.enabled = False
  self.btn_save.text = "Saving..."
  
  try:
    anvil.server.call('save_booking', self.item)
    # Success - show notification (consider M3 Snackbar pattern)
    anvil.alert("Booking saved successfully!")
  finally:
    self.progress.visible = False
    self.btn_save.enabled = True
    self.btn_save.text = "Save"
```

### Pattern 4: Responsive Cards (M3 Way)

```python
# Dashboard metrics - use FlowPanel for responsive wrapping
self.flow_metrics = m3.FlowPanel(gap='medium')
self.flow_metrics.add_component(self.card_revenue)
self.flow_metrics.add_component(self.card_bookings)
self.flow_metrics.add_component(self.card_customers)

# Cards automatically wrap on smaller screens
```

---

## 📦 Recommended Component Prefixes (M3-Aligned)

### Essential (Always Use)

| Prefix | Component Types | M3 Status |
|--------|----------------|-----------|
| `col_` | ColumnPanel, CardContentContainer | ✅ M3 Container |
| `lp_` | LinearPanel | ✅ M3 Container |
| `flow_` | FlowPanel | ✅ M3 Container |
| `btn_` | Button, IconButton, ToggleIconButton | ✅ M3 Component |
| `lbl_` | Text, Heading | ✅ M3 Typography |
| `txt_` | TextBox, TextArea | ✅ M3 Input |
| `dd_` | DropdownMenu | ✅ M3 Input |
| `cb_` | Checkbox | ✅ M3 Input |
| `rb_` | RadioButton | ✅ M3 Input |
| `dp_` | DatePicker | ✅ M3 Input |
| `fu_` | FileLoader | ✅ M3 Input |
| `dg_` | Data Grid | ✅ Anvil + M3 styling |
| `rp_` | RepeatingPanel | ✅ Anvil + M3 styling |

### Good to Have (Complex Forms)

| Prefix | Component Types | M3 Status |
|--------|----------------|-----------|
| `card_` | Card (all variants) | ✅ M3 Display |
| `link_` | Link (for hyperlinks, not navigation) | ✅ M3 Navigation |
| `nav_` | Link components (for sidebar navigation via lambda) | ✅ M3 Pattern (ADR-002) |
| `sw_` | Switch | ✅ M3 Input |
| `menu_` | ButtonMenu, IconButtonMenu, AvatarMenu | ✅ M3 Menu |
| `plot_` | Plot | ✅ M3 Integration |

---

## 🚀 Migration Recommendations

### Phase 1: Critical M3 Components (Week 1)

**Install and configure (ADR-002):**
1. ✅ AdminLayout and CustomerLayout with custom HtmlTemplate + `build_navigation()` + lambda pattern
2. ✅ M3 Button hierarchy (filled/outlined/text)
3. ✅ M3 TextBox/TextArea with outlined role
4. ✅ M3 Typography roles (Heading, Text)

### Phase 2: M3 Display Components (Week 2)

**Implement:**
1. ✅ Card components (elevated/outlined)
2. ✅ DataGrid with M3 styling
3. ✅ Progress indicators
4. ✅ Dividers and spacers

### Phase 3: M3 Input Components (Week 3)

**Replace:**
1. ✅ All input components with M3 variants
2. ✅ Implement M3 error roles
3. ✅ Add M3 validation patterns

### Phase 4: M3 Polish (Week 4)

**Enhance:**
1. ✅ Apply M3 color roles consistently
2. ✅ Use M3 typography scale throughout
3. ✅ Add M3 menus (ButtonMenu, AvatarMenu)
4. ✅ Implement responsive patterns

---

## 📚 Key M3 Resources

**Official Material Design 3:**
- Components: https://m3.material.io/components
- Navigation: https://m3.material.io/components/navigation-drawer/guidelines
- Typography: https://m3.material.io/styles/typography
- Color: https://m3.material.io/styles/color

**Anvil M3 Theme:**
- Documentation: https://anvil.works/docs/ui/app-themes/material-3
- Layouts: https://anvil.works/docs/ui/app-themes/material-3/layouts
- Blog: https://anvil.works/blog/introducing-material-3
- Tutorial: https://anvil.works/learn/tutorials/using-material-3

**Mybizz ADR:**
- [ADR-002: Navigation Standard — Lambda/Link/open_form](../adr/02-navigation-lambda-link-open-form.md)
- [ADR-009: Multi-Vertical to Single Vertical Conversion](../adr/09-multi-vertical-to-single-vertical-conversion.md)

**Anvil Community:**
- Forum: https://anvil.works/forum
- Theme Updates: https://github.com/anvil-works/material-3-theme

---

## ✅ Compliance Checklist

### Navigation (ADR-002)
- [ ] AdminLayout and CustomerLayout use custom HtmlTemplate (NOT NavigationDrawerLayoutTemplate)
- [ ] All sidebar nav links are plain `Link` components created programmatically in `build_navigation()`
- [ ] Lambda click handlers use loop variable capture: `lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a)`
- [ ] `navigate_to` is NOT used anywhere in sidebar navigation
- [ ] Parameterised navigation (row clicks, detail forms) uses `open_form()` directly
- [ ] NavigationLink is NOT used for sidebar navigation (plain Link only)

### Single Vertical (ADR-009)
- [ ] No E-commerce components (products, orders, cart, shipping)
- [ ] No Hospitality components (room management, table bookings)
- [ ] No Membership components (subscription, tiers, recurring billing)
- [ ] All navigation aligned to Consulting & Services only
- [ ] Database schema verified for C&S only (bookings, services, contacts, CRM)

### Typography
- [ ] Using Text/Heading components (not generic Labels)
- [ ] Applied M3 typography roles (headline-*, body-*, etc.)
- [ ] Consistent type scale across application

### Buttons
- [ ] Using M3 Button hierarchy (filled > outlined > text)
- [ ] Primary actions use filled buttons
- [ ] Secondary actions use outlined buttons
- [ ] Icon buttons for icon-only actions

### Inputs
- [ ] Using outlined role for dense forms
- [ ] Implemented M3 error roles (outlined-error)
- [ ] Using M3 native Switch/Slider (not Anvil Extras)

### Cards
- [ ] Using M3 Card variants (elevated/filled/outlined)
- [ ] Cards contain appropriate content hierarchy

### Colors
- [ ] Using M3 theme color roles (theme:Primary, etc.)
- [ ] No hardcoded colors
- [ ] Consistent color usage across app

### Containers
- [ ] Using ColumnPanel/LinearPanel/FlowPanel for layout
- [ ] Not using XYPanel for primary layouts
- [ ] Responsive design with FlowPanel

---

## 🎯 Summary

### Core M3 Components for Mybizz (40+ Forms, C&S Only per ADR-009)

**MUST USE (16 components):**
1. Custom HtmlTemplate layout (AdminLayoutTemplate / CustomerLayoutTemplate) with `build_navigation()` + lambda (ADR-002)
2. Button (filled/outlined/text)
3. IconButton
4. Text
5. Heading
6. TextBox (outlined)
7. TextArea (outlined)
8. DropdownMenu (outlined)
9. Checkbox
10. RadioButton
11. DatePicker
12. FileLoader
13. Card (elevated/outlined)
14. ColumnPanel
15. LinearPanel
16. FlowPanel

**SHOULD USE (10 components):**
17. DataGrid
18. RepeatingPanel
19. Switch
20. RadioGroupPanel
21. ButtonMenu
22. IconButtonMenu
23. AvatarMenu
24. MenuItem
25. Divider
26. Plot

**RARELY USE (8 components):**
27. ToggleIconButton
28. LinearProgressIndicator
29. CircularProgressIndicator
30. Slider
31. Avatar
32. GridPanel
33. Image
34. Spacer

**AVOID (14+ components):**
❌ Anvil Extras: Tabs, Pivot, MessagePill, Chip (unless M3-specific), Quill, MultiSelectDropDown, Autocomplete, PageBreak, etc.
❌ Legacy patterns: NavigationDrawerLayoutTemplate, NavigationLink for sidebar, navigate_to, XYPanel for layout (ADR-002)
❌ Multi-vertical: Products, Orders, Rooms, Membership, Shipping (ADR-009: C&S only)

---

**Status:** ✅ READY FOR IMPLEMENTATION  
**Vertical Scope (ADR-009):** Consulting & Services only. E-commerce, Hospitality, and Membership verticals permanently removed.  
**Navigation Ruling (ADR-002):** Plain Link components with lambda click handlers: `lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a)`. Use `open_form(string)`. NavigationDrawerLayoutTemplate and `navigate_to` are NEVER used in Mybizz.  
**Compliance:** 100% Material Design 3 principles + ADR-002 Navigation Standard + ADR-009 Single Vertical
