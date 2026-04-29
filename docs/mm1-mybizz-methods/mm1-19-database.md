---
name: Database Schema — Mybizz V1.x
globs: ["**/*.md"]
description: Complete data model for Mybizz platform — 47 tables from production anvil.yaml covering core, bookings, customers, content, support, finance, integration, CRM/marketing, website/landing pages, and security. Authority reference for all database work. Derived from actual Anvil app as of 2026-04-10.
alwaysApply: false
---

# Mybizz Database Schema v1.0 (Production)

**Date:** 2026-04-10  
**Source:** mb-2-cs/anvil.yaml  
**Package:** mb_2_cs  
**Total Tables:** 47 (actual production schema)  
**Vertical:** Consulting & Services only  

**Authority:** Mandatory reference for all database design and implementation work. This schema is derived from the actual Anvil Data Tables configuration and represents the production database structure.

**Related resources:**
- `set2-database-schema-2026-04-10.md` — Source document (direct from anvil.yaml)
- `policy_nomenclature.md` — Table naming conventions
- `spec_vault.md` — Encryption and secrets architecture
- `spec_integrations.md` — Integration table usage patterns

---

## Complete Table List (47 Tables)

### Core & Configuration (1-12)
1. activity_log — User action tracking
2. business_profile — Client business information
3. config — Key-value configuration storage
4. email_config — Email service configuration
5. files — File storage metadata
6. payment_config — Payment gateway configuration
7. rate_limits — API rate limiting state
8. theme_config — Website theme configuration
9. users — System users and staff
10. vault — Encrypted secrets storage
11. webhook_log — Webhook event history
12. backups — System backup records

### Bookings & Resources (13-18)
13. availability_exceptions — Booking availability overrides
14. availability_rules — Recurring availability schedules
15. bookable_resources — Services/resources available for booking
16. booking_metadata_schemas — Dynamic booking form schemas
17. bookings — Service appointments and bookings
18. services — Service offerings

### Customers & CRM (19-26)
19. client_notes — Internal notes on customers
20. contact_campaigns — Contact enrollment in email campaigns
21. contact_counter — Counter for contact ID generation
22. contact_events — Contact activity timeline
23. contact_submissions — Website contact form submissions
24. contacts — CRM contacts (leads and customers)
25. customers — Customer records (legacy, see contacts)
26. segments — Contact segments for targeting

### Email & Marketing (27-32)
27. email_campaigns — Email marketing campaigns
28. email_log — Email send history
29. email_templates — Email message templates
30. lead_captures — Lead capture form configurations
31. leads — Captured leads (pre-conversion)
32. tasks — CRM tasks and follow-ups

### Content & Pages (33-36)
33. blog_categories — Blog post categories
34. blog_posts — Blog content
35. landing_pages — Marketing landing pages
36. pages — Website pages

### Support & Reviews (37-40)
37. kb_articles — Knowledge base articles
38. kb_categories — Knowledge base categories
39. reviews — Customer reviews and ratings
40. tickets — Support tickets

### Finance & Events (41-46)
41. ticket_messages — Support ticket messages
42. invoice — Invoice records
43. invoice_items — Line items on invoices
44. expenses — Business expense tracking
45. events — Event definitions
46. event_registrations — Event registration records
47. time_entries — Time tracking for services

---

## Core Tables Overview

### Table 1: activity_log
**Purpose:** User action tracking for audit trails and compliance.

**Key Fields:**
- user_id → users
- action_type (string)
- description (string)
- ip_address (string)
- metadata (simpleObject)
- created_at (datetime)

---

### Table 2: business_profile
**Purpose:** Client's business identity — name, logo, contact info, social media, timezone.

**Key Fields:**
- business_name (string)
- description (string)
- logo (media)
- contact_email (string)
- phone (string)
- website_url (string)
- tagline (string)
- address_line_1, address_line_2 (string)
- city, country, postal_code (string)
- **timezone (string)** — IANA timezone (e.g., "America/New_York") — **Critical for datetime display**
- social_facebook, social_instagram, social_x, social_linkedin (string)
- created_at, updated_at (datetime)

