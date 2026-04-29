# Anvil Material 3 Compliance Code of Practice

**Version**: 1.1  
**Date**: March 22, 2026  
**Purpose**: Enforce full M3 compliance in MyBizz app development  
**Authority**: [Anvil M3 Documentation](https://anvil.works/docs/ui/app-themes/material-3)

---

## 1. M3 Dependency & Setup

### 1.1 Required Configuration
- **Dependency ID**: `4UK6WHQ6UX7AKELK` (Settings → Dependencies → Third Party)
- **Import statement**: Auto-added by theme: `import m3.components as m3`
- **Theme compatibility**: Do NOT mix with legacy Anvil themes (CSS conflicts)

### 1.2 Version Control
- Track M3 theme version in project documentation
- Monitor [M3 changelog](https://github.com/anvil-works/material-3-theme/blob/master/CHANGELOG.md) for breaking changes
- Test after theme version updates

---

## 2. Layouts

### 2.1 Mybizz Layout Decision
**AdminLayout and CustomerLayout** use a custom `HtmlTemplate` layout (`@theme:standard-page.html`),
not `NavigationDrawerLayout` or `NavigationRailLayout`. All sidebar navigation is
built programmatically using plain `Link` components with lambda click handlers.

`NavigationDrawerLayout` and `NavigationRailLayout` are the M3 pre-built layout options.
They are not used in Mybizz — the custom HtmlTemplate layout was chosen for full control
over the sidebar structure, role-based visibility, and the group label dividers.

**Sidesheet / step-by-step workflows:** Both M3 layouts support a `show_sidesheet` property.
Use `NavigationRailLayout` with `self.layout.show_sidesheet = True` for linear step-by-step
guided workflows. This is a separate use case, not sidebar nav.

### 2.2 Layout Implementation Standards
```python
# ✅ CORRECT — Mybizz standard: custom HtmlTemplate layout with lambda navigation
class AdminLayout(AdminLayoutTemplate):  # custom HtmlTemplate, not NavigationDrawerLayout
    def build_navigation(self):
        for attr_name, label, icon, form_name in _NAV_STRUCTURE:
            nav_link = Link(text=label, icon=icon)
            nav_link.set_event_handler(
                'click',
                lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a),
            )
            setattr(self, attr_name, nav_link)
            self.sidebar_panel.add_component(nav_link)

# ❌ INCORRECT: navigate_to requires a Form instance and only works inside
#               NavigationDrawerLayout or NavigationRailLayout, not in Mybizz layouts
class AdminLayout(NavigationDrawerLayout):
    def build_navigation(self):
        self.nav_dashboard.navigate_to = 'DashboardForm'  # strings not accepted
        self.nav_dashboard.navigate_to = DashboardForm()  # only works in M3 layout templates
```

### 2.3 Link Components in Mybizz Navigation
Mybizz does NOT use NavigationLink. Plain `Link` components with lambda click handlers are the standard:
- **Click handler**: MUST use `set_event_handler('click', lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a))`
- **Variable capture**: `fn=` and `a=` keyword arguments are MANDATORY in loops — omitting them causes all nav items to resolve to the last loop value
- **text**: Link label/destination name
- **icon**: Material icon name
- **visible**: Control with feature flags
- **Properties NOT used**: `navigate_to`, `badge`, `badge_count` (NavigationLink properties only; not used in Mybizz custom HtmlTemplate layouts)

### 2.4 Responsive Behaviour
- `NavigationDrawerLayout` always collapses into a modal drawer on smaller screens
- `NavigationRailLayout` can collapse to a modal drawer or an app bar on smaller screens, controlled via `navigation_rail_collapse_to` property
- Test all breakpoints during development

---

## 3. Component Standards

### 3.1 Typography Components

**Text Component** (body text, labels):
```python
# ✅ USE Text for content and labels
self.lbl_description = m3.Text(
    text="Enter customer details",
    style="label",    # 'body' or 'label'
    scale="medium"    # 'small', 'medium', 'large'
)
```

**Heading Component** (titles, headers):
```python
# ✅ USE Heading for page/section titles
self.lbl_page_title = m3.Heading(
    text="Customer Management",
    style="headline",  # 'display', 'headline', 'title'
    scale="large"      # 'small', 'medium', 'large'
)
```

**Typography Role Reference**:
| Use Case | Component | Style | Scale |
|----------|-----------|-------|-------|
| Page title | Heading | headline | large |
| Section header | Heading | headline | small |
| Card title | Heading | title | medium |
| Body text | Text | body | medium |
| Field label | Text | label | medium |
| Caption | Text | body | small |

**❌ NEVER**: Use legacy `Label` component in M3 apps

### 3.2 Form Input Components

**TextBox & TextArea**:
```python
# ✅ ALWAYS use appearance='outlined' for form fields
self.txt_name = m3.TextBox(
    appearance='outlined',
    label_text='Customer Name',
    placeholder='Enter name'
)

# Error state — use the error property, not an appearance variant
if not valid:
    self.txt_email.error = True
    self.txt_email.supporting_text = "Email required"
else:
    self.txt_email.error = False
    self.txt_email.supporting_text = ""
```

**DropdownMenu**:
```python
# ✅ Use appearance='outlined' for consistency
self.dd_status = m3.DropdownMenu(
    appearance='outlined',
    label_text='Status',
    items=[('Active', 'active'), ('Inactive', 'inactive')]
)
```

**Other Form Components**:
- **Checkbox**: Use for boolean options; supports indeterminate state via `allow_indeterminate=True, checked=None`
- **RadioButton**: Use inside `RadioGroupPanel` for single choice from a group
- **Switch**: Use for feature toggles and settings; boolean state via `selected` property
- **DatePicker**: Use `appearance='outlined'`
- **Slider**: Set `min`, `max`, `step`, `value` properties; `show_label` and `show_markers` for display options
- **FileLoader**: Use `appearance` property; five pre-defined options same as Button

### 3.3 Button Hierarchy

**Visual Hierarchy** (importance descending):
1. **Filled**: Primary action (1 per screen recommended)
2. **Outlined**: Secondary actions
3. **Text**: Tertiary/low-emphasis actions

```python
# ✅ CORRECT button hierarchy using the appearance property
self.btn_save = m3.Button(
    text="Save",
    appearance="filled"       # Primary action
)

self.btn_cancel = m3.Button(
    text="Cancel",
    appearance="outlined"     # Secondary action
)

self.btn_details = m3.Button(
    text="View Details",
    appearance="text"         # Tertiary action
)
```

**IconButton & ToggleIconButton**:
```python
# ✅ Use for icon-only actions; set appearance from four pre-defined options
self.btn_edit = m3.IconButton(
    icon='edit',
    appearance='standard'     # 'standard', 'outlined', 'filled', 'tonal'
)

self.btn_favorite = m3.ToggleIconButton(
    icon='favorite',
    appearance='standard'     # same appearance options as IconButton
)
```

**ButtonMenu & IconButtonMenu**:
```python
# ✅ Use for action menus; populate via menu_items property
self.menu_actions = m3.IconButtonMenu(
    icon='more_vert'
)

menu_item_1 = m3.MenuItem(text="Edit", leading_icon="edit")
menu_item_2 = m3.MenuItem(text="Delete", leading_icon="delete")
self.menu_actions.menu_items = [menu_item_1, menu_item_2]
```

### 3.4 Display Components

**Card**:
```python
# ✅ Use cards for content grouping
# appearance options: 'elevated', 'filled', 'outlined'
self.card_details = m3.Card(
    appearance='outlined',
    spacing_above='small',
    spacing_below='small'
)
```

**InteractiveCard**:
- Use when the entire card should be clickable
- Has `click` event and `enabled` property
- Same appearance options as Card: `elevated`, `filled`, `outlined`

**Avatar**:
- Displays user image, initials (from `user_name`), or fallback icon
- Appearance options: `filled`, `tonal`, `outlined`

**Divider**:
- `type` property: `full-width` for separating large sections; `inset` for separating items within a section

### 3.5 Feedback Components

**Progress Indicators**:
```python
# LinearProgressIndicator — use type property, not a boolean
self.progress = m3.LinearProgressIndicator(
    type="determinate",
    progress=50    # integer representing percentage (0–100)
)

# Indeterminate — loops automatically
self.progress_indeterminate = m3.LinearProgressIndicator(
    type="indeterminate"
)

# CircularProgressIndicator — same type/progress API
self.spinner = m3.CircularProgressIndicator(
    type="indeterminate"
)

self.spinner_determinate = m3.CircularProgressIndicator(
    type="determinate",
    progress=75
)
```

---

## 4. Color System

### 4.1 Theme Colors (Required)
**ALWAYS use theme colors** for consistency and theme switching support:

```python
# ✅ CORRECT: Use theme color references
self.card.background_color = 'theme:Surface'
self.card.foreground_color = 'theme:On Surface'
self.btn_primary.background_color = 'theme:Primary'
self.btn_primary.foreground_color = 'theme:On Primary'
```

**Available Theme Colors**:
- `theme:Primary` / `theme:On Primary`
- `theme:Secondary` / `theme:On Secondary`
- `theme:Tertiary` / `theme:On Tertiary`
- `theme:Surface` / `theme:On Surface`
- `theme:Surface Variant` / `theme:On Surface Variant`
- `theme:Error` / `theme:On Error`
- `theme:Background` / `theme:On Background`

**❌ NEVER**: Hardcode color values (`#FFFFFF`, `rgb(255,255,255)`)

### 4.2 Custom Color Schemes
- Use [Google Material Theme Builder](https://material-foundation.github.io/material-theme-builder/) for custom schemes
- Export color scheme and apply in Anvil Color Scheme editor
- Test both light and dark mode variants
- Reference: [Anvil M3 Color Scheme Guide](https://anvil.works/docs/how-to/creating-material-3-colour-scheme)

---

## 5. Container Components

### 5.1 M3-Compatible Containers
**ColumnPanel**: Vertical stacking (primary layout tool)
**LinearPanel**: Horizontal arrangement
**FlowPanel**: Responsive wrapping layout
**GridPanel**: Not M3-specific but compatible
**Card**: Content grouping (M3-specific)

### 5.2 Layout Patterns

**List Form Layout**:
```python
# Structure: ColumnPanel > Header > Filters > DataGrid
col_content (ColumnPanel)
├─ lp_header (LinearPanel)
│  ├─ lbl_title (Heading - headline/large)
│  ├─ spacer
│  └─ btn_new (Button - appearance='filled')
├─ lp_filters (LinearPanel)
│  ├─ txt_search (TextBox - appearance='outlined')
│  └─ dd_status (DropdownMenu - appearance='outlined')
└─ dg_data (DataGrid)
```

**Editor Form Layout**:
```python
# Structure: ColumnPanel > Card(s) > Actions
col_form (ColumnPanel)
├─ card_main (Card - appearance='outlined')
│  ├─ lbl_section (Heading - headline/small)
│  ├─ txt_field1 (TextBox - appearance='outlined')
│  ├─ txt_field2 (TextBox - appearance='outlined')
│  └─ txt_notes (TextArea - appearance='outlined')
└─ lp_actions (LinearPanel)
   ├─ btn_save (Button - appearance='filled')
   └─ btn_cancel (Button - appearance='outlined')
```

### 5.3 Spacing & Alignment
- Use M3 spacing properties: `spacing_above`, `spacing_below`
- Values: `'none'`, `'small'`, `'medium'`, `'large'`
- Set on individual components for consistency

---

## 6. Prohibited Components & Patterns

### 6.1 DO NOT Use Anvil Extras Components
**Prohibited** (M3 alternatives exist):
- ~~Tabs~~ → Use NavigationLink in sidebar
- ~~Pivot~~ → Use custom DataGrid views
- ~~MultiSelectDropDown~~ → Use DropdownMenu + Chips
- ~~Autocomplete~~ → Use DropdownMenu with search
- ~~Quill~~ → Use TextArea
- ~~Switch (Extras)~~ → Use M3 Switch
- ~~Slider (Extras)~~ → Use M3 Slider
- ~~RadioGroup (Extras)~~ → Use M3 RadioGroupPanel
- ~~CheckBoxGroup (Extras)~~ → Use multiple M3 Checkboxes

### 6.2 DO NOT Use These Patterns
**Prohibited**:
- ~~NavigationLink components in Mybizz sidebar~~ → Use plain Link components with lambda handlers (ADR-002)
- ~~`navigate_to` property in Mybizz layouts~~ → Use lambda + `self._nav_click(fn, a)` (custom HtmlTemplate layout)
- ~~NavigationDrawerLayout for AdminLayout/CustomerLayout~~ → Custom HtmlTemplate layout is the standard
- ~~Lambda without variable capture~~ → Always use `lambda e, fn=form_name, a=attr_name:` in loops to prevent silent variable capture bugs
- ~~XYPanel for layout~~ → Use ColumnPanel/LinearPanel
- ~~Hardcoded colors~~ → Use `theme:` colors
- ~~Generic Label components~~ → Use Text/Heading with proper styles
- ~~`role=` on buttons, inputs, or cards~~ → Use `appearance=` (the correct API property)
- ~~`indeterminate=True/False` on progress indicators~~ → Use `type="indeterminate"` or `type="determinate"`
- ~~`label=` on TextBox/TextArea/DropdownMenu~~ → Use `label_text=`

---

## 7. Naming Conventions (MyBizz Standard)

### 7.1 Component Prefixes
**MUST follow** nomenclature standard (`05_nomenclature.md`):

| Component Type | Prefix | Example |
|----------------|--------|---------|
| Link (sidebar nav) | `nav_` | `nav_dashboard` |
| Button | `btn_` | `btn_save` |
| IconButton | `btn_` | `btn_edit` |
| Text | `lbl_` | `lbl_description` |
| Heading | `lbl_` | `lbl_page_title` |
| TextBox | `txt_` | `txt_customer_name` |
| TextArea | `txt_` | `txt_notes` |
| DropdownMenu | `dd_` | `dd_status` |
| Checkbox | `cb_` | `cb_active` |
| RadioButton | `rb_` | `rb_option1` |
| Switch | `sw_` | `sw_enabled` |
| DatePicker | `dp_` | `dp_booking_date` |
| FileLoader | `fu_` | `fu_upload` |
| Card | `card_` | `card_details` |
| ColumnPanel | `col_` | `col_content` |
| LinearPanel | `lp_` | `lp_header` |
| FlowPanel | `flow_` | `flow_items` |
| DataGrid | `dg_` | `dg_customers` |
| RepeatingPanel | `rp_` | `rp_items` |
| ButtonMenu | `menu_` | `menu_actions` |
| Plot | `plot_` | `plot_revenue` |

---

## 8. Testing & Validation

### 8.1 M3 Compliance Checklist
Before deploying any form:
- [ ] AdminLayout/CustomerLayout: Link components with lambda handlers, NOT NavigationLink or `navigate_to`
- [ ] Lambda handlers use explicit variable capture: `lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a)`
- [ ] All text uses Text or Heading components (no Label)
- [ ] All form inputs use `appearance='outlined'`
- [ ] Button hierarchy correctly applied (filled > outlined > text) using `appearance=`
- [ ] All colors use `theme:` references
- [ ] No Anvil Extras components where M3 alternatives exist
- [ ] No NavigationLink components in custom HtmlTemplate layouts (use Link with lambda handlers)
- [ ] Component naming follows MyBizz conventions
- [ ] Error states use the `error=True` property on input components, plus `supporting_text`
- [ ] Progress indicators use `type="determinate"` or `type="indeterminate"`, not boolean `indeterminate`
- [ ] All TextBox/TextArea/DropdownMenu labels use `label_text=`, not `label=`
- [ ] Responsive behaviour tested (desktop, tablet, mobile)

### 8.2 Local Testing Protocol
1. Test via Anvil Uplink (local runtime)
2. Verify all M3 components render correctly
3. Test navigation flow (all sidebar Link handlers functional with variable capture)
4. Test responsive breakpoints
5. Verify theme color consistency
6. Test error state handling

### 8.3 Deployment Testing
1. Push to GitHub
2. Test in Anvil.works deployed app
3. Verify no styling conflicts
4. Test on target devices/browsers
5. Remediate if issues found, iterate

---

## 9. Documentation Requirements

### 9.1 Form-Level Documentation
Each form must document:
- Layout type used (custom HtmlTemplate, NavigationDrawerLayout, or NavigationRailLayout)
- Navigation destinations (if layout form)
- Key user flows
- Feature flag dependencies
- M3 component choices and rationale

### 9.2 Component Customisation
Document any:
- Custom appearance values applied
- Theme color overrides
- Non-standard layout patterns
- Workarounds for M3 limitations

---

## 10. Migration from Legacy Themes

### 10.1 Phased Migration Approach
1. **Phase 1**: Add M3 dependency, create new layout templates
2. **Phase 2**: Migrate high-traffic forms first
3. **Phase 3**: Update remaining forms
4. **Phase 4**: Remove legacy theme dependency

### 10.2 Component Mapping
| Legacy Component | M3 Replacement | Key Change |
|-----------------|----------------|------------|
| Label | Text or Heading | Set `style` and `scale` properties |
| Link | NavigationLink | Use plain Link with `set_event_handler('click', lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a))` in Mybizz layouts |
| Button | Button | Set `appearance`: `filled`/`outlined`/`text` |
| TextBox | TextBox | Set `appearance='outlined'`; use `label_text=` not `label=` |
| TextArea | TextArea | Set `appearance='outlined'`; use `label_text=` not `label=` |
| DropDown | DropdownMenu | Set `appearance='outlined'`; use `label_text=` not `label=` |
| DatePicker | DatePicker | Set `appearance='outlined'` |
| FileLoader | FileLoader | Set `appearance` to desired option |

---

## 11. Common Pitfalls & Solutions

### 11.1 Sidebar Link Not Navigating
**Problem**: Clicking a nav Link does nothing  
**Solution**: Ensure `set_event_handler('click', lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a))` is called on the link. Check that loop variable capture (`fn=form_name`) is present — without it, all links resolve to the last form in the loop.

### 11.2 Forms Not Rendering in Layout
**Problem**: Content appears behind/beside navigation  
**Solution**: Add content to the correct layout slot (content slot, not navigation slot)

### 11.3 Colors Not Updating
**Problem**: Theme colors don't change when scheme is updated  
**Solution**: Use `theme:` prefix; avoid hardcoded values; ensure M3 theme is up to date

### 11.4 Input Fields Look Wrong
**Problem**: TextBox/DropdownMenu styling incorrect  
**Solution**: Set `appearance='outlined'` on all form input components — not `role=`

### 11.5 TypeError on `role=` Property
**Problem**: Setting `role='filled-button'` or `role='outlined'` on a Button or TextBox raises an error or has no effect  
**Solution**: The correct property is `appearance`, not `role`. Valid Button values: `filled`, `outlined`, `text`. Valid TextBox/TextArea/DropdownMenu values: `filled`, `outlined`.

### 11.6 Error State Not Showing on TextBox
**Problem**: Setting `role='outlined-error'` has no effect  
**Solution**: There is no `outlined-error` appearance. Set `error=True` on the component, and use `supporting_text` to display a message below the field.

### 11.7 Progress Indicator Not Animating
**Problem**: `indeterminate=True` has no effect  
**Solution**: The correct API is `type="indeterminate"` (string), not a boolean property. For determinate state: `type="determinate"`, `progress=50` (integer percentage).

### 11.8 Typography Doesn't Match M3
**Problem**: Text appearance inconsistent  
**Solution**: Use Text/Heading components with proper `style`/`scale` properties, not Label

---

## 12. Resources & References

### 12.1 Official Documentation
- [Anvil M3 Theme Overview](https://anvil.works/docs/ui/app-themes/material-3)
- [M3 Components Reference](https://anvil.works/docs/ui/app-themes/material-3/components)
- [M3 Layouts Reference](https://anvil.works/docs/ui/app-themes/material-3/layouts)
- [Google Material 3 Guidelines](https://m3.material.io/)
- [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/)

### 12.2 Example Apps
- [Virtual Plant Shop](https://anvil.works/blog/introducing-material-3) (NavigationRailLayout)
- [Expense Approval](https://anvil.works/blog/introducing-material-3) (NavigationDrawerLayout)
- [Task Manager](https://anvil.works/blog/introducing-material-3) (ButtonMenu, NavigationDrawer)

### 12.3 Community Support
- [Anvil Community Forum](https://anvil.works/forum)
- [M3 Theme GitHub](https://github.com/anvil-works/material-3-theme)
- [M3 Changelog](https://github.com/anvil-works/material-3-theme/blob/master/CHANGELOG.md)

---

**Compliance Status**: MANDATORY  
**Review Frequency**: Quarterly or on M3 theme major version updates  
**Owner**: MyBizz Development Team
