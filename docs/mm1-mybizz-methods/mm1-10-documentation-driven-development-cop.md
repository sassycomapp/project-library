## Code of Practice: Documentation-Driven Development (DDD)

### 1. Purpose

Establish documentation as the primary design artifact. All implementation MUST be derived from pre-defined documentation.

---

### 2. Core Principle

No implementation code SHALL be written until the required documentation is complete, reviewed, and approved.

Documentation SHALL serve as the authoritative specification for:

* Behaviour
* Interfaces
* Constraints
* Edge cases

---

### 3. Required Documentation Artifacts

#### 3.1 User-Facing Specification (MANDATORY)

Defines how the feature is consumed.

MUST include:

* Purpose and scope
* Usage examples
* Inputs and expected outputs
* Error conditions and handling
* Configuration options (with defaults)

---

#### 3.2 API / Interface Specification (MANDATORY)

Defines all callable interfaces.

MUST include:

* Function/method signatures
* Parameter types and validation rules
* Return types and structures
* State dependencies (if any)
* Failure modes and responses

---

#### 3.3 Behavioural Specification (MANDATORY)

Defines system behaviour under all conditions.

MUST include:

* Normal operation flow
* Edge cases (null, invalid input, limits)
* State transitions (if applicable)
* Performance constraints (if relevant)

---

#### 3.4 Decision Log (MANDATORY for non-trivial features)

Records design rationale.

MUST include:

* Key decisions made
* Alternatives considered
* Reasons for rejection/selection

---

### 4. Documentation Standards

All documentation MUST:

* Be written in structured, unambiguous language
* Be implementation-independent
* Avoid references to specific technologies unless strictly required
* Be version-controlled alongside code
* Be testable (i.e., enable derivation of test cases)

---

### 5. Development Workflow

#### Step 1 — Documentation Authoring

Produce all required documentation artifacts.

#### Step 2 — Review & Validation

Documentation MUST be:

* Internally consistent
* Complete
* Sufficient to derive implementation and tests

No progression permitted until approval.

#### Step 3 — Test Definition

Tests SHALL be written directly from documentation.

#### Step 4 — Implementation

Implementation MUST strictly conform to documentation.

#### Step 5 — Verification

Validate that:

* Implementation matches documentation
* Tests pass
* No undocumented behaviour exists

---

### 6. Compliance Rules

* Implementation MUST NOT introduce undocumented behaviour
* Documentation MUST be updated before any behavioural change
* Code that cannot be explained via documentation is non-compliant
* Documentation inconsistencies SHALL be treated as defects

---

### 7. Example (Abstract Specification)

**Component:** Email Campaign Delivery

**Purpose:**
Dispatch email sequences to enrolled contacts according to campaign triggers and scheduling rules.

**Configuration:**

* `campaignId` (campaign identifier, required)
* `enrollmentTrigger` (event-based — e.g. appointment completion, first booking, inactive duration, required)
* `emailSequence` (ordered array of email templates with delays, required)
* `deliveryInterval` (hourly batch window, default defined)

**Behaviour:**

* Track contact enrollments per campaign
* Evaluate trigger conditions at defined intervals
* Send next email in sequence when timing and conditions allow
* Provide delivery status and tracking data
* Reset sequence on completion or manual removal

**Edge Cases:**

* Missing or invalid enrollment data
* Campaign deactivation mid-sequence
* Contact unsubscribe during campaign
* High-frequency enrollment bursts
* Email send failures with retry logic

---

### 8. Tooling Guidance (Non-Prescriptive)

* Store documentation in version-controlled text format
* Co-locate documentation with relevant modules
* Maintain a central decision log file
* Use structured schemas for API definitions where applicable

---

### 9. Outcome Expectations

Adherence to this code of practice SHALL result in:

* Predictable implementations
* Reduced design ambiguity
* Improved interface quality
* Elimination of documentation drift

---

### 10. Enforcement

This code of practice is mandatory for all feature development. Non-compliance SHALL block progression to implementation or release.
