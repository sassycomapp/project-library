---
name: Database Schema Detailed Field Specifications — Mybizz V1.x
globs: ["**/*.py"]
description: Complete field-level specifications for all 47 production database tables. Reference for server code implementation and Anvil Data Tables configuration. Derived from actual anvil.yaml (2026-04-10).
alwaysApply: false
---

# Mybizz Database Schema — Detailed Field Specifications v1.0 (Production)

**Date:** 2026-04-10  
**Source:** mb-2-cs/anvil.yaml  
**Authority:** Mandatory — use when writing server functions that access Data Tables  
**Total Tables:** 47 (production schema from actual Anvil app)

---

## How to Use This Document

Each table entry includes:
- **Table name** (Anvil table name in parentheses)
- **Purpose** — What this table does
- **Complete field list** with names, types, nullable status, notes
- **Special implementation details** (auto-increment patterns, encryption, validation)
- **Links** to related tables via foreign keys

---

## Key Field Types

**Anvil Column Types:**
- `string` — Text
- `number` — Numbers (int/float)
- `bool` — True/False  
- `date` — Date only (no time)
- `datetime` — Date and time (stored in UTC)
- `simpleObject` — JSON data (dict/list)
- `media` — Files (Anvil Media)
- `link_single` — Link to one row in another table
- `link_multiple` — Link to multiple rows

**Special Notation:**
- ⭐ = Core operational table (frequently accessed)
- → = Foreign key link
- (UTC) = Always stored in UTC; display conversion via business_profile.timezone

---

## CORE TABLES

### activity_log
**Purpose:** User action tracking for audit trails and compliance.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| user_id | link_single → users | No | Who performed action |
| action_type | string | No | login, update_settings, delete_contact, etc. |
| description | string | No | Human-readable description |
| ip_address | string | Yes | Requesting IP address |
| metadata | simpleObject | Yes | Additional context (object IDs, values changed) |
| created_at | datetime | No | Timestamp of action (UTC) |

**Implementation Notes:**
- Log all sensitive operations (customer deletion, payment processing, settings changes)
- metadata should include relevant IDs and before/after values for changes
- Row.get_id() for internal technical ID

---

### business_profile
**Purpose:** Client's business identity — name, logo, contact, social media, timezone.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| business_name | string | No | Legal business name |
| description | string | Yes | Business description (public) |
| logo | media | Yes | Business logo (Anvil Media) |
| contact_email | string | Yes | Public contact email |
| phone | string | Yes | Public phone number |
| website_url | string | Yes | External website URL |
| tagline | string | Yes | Business tagline |
| address_line_1 | string | Yes | Street address |
| address_line_2 | string | Yes | Address line 2 (apt, suite, etc.) |
| city | string | Yes | City |
| country | string | Yes | Country name or code |
| postal_code | string | Yes | Postal/ZIP code |
| timezone | string | No | IANA timezone (e.g., "America/New_York") **Critical for datetime display** |
| social_facebook | string | Yes | Facebook URL/handle |
| social_instagram | string | Yes | Instagram handle |
| social_x | string | Yes | X (Twitter) handle |
| social_linkedin | string | Yes | LinkedIn company page |
| created_at | datetime | No | Record creation (UTC) |
| updated_at | datetime | No | Last update (UTC) |

**Critical Implementation:**
- timezone field MUST be IANA string (not offset, not abbreviation)
- All datetime display conversions use this timezone
- Single row per client (or zero rows if not configured)

---

### config
**Purpose:** Key-value configuration store (single row per key).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| key | string | No | Config key (unique, indexed) |
| value | simpleObject | Yes | Config value (JSON) — string, number, bool, object, array |
| category | string | No | system, features, currency, theme, website |
| updated_at | datetime | No | Last update timestamp (UTC) |
| updated_by | link_single → users | Yes | Who changed this config |

**Standard Keys (examples):**
- system_currency (string) — Immutable after first transaction
- display_currency (string) — Optional secondary currency
- exchange_rate (number)
- test_mode (bool)
- bookings_enabled, services_enabled, blog_enabled, marketing_enabled (bool)
- home_template, home_config, about_config (JSON)
- google_maps_api_key (string)
- privacy_policy, terms_conditions (text)

**Implementation Pattern:**
```python
# Read: single row query
config_row = app_tables.config.get(key=key_name)
value = config_row['value'] if config_row else None

# Write: single row upsert
app_tables.config.delete(lambda r: r['key'] == key_name)
app_tables.config.add_row(key=key_name, value=new_value, category=cat)
```

