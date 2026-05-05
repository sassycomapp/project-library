# 12 — Consolidated Build Sequence
**Single Authoritative Phase Plan Replacing Obsolete mm1-08/mm1-12/mm1-21**

Date: 2026-05-03
Status: Pending — awaiting completion of unified planning docs

---

## Context

Three conflicting build sequences existed in the MM1 document set:
- **mm1-08 (Dev Plan):** 9 phases (Auth/Admin → Website → Payments → Bookings → CRM/Marketing → Security → Analytics → Platform Mgmt → Launch)
- **mm1-12 (Mybizz Planning):** 8 phases (Auth/Admin → Schema Foundation → Transactional Core → Customer Layer → Content Layer → Analytics → Launch → Platform Mgmt)
- **mm1-21 (Build Plan):** 10 phases (Auth/Admin → Website → Payments → Bookings → CRM/Marketing → Security → Analytics → Vertical Polish → Platform Mgmt → Launch)

These contradicted each other on phase ordering, phase count, and feature placement. None reflected the cleaned 36-table schema or the confirmed C&S scope.

---

## Decision (Pending)

A single consolidated 5-phase build sequence will replace all three obsolete documents. The sequence prioritises the booking-to-payment-to-CRM loop as the V1 core, deferring content and analytics to later phases.

**Proposed structure (to be finalised during planning):**

| Phase | Focus | Key Deliverables |
|---|---|---|
| 1. Foundation | Auth, RBAC, Vault, navigation, settings | Login, dashboard, settings, config tables, Vault |
| 2. Transactional Core | Services, bookings, payments, invoicing | Service catalogue, booking flow, Stripe + Paystack, invoices, time entries |
| 3. CRM + Email | Contacts, campaigns, Brevo integration | Contact management, email campaigns, segments, tasks, landing pages, lead capture |
| 4. Content + Website | Blog, public website, homepage templates | Blog, public pages, 4 home page templates, landing pages |
| 5. Polish + Launch | Analytics, security, compliance, testing | Dashboard analytics, security hardening, GDPR/POPIA, testing, launch |

**V1 includes:** Blog, landing pages, campaigns, segments, tasks, homepage templates, basic analytics (dashboard metrics).
**Deferred to V2:** Client portal, advanced analytics/reporting, complex task automation, PayPal.

---

## Consequences

### Documents superseded:
- `mm1-08-dev-plan.md` — marked superseded
- `mm1-12-mybizz-planning.md` — marked superseded
- `mm1-21-build-plan.md` — marked superseded

### New document:
- A single build plan document will be created during the planning phase, replacing all three.

### Dependencies:
This ADR cannot be finalised until the unified project documents (P4) and CEO scope review are complete. The phase boundaries and feature assignments depend on the final product scope decision.

---

*End of ADR-012 — Status: PENDING*
