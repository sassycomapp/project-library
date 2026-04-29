Task: Build a workspace description and usage guide for my OpenCode setup on this PC.

Goal:
Create a concise, human- and agent-readable description of:
- how this OpenCode environment is structured (global + both projects),
- how to use it day-to-day,
- how future GStack integration will fit (at a high level only).

Source context:
- Primary: C:\_mb2-cs-app\project-library\workspace\opencode setup.md
- Support: opencode-setup-2.md (attached)
- Do NOT restate OpenCode manual; describe my specific workspace, conventions, and flows.

Output target:
- Update C:\_mb2-cs-app\project-library\workspace\workspace-description.md

Content requirements:
- Short “What this workspace is” overview.
- Sections (example structure):
  1. Global layer
     - where global config/rules live
     - model policy (Qwen 3.6 Plus via OpenRouter only)
  2. Project-library (MM1/AM1 planning & docs)
     - purpose
     - how to run plan vs build here
     - where devlog and todos are written from this side
  3. mb-2-cs (live app build)
     - purpose
     - how to run plan vs build here
     - where devlog and todos are written from this side
  4. Tools
     - Mgrep in WSL
     - OpenCode Desktop on Windows 11
     - how they are used together in practice (very short)
  5. Future: GStack
     - where GStack will sit conceptually (e.g. additional workspace under C:\_mb2-cs-app\…)
     - how these docs will be updated once added (no invented details)
- Include simple “How to start a session” examples for:
  - a planning task in project-library,
  - an implementation task in mb-2-cs.

Style:
- Terse, bullet-heavy, minimal prose.
- Optimized for fast scanning by me and by agents.
- No speculative details about GStack; only explicitly reserve a place for it.