# OpenCode System Docmap

**What this docmap is / how to use it:** This document registers all relevant OpenCode system and config files in your workspace with full paths. It's designed to be human-readable and agent-scannable, providing a single source of truth for your OpenCode setup. Use it to understand configuration hierarchy, locate files quickly, and ensure consistent setup across environments.

## Global config & rules

- **AGENTS.md** - `C:\Users\dev-p\.config\opencode\AGENTS.md`  
  Global behavior rules for all OpenCode sessions (TUI, desktop, IDE). Enforces concise, stepwise, validation-first responses with no emojis or side topics.

- **opencode.json** - `C:\Users\dev-p\.config\opencode\opencode.json`  
  Global OpenCode config file for desktop app. Contains providers, default models, default agents, tools, permissions, and keybinds with highest precedence for global settings.

## Project rules & config – project-library

- **AGENTS.md** - `C:\_mb2-cs-app\project-library\AGENTS.md`  
  Documentation workspace trust model and document provenance rules. Defines required workflow order for multi-vertical to single-vertical conversion validation.

- **opencode.json** - `C:\_mb2-cs-app\project-library\opencode.json`  
  Project config for documentation workspace. Sets default_agent to "plan" with conservative permissions for document analysis and validation tasks.

## Project rules & config – mb-2-cs

- **AGENTS.md** - `C:\_mb2-cs-app\mb-2-cs\AGENTS.md`  
  Live code repository behavior rules. Defines hard file protections, mandatory backup requirements, and timestamp headers for production-adjacent codebase.

- **opencode.json** - `C:\_mb2-cs-app\mb-2-cs\opencode.json`  
  Project config for live code repository. Sets default_agent to "build" with explicit file edit protections for critical Anvil files (anvil.yaml, parameters.yaml, etc.).

## Tools & integrations

- **MGrep/WSL/OpenCode Desktop** - System-wide integration  
  Confirmed operational setup for MGrep, WSL, and OpenCode Desktop on Windows. Uses standard ~/.config/opencode structure that OpenCode Desktop reuses consistently.

## Future: GStack

- **GStack config location** - `C:\Users\dev-p\.config\opencode\gstack\` (placeholder)  
  Reserved directory structure for future GStack configuration files. Will contain GStack-specific agents, tools, and integration settings when implemented.

- **GStack project configs** - `C:\_mb2-cs-app\project-library\.opencode\gstack\` and `C:\_mb2-cs-app\mb-2-cs\.opencode\gstack\` (placeholders)  
  Reserved per-project GStack configuration directories. Will contain project-specific GStack settings without inventing implementation details.