**Important:** The timezone field governs all datetime display conversions. All datetimes stored in UTC.

---

### Table 3: config
**Purpose:** Key-value configuration store (single row per key).

**Key Fields:**
- key (string) — Configuration key (unique, indexed)
- value (simpleObject) — Configuration value (JSON)
- category (string)
- updated_at (datetime)
- updated_by → users

**Standard Keys:**
- system_currency (string, immutable after first transaction)
- display_currency (string, optional)
- exchange_rate (number)
- test_mode (bool)
- bookings_enabled, services_enabled, blog_enabled, marketing_enabled (bool)
- home_template, home_config, about_config (JSON)
- google_maps_api_key (string)
- privacy_policy, terms_conditions (text)

---

### Table 4: email_config
**Purpose:** Email service configuration (Brevo SMTP for transactional email per ADR-001).

**Key Fields:**
- email_provider (string) — "brevo" (ADR-001)
- brevo_smtp_host (string) — "smtp-relay.brevo.com"
- brevo_smtp_port (number) — 587
- smtp_username (string) — Encrypted
- smtp_password (string) — Via Anvil Secrets
- from_email (string)
- from_name (string)
- configured (bool)
- configured_at (datetime)

**Important:** All clients use identical SMTP host/port. Per-client credentials in Vault.

---

### Table 5: files
**Purpose:** File storage metadata for media uploads.

**Key Fields:**
- path (string)
- file (media) — Anvil Media component
- file_version (string)

---

### Table 6: payment_config
**Purpose:** Payment gateway configuration (Stripe, Paystack, PayPal).

**Key Fields:**
- active_gateway (string) — "stripe" | "paystack" | "paypal"
- stripe_publishable_key (string)
- stripe_secret_key (string) — **Should be in vault only**
- stripe_connected (bool)
- stripe_connected_at (datetime)
- paystack_public_key (string)
- paystack_secret_key (string) — **Should be in vault only**
- paystack_connected (bool)
- paystack_connected_at (datetime)
- paypal_client_id (string)
- paypal_secret (string) — **Should be in vault only**
- paypal_connected (bool)
- paypal_connected_at (datetime)
- test_mode (bool)
- configured_at (datetime)

**Critical Note:** Secret keys should be stored in vault table, not here. This table may display masked values.

---

### Table 7: rate_limits
**Purpose:** API rate limiting state (persistent, survives server restart).

**Key Fields:**
- identifier (string) — User ID or IP address (indexed)
- count (number) — Request count in current window
- reset_time (datetime) — When current window expires
- last_request (datetime) — Timestamp of most recent request

---

### Table 8: theme_config
**Purpose:** Material Design 3 theme customization.

**Key Fields:**
- primary_color (string) — Hex code (e.g., "#1976D2")
- accent_color (string) — Hex code (e.g., "#FF4081")
- font_family (string) — Font name
- header_style (string) — Template variant
- updated_at (datetime)

---

### Table 9: users
**Purpose:** System users and staff (extended Anvil Users table).

**Key Fields:**
- email (string) — Unique, indexed
- enabled (bool)
- last_login (datetime)
- password_hash (string) — Anvil managed
- n_password_failures (number) — Anvil managed
- confirmed_email (bool)
- role (string) — "owner" | "manager" | "admin" | "staff" | "customer" | "visitor"
- account_status (string) — "active" | "suspended" | "deleted"
- phone (string)
- permissions (simpleObject) — JSON object of permission flags
- created_at (datetime)

**Role Hierarchy:**
- **owner** — Full access, vault management, billing
- **manager** — Operational access, staff management
- **admin** — Day-to-day operations
- **staff** — Limited to assigned resources/services
- **customer** — Own data only
- **visitor** — No data access

---

### Table 10: vault
**Purpose:** Encrypted secrets storage (payment gateway credentials, API keys).

**Key Fields:**
- name (string) — Secret name
- value (string) — Encrypted secret value
- created_at (datetime)
- updated_at (datetime)
- updated_by → users

