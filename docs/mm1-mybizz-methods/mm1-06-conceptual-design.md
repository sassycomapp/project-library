# Mybizz — Consulting & Services — Conceptual Design
Created: 2026-03-16
Updated: 2026-03-16

---

## Purpose of This Document

This document describes what Mybizz is, who it serves, how it is structured, and the
reasoning behind the key architectural and product decisions that govern the build. It
is written for the developer and the author — not for the agent. It does not contain
build instructions, code patterns, or implementation steps. Those belong in the
development plan and the rules files.

This document should be read at the start of any session in which planning, prompt
writing, or architectural decisions are being made. It is the product and architecture
reference — the "what and why" that gives everything else its context.

---

## 1. What Mybizz Is

Mybizz is a complete online business management platform for consulting and services
businesses, delivered as a subscription SaaS product. Each subscriber receives a fully
operational, isolated application instance — their own online presence and business
management system, from public website through to CRM, bookings, payments, and
reporting.

It is not a toolkit or a framework. It is a finished product. The client configures it;
they do not build it. The distinction matters because it shapes every design decision:
the platform must be immediately usable by a non-technical business owner, and every
feature must work out of the box.

The platform is built on Anvil.works, using Python throughout, with a Material Design 3
(M3) user interface. Development takes place in VS Code with Continue.dev as the agent,
with the Anvil app connected to GitHub as the shared source of truth.

---

## 2. The Strategic Decision — Single Vertical

Mybizz was originally designed as a multi-vertical open platform supporting four
business types: Consulting & Services, E-commerce, Hospitality, and Membership. After
significant development work, the decision was made to narrow to a single vertical —
Consulting & Services only.

This was not an incomplete build. It was a deliberate strategic choice made on the
grounds of complexity, maintenance burden, and focus. A platform that tries to serve
four fundamentally different business models well is harder to build, harder to support,
and harder to sell than one that serves one model exceptionally well.

The consequence of this decision is that the entire codebase, database schema, rules
files, and planning documents are scoped to Consulting & Services. Products, orders,
shopping carts, shipping, room reservations, membership tiers, subscription billing, and
hospitality-specific features are explicitly out of scope. If any of these appear in the
codebase or documentation, they are remnants of the earlier design and should be flagged
and removed.

---

## 3. Who It Serves

The Consulting & Services vertical covers any business that sells professional services,
appointments, or expertise. The common thread is that the business sells time or
deliverables — not physical goods, not accommodation, not access tiers.

Representative examples: day spas and beauty salons, physiotherapy and allied health
practices, personal trainers and fitness coaches, independent consultants and advisors,
life coaches and therapists, legal and accounting firms, studios offering classes or
sessions.

Two commercial patterns are supported within this vertical, and both must be handled
equally well:

**Duration-based services** — a service priced by a time block. A 60-minute massage, a
45-minute personal training session, a 1-hour consultation. The booking flow is
appointment-centric: the client selects a time slot and a provider.

**Unit-based services** — a service priced by a deliverable. A logo design package, a
legal review, a financial audit. The booking flow is engagement-centric: the client
selects a service and initiates the engagement. Invoicing may follow separately.

A single business may offer both types. The platform handles this without the business
owner needing to understand the distinction — they simply configure each service with
the appropriate pricing model.

---

## 4. The Business Model

Mybizz operates as a SaaS subscription. The platform operator (David) maintains the
master template and charges clients a monthly subscription for their instance.

The commercial parameters for V1.x are deliberately conservative:

- Maximum clients: 100
- First 50 clients (beta): $25/month, grandfathered for life
- Remaining 50 clients: $50/month
- Annual revenue at capacity: $45,000
- Direct costs at capacity (Anvil hosting): $18,000/year
- Net income at capacity: $27,000/year
- Support load at capacity: approximately 100 hours/month — sustainable for a solo operator

This is not a venture-scale business. It is a sustainable solo SaaS product with a
clearly defined ceiling and a deliberately simple operational model. The architecture
and feature set are designed to serve this model — not to anticipate growth beyond it.

Clients are onboarded in one of two tiers:

**Standard onboarding** — a 30-minute guided call. The client does the preparatory
work; Mybizz imports data during the call.

**Premium onboarding ($200)** — Mybizz does all setup. The client receives a fully
operational platform without having to touch configuration themselves.

---

## 5. The Dependency Architecture

This is the most important architectural decision in the platform, and it governs
everything else.

Each client receives their own independent Anvil application — their client instance.
This instance does not contain any application code. Instead, it depends on a published
library called master_template, which contains all features, all forms, and all server
functions. The client instance contains only the client's data and configuration.

This architecture has several important consequences:

**Data isolation is absolute.** Each client instance is a separate Anvil app with a
separate database. `app_tables` always resolves to the current client's own data.
Cross-client data access is architecturally impossible — not just prevented by policy,
but structurally impossible.

**Code updates are pull-based.** When the platform operator publishes a new version of
master_template, clients are notified but not automatically updated. Each client chooses
when to adopt the new version and can roll back if needed. This means clients are never
broken by an update they didn't choose.

