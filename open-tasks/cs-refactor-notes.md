# 1. What we are building
A SaaS platform for consulting and services businesses where each client gets an isolated Anvil application instance holding only their data and configuration, with all application code delivered via a shared mastertemplate dependency.
​

A single‑vertical product focused on consulting/services only, supporting duration‑based (time‑priced) and unit‑based (deliverable‑priced) services, with e‑commerce, hospitality, memberships, shipping, and other multi‑vertical features explicitly excluded.
​

A dependency architecture where client instances contain no application code, mastertemplatedev is the development workspace, and published versions of mastertemplate are pulled by client instances when they choose to update.
​

A separate Mybizzmanagement app providing platform‑operator infrastructure for provisioning client instances, monitoring, billing, and update distribution, kept strictly separate from client apps and from mastertemplate.
​

A provider model where each practitioner (therapist, consultant, trainer) is a Staff user with their own availability and service assignments, while all payments are routed to a single business account and provider revenue is tracked in analytics rather than via separate payment accounts.
​

Core feature groups including identity and administration (auth, RBAC, settings, Vault), public website (standard pages, templates, landing pages, blog), service catalogue, bookings and appointments, payments and invoicing, CRM and marketing, analytics and reporting, and security and compliance.
​Please nugget 

A Vault‑based secrets system where each client instance stores its own gateway and email credentials in an encrypted vault, the vault key lives in Anvil Secrets, access is restricted to the Owner role, and sensitive operations require TOTP step‑up authentication.
​

A concrete data schema defined in anvil.yaml with 47 Data Tables covering bookings, services, contacts, customers, email, landing pages, payments, invoices, tasks, users, vault, and supporting structures, representing the current scaffold reality for the CS app.
​
---

#2. How well it is defined
Clearly defined: Business model, target vertical, dependency architecture, platform‑management separation, provider model, payment model, user roles, navigation model, and out‑of‑scope boundaries are explicitly described in mm1-06-conceptual-design-2.md and related ADRs.
​

Clearly defined: Core feature groups and security patterns (including Vault design, RBAC enforcement, data‑access rules, and email layer separation) are specified at a conceptual and architectural level with clear intent.
​

Clearly defined: The current schema scaffold is represented by anvil.yaml with 47 Data Tables; these should be referred to as “Data Tables defined in anvil.yaml” rather than “production tables” to avoid over‑stating what the docs guarantee.
​

Inferred only: User flows for key features are described conceptually in narrative form, but there are no formal screen‑by‑screen journey maps or state‑diagram specifications in the allowed CS documentation.
​

Partially defined: UI implementation patterns (navigation via lambda + open_form, server‑side data access, Vault access patterns) are specified, but there is no exhaustive component‑by‑component UI specification across all screens.
​

Missing: Testing strategy, QA process, and formal validation procedures are not documented in the authoritative CS sources reviewed (mm1, ADRs, anvil.yaml).

Missing: Detailed external API contracts (field‑level request/response specifications) for Stripe, Paystack, PayPal, and Brevo are not present, even though high‑level integration architecture and responsibilities are well defined.
​

Partially defined: Performance and scalability are framed by a 100‑client V1.x capacity limit and solo‑operator support constraints, but there are no detailed metrics for latency, throughput, or heavy‑load behaviour.
​

Inferred only: The documentation is technical, specific, and implementation‑oriented in tone (evidenced by ADRs on Vault security and navigation lambda usage), but this remains a qualitative judgement rather than a formal requirement.
​
---

# 1. Conceptually aligned tables
These are directly anchored in the CS conceptual design in mm1-06; they are core to the product, not just the schema.

bookings – Core operational table; mm1-06 describes bookings/appointments as “the transactional engine” of the platform.
​

services – Service catalogue; mm1-06 calls this “the commercial heart of the platform”, with duration/unit pricing and provider assignment.
​

contacts – Unified contact database; explicitly described as core CRM with integration to the lead/capture pattern.
​

users – Five roles (Owner, Manager, Admin, Staff, Customer) with server‑enforced RBAC; clearly defined in the roles section.
​

vault – Encrypted secrets store; conceptual design and ADRs describe it as the only place for client API keys with TOTP step‑up access.
​

payment_config – Payment gateway configuration; mm1-06 details Stripe, Paystack, and PayPal and central‑account rules.
​

business_profile – Business identity, including timezone setting used for UTC storage/display conversion.

config – Key–value config store; conceptual design mentions feature toggles and config‑driven behaviour.
​

