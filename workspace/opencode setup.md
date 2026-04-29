```
This config policy is aligned with OpenCode Desktop on Windows, and the paths and config strategy we are using match what the desktop app actually reads.

Key confirmations:

Global config path: C:\Users\dev-p\.config\opencode\opencode.json is the documented global config location for OpenCode on native Windows, including desktop.

Global rules path: C:\Users\dev-p\.config\opencode\AGENTS.md is the documented global rules file and applies across all OpenCode sessions (TUI, desktop, IDE) on your user account.
​

Project rules: AGENTS.md in C:\_mb2-cs-app\project-library and C:\_mb2-cs-app\mb-2-cs are exactly how OpenCode expects per-project rules for any front-end, including the desktop app.

Project config: opencode.json in each project root (project-library and mb-2-cs) is the correct per-project config mechanism and has the highest precedence among standard config files, which the desktop app also respects.

Skills and .config\opencode layout: you are using the standard ~/.config/opencode structure that OpenCode Desktop reuses, so skills, agents, and future MCP settings there will be picked up consistently.

The first line:

text
# 0. MGrep/ WSL/ OpenCode have alse been setup and are working
fits well as a status note in your policy file and is consistent with the assumption that the desktop app is already installed and mgrep/WSL are operational.

the policy and the plan are aligned with OpenCode Desktop on native Windows, and it is correct to treat this document as an implementation manual as we go
​```


# 0. MGrep/ WSL/ OpenCode have alse been setup and are working

# A. Global Behavior & Rules

1. (agents.md)
C:\Users\dev-p\.config\opencode\agents.md
Task/s
- [DONE] Maintain global behavior rules for OpenCode sessions.
- [DONE] Enforce concise, stepwise, validation‑first responses with no emojis or side topics.
- [DONE] Distinguish clearly between facts, inferences, and proposed revisions.
- Add a global numbering rule: never use `§` for numbering; always use period-style numbering when a symbol is needed (for example: `1.`, `2.`, `3.`).

2. (Repository AGENTS.md – docs)
C:\_mb2-cs-app\project-library\agents.md
Task/s
- [DONE] Define the documentation workspace trust model and document provenance rules.
- [DONE] Enforce required workflow order (refine ADRs, validate `am1/mm1` & `am2/mm2` against baselines, then improve working docs).
- Keep this file focused on documentation and planning behavior, not code execution rules.

3. (Repository AGENTS.md – code)
C:\_mb2-cs-app\mb-2-cs\agents.md
Task/s
- [DONE] Define live code repo behavior: conservative, minimal, implementation-focused.
- [DONE] Protect: `anvil.yaml`, `standard-page.html`, `theme.css`, `parameters.yaml`, `templates.yaml`, and all `form_template.yaml` files from change without explicit permission.
- [DONE] Require backups in `working-backup` mirroring the original path, with incremented `(NN)` filenames when duplicates exist.
- [DONE] Require `Created:` / `Updated:` timestamps in UTC+2 at the top of touched files where safe.
- Keep hard protections and backup/timestamp rules in sync with how you actually work.

---

# B. Global Config & Core Platform — Status

Status: Core provider and model config implemented on 2026-04-25 (OpenCode Desktop, Windows).

4. (opencode.json – global)
C:\Users\dev-p\.config\opencode\opencode.json
Task/s
- [DONE] Create the global OpenCode config file for the desktop app.
- [DONE] Use it as the central place for providers, default models, default agents, tools, permissions, keybinds, and commands.
- Future: extend this file with any additional agents, tools, and keybinds once the basics are stable.

5. (providers – global)
C:\Users\dev-p\.config\opencode\opencode.json
Task/s
- [DONE] Configure a single provider: `openrouter`.
- [DONE] Set `api_key` to `env:OPENROUTER_API_KEY` and confirm the environment variable is set.
- [DONE] Restrict the provider to the Qwen models actually in use:
  - `qwen/qwen3-max-thinking`
  - `qwen/qwen3.6-plus`

6. (default models – global)
C:\Users\dev-p\.config\opencode\opencode.json
Task/s
- [DONE] Set the main default model to:
  - `model`: `openrouter/qwen/qwen3-max-thinking`
- [DONE] Set the lightweight default model to:
  - `small_model`: `openrouter/qwen/qwen3.6-plus`
- [DONE] Confirm both models are visible and usable in OpenCode Desktop.

---

# C. Agents, Skills, Tools, Permissions — Status (agents + base permissions)

Status: Global plan/build agents and conservative permissions implemented on 2026-04-25.

7. (global agents)
C:\Users\dev-p\.config\opencode\opencode.json
Task/s
- [DONE] Define two core global agents:
  - `plan`: planning, analysis, and refactor-thinking agent.
  - `build`: implementation and coding agent.
