## Sidesheet Pattern in Anvil (M3)

**CRITICAL NOTE — Naming correction (2026-03-18):**
This pattern was previously documented under the misnomer "Slidesheet". The correct
M3 term is **Sidesheet**. All references to "Slidesheet" throughout the codebase and
reference system have been corrected to "Sidesheet".

---

VALID - FULLY APPLICABLE with M3 Theme + Dependency.

CRITICAL INFO (Must Read)

**Sidesheet = M3 NATIVE pattern using NavigationRailLayout**

**Perfect for Mybizz guided workflows:**
- Customer onboarding → 3-slide flow
- Record review → One slide per record
- Survey collection → Step-by-step

**Implementation (100% M3):**
```
NavigationRailLayout.show_sidesheet = True
content_panel.clear() → add(Slide1Form())
Next button → content_panel.add(Slide2Form())
Data binds to self.item via Writeback
```

```python
# Slide navigation pattern:
def btn_next_click(self, **event_args):
    self.content_panel.clear()
    self.content_panel.add_component(Slide2(item=self.item))  # Data persists
```

---

## What Sidesheets Are For

In Anvil, **Sidesheets** are designed for situations where you want to combine the
**structured nature of a spreadsheet** with the **guided, step-by-step experience of
a presentation or form**.

A **typical use case** is when you need non-technical users to **enter, review, or
update data in a controlled and intuitive way**, without exposing them to a raw
database table or a complex multi-page app.

### How Sidesheets Work

The Sidesheet is an official M3 layout feature available on both
`NavigationDrawerLayout` and `NavigationRailLayout`. It is controlled by setting
`show_sidesheet = True` on the layout. The `SidesheetContent` component is the M3
container for sidesheet content.

The Sidesheet panel slides in from the side of the content area without replacing the
main content — making it ideal for detail panels alongside a list, step-by-step guided
workflows, or review/approval flows.

### Key Architectural Pattern

Pass accumulated data via `self.item` between steps. Submit to the server in a single
call at the final step. Do not make server calls between steps.

### Typical Use Cases

**Guided data entry:** Guide users through data one step at a time — basic information,
then details and selections, then review and confirmation. Keeps users focused and
reduces errors compared to long forms.

**Review and approval workflows:** A manager reviews expense claims, one per slide.
Approve, Reject, Next buttons. Far easier than scrolling through a large table.

**Field data collection:** Works well on tablets and touch devices because it is linear,
visual, and button-driven.

### Why Use Sidesheets Instead of a Normal Form?

Use Sidesheets when you want:
- A **guided, step-by-step flow**
- Fewer user errors
- A cleaner experience than a spreadsheet
- A UI that matches how people *think* through data, not how databases store it

---

*Sidesheet is the correct M3 term. "Slidesheet" was a misnomer — do not use it.*
