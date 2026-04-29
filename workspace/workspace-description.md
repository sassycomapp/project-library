# OpenCode Workspace Description & Usage Guide

**What this workspace is:** This is your dual-project OpenCode environment on Windows 11, configured for both documentation/refinement work (project-library) and live application development (mb-2-cs). Uses OpenRouter with Qwen 3.6 Plus as the exclusive model for all tasks, with conservative permissions requiring explicit approval for all file edits and commands.

## 1. Global layer

- **Global config location:** `C:\Users\dev-p\.config\opencode\`
- **Global rules:** `C:\Users\dev-p\.config\opencode\AGENTS.md` - applies to all OpenCode sessions
- **Global config:** `C:\Users\dev-p\.config\opencode\opencode.json` - contains provider, models, and default agents
- **Model policy:** Uses only `openrouter/qwen/qwen3.6-plus` for all tasks (both plan and build agents) via OpenRouter API

## 2. Project-library (MM1/AM1 planning & docs)

- **Purpose:** Documentation workspace for analyzing, validating, and refining multi-vertical to single-vertical conversion
- **Default agent:** `plan` (uses qwen3.6-plus for high-quality reasoning)
- **How to run:**
  - Planning tasks: Use default `plan` agent for document analysis, validation, and architectural reasoning
  - Build tasks: Explicitly switch to `build` agent only for tightly scoped document tasks when instructed
- **Devlog & todos:** Written to `C:\_mb2-cs-app\project-library\logs\devlog\` and `C:\_mb2-cs-app\project-library\todo.md`

## 3. mb-2-cs (live app build)

- **Purpose:** Production-adjacent live application code repository with conservative change policies
- **Default agent:** `build` (uses qwen3.6-plus for implementation tasks)
- **How to run:**
  - Implementation tasks: Use default `build` agent for explicit user-directed coding tasks only
  - Planning tasks: Switch to `plan` agent for architectural reasoning and implementation analysis
- **Critical protections:** Hard-denied edits to `anvil.yaml`, `parameters.yaml`, `templates.yaml`, and all `form_template.yaml` files
- **Devlog & todos:** Written to same locations as project-library (`C:\_mb2-cs-app\project-library\logs\devlog\` and `todo.md`)

## 4. Tools

- **MGrep in WSL:** Operational for codebase searching and analysis
- **OpenCode Desktop on Windows 11:** Primary interface with verified shortcut behavior (`Ctrl+P` active, `Ctrl+X`/`F2` inactive)
- **Integration:** Both tools work together using standard `~/.config/opencode` structure that OpenCode Desktop reuses consistently

## 5. Future: GStack

- **Conceptual location:** Will be added as additional workspace under `C:\_mb2-cs-app\gstack\`
- **Documentation updates:** This guide will be updated to include GStack-specific sections for config locations, usage patterns, and integration points once implemented
- **No speculative details:** Only explicit placeholder reserved; no invented implementation details

## How to start a session

**Planning task in project-library:**
1. Open OpenCode Desktop in `C:\_mb2-cs-app\project-library`
2. Default `plan` agent activates automatically
3. Begin with document analysis, validation, or architectural reasoning tasks

**Implementation task in mb-2-cs:**
1. Open OpenCode Desktop in `C:\_mb2-cs-app\mb-2-cs`
2. Default `build` agent activates automatically
3. Request explicit implementation tasks; agent will ask for approval before any file edits
