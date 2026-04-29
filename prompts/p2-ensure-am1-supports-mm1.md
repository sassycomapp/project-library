Task: Validate and finalize AM1 support for MM1 (CS project)

Repository
- Working repo: C:\_mb2-cs-app\project-library

Objective
Ensure AM1 contains only the Anvil.works codes of practice and project-specific specifications required to fully and correctly support validated MM1.

Success Criteria
AM1 must be:
- fully aligned with validated MM1
- complete where MM1 requires implementation guidance
- free of unnecessary, duplicated, obsolete, or conflicting content
- limited to justified AM1 scope
- composed only of relevant Anvil.works practices and project-specific implementation specifications

Authoritative Sources
1. Validated MM1 artifacts in project-library
2. Relevant ADRs in project-library
3. Current AM1 source files in project-library

Supporting Context
- cs-refactor-notes.md may be used for analysis and cross-checking only.
- It is not an authoritative source and must not override MM1, ADR, or AM1 decisions.

Validation Scope
1. Validate AM1 against approved MM1.
2. Confirm which AM1 content correctly supports MM1.
3. Identify AM1 content that is:
   - out of scope
   - obsolete
   - duplicated
   - weakly justified
   - unnecessary for MM1 support
   - in conflict with MM1 or ADRs
4. Identify MM1 requirements that are insufficiently supported or unsupported in AM1.

Classification Framework
Classify each finding as one of:
- SUPPORTS_CORRECTLY
- MISSING_SUPPORT
- OVERSPECIFIED
- REVISE
- REMOVE

Execution Protocol
Phase 1: Planning (mandatory)
Before making any changes, produce a proposed action plan that includes:
- AM1 files to review
- anticipated revisions
- likely removals
- likely unsupported MM1 areas
- potential follow-up todo items

Stop after presenting the plan and wait for explicit approval before making any edits.

Phase 2: Execution (after approval only)
- Apply only changes that directly improve AM1 support for MM1.
- Do not expand scope beyond AM1.
- Do not alter MM1 unless explicitly instructed.
- Preserve alignment with validated MM1 and existing ADRs.
- If uncertainty exists, prefer deferral over speculative inclusion.

Follow-Up Handling
- Documentation, planning, architecture, or specification follow-ups:
  - C:\_mb2-cs-app\project-library\todo.md
- Application, build, or implementation follow-ups:
  - C:\_mb2-cs-app\mb-2-cs\todo.md

Todo Requirements
- Use the exact todo format defined in the applicable AGENTS.md.
- Apply all required tags from the relevant AGENTS.md.
- Only add actionable, justified follow-up items.

Devlog Requirements
- Create a devlog entry in the shared devlog location.
- Update the shared devlog index.
- Do not consider the task complete until:
  1. all AM1 updates are finished
  2. all required todos are recorded
  3. devlog entry is written
  4. devlog index is updated

Deliverables
Phase 1 Output (planning only)
1. AM1 files to review
2. Anticipated revisions
3. Likely removals
4. Likely unsupported MM1 areas
5. Potential todo entries

Phase 2 Output (after approval and execution)
1. Executive summary (brief)
2. Findings by classification:
   - SUPPORTS_CORRECTLY
   - MISSING_SUPPORT
   - OVERSPECIFIED
   - REVISE
   - REMOVE
3. Exact AM1 files modified
4. Summary of changes applied to each file
5. Unsupported MM1 requirements (if any)
6. Todos created, grouped by destination file
7. Devlog entry path
8. Devlog serial / identifier
9. Any unresolved decisions requiring later review