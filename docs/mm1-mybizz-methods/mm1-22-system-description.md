# cs-docs-refactor — System Description

**Last updated: April 2026**

---

## Purpose

Refactoring prior project context files into clean, structured documentation sets for the next project phase. Author role only — rules, planning, and structure production.

---

## Roles

| Role | Who | Responsibility |
|---|---|---|
| Developer | David | Final authority. Approves all rewrites, escalations, unresolved conflicts |
| Author | Claude Desktop | Produces rules, planning, and structure |
| Agent | Claude in continue.dev (VS Code) | Executes rules, writes to working files |

---

## Platform

**Claude Desktop (consumer app)**
- Model: Sonnet 4.6
- Plan: Pro
- Memory: On

---

## Project

| Element | Value |
|---|---|
| Project name | cs-docs-refactor |
| Project folder | `C:/_Data/_Mybizz/cs-docs-refactor` |
| Working library | `C:/_Data/_Mybizz/project-library` |

---

## System Prompt Architecture

Three layers, highest priority first:

1. **Anthropic built-in** — not visible or editable
2. **Project Instructions** — mandatory startup sequence (see below)
3. **Session message** — task-specific input from David

---

## Project Instructions

```
## Identity
You are Author (Claude Desktop). Not Claude Code. Not Claude.ai web.
Every session starts fresh — you have no memory of prior sessions.

## Mandatory Startup Sequence
On every new session, before any action:

1. Confirm MCP filesystem access via `list_allowed_directories`
2. If access fails — notify David immediately. Stop.
3. Read files IN THIS ORDER. Confirm each before proceeding:
   - `C:/_Data/_Mybizz/project-library/activity/handovers/startup.md`
   - `C:/_Data/_Mybizz/project-library/activity/handovers/refactor.md`
   - `C:/_Data/_Mybizz/project-library/activity/handovers/rules.md`
   - `C:/_Data/_Mybizz/project-library/activity/handovers/process.md`
   - `C:/_Data/_Mybizz/project-library/activity/handovers/reference.md`
4. Provide [READ CONFIRMATION] for each file (max 50 tokens).
5. Do not act until David gives explicit permission.
```

---

## Handover Files (Session Context)

Located at `C:/_Data/_Mybizz/project-library/activity/handovers/`

| File | Purpose |
|---|---|
| startup.md | Identity, filesystem access, mandatory reading sequence |
| refactor.md | Context, mental model, governing principles, file processing order |
| rules.md | Content classification, source authority, execution discipline |
| process.md | Session workflow, working file handling, rewrite protocol |
| reference.md | Path aliases, ADR summary, source groups, devlog standard |

---

## Path Aliases

| Alias | Path |
|---|---|
| @authref | `C:/_Data/_Mybizz/project-library/author/` |
| @devref | `C:/_Data/_Mybizz/project-library/developer/` |
| @agentref | `C:/_Data/_Mybizz/project-library/agent/` |
| @backup | `C:/_Data/_Mybizz/project-library/planning-pass-2/rules-library-backup/` |
| @devlog | `C:/_Data/_Mybizz/project-library/activity/devlog/` |
| @old-anvil | `C:/_Data/_Mybizz/project-library/planning-pass-1/Anvil_Methods/` |
| @old-mybizz | `C:/_Data/_Mybizz/project-library/planning-pass-1/Mybizz_Methods/` |
| @todo | `C:/_Data/_Mybizz/project-library/activity/open-tasks/todo.md` |
| @adr | `C:/_Data/_Mybizz/project-library/adr/` |
| @for-deletion | `C:/_Data/_Mybizz/project-library/activity/for-deletion/` |
| @handovers | `C:/_Data/_Mybizz/project-library/activity/handovers/` |

**Constraint:** Claude may access only `project-library` and `mybizz-core`.

---

## MCP Connectors

| Connector | Type | Purpose |
|---|---|---|
| filesystem | LOCAL DEV | Read/write all project files |
| time | LOCAL DEV | Devlog timestamps |
| everything-search | config.json | Locate files quickly |

**Permitted paths (filesystem MCP):**
- `C:/_Data/_Mybizz/project-library`
- `C:/_Data/_Mybizz/mybizz-core`

**Config file location:**
`C:\Users\dev-p\AppData\Local\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude\config.json`

---

## Skills

None required. Project produces markdown files only — handled entirely by filesystem MCP.

Built-in skills (auto-invoked when relevant): Excel, Word, PowerPoint, PDF.
Prerequisite if needed: Settings → Capabilities → Code execution and file creation.

---

## Persistence Mechanisms

| Mechanism | Purpose |
|---|---|
| Devlog (`@devlog`) | Session records, one file per session |
| devlog/index.md | Index of all devlog entries |
| todo.md (`@todo`) | Open tasks |
| todo-archive.md | Completed tasks |
| Working file | Accumulates extracted content across sessions |

---

## Context Window Management

- Sessions scoped to one source group at a time
- Notify David when context window reaches 60-70% capacity
- No summarisation or condensation of content — forbidden by rules.md

---

## Application Root

`C:\Users\dev-p\AppData\Local\Packages\Claude_pzs8sxrjxfjjc`

---

*End of document*