These 8 tables are the ones you should treat as “can’t ship CS without them” under the current design.

# 2. Schema‑documented only
These have clear schema definitions (and likely mm1‑20 coverage) but are not strongly foregrounded as independent product concepts in mm1-06; they implement or support higher‑level features.

activity_log – Audit trail for security/compliance; mentioned conceptually only at a high level.

availability_exceptions – Booking availability exceptions; implementation detail for schedules.

availability_rules – Recurring availability schedules; schema implementation of availability management.

client_notes – Internal notes on customers; implied as CRM detail but not conceptually centre‑stage.

contact_campaigns – Enrollment of contacts in campaigns; structural CRM/marketing link, concept is “campaigns” and “segments”.

contact_counter – ID counter singleton; pure implementation detail.

contact_events – Activity timeline; schema for CRM history, concept is “timeline” but not heavily elaborated.

contact_submissions – Website contact form submissions; conceptual docs mention contact forms, not this table by name.

customers – Customer entities; structurally separate from contacts, but conceptual emphasis is on the unified contacts model.

email_campaigns – Marketing campaigns; Brevo use is foregrounded conceptually, not this table specifically.

email_config – Email service configuration; structure matches the three‑layer email architecture.

email_log – Email delivery log; compliance support but not a primary product concept.

email_templates – Template library; supports transactional/notification flows.

expenses – Expense tracking; part of finance/reporting but not strongly developed conceptually.

files – File metadata; supports uploads/media.

invoice – Invoice records; invoicing is conceptually core, but most detail lives at schema/implementation level.

invoice_items – Invoice line items; implementation detail of invoicing.

landing_pages – Landing page configs; concept described, full detail is schema‑level.

lead_captures – Lead capture configs; ADR pattern is the conceptual anchor, schema holds detail.

leads – Leads themselves; again, anchored by the ADR pattern more than conceptual narrative.

pages – Website page configs; conceptual docs talk about standard pages/templates.

rate_limits – Rate‑limit state; security infra, not a business concept.

segments – Contact segmentation; concept exists (segments, targeting), schema holds detail.

tasks – CRM tasks; conceptual design mentions task automation but not this table by name.

theme_config – Theme customization; concept is “M3 theme, configurable”, schema defines exact fields.

ticket_messages – Per‑ticket messages; detail of the support system.

tickets – Support tickets; support is mentioned, full structure is schema‑level.

time_entries – Time tracking entries; supports finance/reporting but is not deeply elaborated in mm1-06.

webhook_log – Webhook event log; infra for payment/events, not a first‑class business concept.

These 30 tables are valid under the current design but sit one layer down: they are implementation of concepts, not primary CS concepts by themselves.

# 3. Weak / review‑candidate tables
These exist in the schema but have relatively weak conceptual anchoring in the CS‑only narrative; they deserve explicit “keep/trim/re‑scope” decisions.
backups – Backup records; operationally important but not part of the CS product story.
blog_categories – Blog categories; blog is mentioned as a basic website feature, but categories are not emphasised.
blog_posts – Blog content; again, present as a basic feature, but not a core CS differentiator in the current design.
bookable_resources – Bookable resources; schema pattern is explicit, but conceptual docs lean on services/providers rather than a separate “resource” concept.
booking_metadata_schemas – Dynamic booking schemas; powerful capability, but not clearly surfaced at conceptual level.
event_registrations – Event registrations; events are barely (if at all) in the CS‑only conceptual story.
events – Event definitions; same concern as above: may be over‑scope for core CS v1.
kb_articles – Knowledge base articles; support/KB not clearly called out as a core CS feature.
kb_categories – KB categories; same as above.
reviews – Customer reviews; briefly mentioned in flows, but not a major CS product pillar.

These 11 are where refactor decisions and scope cuts are most likely: whether to keep them in v1 CS, defer, or document their role explicitly.

# 4. Counts
Conceptually aligned: 8 tables.

Schema‑documented only: 30 tables.
​

# Weak / review candidates: 11 tables.

You can now treat:

the 8 aligned as “core CS data model,”

the 30 schema‑documented as “implementation layer we probably keep, but can reshuffle and document better,” and

the 11 weak as your shortlist for scope and clean‑up decisions in the next planning pass.


---
# Next steps
From here, a natural next step is to choose whether you want to tackle 
(b) start drafting implementation prompts for one feature slice (e.g. the Vault or bookings) using this baseline—do you have a preference on which to do first?

