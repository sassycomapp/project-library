"C:\_mb2-cs-app\project-library\agents.md"
# AGENTS.md — project-library [PLAN] project

## Project purpose
This project-library is the documentation workspace for analysing, validating, and refining the refactor from a multi-vertical application to a single-vertical application. It is not the live code repository. Its purpose is to preserve document provenance, improve document quality, and produce validated working documents that can safely guide app development.

## Core document sets
This project uses six main document sets:

- `am0-anvil-methods` = original multi-vertical Anvil technical documents.
- `am1-anvil-methods` = converted single-vertical Anvil technical documents.
- `am2-anvil-methods` = converted single-vertical line-limited working/design documents.
- `mm0-mymizz-methods` = original multi-vertical MyMizz technical documents.
- `mm1-mymizz-methods` = converted single-vertical MyMizz technical documents.
- `mm2-mymizz-methods` = converted single-vertical line-limited working documents.

## Trust model
Treat `am0` and `mm0` as the primary source baselines.
Treat `am1` and `mm1` as converted technical sets that must be validated against the originals.
Treat `am2` and `mm2` as working sets that must also be validated against the originals before being trusted.
Do not assume converted documents are correct just because they already exist.

## Required workflow order
Follow this order unless the user explicitly instructs otherwise:

1. Refine ADR and architectural documents that define the multi-vertical to single-vertical conversion.
2. Validate `am1/mm1` and `am2/mm2` against `am0/mm0`.
3. Improve and polish the final working document sets.
4. Confirm that application scaffolding and schema expectations align with the validated docs.
5. Confirm or refine the development plan.
6. Create or improve coding and testing prompts.
7. Only then support implementation work.

## Working method
When asked to analyse or refactor documents:

- Read the relevant original source documents first.
- Compare converted documents against the originals.
- Preserve traceability between original intent and revised output.
- Prefer incremental refinement over full rewrites.
- Keep architectural meaning, dependencies, constraints, and business rules intact.
- Flag uncertainty, contradiction, or missing provenance explicitly.
- Be careful with Anvil-specific terminology and platform constraints.

## Output rules
- Prefer concise, structured outputs.
- Distinguish clearly between facts from source docs, inferred conclusions, and proposed revisions.
- When rewriting a document, preserve useful structure where possible.
- Do not silently invent requirements, architecture, flows, tables, or dependencies.
- If a gap exists in the source material, say so directly.

## Safety rules
- Do not delete source documents unless the user explicitly asks.
- Do not overwrite important documents without clear instruction.
- Do not treat generated summaries as canonical unless validated.
- Do not push, publish, sync, or export anything unless the user explicitly asks.
- Do not change workflow order casually.

## What to consult first
When starting any task, consult in this order:

1. Relevant ADR / architectural conversion files.
2. Original source sets: `am0` and `mm0`.
3. Converted technical sets: `am1` and `mm1`.
4. Working sets: `am2` and `mm2`.
5. Planning, prompt, and implementation-support documents.

## Preferred behaviour
Be conservative, traceable, and validation-first.
The user is the final decision-maker on architecture, refactor direction, and document truth.
Your role is to help inspect, compare, refine, and structure the documentation safely.

---
The following rules override that behaviour when the task is about the current Mybizz Consulting Services (CS) application design, schema, or implementation planning.
For those CS tasks, treat the “Mybizz CS – Agent Rules” section as higher priority than the generic trust model.

The sections above describe the general documentation/refactor workspace, including multi-vertical history.
For multi-vertical history and provenance work, treat `am0` and `mm0` as primary baselines.
For current CS design and build tasks, follow the Mybizz CS rules below.

Whenever the user’s request mentions “CS app”, “Consulting Services app”, “Mybizz CS”, or refers to the current Anvil app/schema, you must treat the task as Mybizz CS mode and apply the “Mybizz CS – Agent Rules (Docs & Design)” section in full.
---

## Mybizz CS – Agent Rules (Docs & Design)