**Stored Secrets:**
- brevo_smtp_key (SMTP authentication)
- brevo_api_key (Campaigns API)
- stripe_secret_key
- paystack_secret_key
- paypal_secret

---

## Booking Tables (13-18)

### Table 13: availability_exceptions
Exceptions to recurring operating hours (public holidays, special closures).

**Key Fields:**
- resource_id → bookable_resources
- exception_date (date)
- start_time, end_time (string, HH:MM)
- is_available (bool)
- reason (string)

---

### Table 14: availability_rules
Recurring availability schedules (operating hours).

**Key Fields:**
- resource_id → bookable_resources
- day_of_week (number) — 0=Sunday to 6=Saturday
- start_time, end_time (string, HH:MM)
- is_active (bool)

---

### Table 15: bookable_resources
Services or resources available for booking (therapists, equipment, rooms).

**Key Fields:**
- resource_id (string)
- name (string)
- resource_type (string) — "staff" | "equipment" | "space"
- description (string)
- capacity (number)
- hourly_rate, daily_rate (number)
- metadata (simpleObject)
- is_active (bool)
- created_at (datetime)

---

### Table 16: booking_metadata_schemas
Dynamic booking form schemas (custom metadata per booking type).

**Key Fields:**
- schema_name (string)
- booking_type (string) — "appointment" | "service" | "event"
- field_definitions (simpleObject) — JSON array of field objects
- is_active (bool)

---

### Table 17: bookings ⭐ CORE OPERATIONAL TABLE
Service appointments and bookings.

**Key Fields:**
- booking_id (string)
- customer_id → customers
- service_id → services
- resource_id → bookable_resources
- contact_id → contacts (CRM link)
- booking_type (string)
- status (string) — "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
- start_datetime (datetime) — **Stored in UTC**
- end_datetime (datetime) — **Stored in UTC**
- total_price (number)
- payment_status (string) — "unpaid" | "deposit_paid" | "paid" | "refunded"
- payment_id (string) — Payment gateway transaction ID
- special_requests (string)
- metadata (simpleObject)
- created_at (datetime)
- updated_at (datetime)

**Important Patterns:**
- When booking created: contact_id populated (creates/finds contact)
- contact_events entry created (event_type: booking)
- Customer enrolled in campaign if trigger = booking_created
- All datetimes in UTC; display conversion via business_profile.timezone

---

### Table 18: services ⭐ CORE OPERATIONAL TABLE
Service offerings available for booking.

**Key Fields:**
- service_id (string)
- name (string)
- description (string)
- duration_minutes (number)
- price (number)
- category (string)
- provider_id → users
- meeting_type (string) — "In-Person" | "Video Call" | "Phone Call"
- pricing_model (string)
- images (simpleObject)
- video_url (string)
- is_active (bool)
- created_at (datetime)

---

## CRM & Contact Tables (19-26)

### Table 19: client_notes
Internal staff notes on customers.

**Key Fields:**
- customer_id → customers
- author_id → users
- note_text (string)
- note_type (string)
- is_confidential (bool) — RBAC restricted
- is_important (bool)
- created_at (datetime)

---

### Table 20: contact_campaigns
Contact enrollment in email campaigns.

**Key Fields:**
- id (string)
- contact_id → contacts
- campaign_id → email_campaigns
- sequence_day (number)
- status (string) — "enrolled" | "sent" | "opened" | "clicked" | "completed"
- enrolled_date (datetime)
- last_email_sent_date (datetime)
- completed_date (datetime)

**Purpose:** Tracks each contact's position in campaign sequences.

---

### Table 21: contact_counter
Single-row counter for contact ID generation.

**Key Fields:**
- value (number) — Sequential counter, starts at 0

**Purpose:** Thread-safe contact_id generation. Increment via @in_transaction decorator.

---

### Table 22: contact_events ⭐ CRM ACTIVITY TIMELINE
Contact activity timeline — every interaction logged.

