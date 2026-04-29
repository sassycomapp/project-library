# Code of Practice: Front Matter for Continue.dev Rules Files

> **Audience:** Claude, when drafting `.md` rule files for a Continue.dev workspace.  
> **Authority:** Verified against Continue.dev official documentation (docs.continue.dev/customize/deep-dives/rules).  
> **Last verified:** 2026-03-22

---

## 1. What This Document Is

This is a binding code of practice for how front matter must be written in Continue.dev rules files (`.md` files located in `.continue/rules/`). Follow it exactly. Do not invent fields. Do not carry over conventions from other tools or frameworks.

---

## 2. The Canonical Front Matter Schema

Continue.dev recognises **five fields and five fields only** in the YAML front matter block of a rules `.md` file.

| Field | Required | Type | Purpose |
|---|---|---|---|
| `name` | **Yes** | string | Display label shown in the Continue rules toolbar |
| `globs` | No | string or array of strings | File path patterns that trigger automatic rule inclusion |
| `regex` | No | string or array of strings | File content patterns that trigger automatic rule inclusion |
| `description` | No | string | Agent-readable summary used to decide whether to pull the rule into context |
| `alwaysApply` | No | boolean | Controls inclusion behaviour (see Section 4) |

**No other fields are parsed or acted upon by Continue.dev.** Any field not in this table is silently ignored by the tool. It will not error, but it will have zero effect on behaviour.

---

## 3. The Correct Front Matter Block

```yaml
---
name: <Short display label for the rules toolbar>
globs: ["**/*.{ts,tsx}", "src/**/*.md"]   # optional — omit if rule is not file-scoped
description: >
  One or two sentences. Written for the agent, not for a human reader.
  Describes when and why this rule is relevant so the agent can decide
  whether to include it. Be specific about the domain and trigger context.
alwaysApply: false   # optional — see Section 4
---
```

Single-glob shorthand (also valid):

```yaml
---
name: API Standards
globs: "src/api/**/*.ts"
description: Governs all API route files — apply when writing or modifying Express routes, controllers, or middleware.
alwaysApply: false
---
```

---

## 4. `alwaysApply` Behaviour Reference

| Value | Behaviour |
|---|---|
| `true` | Rule is injected into every Agent, Chat, and Edit request, regardless of context |
| `false` | Rule is included only if globs match the current file context, OR the agent decides to pull it in based on `description` |
| *(omitted)* | Rule is included if no globs are set (always), OR globs are set and they match |

**Guidance:**
- Use `alwaysApply: true` for short, universal rules (tone, language, formatting conventions).
- Use `alwaysApply: false` for large reference files, domain-specific standards, or anything that should only load in relevant contexts.
- Omit `alwaysApply` for simple rules with no globs — they will always be included by default.

---

## 5. What Goes in the Rule Body

Everything that is not a Continue.dev front matter field belongs **in the markdown body below the closing `---`**, not in the front matter.

This includes: layer, role, authority level, related files, applies-to scope, tags, last updated date, file path, and any other project metadata.

The model reads the body. It does not read unrecognised front matter keys.

**Pattern:**

```markdown
---
name: Platform Features & User Flows
globs: ["**/*.{ts,tsx,vue}"]
alwaysApply: false
description: >
  Defines all user-facing features and critical user journeys for the Mybizz
  platform — Consulting & Services vertical only. Apply when implementing any
  customer-facing flow: onboarding, bookings, CRM, or marketing.
---

# Platform Features & User Flows

**Layer:** Platform  
**Applies to:** all_forms, client_onboarding, bookings, crm, marketing  
**Authority:** Reference — defines intended behaviour for all user flows.  
**Last updated:** 2026-03-21

## Related files
- `platform_sitemap.md` — all routes and form names for every flow
- `spec_ui_standards.md` — M3 component standards governing all UI referenced here
- `spec_crm.md` — CRM architecture underpinning flows 7–9

---

<!-- Rule content follows -->
```

---

## 6. Prohibited Patterns

Do not use any of the following in the front matter block:

```yaml
# ❌ PROHIBITED — none of these are Continue.dev fields
title: ...
file: ...
location: ...
layer: ...
role: ...
applies_to: ...
authority: ...
related: ...
tags: [...]
last_updated: ...
```

These fields will be silently ignored. Place them in the rule body instead.

---

## 7. File Naming and Load Order

- Rule files must be `.md` format.
- Files are loaded in **lexicographical (alphabetical) order**.
- To control load order explicitly, prefix filenames with numbers:

```
01-general-standards.md
02-frontend-conventions.md
03-api-rules.md
04-platform-features.md
```

- Local rules live in `.continue/rules/` at the workspace root.
- Global rules (apply across all projects) live in `~/.continue/rules/`.

---

## 8. Complete Worked Example

**File:** `.continue/rules/04-platform-features.md`

```markdown
---
name: Platform Features & User Flows
globs: ["**/*.{ts,tsx,vue}", "**/platform*", "**/onboarding*", "**/booking*"]
alwaysApply: false
description: >
  Defines all user-facing features and critical user journeys for the Mybizz
  platform — Consulting & Services vertical only. Apply when implementing or
  understanding any customer-facing flow, including onboarding, bookings, CRM,
  and marketing. Also apply when any referenced form name or actor is mentioned.
---

# Platform Features & User Flows

**Layer:** Platform  
**Applies to:** all_forms, client_onboarding, bookings, crm, marketing  
**Authority:** Reference — defines intended behaviour for all user flows.  
**Last updated:** 2026-03-21

## Related files
- `platform_sitemap.md` — all routes and form names for every flow
- `spec_ui_standards.md` — M3 component standards governing all UI referenced here
- `spec_crm.md` — CRM architecture underpinning flows 7–9

---

<!-- Rule content begins here -->
```

---

## 9. Quick-Reference Checklist

Before submitting any rules file, verify:

- [ ] Front matter contains only fields from the canonical schema (Section 2)
- [ ] `name` is present and is a clear, human-readable label
- [ ] `description` is written as agent-readable instruction, not a title
- [ ] `globs` uses correct glob syntax — array for multiple patterns, string for one
- [ ] `alwaysApply` is set intentionally, or omitted with awareness of default behaviour
- [ ] All project metadata (layer, role, tags, related files, etc.) is in the **body**, not the front matter
- [ ] File is named with a numeric prefix if load order matters

---

*End of Code of Practice.*
