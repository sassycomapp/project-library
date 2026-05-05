# 11 — Schema Scope Reduction
**Removal of Out-of-Scope Tables from anvil.yaml**

Date: 2026-05-03
Status: Accepted
Source: YC Office Hours session — scope validation against C&S vertical

---

## Context

The live `anvil.yaml` schema contained tables inherited from earlier multi-vertical iterations (ADR-009) and feature creep from exploratory development phases. These tables were not part of the confirmed Consulting & Services V1 scope and added maintenance burden, documentation complexity, and potential confusion for developers.

Tables identified as out of scope:
- **Support/Help:** `tickets`, `ticket_messages`, `kb_articles`, `kb_categories`, `reviews`
- **Events:** `events`, `event_registrations`
- **Finance:** `expenses`
- **Infrastructure:** `backups` (Anvil handles natively)

Additionally, `bookable_resources` was removed as an unnecessary abstraction — for C&S, providers are always Staff-role users, not generic "resources" (equipment, space, etc.).

---

## Decision

**All out-of-scope tables are removed from the live schema.** The production table count is reduced from 49 to 36.

### Tables removed:
| Table | Reason |
|---|---|
| `tickets` | Support ticket system — out of scope for V1 |
| `ticket_messages` | Dependent on tickets |
| `kb_articles` | Knowledge base — out of scope for V1 |
| `kb_categories` | Dependent on kb_articles |
| `reviews` | Review/rating system — out of scope for V1 |
| `events` | Event management — out of scope for V1 |
| `event_registrations` | Dependent on events |
| `expenses` | Expense tracking — out of scope (time tracking retained) |
| `backups` | Anvil handles backups natively; metadata table redundant |
| `bookable_resources` | Unnecessary abstraction; providers are Staff users |
| `customers` | Merged into `contacts` (ADR-010) |

### Tables retained (36 total):
- **Core (10):** activity_log, business_profile, config, email_config, files, payment_config, rate_limits, theme_config, users, vault
- **Bookings (6):** availability_exceptions, availability_rules, booking_metadata_schemas, bookings, services, contact_submissions
- **CRM (9):** contacts, contact_events, contact_counter, contact_campaigns, email_campaigns, segments, tasks, leads, lead_captures
- **Email (3):** email_templates, email_log, webhook_log
- **Content (4):** blog_posts, blog_categories, pages, landing_pages
- **Finance (3):** invoice, invoice_items, time_entries

---

## Consequences

### Files affected:
- `anvil.yaml` — out-of-scope tables removed
- `spec_database.md` / `spec_database_schema.md` — table count and references updated
- All build plan documents — feature phases adjusted to exclude removed tables
- `platform_overview.md` — feature list updated

### Future scope:
If any removed feature (tickets, knowledge base, reviews, events, expenses) is requested post-V1, it must be re-added via a new ADR with explicit scope justification. No removed table is implicitly "available for later."

---

*End of ADR-011*