---

### email_config
**Purpose:** Email service configuration (Brevo SMTP per ADR-001).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| email_provider | string | No | "brevo" (ADR-001) |
| brevo_smtp_host | string | No | "smtp-relay.brevo.com" |
| brevo_smtp_port | number | No | 587 |
| smtp_username | string | No | Encrypted SMTP username |
| smtp_password | string | No | Stored via Anvil Secrets |
| from_email | string | No | Sender email address |
| from_name | string | No | Sender display name |
| configured | bool | No | Configuration complete flag |
| configured_at | datetime | Yes | When configured (UTC) |

**Critical Notes:**
- All clients use identical SMTP host and port
- Per-client SMTP credentials in vault table (brevo_smtp_key)
- Email provider is "brevo" for transactional email via SMTP
- Separate Brevo Campaigns API for marketing email (brevo_api_key in vault)

---

### files
**Purpose:** File storage metadata for media uploads.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| path | string | No | File path/location |
| file | media | No | Anvil Media component |
| file_version | string | Yes | Version identifier |

---

### payment_config
**Purpose:** Payment gateway configuration (Stripe, Paystack, PayPal).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| active_gateway | string | No | "stripe", "paystack", "paypal" — one per client |
| stripe_publishable_key | string | Yes | Public key (safe to display) |
| stripe_secret_key | string | Yes | **Should be in vault only, not here** |
| stripe_connected | bool | Yes | Connection status |
| stripe_connected_at | datetime | Yes | When connected (UTC) |
| paystack_public_key | string | Yes | Public key (safe to display) |
| paystack_secret_key | string | Yes | **Should be in vault only, not here** |
| paystack_connected | bool | Yes | Connection status |
| paystack_connected_at | datetime | Yes | When connected (UTC) |
| paypal_client_id | string | Yes | Client ID (can be public) |
| paypal_secret | string | Yes | **Should be in vault only, not here** |
| paypal_connected | bool | Yes | Connection status |
| paypal_connected_at | datetime | Yes | When connected (UTC) |
| test_mode | bool | No | Payment gateway test mode |
| configured_at | datetime | Yes | When configured (UTC) |

**Critical Security Notes:**
- Secret keys should be stored in vault table only
- This table may display masked values or be read-only for secrets
- Never log or expose secret key values
- All three gateways support one-time payments only (no subscriptions in V1.x)

---

### rate_limits
**Purpose:** API rate limiting state (persistent, survives server restarts).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| identifier | string | No | User ID or IP address (indexed) |
| count | number | No | Request count in current window |
| reset_time | datetime | No | When current window expires (UTC) |
| last_request | datetime | No | Timestamp of most recent request (UTC) |

**Implementation Pattern:**
```python
@anvil.server.background_task
def cleanup_rate_limits():
    # Delete records older than 24 hours
    cutoff = datetime.utcnow() - timedelta(days=1)
    for row in app_tables.rate_limits.search():
        if row['reset_time'] < cutoff:
            row.delete()
```

---

### theme_config
**Purpose:** Material Design 3 theme customization.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| primary_color | string | No | Hex code (e.g., "#1976D2") |
| accent_color | string | No | Hex code (e.g., "#FF4081") |
| font_family | string | Yes | Font name (system or Google Font) |
| header_style | string | Yes | Template variant identifier |
| updated_at | datetime | No | Last update (UTC) |

**Implementation Notes:**
- Single row per client (or zero rows)
- Colors used throughout Material Design 3 UI via theme variables
- font_family should be web-safe or Google Font name
- header_style selects pre-built layouts (e.g., "minimal", "full_width")

---

### users
**Purpose:** System users and staff (extended Anvil Users table).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| email | string | No | Unique email (indexed) |
| enabled | bool | No | Active/disabled flag |
| last_login | datetime | Yes | Timestamp of last login (UTC) |
| password_hash | string | No | Hashed password (Anvil managed) |
| n_password_failures | number | No | Failed login count (Anvil managed) |
| confirmed_email | bool | No | Email verification flag |
| role | string | No | "owner", "manager", "admin", "staff", "customer", "visitor" |
| account_status | string | No | "active", "suspended", "deleted" |
| phone | string | Yes | Contact phone number |
| permissions | simpleObject | Yes | JSON object of permission flags |
| created_at | datetime | No | Account creation (UTC) |

