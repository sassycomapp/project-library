# 02 — Navigation Standard: Lambda/Link/open_form
Date: 2026-03-18
Status: Accepted
Source: Devlog #29 — task-navigation-ruling-propagation

---

## Context

The original Anvil navigation approach used `NavigationDrawerLayoutTemplate` with
`NavigationLink` components and `navigate_to()`. During development it was established
that this pattern does not suit the Mybizz architecture. `navigate_to` requires an
instantiated Form object and only functions inside `NavigationDrawerLayoutTemplate`.
Neither condition is compatible with Mybizz's custom layout approach.

A ruling was made (session prior to devlog #29) and propagated across all affected
files in devlog #29.

---

## Decision

**Sidebar navigation** in AdminLayout and CustomerLayout uses:
- Custom `HtmlTemplate` layouts — not `NavigationDrawerLayoutTemplate`
- Plain `Link` components in the sidebar — not `NavigationLink`
- Lambda click handlers with **mandatory loop variable capture**:

```python
lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a)
```

The `fn=` and `a=` keyword arguments in the lambda are not optional. Omitting them
causes all nav items to capture the last value of the loop variable — a silent bug.

**Parameterised navigation** (row clicks, detail forms with IDs) uses `open_form()`
called directly:

```python
open_form('BookingViewerForm', booking_id=row['booking_id'])
```

**`navigate_to` is never used.** It is not compatible with the Mybizz layout model.
**`NavigationDrawerLayoutTemplate` is not used.** Custom HtmlTemplate is the standard.
**`NavigationLink` is not used for navigation.** The `nav_` prefix in component naming
refers to Link components styled for sidebar use — not NavigationLink components.

---

## Consequences

### Rules files requiring verification during refactor

All files below must be checked during their refactor task to confirm the ruling is
correctly applied. Do not blindly reapply — verify first, then correct only what is wrong.

| File | Note |
|---|---|
| `spec_ui_standards.md` | §1 rewritten in devlog #29 — verify correct |
| `spec_ui_standards_forms.md` | Corrected in devlog #29 — verify correct |
| `ref_anvil_navigation.md` | Corrected in devlog #29 — verify correct |
| `policy_development.md` | Corrected in devlog #29 — verify correct |
| `platform_overview.md` | §5.3 — verify nav ruling applied |
| `spec_architecture.md` | Navigation section — verify nav ruling applied |
| `platform_docmap.md` | §2 critical facts — verify nav ruling applied |

### Files already confirmed correct (devlog #29)
The backup versions of `ref_anvil_navigation.md`, `spec_ui_standards.md`,
`spec_ui_standards_forms.md`, `policy_development.md`, and `platform_docmap.md` were
all corrected in devlog #29. The refactor task is to verify the ruling survived the
refactor process — not to reapply it from scratch.

---

*End of ADR-002*
