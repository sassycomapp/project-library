Anvil Methods - Technical Reference Index (M3 Edition)
Last Updated: January 26, 2026
Purpose: Index of M3-compliant Anvil-specific patterns, methods, and technical discoveries

Overview
This folder contains M3 Theme + Routing dependency ONLY technical reference documentation for Anvil Works. Captures 100% M3-compliant patterns for Mybizz development.

Dependencies LOCKED:

✅ Material 3 Theme (built-in)

✅ M3 Dependency (installed)

✅ Routing: 3PIDO5P3H4VPEMPL

❌ NO Anvil Extras - EVER

Active Technical References
📦 Structure & Organization
Document	Purpose	Last Updated
anvil_packages_namespaces.md	Anvil packages as Python namespaces; M3 folder patterns	Jan 3, 2026
Mybizz_core_scaffolding.md	Current Mybizz_core M3 structure	Jan 14, 2026
m3_mandatory_patterns.md	NEW Entries 1-20,63-72 validated M3 patterns	Jan 26, 2026
🔀 M3 Navigation & Routing
Document	Purpose	Last Updated
ops_anvil_routing.md	M3 custom HtmlTemplate layout + Link component patterns (ADR-002)	Jan 26, 2026
set3-anvil-cop-m3-navigation-routing.md	M3 Link + lambda handler navigation standard (ADR-002 compliant)	Mar 18, 2026
When to Add New M3 Methods Documents
Add when:

✅ M3-specific Anvil pattern discovered

✅ Official docs unclear for M3 components

✅ Pattern used across multiple M3 forms

✅ M3 NavigationRailLayout/StandardPage best practice

NEVER add:

❌ Anvil Extras patterns

❌ Custom layout patterns

❌ Non-M3 component usage

❌ General Python (not Anvil/M3 specific)

Document Categories
1. M3 Structure & Layouts
NavigationRailLayout patterns

StandardPageTemplate slots

content_panel navigation

2. M3 Data Binding
self.item + Writeback (Entries 64-65,68-72)

refresh_data_bindings patterns

3. M3 Navigation
Link components with lambda click handlers — MANDATORY variable capture: `lambda e, fn=form_name, a=attr_name:` (ADR-002)

set_active_link() for active state highlighting

open_form() for parameterised navigation with IDs

4. M3 Components
AvatarMenu, ButtonMenu patterns

Role usage (Entry 15)

Error states (Entry 20)

Quick Reference
Question	Answer
"Default layout?"	Custom HtmlTemplate (AdminLayoutTemplate / CustomerLayoutTemplate)
"Form data binding?"	self.item + Writeback ON (Entry 65)
"Navigation highlighting?"	set_active_link() — bold/foreground on plain Link components
"User menu?"	AvatarMenu(user_name="Name")
"Multi-select workaround?"	DropdownRow + CheckBoxList popup
"Dependencies?"	M3 + Routing ONLY
M3 Compliance Checklist
text
✅ Custom HtmlTemplate layout (AdminLayoutTemplate / CustomerLayoutTemplate) — NOT NavigationDrawerLayoutTemplate
✅ Plain Link components ONLY for sidebar navigation — NOT NavigationLink (ADR-002)
✅ Lambda handlers with MANDATORY variable capture: `lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a)`
✅ Parameterised navigation via `open_form('FormName', param=value)` — NOT navigate_to
✅ self.item Writeback (Entry 65)
✅ NO Anvil Extras dependencies
✅ Routing: 3PIDO5P3H4VPEMPL
Contributing New Documents
M3 Template
text
# [M3 Pattern Name]

**M3 Compliant:** ✅ YES  
**Dependencies:** M3 Theme + Routing ONLY  
**Replaces:** [Custom/Extras pattern]

## M3 Pattern
[NavigationRailLayout/StandardPage pattern]

## Code Example
```python
# 100% M3 code
Used In Mybizz
[Forms using this pattern]

text

***

**This is your M3 Technical Bible. All patterns MUST pass M3 validation and ADR-002 navigation ruling compliance.**