**Role Hierarchy:**
- **owner** — Full access, vault management, billing
- **manager** — Operational access, staff management, reporting
- **admin** — Day-to-day operations (bookings, customers, payments)
- **staff** — Limited to assigned resources/services
- **customer** — Own data only (bookings, invoices, profile)
- **visitor** — No data access (public website only)

**Permissions JSON (example):**
```json
{
  "bookings.manage": true,
  "customers.manage": true,
  "payments.process": true,
  "settings.manage": false,
  "reports.view": true
}
```

---

### vault
**Purpose:** Encrypted secrets storage (payment credentials, API keys).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| name | string | No | Secret name (unique, indexed) |
| value | string | No | Encrypted secret value |
| created_at | datetime | No | Creation timestamp (UTC) |
| updated_at | datetime | No | Last update timestamp (UTC) |
| updated_by | link_single → users | No | Who last updated this |

**Stored Secrets (by name):**
- `brevo_smtp_key` — SMTP authentication
- `brevo_api_key` — Campaigns API
- `stripe_secret_key` — Payment processing
- `paystack_secret_key` — Payment processing
- `paypal_secret` — Payment processing

**Implementation Pattern:**
```python
def get_vault_secret(secret_name):
    row = app_tables.vault.get(name=secret_name)
    return row['value'] if row else None

def set_vault_secret(secret_name, secret_value, user):
    app_tables.vault.delete(lambda r: r['name'] == secret_name)
    app_tables.vault.add_row(
        name=secret_name,
        value=encrypt(secret_value),
        updated_by=user
    )
```

---

### webhook_log
**Purpose:** Webhook event history for payment gateway callbacks.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| gateway | string | No | "stripe", "paystack" |
| event_type | string | No | Payment gateway event type |
| payload | simpleObject | No | Complete webhook payload |
| signature | string | No | Webhook signature (for verification) |
| verified | bool | No | Signature verification result |
| processed | bool | No | Event processed successfully |
| error_message | string | Yes | Error if processing failed |
| received_at | datetime | No | When webhook received (UTC) |

**Implementation Notes:**
- Always verify webhook signature before processing
- Store complete payload for debugging
- Mark processed=true only after successful handling
- Keep for audit trail and dispute resolution

---

### backups
**Purpose:** System backup records.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| backup_id | string | No | Unique backup identifier |
| backup_type | string | No | "weekly", "pre_update_snapshot" |
| backup_date | datetime | No | When backup created (UTC) |
| backup_size | number | No | Size in bytes |
| backup_url | string | Yes | URL to backup file |
| retention_days | number | No | Days to retain backup |
| created_at | datetime | No | Record creation (UTC) |

---

## BOOKING TABLES

### availability_exceptions
**Purpose:** Exceptions to recurring operating hours.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| resource_id | link_single → bookable_resources | No | Which resource |
| exception_date | date | No | Specific date (no time) |
| start_time | string | Yes | Start of exception (HH:MM, null = all day) |
| end_time | string | Yes | End of exception (HH:MM, null = all day) |
| is_available | bool | No | Available or closed on this date |
| reason | string | Yes | Why (e.g., "public holiday", "maintenance") |

---

### availability_rules
**Purpose:** Recurring availability schedules (operating hours).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| resource_id | link_single → bookable_resources | No | Which resource |
| day_of_week | number | No | 0=Sunday, 1=Monday, ..., 6=Saturday |
| start_time | string | No | Start time (HH:MM, e.g., "09:00") |
| end_time | string | No | End time (HH:MM, e.g., "17:00") |
| is_active | bool | No | Enable/disable rule |

---

### bookable_resources
**Purpose:** Services or resources available for booking (therapists, equipment, rooms).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| resource_id | string | No | Human-readable ID (e.g., "THERAPIST-001") |
| name | string | No | Display name |
| resource_type | string | No | "staff", "equipment", "space" |
| description | string | Yes | Description (public or internal) |
| capacity | number | Yes | Max concurrent bookings |
| hourly_rate | number | Yes | Hourly billing rate |
| daily_rate | number | Yes | Daily billing rate |
| metadata | simpleObject | Yes | Custom fields (qualifications, languages, etc.) |
| is_active | bool | No | Active/inactive flag |
| created_at | datetime | No | Creation timestamp (UTC) |

---

### booking_metadata_schemas
**Purpose:** Dynamic booking form schemas (custom metadata per booking type).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| schema_name | string | No | Display name for schema |
| booking_type | string | No | "appointment", "service", "event" |
| field_definitions | simpleObject | No | JSON array: [{name, label, type, required}, ...] |
| is_active | bool | No | Active/inactive |

