# Anvil Designer Gotchas
Created at: 2026-03-15 06:15
Updated at: 2026-03-15 06:15

Discovered quirks and surprises. Things that look one way but behave another.
Not general Anvil knowledge — only things that cost time to discover.

---

## Properties That Look Like Designer But Must Be Set in Code

### LinearPanel orientation
`orientation` cannot be set in the Designer Properties Panel at all.
Must be set in code:
```python
self.lp_tab_bar.orientation = 'horizontal'
```
Add a comment in code explaining this is intentional — not a lazy omission.
David builds in the Designer himself and will otherwise wonder why it isn't in properties.

---

## Properties That Look Like Code But Must Be Set in Designer

### TextBox outlined style
Set via the `appearance` property in the Designer Properties Panel.
NOT via `role`. Outlined/filled are role-based on M3 buttons — TextBox is different.
Natural wrong assumption coming from button patterns.

### TextBox password masking
Set via `hide_text = True` in the Designer Properties Panel.
NOT via `type = 'password'`. There is no `type` property on Anvil TextBox.
Natural wrong assumption coming from web development.

---

## Designer Behaviour That Looks Wrong But Is Correct

### CardContentContainer auto-creation
When you add a Card in Designer, Anvil automatically creates a CardContentContainer
inside it. This is expected. Do not try to remove it or work around it.
Place all card content inside the CardContentContainer.

---

## Patterns That Cause Problems

### Data bindings on settings/config forms
Do NOT use Anvil data bindings (`self.item` write-back) on forms that manage
their own read/write explicitly. SettingsForm reads all values on load and writes
them on save via direct server calls. Data bindings fight with this pattern.
Applies to any form that does its own server calls for load and save.

### Stray event handlers from Designer
The Designer sometimes generates a stray event handler stub in `__init__.py`
when you interact with components during a build. These stubs have no body
and will cause errors.
Always check `__init__.py` for stray handlers before Task 3. Delete them in the rewrite.
Known instance: `@handle("txt_paypal_sk", "pressed_enter")` in SettingsForm.

### DropdownMenu items
Leave empty in Designer. Set in code.
Setting them in Designer creates maintenance pain and doesn't work well with
dynamic lists.

---

## YAML Verification

David verifies Designer builds by uploading `form_template.yaml`.
When verifying:
- Read the entire YAML before responding
- Verify component by component — names, types, visible flags, nesting
- Give explicit pass/fail per named component — not general reassurance
- The YAML is the source of truth for what is actually in the Designer
