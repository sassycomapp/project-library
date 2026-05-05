# 09-multi-vertical-to-single-vertical-conversion
**Platform Narrowed from Open Verticals to Consulting & Services Only**

Date: 2026-04-04
Status: Accepted
Source: Session 11 — Multi-vertical audit and remediation

---

## Context

Mybizz was originally designed and partially built as a multi-vertical open platform supporting four business types:

- Consulting & Services
- E-commerce
- Hospitality
- Membership

The entire architecture — codebase, database schema, rules files, scaffold, and prompt system — was built to that specification. Clients could activate any combination of verticals.

After significant development work, it became clear that maintaining four fundamentally different business models in a single platform created unsustainable complexity, maintenance burden, and diluted strategic focus. A platform that tries to serve four models well is harder to build, harder to support, and harder to sell than one that serves one model exceptionally well.

---

## Decision

Mybizz is narrowed permanently to a single vertical: **Consulting & Services only.**

This is a deliberate architectural decision. It is not an incomplete build. The three removed verticals — E-commerce, Hospitality, and Membership — are permanently out of scope.

---

## What Was Removed (Session 11)

All 35 rules files audited and remediated for multi-vertical content.

**Database tables removed from specs:**
`products`, `orders`, `cart`, `shipments`, `membership_tiers`, `subscriptions`, `courier_config`

**Server packages removed from specs:**
`server_products`, shipping services, subscription service, hospitality pricing

**Client packages removed from specs:**
products package, room management forms, e-commerce public pages, courier config forms, membership components

**Navigation:** all out-of-scope vertical items removed from layout specs

**Integrations removed:** Bob Go, Easyship, subscription billing

**Anvil.works database:** verified clean — out-of-scope tables were already absent; 5 missing in-scope tables created

---

## What Is In Scope

Bookings, services, contacts, CRM, invoicing, payments, and marketing.

The C&S vertical is the complete intended scope. Nothing has been omitted. Nothing is planned for later phases that restores the removed verticals.

---

## Consequences

Any reference to the following found in any rules file, spec file, devref file, schema, or codebase is a remnant of the multi-vertical design and must be flagged and removed:

- Products, orders, shopping cart, inventory, shipping
- Room reservations, hospitality pricing, table bookings
- Membership tiers, subscription access control, recurring billing
- Bob Go, Easyship, or any shipping provider integration
- `server_products`, `server_hospitality`, `server_membership`, or equivalent packages

---


*End of ADR-009*