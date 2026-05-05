# Mybizz CS — Architecture

**Vertical:** Consulting & Services only
**Architecture:** Dependency-based (master_template → client instances)
**Schema:** 36 tables (see `database-schema.md`)

---

## 1. The Three Applications

### master_template_dev
The development workspace. All feature work happens here. Connected to GitHub as the shared source of truth between Anvil.works and VS Code.

### master_template
The published dependency. A frozen, versioned snapshot of master_template_dev. Client instances contain no application code — they depend entirely on master_template for all functionality. Updates are pull-based: clients choose when to adopt a new version.

### Mybizz_management
The platform operator's internal tooling — client provisioning, health monitoring, billing automation, update distribution. A separate Anvil application, never part of master_template. Built only after the master template reaches launch and the first client has been manually onboarded.

**See:** ADR-009 (Multi-Vertical to Single-Vertical)

---

## 2. Client Instances

Each subscriber receives their own independent Anvil application containing only Data Tables and configuration. It depends on master_template as a versioned library.

- **Data isolation is structural.** Each client is a separate Anvil app with a separate database. `app_tables` always resolves to the current client's data. Cross-client access is architecturally impossible.
- **The master template is stateless.** It contains zero client data. All state lives in the client's Data Tables.
- **Clients never see source code.** The master template is published as a compiled dependency.

---

## 3. Development Workflow

Changes made in VS Code are pushed to GitHub. Anvil syncs from GitHub. Changes made in the Anvil Designer are pulled into VS Code before any code draft prompt is run. Designer work must always precede code work for any given form.

---

## 4. Package Structure

Feature-based organization. Packages are never renamed or merged during active development.

```
client_code/
  auth/          layouts/       dashboard/     settings/
  bookings/      services/      customers/     crm/
  blog/          public_pages/  shared/

server_code/
  server_auth/       server_settings/   server_dashboard/
  server_bookings/   server_services/   server_customers/
  server_marketing/  server_payments/   server_blog/
  server_shared/     server_analytics/  server_emails/
```

**Note:** The client-side CRM and marketing package is named `crm/` — not `marketing/`. The server-side package remains `server_marketing/`.

**See:** ADR-006 (Package Name: crm/ Replaces marketing/)

---

## 5. Three-Tier Module Pattern

1. **Forms** handle presentation only. Event handlers call methods; methods contain the logic.
2. **Client Modules** handle UI coordination, input validation, and server call orchestration.
3. **Server Modules** handle all business rules, persistence, security enforcement, and external API calls.
4. **Pure Logic Modules** (no Anvil imports) contain side-effect-free business logic for unit testing.

This structure is not a preference. It is what makes the testing strategy work.

---

## 6. Navigation Architecture

Two navigation systems, not interchangeable:

| Area | System |
|---|---|
| Admin & customer portal | Custom HtmlTemplate + plain Link components + lambda click handlers |
| Public website pages | Anvil Routing dependency (@router.route) |

**Authenticated navigation ruling:**
- Use plain `Link` components — not `NavigationLink`
- Lambda click handlers with mandatory loop variable capture: `lambda e, fn=form_name, a=attr_name: self._nav_click(fn, a)`
- `open_form(string)` for parameterised navigation (row clicks, detail forms)
- `NavigationDrawerLayoutTemplate`, `NavigationLink`, and `navigate_to` are never used

**See:** ADR-002 (Navigation Standard)

### AdminLayout Navigation Structure
```
Dashboard                          (always)
▼ Sales & Operations
  Bookings                         (always)
  Services                         (always)
▼ Customers & Marketing
  Contacts                         (always)
  Campaigns                        (marketing_enabled)
  Broadcasts                       (marketing_enabled)
  Segments                         (marketing_enabled)
  Tasks                            (marketing_enabled)
▼ Content & Website
  Blog                             (blog_enabled)
  Pages                            (always)
  Media                            (always)
▼ Finance & Reports
  Invoices                         (always)
  Payments                         (always)
  Reports                          (always)
  Analytics                        (always)
  Time Entries                     (always)
Settings                           (Owner / Manager only)
Vault                              (Owner only)
[Sign out — bottom of sidebar, all roles]
```

### CustomerLayout Navigation Structure
```
My Dashboard                       (always)
My Bookings                        (always)
My Invoices                        (always)
My Reviews                         (always)
Support Tickets                    (always)
Account                            (always)
[Sign out — bottom of sidebar]
```

**Note:** The CustomerLayout is deferred to V2. Customers book via the public site and the business manages all bookings from the admin panel in V1.

**Note:** The CustomerLayout is deferred to V2. Customers book via the public site and the business manages all bookings from the admin panel in V1.

---

## 7. Startup and Authentication Routing

The Startup Form is `auth.LoginForm` (defined in anvil.yaml). The `__init__` method checks authentication and routes before `init_components()`:

1. If logged in as Owner/Manager/Admin/Staff → open `DashboardForm` with AdminLayout, return
2. If logged in as Customer → open customer portal with CustomerLayout, return
3. If not logged in → proceed with LoginForm display

Calling `open_form()` in `__init__` must always be followed by `return`.

---

## 8. The Sidesheet

The M3 Sidesheet is available on NavigationDrawerLayout and NavigationRailLayout. It is appropriate for secondary content or detail panels alongside main content without replacing it. The NavigationRailLayout with Sidesheet is well-suited to step-by-step guided workflows: pass accumulated data via `self.item` between steps; submit to the server in a single call at the final step.

---

*End of file*