- [DONE] Assign per-agent models:
  - `plan` → `openrouter/qwen/qwen3-max-thinking`
  - `build` → `openrouter/qwen/qwen3.6-plus`
- [DONE] Align these roles with the refactor-heavy docs project vs the implementation-heavy mb-2-cs project.

8. (default_agent – global)
C:\Users\dev-p\.config\opencode\opencode.json
Task/s
- [DONE] Set `default_agent` to `plan` so new sessions favour high-quality reasoning and planning.
- [DONE] Confirm that new Desktop sessions start with the `plan` agent active.

9. (project-local agents – docs)
Project-local agent config (for example: C:\_mb2-cs-app\project-library\.opencode\agents\)
Task/s
- [NOT DONE] No project-local agents created yet.
- Decision pending: determine whether `project-library` needs repo-specific agents beyond the global `plan` and `build`.

10. (project-local agents – code)
Project-local agent config (for example: C:\_mb2-cs-app\mb-2-cs\.opencode\agents\)
Task/s
- [NOT DONE] No project-local agents created yet.
- Decision pending: determine whether `mb-2-cs` needs repo-specific agents beyond the global `plan` and `build`.

11. (tools – global defaults)
C:\Users\dev-p\.config\opencode\opencode.json
Task/s
- [DONE] Enable tools in a conservative way by default via per-agent permissions (see item 12).
- Future: explicitly list additional tools (for example: `mgrep`, `webfetch`) as your workflow stabilises.

12. (tool permissions – per agent)
C:\Users\dev-p\.config\opencode\opencode.json
Task/s
- [DONE] Set both `plan` and `build` agents to require explicit approval before editing files or running commands:
  - `edit`: `"ask"`
  - `webfetch`: `"ask"`
  - `bash`: `"*": "ask"`
- [DONE] Ensure agents never write or execute “freely”; they must act only on your explicit prompts and with your confirmation.
- Future: tighten or relax permissions per agent once you have more experience with real tasks.

13. (skills – global)
C:\Users\dev-p\.config\opencode\skills\
Task/s
- [NOT DONE] No explicit global skill configuration has been implemented yet.
- Current state: relying on OpenCode Desktop defaults only.

14. (skills – per project)
Project skill locations (for example: C:\_mb2-cs-app\project-library\skills\ and C:\_mb2-cs-app\mb-2-cs\skills\ if used)
Task/s
- [NOT DONE] No project-specific skills have been created or configured yet.
- Decision pending: determine whether either repo needs local skills.

---

# D. Project Configs (Docs & Code) — Status

Status: Project-level `opencode.json` files implemented on 2026-04-25 for both main workspaces.

15. (opencode.json – docs project)
C:\_mb2-cs-app\project-library\opencode.json
Task/s
- [DONE] Create the project config for the documentation workspace.
- [DONE] Set `default_agent` to `plan`.
- [DONE] Keep permissions conservative:
  - `edit`: `"ask"`
  - `webfetch`: `"ask"`
  - `bash`: `"*": "ask"`
- [DONE] Set project agent intent:
  - `plan` = primary agent for document analysis, validation, provenance checks, architectural reasoning, and refactor planning.
  - `build` = secondary agent for tightly scoped document tasks only when explicitly instructed.

16. (opencode.json – code project)
C:\_mb2-cs-app\mb-2-cs\opencode.json
Task/s
- [DONE] Create the project config for the live code repository.
- [DONE] Set `default_agent` to `build`.
- [DONE] Keep permissions conservative:
  - `edit`: `"ask"`
  - `webfetch`: `"ask"`
  - `bash`: `"*": "ask"`
- [DONE] Set project agent intent:
  - `plan` = planning, architectural reasoning, and implementation analysis agent.
  - `build` = primary coding and test-oriented agent for explicit user-directed implementation tasks only.

---

# E. Interaction, Commands, and Workflow Comfort — Status

Status: OpenCode Desktop keybind behavior has been checked against the installed app on this machine on 2026-04-25.

17. (keybinds & shortcuts – global)
C:\Users\dev-p\.config\opencode\opencode.json
Task/s
- [NOT DONE] No custom keybinds configured yet.
- [DONE] Verify actual built-in OpenCode Desktop shortcut behavior from Settings > Keyboard Shortcuts.
- [DONE] Confirm that `Ctrl+P` is active in this Desktop install and opens an action list.
- [DONE] Confirm that `Ctrl+X` is not active in this Desktop install.
- [DONE] Confirm that `F2` is not active in this Desktop install.
- Current state: rely on the Desktop app’s actual shortcut list, not assumed defaults from external references.

18. (modes / commands – global)
C:\Users\dev-p\.config\opencode\opencode.json
Task/s
- [NOT DONE] No custom global commands configured yet.
- [DONE] Confirm that OpenCode Desktop already exposes built-in actions through the current shortcut/action system.
- Decision pending: add custom commands only after repeated workflow needs are identified.