### 1. Source of truth and file scope
#### 1.1 Authoritative sources for this project are only:
- `C:\_mb2-cs-app\project-library\adr\`
- `C:\_mb2-cs-app\project-library\docs\am1-anvil-methods\`
- `C:\_mb2-cs-app\project-library\docs\mm1-mybizz-methods\`
- `C:\_mb2-cs-app\project-library\docs\reference-anvil.yaml\anvil.yaml`

#### 1.2 Off-limits as authoritative CS sources
You must not use any other project folders or files as sources of fact about the Mybizz CS application (architecture, requirements, schema, flows, scope), including but not limited to:
- `am0-*` and `mm0-*`
- any folders named `DELETED`, `deleted`, `archive`, `legacy`, or similar
- any other repos on disk

#### 1.3 Project-specific fact rule
You must not use your own general training data or prior memory to assert project-specific facts.
If a fact is not supported by the allowed files in 1.1, you must treat it as inferred or missing, not as known truth.

#### 1.4 Explicit exception handling
If the user explicitly instructs you to read a file outside 1.1, you may use it only for that request and you must state that its content is historical / advisory, not an authoritative CS spec, unless the user explicitly promotes it.

### 2. Certainty levels (must be explicit)
When you assess how well something is defined (requirements, design, schema, flows, etc.), every statement must fall into one of these categories:

- `Clearly defined:` there is an explicit statement in an allowed file that directly answers the point, in clear, unambiguous language.
- `Partially defined:` the files give some constraints or examples, but not a full specification; important details are missing or implied.
- `Inferred only:` you are connecting dots that are not explicitly stated in any single place; this depends on interpretation.
- `Missing:` the allowed files do not provide enough information to answer reliably.

When the user asks how well something is defined or scoped:
- Prefix each bullet with one of the four labels above.
- Do not upgrade inferred material to clearly defined.

### 3. Language restrictions
#### 3.1 Schema alignment claims
Do not claim that the current database schema “matches”, “is identical to”, or “fully implements” any document set unless:
- in this session, you were explicitly asked to compare them, and
- you produced a concrete comparison output.

#### 3.2 Allowed cautious language
In general descriptions of alignment between docs and schema, use cautious language such as:
- “is broadly aligned with …”
- “appears consistent with …”
- “implements many of the patterns described in …”

#### 3.3 Flow completeness claims
Do not use phrases like “fully specified”, “complete journey maps”, or “clearly defined user flows” unless the files actually contain step-by-step or screen-by-screen flow descriptions.

### 4. Treatment of mm0/am0 and deleted/legacy content
#### 4.1 Legacy status
`mm0` and `am0` are legacy multi-vertical design docs.
For the CS project:
- they are not part of the active spec,
- they must not be treated as truth for current requirements or architecture decisions.

#### 4.2 Deleted / archive restrictions
Any file under a path containing `\DELETED\`, `\deleted\`, `\archive\`, or `\legacy\` is off-limits by default.
You may not read or cite these files unless the user explicitly asks you to for a specific purpose.

#### 4.3 If explicitly instructed to use legacy content
You must label all insights from those files as historical context or inferred only, not as authoritative for the current CS build.
Do not silently merge that information into statements about what is clearly defined now.

### 5. Behaviour for project summaries and synopses
When summarising the project:

- Restrict facts to what you can support from the allowed files.
- If you are using an inference, label it as such.
- Do not introduce numbers or qualifiers that are not explicitly present.
- For flows, distinguish clearly between conceptual flows and detailed UI/UX flows.

### 6. When in doubt
- If unsure whether something is clearly defined vs inferred, default to `Inferred only` or `Partially defined`.
- If you cannot find evidence in the allowed files, say so explicitly.

## Devlog protocol (Plan / Build / Status)

### Devlog goals
- Keep an append-only history of important planning and build work.
- Make every completed task leave exactly one devlog file and one index row.

### Devlog locations
- Devlog files live under `C:/_mb2-cs-app/project-library/logs/devlog/`.
- The devlog index file is `C:/_mb2-cs-app/project-library/logs/devlog/index.md`.
- Treat those paths as authoritative for devlog history.

### Devlog types
Use exactly one type per entry:
- `plan` — planning, design decisions, architecture decisions, prompt authoring, build-rules authoring, refactor strategy, document validation and comparison work.
- `build` — implementation support artefacts, scripts, generated support files, or other explicitly approved non-live-code build work.
- `status` — session close, handover, checkpoint, “here is where we are” snapshots.

Do not classify planning work as build.

### Devlog sequence and serials
- Always open `C:/_mb2-cs-app/project-library/logs/devlog/index.md` first.
- Read the last serial number from the index.
- The next devlog serial is last + 1.
- Never renumber existing entries.
- Never delete existing entries.
- New entries are always appended at the bottom.

### Devlog file naming
Use this naming pattern:

`{serial}-{type}-{slug}.md`

`{slug}` is a short, kebab-case summary of the task.

### Devlog file template
Every new devlog file must follow this structure:

```text
# Devlog #{serial} — {type} — {slug}
Date: YYYY-MM-DD
Type: {plan|build|status}

***

## Task

## Sources Used

## Changes Made

## Validation Outcome

## Files Changed

***

*End of devlog entry #{serial}*
```

Keep sections short and factual.

### Devlog index update
After writing the devlog file, append a matching row to `C:/_mb2-cs-app/project-library/logs/devlog/index.md`:

```text
| {serial} | {type} | {slug} | {one-line brief} |
```

### Task completion rule
A task is not complete until:
- the devlog file exists,
- the index row exists and matches,
- the type is correct.

Do not report a task as complete until both the devlog file and index row are created.

## To-do system (deferred and out-of-scope work)

### Purpose
Use `todo.md` to capture work discovered during document analysis, validation, planning, prompt creation, or implementation-support work that is outside the currently approved task scope.

Do not silently expand scope.
Record it for later unless the user explicitly expands scope.

### Files
- Active backlog: `todo.md`
- Closed backlog archive: `todo-archive.md`

### Core rules
- Read `todo.md` at the start of a relevant task.
- When new out-of-scope work is discovered, add a new item to the top of `todo.md`.
- Completed and cancelled items must be moved from `todo.md` to `todo-archive.md` at close.
- `todo-archive.md` is append-only. Never edit or remove old archive rows.
- IDs are unique identifiers only, not priority numbers.
- New items are added to the top and use the next available ID.

### When to create a to-do item
Create a to-do item when:
- a document gap is discovered but not resolved in the current task,
- a validation mismatch needs later review,
- a prompt/build-rules improvement is identified but deferred,
- a separate bug, inconsistency, or cleanup task is found outside current scope,
- the user explicitly says to defer something for later.

### Status tags
- `[NEXT-UP]` — ready for future execution, no known blocker
- `[PENDING]` — blocked by an external dependency, decision, or prerequisite
- `[FROZEN]` — intentionally 