**Example field_definitions:**
```json
[
  {"name": "notes", "label": "Special Requests", "type": "text", "required": false},
  {"name": "intake_form", "label": "Intake Form", "type": "file", "required": false},
  {"name": "fitness_level", "label": "Fitness Level", "type": "select", "required": true}
]
```

---

### bookings ⭐ CORE OPERATIONAL TABLE
**Purpose:** Service appointments and bookings.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| booking_id | string | No | Internal ID (use row.get_id()) |
| customer_id | link_single → customers | No | Who booked |
| service_id | link_single → services | No | Service details |
| resource_id | link_single → bookable_resources | No | What/who booked |
| contact_id | link_single → contacts | Yes | CRM link (populated by contact_service) |
| booking_type | string | No | "appointment", "service", "event" |
| status | string | No | "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED" |
| start_datetime | datetime | No | When it starts (UTC) |
| end_datetime | datetime | No | When it ends (UTC) |
| total_price | number | No | Total cost |
| payment_status | string | No | "unpaid", "deposit_paid", "paid", "refunded" |
| payment_id | string | Yes | Payment gateway transaction ID |
| special_requests | string | Yes | Customer notes/requests |
| metadata | simpleObject | Yes | Custom metadata per booking_type |
| created_at | datetime | No | Booking creation (UTC) |
| updated_at | datetime | No | Last update (UTC) |

**Critical Implementation Patterns:**

1. **When booking created:**
   - contact_id populated via contact_service (creates/finds contact)
   - contact_events entry created (event_type: booking)
   - Customer enrolled in campaign if trigger = booking_created
   - Confirmation email sent (Brevo SMTP)

2. **Datetime handling:**
   - Always store in UTC
   - Display converted via business_profile.timezone
   - Example: booking stored as "2026-04-15T14:00:00Z" → displayed as "3:00 PM" in NY timezone

3. **Status workflow:**
   - PENDING → CONFIRMED → (optionally COMPLETED) or CANCELLED
   - CANCELLED can happen from any state

---

### services ⭐ CORE OPERATIONAL TABLE
**Purpose:** Service offerings available for booking.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| service_id | string | No | Unique ID (e.g., "SVC-001") |
| name | string | No | Service name (public) |
| description | string | No | Description (public) |
| duration_minutes | number | No | How long (0 = variable) |
| price | number | No | Cost to customer |
| category | string | Yes | Service category |
| provider_id | link_single → users | Yes | Assigned therapist/consultant |
| meeting_type | string | No | "In-Person", "Video Call", "Phone Call" |
| pricing_model | string | Yes | "duration", "unit", "custom" |
| images | simpleObject | Yes | Array of image URLs |
| video_url | string | Yes | Promotional video URL |
| is_active | bool | No | Active/inactive |
| created_at | datetime | No | Creation timestamp (UTC) |

---

## CRM & CONTACT TABLES

### client_notes
**Purpose:** Internal staff notes on customers.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| customer_id | link_single → customers | No | About whom |
| author_id | link_single → users | No | Who wrote this |
| note_text | string | No | Note content |
| note_type | string | Yes | "intake", "follow_up", "internal", "medical_history" |
| is_confidential | bool | No | Staff-only visibility (RBAC enforced) |
| is_important | bool | No | Flagged for attention |
| created_at | datetime | No | Note timestamp (UTC) |

**Confidentiality:** If is_confidential=true, only owner/managers can view (enforced by server-side RBAC).

---

### contact_campaigns
**Purpose:** Contact enrollment in email campaigns.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| id | string | No | Internal ID (use row.get_id()) |
| contact_id | link_single → contacts | No | Enrolled contact |
| campaign_id | link_single → email_campaigns | No | Campaign definition |
| sequence_day | number | No | Current day in sequence (0-based) |
| status | string | No | "enrolled", "sent", "opened", "clicked", "completed" |
| enrolled_date | datetime | No | When enrolled (UTC) |
| last_email_sent_date | datetime | Yes | Last email sent (UTC) |
| completed_date | datetime | Yes | When sequence completed (UTC) |

**Purpose:** Tracks each contact's position in campaign sequences.

---

### contact_counter
**Purpose:** Single-row counter for contact ID generation (thread-safe).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| value | number | No | Sequential counter (starts at 0) |