19. (modes / commands – project-specific)
Project opencode.json files
Task/s
- [NOT DONE] No project-specific commands configured yet.
- Decision pending after more real usage in `project-library` and `mb-2-cs`.


---

# F. Quality, Formatting, and Tooling

20. (formatters & linters – global and per project)
Language- and tool-specific config files, plus references in opencode.json if needed
Task/s
- [DONE] Confirm Anvil.works formatter direction.
- [DONE] Confirm that Anvil.works currently uses Ruff in the Anvil IDE for formatting/linting, not Black.
- [DONE] Confirm that this local codebase currently contains neither `pyproject.toml` nor `ruff.toml`.
- [DECIDED] Do not enable OpenCode formatter or linter integration yet.
- [DECIDED] Do not introduce Ruff configuration into the repo at this stage.
- [DECIDED] Treat Ruff as the leading future candidate if formatter/linter standardisation is later adopted for this codebase.
- Rationale: automatic formatting should not be introduced into this project until formatting rules are deliberately defined and accepted for the local repo.


21. (protected-file edit controls for mb-2-cs)
C:\_mb2-cs-app\mb-2-cs\opencode.json
Task/s
- [DONE] Confirm that `.gitignore` is not a sufficient protection against OpenCode editing tracked files.
- [DONE] Confirm that file edit protection must be enforced primarily through `AGENTS.md` rules and OpenCode permission rules.
- [DONE] Add explicit path-based `edit` protection in `mb-2-cs\opencode.json`.
- [DONE] Deny edits to:
  - `anvil.yaml`
  - `parameters.yaml`
  - `templates.yaml`
  - all `form_template.yaml` files
- [DONE] Keep `standard-page.html` and `theme.css` protected by default with `ask` permissions, so they may only be edited on explicit user request in the active session.
- Rationale: this repository is pushed back to Anvil via GitHub, so protected-file controls must prevent edits before staging and commit concerns arise.


22. (package.json)
C:\Users\dev-p\.config\opencode\package.json
Task/s
- [DONE] Determine whether `package.json` is part of the active OpenCode Desktop configuration strategy.
- [DECIDED] `package.json` is not part of the active setup at this stage.
- [DECIDED] No node-based helper tooling, formatter package dependencies, or plugin package management will be introduced through this file at this time.
- [DECIDED] Leave `package.json` unchanged unless a later OpenCode setup step explicitly requires package-managed tooling.
- Rationale: the current OpenCode Desktop setup is driven by `AGENTS.md`, `opencode.json`, providers, models, and permissions, not by node package management.


23. (package-lock.json)
C:\Users\dev-p\.config\opencode\package-lock.json
Task/s
- [DONE] Determine whether `package-lock.json` is part of the active OpenCode Desktop configuration strategy.
- [DECIDED] `package-lock.json` is not part of the active setup at this stage.
- [DECIDED] Leave `package-lock.json` unchanged.
- [DECIDED] Review this file only if `package.json` later becomes part of the active configuration strategy through npm-managed tooling.
- Rationale: `package-lock.json` is only relevant when npm-managed dependencies are part of the actual configuration workflow.

---

# G. MCP Servers and External Integrations — Status

Status: Documentation access requirements identified on 2026-04-25. MCP is under active consideration for authoritative documentation workflows.

24. (documentation access requirement)
OpenCode Desktop built-in tools and possible future MCP support
Task/s
- [DONE] Confirm that authoritative documentation access is a required capability for this OpenCode Desktop setup.
- [DONE] Confirm current documentation targets:
  - Anvil.works
  - Paystack
  - PayPal
  - Stripe
  - Brevo
- [DONE] Confirm that built-in OpenCode web research tools (`websearch` and `webfetch`) can be used for live official documentation lookup and retrieval.
- [DECIDED] Use built-in documentation/web research first for official docs lookup.
- [DECIDED] Evaluate docs-focused MCP only if built-in web research proves insufficient for structured, repeatable, or version-aware documentation work.

25. (MCP / external servers – future documentation and integration layer)
MCP-specific config locations as required by future integrations
Task/s
- [NOT DONE] No MCP server has been implemented yet.
- [IN REVIEW] Determine whether a docs-focused MCP server is needed for indexed, persistent, or multi-source documentation retrieval.
- [IN REVIEW] Future MCP candidates should be justified by real workflow gaps, especially around integration documentation accuracy and repeatability.
- Possible future scope:
  - documentation indexing/search across official vendor docs
  - GitHub or repository integration
  - other external system integrations only when clearly needed

```

This structure gives you:

- broad “chapters” (A–G) to reason about strategy,
- numbered items with filename + path + tasks,
- explicit coverage of tools, skills, agents, and MCPs,
- and clear separation between global vs project concerns.

