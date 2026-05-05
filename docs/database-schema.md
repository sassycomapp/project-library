# Mybizz CS — Database Schema

**Date:** 2026-05-03
**Source:** mb-2-cs/anvil.yaml (live schema)
**Total Tables:** 36
**Vertical:** Consulting & Services only

---

## Table Groups

### Core & Configuration (10)
1. `activity_log` — User action tracking
2. `business_profile` — Client business information
3. `config` — Key-value configuration storage
4. `email_config` — Email service configuration (Brevo)
5. `files` — Anvil Media storage metadata
6. `payment_config` — Payment gateway configuration
7. `rate_limits` — API rate limiting state
8. `theme_config` — M3 theme customization
9. `users` — System users and staff (extended Anvil Users)
10. `vault` — Encrypted secrets storage

### Bookings (6)
11. `availability_exceptions` — Booking availability overrides
12. `availability_rules` — Recurring availability schedules
13. `booking_metadata_schemas` — Dynamic booking form schemas (time-based vs unit-based)
14. `bookings` — Service appointments
15. `services` — Service offerings
16. `contact_submissions` — Website contact form submissions

### CRM (9)
17. `contacts` — Unified contact database (leads and customers)
18. `contact_events` — Contact activity timeline
19. `contact_counter` — Counter for contact ID generation
20. `contact_campaigns` — Contact enrollment in email campaigns
21. `email_campaigns` — Email marketing campaigns
22. `segments` — Contact segmentation
23. `tasks` — CRM tasks and follow-ups
24. `leads` — Captured leads (simultaneous creation with contacts)
25. `lead_captures` — Lead capture form configurations

### Email (3)
26. `email_templates` — Email message templates
27. `email_log` — Email send history
28. `webhook_log` — Payment gateway webhook history

### Content (4)
29. `blog_posts` — Blog content
30. `blog_categories` — Blog post categories
31. `pages` — Static website pages
32. `landing_pages` — Marketing landing pages (V1 — schema present, feature included) (V1 — schema present, feature included) (V1 — schema present, feature included) (V1 — schema present, feature included)

### Finance (3)
33. `invoice` — Invoice records
34. `invoice_items` — Invoice line items
35. `time_entries` — Time tracking for services

---

## Key Tables

### contacts (Unified Person Record)
All customers are contacts but not all contacts are customers. Single source of truth for all person records.

| Field | Type | Notes |
|---|---|---|
| contact_id | string | Human-readable ID (C-{number}) |
| instance_id | link → users | Client identifier |
| first_name, last_name | string | |
| email | string | Indexed, nullable for walk-ins |
| phone | string | |
| status | string | new, active, inactive, archived |
| source | string | Website Form, Booking Widget, Manual Entry |
| lifecycle_stage | string | new, active, at_risk, lost |
| tags | simpleObject | Array of tag strings |
| total_spent | number | Cached, updated after bookings |
| total_transactions | number | Cached count |
| average_order_value | number | Cached |
| last_contact_date | datetime | UTC |
| date_added | datetime | UTC |
| created_at, updated_at | datetime | UTC |
| internal_notes | string | |
| preferences | simpleObject | |

**See:** ADR-004 (Lead Capture: Simultaneous Creation), ADR-010 (Single Contacts Table)

### bookings
| Field | Type | Notes |
|---|---|---|
| booking_id | string | |
| contact_id | link → contacts | Person who booked |
| service_id | link → services | |
| resource_id | link → users | Staff provider |
| booking_type | string | appointment, service, event |
| status | string | PENDING, CONFIRMED, COMPLETED, CANCELLED |
| start_datetime | datetime | UTC |
| end_datetime | datetime | UTC |
| total_price | number | |
| payment_status | string | unpaid, deposit_paid, paid, refunded |
| payment_id | string | Gateway transaction ID |
| special_requests | string | |
| metadata | simpleObject | Per booking_type schema |
| booking_number | string | |
| created_at, updated_at | datetime | UTC |

### services
| Field | Type | Notes |
|---|---|---|
| service_id | string | |
| name | string | Public |
| description | string | Public |
| duration_minutes | number | 0 = variable |
| price | number | |
| category | string | |
| provider_id | link → users | |
| meeting_type | string | In-Person, Video Call, Phone Call |
| pricing_model | string | duration, unit, custom |
| images | simpleObject | Array of URLs |
| video_url | string | |
| is_active | bool | |
| created_at | datetime | UTC |

### users (Extended Anvil Users)
| Field | Type | Notes |
|---|---|---|
| email | string | Unique, indexed |
| enabled | bool | |
| last_login | datetime | UTC |
| password_hash | string | Anvil managed |
| n_password_failures | number | Anvil managed |
| confirmed_email | bool | |
| role | string | owner, manager, admin, staff, customer |
| account_status | string | active, suspended, deleted |
| phone | string | |
| permissions | simpleObject | JSON permission flags |
| created_at | datetime | UTC |
| signed_up | datetime | UTC |
| email_confirmation_key | string | |
| mfa | simpleObject | |

### vault
| Field | Type | Notes |
|---|---|---|
| name | string | Unique, indexed |
| value | string | Encrypted |
| created_at, updated_at | datetime | UTC |
| updated_by | link → users | |

Stored secrets: `brevo_smtp_key`, `brevo_api_key`, `stripe_secret_key`, `paystack_secret_key`.

### payment_config
| Field | Type | Notes |
|---|---|---|
| active_gateway | string | stripe, paystack |
| stripe_publishable_key | string | Public |
| stripe_connected | bool | |
| stripe_connected_at | datetime | UTC |
| paystack_connected | bool | |
| paystack_connected_at | datetime | UTC |
| paypal_client_id | string | |
| paypal_connected | bool | |
| paypal_connected_at | datetime | UTC |
| test_mode | bool | |
| configured_at | datetime | UTC |

**Note:** Secret keys are stored in the Vault only, not in this table.

---

## Key Architectural Patterns

### UTC Storage & Timezone Display
All datetimes stored in UTC. Display conversion uses `business_profile.timezone` (IANA string).

### Multi-Tenant Isolation
Tables with `instance_id` → `users` enforce client data isolation. Some tables (bookings, invoice, time_entries) use `contact_id` or `staff_id` instead — verify schema before querying.

### Secret Management
Payment gateway secret keys stored in `vault` table only (encrypted at rest). Credentials retrieved via `get_vault_secret()` in server code.

### Lead Capture (ADR-004)
When lead submitted from landing page: both `leads` and `contacts` rows created simultaneously. `leads.converted_to_contact_id` set immediately. Contact auto-enrolled in welcome campaign.

### Email Architecture (ADR-001)
- Brevo SMTP — Transactional email
- Brevo Campaigns API — Marketing email
- All clients use identical SMTP host (smtp-relay.brevo.com:587)
- Per-client credentials in vault

---

*End of file*