**Clients never see source code.** The master template is published as a compiled
dependency. Client owners cannot inspect, modify, or copy the platform code.

**The master template contains zero client data.** All state lives in the client
instance's Data Tables. The master template is entirely stateless.

The development workspace is called `master_template_dev`. All feature work is done
here. When a feature set is complete and tested, it is published as a new versioned
release of master_template, which all client instances can then adopt.

---

## 6. The Platform Management Separation

Running Mybizz as a SaaS business requires operator infrastructure: tools to provision
new client instances, monitor client health, distribute updates, and manage billing. This
infrastructure lives in a separate Anvil application called `Mybizz_management`.

The separation is a security requirement. The provisioning and billing infrastructure
for the platform operator must not be accessible from within a client instance. These
are two entirely different concerns — client business management and platform operator
management — and they must be architecturally separate.

`Mybizz_management` is not part of `master_template`. It is not included in any client
instance. It is built after the C&S master template is complete and the first client has
been onboarded manually. Until that point, provisioning is done by hand.

---

## 7. The Provider Model

Within the Consulting & Services vertical, many businesses have multiple practitioners,
therapists, consultants, or trainers — each with their own schedule, their own services,
and their own availability. These are called providers in the platform.

Providers are Staff-role users in the system. A solo operator is the owner and the only
provider. A multi-provider business (a spa with four therapists, a clinic with three
physiotherapists) has one Staff user account per provider, each with their own
availability schedule and service assignments.

All payments go to the business's central payment account. There are no per-provider
payment accounts. Revenue attribution per provider is tracked on bookings and reported
in analytics — this is how a business owner understands each provider's contribution
without splitting payments.

---

## 8. The Feature Architecture

The platform's features are not independently purchased modules in a marketplace sense.
They are configuration-driven capabilities that are present in every instance and can be
enabled or disabled per client. The distinction matters: the code is always there; what
changes is whether it is visible and active.

Feature toggles govern visibility in navigation and public pages. A client who does not
use the blog simply has blog navigation hidden and the public blog route inactive. The
code does not change. This keeps the master template uniform and updates simple.

The core feature groups are:

**Identity and administration** — authentication, RBAC, settings, the Vault. These are
always on. Every instance needs them.

**Public website** — the client's customer-facing online presence. Standard pages
(home, about, contact, privacy, terms), configurable home page templates, landing pages,
and blog. This is not optional — every C&S business needs a public presence.

**Service catalogue** — the commercial heart of the platform. Duration and unit pricing
models. Per-service configuration: provider assignment, availability, intake forms,
meeting type, images, video.

**Bookings and appointments** — the transactional engine. Calendar, availability
management, the booking creation flow, confirmation and reminders, recurring
appointments. Depends on the service catalogue.

**Payments and invoicing** — gateway integration (Stripe, Paystack, PayPal), invoice
generation, payment recording. Integrated into the booking flow — there is no separate
checkout.

**CRM and marketing** — contact management, email campaigns via Zoho Campaigns,
segmentation, task automation. The CRM is Mybizz's UI layer over Zoho CRM as the master
contact record.

**Analytics and reporting** — dashboard analytics, revenue reporting, customer
analytics. The data is collected throughout the system; this feature group surfaces it.

**Security and compliance** — RBAC enforcement, data encryption, audit logging,
GDPR/POPIA compliance. Security is not a phase to be added later — it is enforced from
the authentication system onward. The Security and Compliance phase is the point at
which it is comprehensively verified across the full feature set.

---

## 9. The Vault

API keys and credentials are sensitive. In a multi-client SaaS platform, each client
has their own payment gateway keys, email credentials, and integration secrets. These
must never be stored in application code, environment variables accessible to the
developer, or in Data Tables where they could be read by a compromised query.

The Vault is an encrypted secrets store built into each client instance. It holds all
client API keys. The encryption key used to protect Vault contents is stored in Anvil
Secrets — the only item that ever goes in Anvil Secrets. Client secrets never leave
the Vault in plaintext. Server functions retrieve them via `get_vault_secret()` at
runtime and use them without exposing them to client code.

Access to the Vault is restricted to the Owner role and requires TOTP step-up
authentication (Google Authenticator) on every open. This is not a standard login gate
— it is a per-action step-up that fires even if the user is already logged in as Owner.

