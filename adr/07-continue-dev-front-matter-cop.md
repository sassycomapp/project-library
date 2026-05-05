# 07 — Continue.dev Front Matter CoP: Five-Field Schema and Glob Strategy
Date: 2026-03-23
Status: Accepted
Source: @authref/continue-rules-front-matter-cop.md — session 2026-03-23

This ADR policy is now obsolete
---

## Context

Rules files in @agentref were being written with varying front matter schemas — some
including prohibited fields (title, layer, role, tags, last_updated) that Continue.dev
silently ignores, and none had globs defined. Without globs, Continue.dev's loading
behaviour is unpredictable and either over-loads (all files every session) or relies
entirely on the agent's description-matching — which is unreliable for critical
standards files.

---

## Decision

All agent-facing `.md` rules files saved to `@agentref` must follow the canonical
front matter schema. Continue.dev recognises **five fields only**:
`name`, `globs`, `description`, `alwaysApply`, `regex`.

Any other field is silently ignored. All project metadata (layer, role, authority,
related files, last updated) belongs in the **body**, not the front matter.

### Glob strategy for this project

Globs must be set deliberately on every file. The established patterns:

| File type | Globs | Rationale |
|---|---|---|
| Universal coding/naming standards | `["**/*.py"]` | Always relevant when writing Python |
| Form-specific standards | `["**/forms/**/*.py", "**/*Form*/__init__.py"]` | Only relevant in form context |
| Large orientation documents | `[]` with `alwaysApply: false` | Agent-pull only — never auto-loads |

**Token economy principle:** Every file loaded into context costs tokens. Files should
load in exactly the contexts where they are relevant — no more, no less. A rule loaded
into every request regardless of context wastes tokens and dilutes agent focus.

### Current @agentref glob assignments (2026-03-23)

| File | Globs | Rationale |
|---|---|---|
| `policy_nomenclature.md` | `["**/*.py"]` | Universal — naming applies to all Python |
| `ref_anvil_coding.md` | `["**/*.py"]` | Universal — coding standards apply to all Python |
| `policy_nomenclature_components.md` | `["**/forms/**/*.py", "**/*Form*/__init__.py"]` | Form context only |
| `platform_features.md` | `["**/forms/**/*.py", "**/*Form*/__init__.py"]` | Form context only |
| `platform_overview.md` | `[]` | Agent-pull only — large orientation document |

---

## Consequences

### All future @agentref files must include globs

When writing a new rules file, the author must decide the glob pattern before saving.
The question to ask: "Which file types make this rule relevant?" If the answer is
unclear, default to `[]` with `alwaysApply: false` and write a precise `description`.

### The checklist (applied before saving any rules file)
- Front matter contains only the five permitted fields
- `name` is present and human-readable
- `description` is written for the agent — not a title
- `globs` is set deliberately — not omitted by default
- All project metadata is in the body, not the front matter

### Full CoP reference
`@authref/continue-rules-front-matter-cop.md` — read this before writing any rules file.

---

*End of ADR-007*