**Implementation:**
```python
@anvil.server.callable
@in_transaction
def generate_contact_id():
    counter = app_tables.contact_counter.get()
    counter['value'] += 1
    contact_num = counter['value']
    return f"C-{contact_num}"
```

---

### contact_events ⭐ CRM ACTIVITY TIMELINE
**Purpose:** Contact activity timeline — every interaction logged.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| contact_id | link_single → contacts | No | Which contact (indexed) |
| event_type | string | No | "booking", "order", "email_opened", "email_clicked", "note", "form_submit", "payment", etc. |
| event_date | datetime | No | When event occurred (UTC) |
| event_data | simpleObject | Yes | JSON with event details |
| related_id | string | Yes | booking_id, order_id, campaign_id, etc. |
| created_at | datetime | No | Record creation (UTC) |

**Purpose:** Complete audit trail of each contact's relationship with the business. Used for lifecycle stage determination, campaign triggers, and reporting.

---

### contact_submissions
**Purpose:** Website contact form submissions.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| name | string | No | Submitter name |
| email | string | Yes | Submitter email |
| phone | string | Yes | Submitter phone |
| message | string | No | Message content |
| submitted_date | datetime | No | When submitted (UTC) |
| status | string | No | "new", "read", "replied" |

---

### contacts ⭐ CRM CORE TABLE
**Purpose:** Unified contact database (leads and customers).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| contact_id | string | No | Human-readable ID (C-{number}) |
| instance_id | link_single → users | No | Client identifier (indexed) |
| first_name | string | No | Given name |
| last_name | string | No | Family name |
| email | string | Yes | Contact email (indexed) — null for walk-in customers |
| phone | string | Yes | Contact phone |
| status | string | No | "new", "active", "inactive", "archived" |
| source | string | Yes | "Website Form", "Booking Widget", "Manual Entry", etc. |
| lifecycle_stage | string | Yes | "new", "active", "at_risk", "lost" |
| tags | simpleObject | Yes | Array of tag strings |
| total_spent | number | No | $ spent (cached, updated after bookings/orders) |
| total_transactions | number | No | Count of transactions (cached) |
| last_contact_date | datetime | Yes | Most recent interaction (UTC) |
| date_added | datetime | No | When contact created (UTC) |
| created_at | datetime | No | Record creation (UTC) |
| updated_at | datetime | No | Last update (UTC) |

**ADR-004 Integration:**
When a lead is captured from a landing page, both leads + contacts rows created simultaneously.
- leads.converted_to_contact_id set immediately to the new contact row
- Contact automatically enrolled in welcome campaign
- No manual conversion step required

---

### customers
**Purpose:** Customer records (legacy, see contacts for CRM integration).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| customer_id | string | No | Internal ID |
| user_id | link_single → users | Yes | If customer is registered user |
| contact_id | link_single → contacts | Yes | CRM contact (for marketing) |
| first_name | string | No | Given name |
| last_name | string | No | Family name |
| email | string | No | Contact email (indexed) |
| phone | string | Yes | Contact phone |
| address | simpleObject | Yes | Address JSON {street, city, zip} |
| notes | string | Yes | Internal staff notes |
| tags | simpleObject | Yes | Array of tag strings |
| lifetime_value | number | No | Total $ spent (cached) |
| total_bookings | number | No | Count of bookings (cached) |
| total_orders | number | No | Count of orders (cached) |
| status | string | No | "active", "inactive" |
| created_at | datetime | No | Record creation (UTC) |
| updated_at | datetime | No | Last update (UTC) |

---

### segments
**Purpose:** Contact segmentation for campaign targeting.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| segment_id | string | No | Internal ID |
| instance_id | link_single → users | No | Client identifier |
| segment_name | string | No | Display name |
| segment_type | string | No | "Pre_Built", "Custom" |
| filter_criteria | simpleObject | No | JSON filter definition |
| contact_count | number | No | Cached contact count |
| is_active | bool | No | Active/inactive |
| created_date | datetime | No | Creation timestamp (UTC) |

---

## EMAIL & MARKETING TABLES