**Key Fields:**
- contact_id → contacts
- event_type (string) — "booking" | "order" | "email_opened" | "email_clicked" | "note" | "form_submit" | "payment" | etc.
- event_date (datetime)
- event_data (simpleObject) — JSON with event details
- related_id (string) — booking_id, order_id, campaign_id, etc.
- created_at (datetime)

**Purpose:** Complete audit trail for each contact's relationship with the business.

---

### Table 23: contact_submissions
Website contact form submissions.

**Key Fields:**
- name (string)
- email (string)
- phone (string)
- message (string)
- submitted_date (datetime)
- status (string) — "new" | "read" | "replied"

---

### Table 24: contacts ⭐ CRM CORE TABLE
Unified contact database (leads and customers).

**Key Fields:**
- contact_id (string) — Human-readable (C-{number})
- instance_id → users
- first_name (string)
- last_name (string)
- email (string)
- phone (string)
- status (string) — "new" | "active" | "inactive" | "archived"
- source (string)
- lifecycle_stage (string) — "new" | "active" | "at_risk" | "lost"
- tags (simpleObject) — Array of tag strings
- total_spent (number)
- total_transactions (number)
- last_contact_date (datetime)
- date_added (datetime)
- created_at (datetime)
- updated_at (datetime)

**ADR-004 Integration:** When lead captured, contact created simultaneously. Leads.converted_to_contact_id set immediately.

---

### Table 25: customers
Customer records (legacy, see contacts for CRM integration).

**Key Fields:**
- customer_id (string)
- user_id → users (if registered)
- contact_id → contacts (CRM link)
- first_name, last_name (string)
- email (string)
- phone (string)
- address (simpleObject)
- notes (string)
- tags (simpleObject)
- lifetime_value, total_bookings, total_orders (number)
- status (string) — "active" | "inactive"
- created_at, updated_at (datetime)

---

### Table 26: segments
Contact segmentation for targeting campaigns.

**Key Fields:**
- segment_id (string)
- instance_id → users
- segment_name (string)
- segment_type (string) — "Pre_Built" | "Custom"
- filter_criteria (simpleObject) — JSON filter definition
- contact_count (number) — Cached
- is_active (bool)
- created_date (datetime)

---

## Email & Marketing Tables (27-32)

### Table 27: email_campaigns
Email marketing campaigns (sequences, broadcasts).

**Key Fields:**
- campaign_id (string)
- instance_id → users
- campaign_name (string)
- campaign_type (string)
- status (string) — "draft" | "active" | "paused" | "completed"
- emails_sent, opens, clicks, conversions (number)
- revenue_generated (number)
- campaign_settings (simpleObject)
- created_date (datetime)
- last_run_date (datetime)

---

### Table 28: email_log
Email delivery log (audit trail).

**Key Fields:**
- recipient (string)
- subject (string)
- template_id → email_templates
- status (string) — "sent" | "failed" | "bounced"
- error_message (string)
- sent_at (datetime)

---

### Table 29: email_templates
Email template library.

**Key Fields:**
- template_id (string)
- name (string) — "booking_confirmation", "order_receipt", etc.
- subject (string) — Supports {{variables}}
- body_html, body_text (string)
- template_type (string) — "transactional" | "notification"
- is_active (bool)

---

### Table 30: lead_captures
Lead capture form configurations (exit-intent, timed, scroll popups).

**Key Fields:**
- capture_id (string)
- instance_id → users
- capture_name (string)
- trigger_type (string) — "exit_intent" | "timed" | "scroll"
- trigger_settings (simpleObject) — JSON configuration
- form_fields (simpleObject) — JSON field definitions
- offer_text (string)
- status (string) — "active" | "paused"
- captures_count, conversions_count (number)
- created_date (datetime)

---

### Table 31: leads (ADR-004: Simultaneous Creation)
Captured leads (pre-conversion to contact).