The Vault design enforces a clear separation: the platform operator cannot access client
secrets (they live in the client's own instance), and client code cannot access secrets
(they are retrieved server-side only). This is both a security property and a commercial
one — clients own and control their own API keys.

---

## 10. Payments

Three payment gateways are supported. Each client instance uses one gateway, configured
at onboarding. The gateway choice is determined by the client's geography and preference.

**Stripe** is the Anvil-native integration and the primary international gateway. It is
straightforward to implement and broadly accepted globally.

**Paystack** is the appropriate gateway for South African and African clients. Stripe
does not operate in South Africa; Paystack fills this gap.

**PayPal** is included as a globally recognised payment standard with wide consumer
acceptance.

All three gateways use the same gateway-agnostic service layer in the platform code.
Client forms call the service layer; the service layer calls the appropriate gateway.
Gateway selection is determined by configuration, not by branching in client code.

Payment is integrated into the booking flow. There is no separate checkout process.
The payment model is central-account only — all payments go to the business's single
account. Per-provider payment accounts are not supported.

System currency is set at onboarding and is immutable after the first transaction. All
calculations and reporting use the system currency. A display currency for customer-
facing prices is optionally available.

---

## 11. Email and Communication

Three distinct email systems serve different purposes and must not be conflated.

**Anvil built-in email** is the platform-provided email service available to every
Anvil app via `anvil.email.send()`. Each client instance has a monthly quota of
approximately 1,000 emails, which resets on the 1st of each month. This service is
used for system-level emails: login confirmations, password reset links, account
notifications, and other platform-generated messages that do not originate from the
business's own identity. Emails sent via this service come from an Anvil-hosted
address. It is appropriate for system events — not for business correspondence.

**Transactional and marketing email** are both handled by Brevo. Booking confirmations,
reminders, invoices, and contact form auto-replies are transactional and use Brevo's
SMTP relay. Campaign sequences, broadcast emails, and newsletter communications are
marketing and use Brevo's campaign and automation API. Both functions are consolidated
into a single Brevo account per client.

Brevo is client-connected — each client creates and manages their own Brevo account.
The free tier is functional from day one (300 emails/day, SMTP included). Clients who
need higher volume upgrade directly with Brevo. Mybizz has no involvement in the
commercial relationship.

Business email addresses (admin@, help@, etc.) are not provisioned by Mybizz. Clients
use whatever email provider they choose. If they want transactional emails to appear
from their own domain, they configure DKIM in Cloudflare.

The separation between the three systems is intentional and must be maintained. System
events use Anvil; business correspondence and marketing both use Brevo. Mixing them
would compromise deliverability and blur the distinction between platform notifications
and business communications.

**Full detail:** `@devref/brevo-email-reference.md`

---

## 12. The User Roles

Five roles govern access throughout the platform. They are not a flat permission list —
they represent real relationships between people in a consulting or services business.

**Owner** — the business owner. Full access to everything including the Vault,
financial data, and user management. Only the Owner can access and modify Vault secrets.

**Manager** — operational management access. Full access to bookings, customers,
marketing, and reporting. Cannot access the Vault or financial configuration.

**Admin** — administrative staff. Booking and customer management. No access to
financial reporting, settings, or the Vault.

**Staff** — practitioners, therapists, consultants. Access to their own calendar and
bookings. No access to other staff's data, financial information, or settings.

**Customer** — the client's customers. Access only to their own bookings, invoices, and
account in the customer portal.

Role enforcement is server-side. The client can show or hide navigation based on role,
but every server function performs its own role check. Client-side visibility is a UX
convenience, not a security control.

---

## 13. Data Architecture

The platform uses Anvil Data Tables, which are backed by PostgreSQL. All data access
is server-side. Client forms never query Data Tables directly — they call server
functions which query and return data.

Several tables have a single-row pattern: `business_profile`, `email_config`,
`payment_config`, `theme_config`. These tables always have zero or one row. The read
pattern checks for the row's existence and handles the zero-row case explicitly.

The `instance_id` field does not exist on all tables. Some tables — notably `invoice`,
`bookings`, and `time_entries` — use `customer_id` or `staff_id` rather than
`instance_id`. This is an architectural reality that must be accounted for in any query
against these tables. Assuming `instance_id` exists everywhere is a known failure mode.

The `create_initial_config()` function bootstraps a fresh installation with the correct
initial state for all configuration tables. It is a provisioning utility — not a
settings service function — and must not be modified during normal development or
polish passes.

---

## 14. The Navigation Architecture

Two navigation systems are used, and they are not interchangeable.

**Authenticated areas** (admin panel and customer portal) use custom HtmlTemplate
layout forms (`@theme:standard-page.html`) with plain Link components built
programmatically. Navigation is driven by lambda click handlers with mandatory loop
variable capture, calling `open_form(string)`. `NavigationDrawerLayoutTemplate`,
`NavigationLink`, and the `navigate_to` property are not used in this project. This is
the settled and permanent navigation standard, documented in the ADR (Part D §13).

**Public website pages** use the Anvil Routing dependency. Public routes are decorated
with `@router.route`. This system handles shareable URLs, browser history, and the
public page layout separately from the authenticated layout.

The two systems must not be mixed. Authenticated forms use the custom HtmlTemplate
layout with Link components. Public pages use the Routing dependency.

---

## 15. What Is Out of Scope

The following are explicitly not part of the Consulting & Services platform and must not
appear in the codebase, rules files, or planning documents:

- Product catalogue, shopping cart, inventory management, shipping
- Room reservations and hospitality table bookings
- Membership tiers, subscription access control, recurring billing (for clients of the
  platform — Mybizz's own subscription billing for its clients is handled in
  Mybizz_management)
- Multi-vertical feature toggle system
- Any integration with shipping providers (Bob Go, Easyship, or similar)

If any of these appear in any file, they are remnants of the earlier open-verticals
design and should be flagged for removal.

---

*End of file — cs-conceptual-design.md*
