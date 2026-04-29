**ADR-008 — Rules Files Must Not Exceed 250 Lines**

Date: 2026-04-20
Status: Accepted

---


## Context

Continue.dev agent rules files have enforced length limit of 500 lines by default. Long files degrade agent performance. Critical rules are diluted, and the agent samples rather than reads the full file — producing failure modes

A hard line limit is the structural fix. It forces discipline at the point of authoring rather than relying on the agent to handle arbitrarily long files reliably.

---

## Decision

All rules files must not exceed 250 lines. This is a hard limit. It is not a guideline.

When any rules file reaches or exceeds 250 lines, one of the following actions must be taken immediately:

1. **Trim** — remove non-essential or redundant content.
2. **Condense** — restructure to reduce length without losing functional information.
3. **Split** — divide into two parts where reduction is not feasible.

---

## Split File Requirements

When splitting, both parts must:
- Reference each other explicitly by filename.
- Contain enough context to be understood independently.
- Not duplicate content in a way that creates ambiguity between parts.

---

## Consequences

Any rules file found exceeding 5250 lines is non-compliant and must be corrected .

No information that impacts a file's functional purpose may be lost during trimming, condensing, or splitting.

---


*End of ADR-008*