**Key Fields:**
- lead_id (string)
- instance_id → users
- email (string)
- name (string)
- phone (string)
- source (string)
- landing_page_id → landing_pages
- capture_id → lead_captures
- **converted_to_contact_id → contacts** — **Set immediately on creation (ADR-004)**
- status (string) — "new" | "contacted" | "qualified" | "converted"
- captured_at (datetime)
- client_id → users

**Critical ADR-004 Pattern:** When lead submitted, both leads + contacts rows created simultaneously. leads.converted_to_contact_id set immediately to new contact. Contact auto-enrolled in welcome campaign.

---

### Table 32: tasks
CRM tasks and follow-ups.

**Key Fields:**
- task_id (string)
- instance_id → users
- contact_id → contacts (nullable)
- task_title (string)
- task_type (string) — "follow_up" | "review_request" | "callback" | "custom"
- due_date (date)
- completed (bool)
- completed_date (datetime)
- notes (string)
- auto_generated (bool)
- created_at (datetime)

---

## Content & Pages Tables (33-36)

### Table 33: blog_categories
Blog post categories.

**Key Fields:**
- category_id (string)
- name (string)
- slug (string)
- description (string)

---

### Table 34: blog_posts
Blog content (rich text editor, SEO).

**Key Fields:**
- post_id (string)
- title (string)
- slug (string)
- content (string)
- excerpt (string)
- featured_image (media)
- author_id → users
- category_id → blog_categories
- status (string) — "draft" | "published" | "archived"
- view_count (number)
- published_at (datetime)
- created_at, updated_at (datetime)

---

### Table 35: landing_pages
Promotional landing pages with conversion tracking.

**Key Fields:**
- landing_page_id (string)
- instance_id → users
- title (string)
- slug (string) — Unique URL
- template_type (string) — "lead_capture" | "service_launch" | "event" | "vsl"
- config (simpleObject) — Template configuration JSON
- status (string) — "draft" | "published" | "archived"
- views_count, conversions_count (number)
- created_date (datetime)
- published_date (datetime)

---

### Table 36: pages
Static website pages (home, about, services, contact).

**Key Fields:**
- page_name (string) — "home" | "about" | "services" | "contact"
- page_title (string)
- slug (string)
- components (simpleObject) — JSON array of component definitions
- is_published (bool)
- view_count (number)
- created_at, updated_at (datetime)

---

## Support Tables (37-40)

### Table 37: kb_articles
Knowledge Base articles (searchable help).

**Key Fields:**
- article_id (string)
- category_id → kb_categories
- title (string)
- slug (string)
- content (string)
- excerpt (string)
- keywords (simpleObject) — Array for chatbot matching
- view_count, helpful_count, unhelpful_count (number)
- is_published (bool)
- created_at, updated_at (datetime)

---

### Table 38: kb_categories
Knowledge Base categories.

**Key Fields:**
- category_id (string)
- name (string)
- slug (string)
- icon (string)
- description (string)
- sort_order (number)
- created_at (datetime)

---

### Table 39: reviews
Customer reviews and ratings.

**Key Fields:**
- review_id (string)
- item_type (string) — "product" | "booking" | "service" | "business"
- item_id (string)
- customer_id → customers
- reviewer_name (string)
- rating (number) — 1-5
- title (string)
- comment (string)
- photos (simpleObject) — Array of URLs
- is_verified_purchase (bool)
- status (string) — "pending" | "approved" | "rejected" | "spam"
- business_response (string)
- response_at (datetime)
- helpful_count, reported_count (number)
- created_at (datetime)

---

### Table 40: tickets
Support tickets.

**Key Fields:**
- ticket_id (string)
- ticket_number (string) — "TKT-YYYYMMDD-NNN"
- customer_id → customers
- customer_name (string) — For guests
- customer_email (string)
- subject (string)
- description (string)
- category (string) — "general" | "billing" | "technical" | "complaint"
- status (string) — "open" | "in_progress" | "resolved" | "closed"
- priority (string) — "low" | "medium" | "high" | "urgent"
- assigned_to → users
- resolved_at (datetime)
- last_reply_at (datetime)
- created_at, updated_at (datetime)

---

## Finance Tables (41-43)

