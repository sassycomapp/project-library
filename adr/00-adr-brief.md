RULE: 01 — Brevo Replaces All Zoho Products: 
IF: Any file, document, or codebase reference contains any reference to Zoho Mail, Zoho Campaigns, or Zoho CRM — including Zoho credentials, integration code, or any carve-out language such as "Zoho CRM is unaffected" or any equivalent partial-retention statement
THEN: The reference must be treated as a documentation error and corrected immediately by removing all Zoho references and replacing with the corresponding Brevo equivalent — Brevo SMTP relay, Brevo Campaigns API, or Brevo CRM API — with credentials replaced by brevo_smtp_key and brevo_api_key
NEVER: Zoho Mail, Zoho Campaigns, Zoho CRM, zoho_crm_client_id, zoho_crm_client_secret, zoho_crm_refresh_token, any Zoho email credentials, any language implying partial retention or phased coexistence of any Zoho product

RULE: 02 — Navigation Standard: (Lambda/Link/open_form)
IF: Any file, document, or codebase reference contains navigate_to, NavigationDrawerLayoutTemplate, NavigationLink used for navigation, or a lambda click handler without fn= and a= keyword argument capture
THEN: The reference must be treated as an error requiring correction — replace with custom HtmlTemplate layouts, plain Link components, lambda handlers using the mandatory lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a) pattern, and open_form() for parameterised navigation
NEVER: navigate_to, NavigationDrawerLayoutTemplate, NavigationLink for navigation purposes, lambda handlers that omit fn= and a= loop variable capture

RULE: 03 — Payment Security Boundary: (Secret Keys Deferred to the Vault)
IF: Any file, document, or codebase reference contains stripe_secret_key, paystack_secret_key, or paypal_secret being saved to the payment_config Data Table, returned as plaintext from get_payment_config() or get_email_config(), transmitted in outbound dicts from the client, or an AssertionError that is swallowed by a broader exception handler
THEN: The reference must be treated as an architectural violation — secret keys must be stored only in the Vault (vault Data Table, encrypted); the _PAYMENT_SECRET_COLUMNS assertion guard must be present in any server function that saves payment config and must be re-raised before any broader handler; get_payment_config() must return '***' for any secret key that is set; _save_payments() on the client must exclude secret key fields from the outbound dict entirely
NEVER: stripe_secret_key, paystack_secret_key, or paypal_secret saved to payment_config; plaintext secret keys returned by any getter; secret fields transmitted in client outbound dicts; AssertionError swallowed by a broader except Exception handler

RULE: 04 — Lead Capture: (Simultaneous leads + contacts Creation)
IF: Any file, document, or codebase reference describes lead capture creating only a leads record without a simultaneous contacts record, or shows leads.converted_to_contact_id as null after a successful lead capture, or describes a manual conversion step from lead to contact
THEN: The reference must be treated as an error requiring correction — the server function must create both a leads row and a contacts row in a single operation, set leads.converted_to_contact_id immediately on creation, and enroll the contact in the welcome sequence without any manual conversion step
NEVER: Lead capture that creates only a leads record without a simultaneous contacts record; leads.converted_to_contact_id left null for a successfully captured lead; any manual conversion step between lead and contact

RULE: 05 — Client Timezone: (IANA String, UTC Storage, Display-Time Conversion)
IF: Any file, document, or codebase reference stores datetimes in any timezone other than UTC, performs timezone conversion in client code, duplicates timezone conversion logic across individual server functions rather than using a centralised helper, or stores a client timezone as anything other than an IANA string in business_profile.timezone
THEN: The reference must be treated as an error requiring correction — all datetimes must be stored as UTC; timezone conversion must occur at display time in server functions only, reading business_profile.timezone as an IANA string; conversion logic must be centralised in a single helper function; client code must not handle timezone conversion
NEVER: Datetimes stored in local or non-UTC timezone; timezone conversion in client code; per-function duplication of timezone conversion logic; timezone values stored as anything other than an IANA string

RULE: 06 — Package Name: (crm/ Replaces marketing/)
IF: Any file, document, or codebase reference contains client_code/marketing/ or refers to the client-side CRM and marketing package as marketing/
THEN: The reference must be treated as a documentation error requiring correction — replace all instances of client_code/marketing/ with client_code/crm/; note that server_marketing/ is unaffected and must not be renamed; note that the admin navigation display label "Customers & Marketing" is intentionally different from the package name and must not be changed
NEVER: client_code/marketing/ as a package reference; any equation of the server_marketing/ server package with the client-side rename; any equation of the "Customers & Marketing" display label with the package name crm/

RULE: 07 — Continue.dev Front Matter CoP: (Five-Field Schema and Glob Strategy)
IF: The file contains front matter fields other than name, globs, description, alwaysApply, and regex — including title, layer, role, tags, or last_updated — or has globs omitted entirely, or contains project metadata (layer, role, authority, related files, last updated) in the front matter rather than the body
THEN: The file must be treated as non-conformant and corrected — remove all prohibited front matter fields; move all project metadata to the body; set globs deliberately using the established patterns (["**/*.py"] for universal coding standards, ["**/forms/**/*.py", "**/*Form*/__init__.py"] for form-specific standards, [] with alwaysApply: false for large orientation documents); verify all five checklist items before saving
NEVER: Front matter fields outside the five permitted (name, globs, description, alwaysApply, regex); globs omitted or left unset by default; project metadata in the front matter

RULE: 08 — Rules Files Must Not Exceed 500 Lines
IF: Any rules file reaches or exceeds 500 lines
THEN: The file must be treated as non-compliant and corrected immediately by one of three actions — trim non-essential or redundant content; condense by restructuring to reduce length without losing functional information; or split into two parts where each part references the other explicitly by filename, contains enough context to be understood independently, and does not duplicate content in a way that creates ambiguity; no information that impacts the file's functional purpose may be lost during any of these actions
NEVER: Any rules file exceeding 500 lines left uncorrected; trimming, condensing, or splitting that removes information impacting the file's functional purpose; split files that do not reference each other explicitly by filename

RULE: 09 — Platform Narrowed from Open Verticals to Consulting & Services Only
IF: Any file, document, or codebase reference contains products, orders, shopping cart, inventory, or shipping; room reservations, hospitality pricing, or table bookings; membership tiers, subscription access control, or recurring billing; Bob Go, Easyship, or any shipping provider integration; or server_products, server_hospitality, server_membership, or equivalent packages — including database tables products, orders, cart, shipments, membership_tiers, subscriptions, or courier_config
THEN: The reference must be treated as a remnant of the multi-vertical design and flagged for removal immediately — the only in-scope vertical is Consulting & Services; the complete in-scope scope is bookings, services, contacts, CRM, invoicing, payments, and marketing; nothing removed is planned for restoration
NEVER: Any reference to E-commerce, Hospitality, or Membership verticals in any rules file, spec file, devref file, schema, or codebase; any framing of the removed verticals as incomplete, planned, or deferred rather than permanently out of scope