### email_campaigns
**Purpose:** Email marketing campaigns (sequences, broadcasts, automations).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| campaign_id | string | No | Internal ID |
| instance_id | link_single → users | No | Client identifier |
| campaign_name | string | No | Display name |
| campaign_type | string | No | "Welcome", "Abandoned Cart", "Re-engagement", "Custom" |
| status | string | No | "draft", "active", "paused", "completed" |
| emails_sent | number | No | Count |
| opens | number | No | Count |
| clicks | number | No | Count |
| conversions | number | No | Count |
| revenue_generated | number | No | $ amount |
| campaign_settings | simpleObject | Yes | JSON configuration |
| created_date | datetime | No | Creation (UTC) |
| last_run_date | datetime | Yes | Last execution (UTC) |

---

### email_log
**Purpose:** Email delivery log (audit trail for compliance).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| recipient | string | No | Email address |
| subject | string | No | Email subject |
| template_id | link_single → email_templates | Yes | Template used |
| status | string | No | "sent", "failed", "bounced" |
| error_message | string | Yes | Error if failed |
| sent_at | datetime | No | Timestamp (UTC) |

---

### email_templates
**Purpose:** Email template library (transactional & notification).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| template_id | string | No | Unique ID |
| name | string | No | "booking_confirmation", "order_receipt", "reminder", etc. |
| subject | string | No | Email subject (supports {{variables}}) |
| body_html | string | No | HTML content |
| body_text | string | No | Plain text fallback |
| template_type | string | No | "transactional", "notification" |
| is_active | bool | No | Active/inactive |

---

### lead_captures
**Purpose:** Lead capture form configurations (popups, landing pages).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| capture_id | string | No | Unique ID |
| instance_id | link_single → users | No | Client identifier |
| capture_name | string | No | Display name |
| trigger_type | string | No | "exit_intent", "timed", "scroll" |
| trigger_settings | simpleObject | No | JSON (delay, scroll %, etc.) |
| form_fields | simpleObject | No | JSON field definitions |
| offer_text | string | Yes | CTA copy |
| status | string | No | "active", "paused" |
| captures_count | number | No | Total captures |
| conversions_count | number | No | Converted to contacts |
| created_date | datetime | No | Creation (UTC) |

---

### leads (ADR-004)
**Purpose:** Captured leads (pre-conversion to contact).

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| lead_id | string | No | Internal ID |
| instance_id | link_single → users | No | Client identifier |
| email | string | No | Lead email |
| name | string | Yes | Lead name |
| phone | string | Yes | Lead phone |
| source | string | No | "landing_page", "contact_form", "other" |
| landing_page_id | link_single → landing_pages | Yes | Which landing page |
| capture_id | link_single → lead_captures | Yes | Which popup |
| **converted_to_contact_id** | **link_single → contacts** | **No** | **Set immediately on creation (ADR-004)** |
| status | string | No | "new", "contacted", "qualified", "converted" |
| captured_at | datetime | No | Capture timestamp (UTC) |
| client_id | link_single → users | No | Client owner |

**Critical ADR-004 Pattern:**
When lead submitted, BOTH rows created simultaneously:
1. leads row created
2. contacts row created
3. leads.converted_to_contact_id set immediately to new contact row
4. Contact auto-enrolled in welcome campaign
5. Never null for successfully captured leads

---

### tasks
**Purpose:** CRM tasks and follow-ups.

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| task_id | string | No | Internal ID |
| instance_id | link_single → users | No | Client identifier |
| contact_id | link_single → contacts | Yes | Associated contact (nullable) |
| task_title | string | No | Task description |
| task_type | string | No | "follow_up", "review_request", "callback", "custom" |
| due_date | date | No | Due date (no time) |
| completed | bool | No | Completion flag |
| completed_date | datetime | Yes | When completed (UTC) |
| notes | string | Yes | Additional notes |
| auto_generated | bool | No | System-generated or manual |
| created_at | datetime | No | Creation (UTC) |

---

## Summary of Key Architectural Decisions

1. **UTC Storage:** All datetimes stored in UTC; display conversion via business_profile.timezone
2. **Multi-tenant:** instance_id field provides client isolation on CRM/marketing tables
3. **ADR-004 Lead Capture:** Simultaneous creation of leads + contacts, immediate conversion
4. **ADR-001 Brevo:** SMTP for transactional, Campaigns API for marketing
5. **Secret Management:** Payment credentials in vault table only (encrypted at rest)
6. **CRM Timeline:** contact_events table provides complete interaction history
7. **One Gateway:** Single active payment gateway per client instance

---

**Status:** ✅ Production Schema Reference  
**Version:** 1.0 (2026-04-10)  
**Authority:** Mandatory — derived from actual Anvil Data Tables configuration  
**Last Updated:** 2026-04-10 (user-provided schema)