### Table 41: ticket_messages
Support ticket conversation thread.

**Key Fields:**
- ticket_id → tickets
- author_id → users
- author_type (string) — "customer" | "staff"
- message (string)
- is_internal_note (bool)
- attachments (simpleObject) — Array of URLs
- created_at (datetime)

---

### Table 42: invoice
Invoice records (auto-generated or manual).

**Key Fields:**
- invoice_id (string)
- invoice_number (string) — "INV-YYYYMMDD-NNN"
- customer_id → customers
- invoice_date (datetime)
- due_date (datetime)
- total_amount (number)
- currency (string)
- status (string) — "draft" | "sent" | "paid" | "overdue" | "cancelled"
- payment_method (string)
- payment_id (string)
- paid_at (datetime)
- pdf_url (string)
- notes (string)
- created_at (datetime)

---

### Table 43: invoice_items
Line items within invoices.

**Key Fields:**
- invoice_id → invoice
- description (string)
- quantity (number)
- unit_price (number)
- amount (number)

---

## Events & Time Tracking (44-47)

### Table 44: expenses
Business expense tracking.

**Key Fields:**
- expense_id (string)
- expense_date (date)
- category (string) — "supplies" | "software" | "advertising" | "other"
- description (string)
- amount (number)
- currency (string)
- receipt (media)
- created_by → users
- created_at (datetime)

---

### Table 45: events
Event definitions (workshops, webinars, seminars).

**Key Fields:**
- event_id (string)
- title (string)
- description (string)
- event_date (datetime) — **UTC**
- end_date (datetime) — **UTC**
- location (string)
- capacity (number)
- price_per_person (number)
- status (string) — "upcoming" | "in_progress" | "completed" | "cancelled"
- created_at (datetime)

---

### Table 46: event_registrations
Event registration records.

**Key Fields:**
- registration_id (string)
- event_id → events
- customer_id → customers
- num_attendees (number)
- total_paid (number)
- payment_status (string)
- registration_date (datetime)

---

### Table 47: time_entries
Time tracking for hourly billing.

**Key Fields:**
- entry_id (string)
- customer_id → customers
- staff_id → users
- service_id → services
- start_time (datetime) — **UTC**
- end_time (datetime) — **UTC**
- duration_hours (number)
- hourly_rate (number)
- total_amount (number)
- description (string)
- is_billable (bool)
- is_invoiced (bool)
- created_at (datetime)

---

## Key Architectural Patterns

### UTC Storage & Timezone Display
All datetime fields (bookings.start_datetime, events.event_date, etc.) stored in UTC. Display conversion uses business_profile.timezone (IANA string, e.g., "America/New_York").

### Multi-Tenant Isolation
Most tables include instance_id field for client isolation. Some tables (users, activity_log, config, vault) use implicit isolation via client context.

### Secret Management
Payment gateway secret keys stored in vault table only (not payment_config). Vault provides encryption at rest. Credentials retrieved via get_vault_secret() in server code.

### CRM & Lead Capture (ADR-004)
When lead submitted from landing page:
1. leads row created
2. contacts row created simultaneously
3. leads.converted_to_contact_id set immediately to new contact row
4. Contact auto-enrolled in welcome campaign
5. No manual conversion required

### Email Architecture (ADR-001)
- **Brevo SMTP** — Transactional email (booking confirmations, reminders, invoices)
- **Brevo Campaigns API** — Marketing email (campaign sequences, broadcasts)
- All clients use identical SMTP host (smtp-relay.brevo.com:587)
- Per-client credentials in vault (brevo_smtp_key, brevo_api_key)

---

## Status

**Status:** ✅ Production Schema  
**Version:** 1.0 (2026-04-10)  
**Authority:** Mandatory reference derived from actual Anvil Data Tables configuration  
**ADR Compliance:** ✅ ADR-001 (Brevo), ✅ ADR-004 (Lead Capture Simultaneous Creation), ✅ ADR-005 (UTC Storage)  
**Vertical:** Consulting & Services only (C&S)
