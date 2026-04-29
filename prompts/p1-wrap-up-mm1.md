Task: Finalize MM1 for the CS project

Repository
- Working repo: C:\_mb2-cs-app\project-library

Objective
Bring MM1 to a final, internally consistent, implementation-ready state for CS scope only.

Success Criteria
MM1 must be:
- complete for current CS scope
- internally consistent
- free of duplication and contradiction
- limited to justified MM1 scope
- stripped of obsolete, speculative, or out-of-scope material

Authoritative Sources
1. MM1 source files in project-library
2. Relevant ADRs in project-library

Supporting Context
- cs-refactor-notes.md may be used for analysis and cross-checking only.
- It is not an authoritative source and must not override MM1 or ADR decisions.

Required Analysis
1. Confirm the minimum required MM1 scope for CS.
2. Identify:
   - conflicts
   - duplication
   - obsolete content
   - unjustified or weakly justified scope
   - items that belong to later milestones
3. Classify each finding as one of:
   - KEEP
   - REVISE
   - DEFER
   - REMOVE

Execution Protocol
Phase 1: Planning (mandatory)
Before making any changes, produce a proposed action plan that includes:
- files to review
- anticipated changes
- likely deferments
- potential todo entries

Stop after presenting the plan and wait for explicit approval before making any edits.

Phase 2: Execution (after approval only)
- Apply only changes that directly improve MM1.
- Do not expand scope beyond MM1.
- Do not begin or prepare AM1 validation.
- Preserve alignment with existing ADR decisions.
- If uncertainty exists, prefer deferral over speculative inclusion.

Follow-Up Handling
- Documentation, planning, or analysis follow-ups:
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
  1. all MM1 updates are finished
  2. all required todos are recorded
  3. devlog entry is written
  4. devlog index is updated

Deliverables
Phase 1 Output (planning only)
1. Files to review
2. Anticipated changes
3. Likely deferments
4. Potential todo entries

Phase 2 Output (after approval and execution)
1. Executive summary (brief)
2. Findings by classification:
   - KEEP
   - REVISE
   - DEFER
   - REMOVE
3. Exact MM1 files modified
4. Summary of changes applied to each file
5. Todos created, grouped by destination file
6. Devlog entry path
7. Devlog serial / identifier
8. Any unresolved decisions requiring later review