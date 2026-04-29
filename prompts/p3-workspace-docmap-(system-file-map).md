Task: Build a system docmap for my OpenCode setup on this PC.

Goal:
Create a single, human- and agent-readable docmap that registers all relevant OpenCode system and config files with full paths, clearly split into:
- global system files
- project-level system files (project-library, mb-2-cs)
- future GStack-related files (placeholder section, no guessing)

Source context:
- Primary: C:\_mb2-cs-app\project-library\workspace\opencode setup.md
- Support: opencode-setup-2.md (attached)
- Do NOT rewrite generic OpenCode docs; focus only on my actual workspace layout and config.

Output target:
- Update C:\_mb2-cs-app\project-library\workspace\workspace-docmap.md

Content requirements:
- Short intro: “What this docmap is / how to use it”.
- Sections:
  - Global config & rules (e.g. C:\Users\dev-p\.config\opencode\…)
  - Project rules & config – project-library
  - Project rules & config – mb-2-cs
  - Tools & integrations (Mgrep/WSL/OpenCode Desktop)
  - Future: GStack (section stub, describe where GStack config/docs will live without inventing details)
- For each item: filename, full path, purpose in 1–2 lines.
- Keep it terse, bullet-based, and predictable so agents can scan it.

Constraints:
- Assume all coding work uses model: openrouter/qwen/qwen3.6-plus only.
- Do not introduce new files or paths; only document what exists or clearly reserved placeholders (like GStack).