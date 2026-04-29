---
name: Project Overview — Mybizz Development
globs: []
description: Describes the structure of the Mybizz project, the development workflow, the roles of each participant, and the systems that support the development process. Covers strategic context, rules structure, Author support structure, and the prompt system. Read once per session for project orientation.
alwaysApply: false
---

# Project title: Mybizz

## Strategic Context — Why the Codebase Looks the Way It Does

Mybizz was originally designed and partially built as a multi-vertical open platform. The architecture supported four business verticals — Consulting & Services, E-commerce, Hospitality, and Membership — and clients could activate any combination of them. The codebase, database schema, rules files, scaffold, and prompt system were all built to that specification.

After significant development work, the decision was made to narrow the platform to a single vertical: **Consulting & Services only**. The reasons were complexity, maintenance burden, and strategic focus. This was a deliberate architectural decision, not an incomplete build.

**What was adapted (Session 11):**
- All 35 rules files were audited for multi-vertical content and remediated
- Out-of-scope database tables removed from specs: products, orders, cart, shipments, membership_tiers, subscriptions, courier_config
- Out-of-scope server packages removed from specs: server_products, shipping services, subscription service, hospitality pricing
- Out-of-scope client packages removed from specs: products package, room management forms, e-commerce public pages, courier config forms, membership components
- Navigation items for out-of-scope verticals removed from layout specs
- Integration specs for shipping (Bob Go, Easyship) and subscription billing removed
- Anvil.works database verified clean — out-of-scope tables were already absent; 5 missing in-scope tables created

**What this means for you as a future Claude:**
The C&S vertical is the complete intended scope. Bookings, services, contacts, CRM, invoicing, payments, and marketing are all in scope. If you encounter references to products, orders, e-commerce, rooms, hospitality, memberships, or shipping anywhere in the rules files or codebase, treat them as remnants to be flagged — not as intended scope.

---

## Project Structure & Workflow

Mybizz is an Anvil.works application which is being built in VS code using continue.dev.

Design work is guided by the Author and built by the Developer in Anvil.works.

Project files are transferred between Anvil.works and VS code via Github version control

### Version control and sync workflow

All application code lives in Anvil.works.

To enable development in VS Code with Continue.dev, the application is connected to a GitHub repository, which acts as the bridge between the two environments.

When changes are made in VS Code they are pushed to GitHub. Anvil is sync'd to Github.

When changes are made in Anvil.works --- such as building or modifying UI, the developer pulls them into VS Code.

GitHub is the shared source of truth.

The practical implication for is that UI build work done in the Anvil Anvil.works Designer must be pulled into VS Code before any code draft prompt is run against those files.

### Developmental structure

**PHASE 1 --- Authentication & Administration**

Stages:

> 1.1 Project Infrastructure  
> 1.2 Authentication System  
> etc

**PHASE 2 --- Website & Content**

Stages:

> 2.1 Public Website --- Standard Pages  
> 2.2 Home Page Templates  
> etc

continues to stage 10.3 Which is the final stage

## Tasks structure

There are seven tasks related to the development of every stage:

1.  **UI Scope** -- The author reads the rules files In scopes the UI. The template structure does not apply to this task

2.  **UI Design & Build** -- The author creates the UI wire frames and the developer build the UI in the Anvil Anvil.works Designer Interface. The template structure does not apply to this task

3.  **Code Draft** -- The author creates the prompt using the template structure

4.  **Code Polish**-- The author creates the prompt using the template structure

5.  **Local Testing**-- The author creates the prompt using the template structure

6.  **Uplink Testing**-- The author creates the prompt using the template structure

7.  **Checks**-- The author creates the prompt using the template structure

    a.  **Checks file build -** Uses the template structure

    b.  **Checks file scan -** Uses the template structure

### Note on Tasks 3 and 4 call structure

Tasks 3 and 4 are split into two calls per stage — an A call (client side) and a B call (server side).

- **A call** covers all client-side files: the main form and any subordinate row template forms together in one call.
- **B call** covers all server-side files in one call.

The split is always client vs server. A stage with multiple client files (e.g. a form and two row templates) still produces one A call — all client files travel together. Tasks 5, 6, 7a, and 7b are not split — they receive all stage files in a single call.

## Actors

**Developer:** David  
**Author:** Claude responsible for creating the prompts  
**Agent:** Continue.dev agent  
**Model**: Claude Sonnet 4.6

### Actors --- interaction model

Developer and Author interact through the chat session.

Developer directs, decides, and approves;

Author produces, advises, and records.

Author translates the outcomes of chat session discussions into the documents that govern the development process --- templates, notes, handovers, and reference files.

The Agent only operates in Continue.dev. It receives its instructions solely through prompts received from the developer, and returns its output.

Developer reviews the Agent\'s output; Author interprets it and advises on next steps.

## Rules structure

The rules files make up the project description, standards and specifications. The rules also include Anvil's specifications and codes of practice. There are 35 rules at this stage. Currently the rules are:

**rules-library**

1.  platform_docmap.md
2.  platform_features.md
3.  platform_overview.md
4.  platform_sitemap.md
5.  platform_status.md
6.  policy_development.md
7.  policy_nomenclature.md
8.  policy_nomenclature_components.md
9.  policy_security.md
10. policy_security_compliance.md
11. ref_anvil_coding.md
12. ref_anvil_coding_patterns.md
13. ref_anvil_components.md
14. ref_anvil_data_tables.md
15. ref_anvil_misc.md
16. ref_anvil_navigation.md
17. ref_anvil_packages.md
18. ref_anvil_testing.md
19. ref_anvil_testing_integration.md
20. ref_anvil_uplink.md
21. spec_architecture.md
22. spec_build_plan.md
23. spec_crm.md
24. spec_crm_campaigns.md
25. spec_crm_contacts.md
26. spec_crm_segments_tasks.md
27. spec_database.md
28. spec_database_schema.md
29. spec_domain_email_offboarding.md
30. spec_integrations.md
31. spec_performance.md
32. spec_scaffold.md
33. spec_ui_standards.md
34. spec_ui_standards_forms.md
35. spec_vault.md

Based on working-methods.md §6, the rules folder operates as follows:

**Always-on** files live permanently in C:\Users\dev-p\\continue\rules\\ and are never removed. There are four of them:

- platform_docmap.md,
- policy_development.md,
- policy_nomenclature.md,
- platform_status.md.

These are loaded by every agent prompt automatically, every time.

**Task-specific** files live in C:\Users\dev-p\\continue\rules-library\\ and are only moved into the rules\\ folder for the duration of a specific task.

Once the task completes, they are moved back to rules-library\\

This keeps the active context lean and prevents unrelated policy and spec files from being loaded into prompts where they aren\'t needed.

### Rules maintenance and the two-folder loading system

The two-folder system controls which rules files are active in Continue.dev at any given time. Continue.dev loads every file present in C:\Users\dev-p\\continue\rules\\ automatically when a prompt runs --- there is no selective loading within that folder.

The two-folder system is therefore a file management discipline, not a software feature: only the files needed for the current task are physically present in rules\\ when the agent runs.

Always-on files are permanent residents of rules\\ and are never moved.

Task-specific files live in rules-library\\ and are moved into rules\\ immediately before a task runs, then moved back when it completes.

Before moving any task-specific files in, platform_docmap.md must be updated to list exactly the files that will be present in rules\\ for that task run --- it is a live index of the active working set, not a permanent registry.

If platform_docmap.md is stale when the agent runs, the agent\'s understanding of what context it has will be wrong.

### Rules file maintenance

The rules files themselves are maintained by Developer, with Author drafting changes. The following conditions trigger an update:

- A chat session decision changes how the project should be built --- the relevant spec, policy, or platform file is updated to reflect the decision before the next task runs

- If a stage close reveals a gap, error, or outdated content in an existing rules file it is corrected before the next stage begins

- A new stage introduces scope not yet covered --- new or amended spec files are drafted and reviewed before Task 1 of that stage begins

When a rules file is added, removed, or renamed, the following must also be updated:

- platform_docmap.md --- reflects the current active set in rules\\

- platform_status.md --- reflects the current state of the build and what is in scope

- index.md is the Author\'s Reference

- working-methods.md §6 --- if the folder assignment of any file changes

Rules files are never edited during an active agent task.

platform_docmap.md file must be updated to reflect only what is currently sitting in the rules\\ folder before any agent prompt is run

## Author support structure

Author has no memory between sessions. Every session starts blank. The Author support structure is a reference library maintained on Developer\'s hard drive and passed to Author at the start of each session to compensate for this.

It is entirely separate from the rules files

- the rules files tell the Agent how to build;
- the Author support files tell Author how to work, what has been learned, and what is currently in progress.

Without this system, knowledge discovered through trial and error will not persist beyond the session boundary.

The files in this library are maintained by Author under Developer\'s direction and are updated at the close of every session.

### anvil-designer-gotchas.md

- A compact reference capturing Anvil Anvil.works Designer surprises discovered during Mybizz development --- specifically, properties that must be set in code rather than the Anvil.works Designer

- (LinearPanel orientation), properties that must be set in the Anvil.works Designer rather than code

- (TextBox appearance and password masking),

- E The xpected Anvil.works Designer behaviours that look wrong but are not

- (CardContentContainer auto-creation), and

- patterns that cause problems including data bindings on settings forms, stray event handler stubs, and DropdownMenu item management.

- Includes YAML verification standards.

### handover-template-notes.md

A session handover document scoped to a single in-progress task, written by the current Author instance for the next. It records the structure and format agreed for the deliverable, documents what was produced and approved this session as the reference model, lists what remains to be done and in what order, and specifies exactly which files to request at the start of the next session before any work begins.

### index.md

A master index file for a personal reference library maintained across AI-assisted development sessions. Because the AI has no memory between sessions, this index is passed at every session start so the AI can quickly identify which reference files are relevant to the current task without loading everything into context unnecessarily.

It lists every file in the library with a description of when it should be requested, provides section-level maps of the larger files so the AI knows exactly what is in each one before requesting it, records the current state of any temporary raw knowledge files awaiting distillation, and shows the complete folder structure of the library.

### intro.md

The orientation document for the Author\'s Reference system --- read once per session. It explains the purpose of the library (preserving hard-won knowledge across sessions given Author\'s lack of memory), describes the folder structure, defines the session-start and session-end usage protocols, explains how knowledge enters and accumulates in the system, and gives criteria for what makes a good knowledge entry versus what should be excluded.

### mybizz-architecture.md

- A record of architecture decisions and patterns established during Mybizz sessions that are not captured in rules files or general documentation.

- Covers the Stage 1.4 payment security boundary (secret keys deferred to Stage 1.5),

- the secret masking rule for config getter functions,

- the single-row read pattern for config tables,

- a known silent-zero bug on tables without instance_id,

- schema changes made in Sessions 5--7,

- the create_initial_config() preservation rule, the test_email_connection()

- SMTPLIB exception ordering pattern,

- settings tab navigation design, and the

- SettingsForm code structure conventions.

### todo.md

- A sequential, append-only task list that persists across all development sessions on the Mybizz project.

- Each item carries a permanent numeric ID that is never changed or reused, a status tag, a date, a task description, and a file path reference for the affected file.

- Items are never removed --- completed items are marked \[DONE\] and remain in the list as a record.

- The status tagging system uses 5 tags:

  - \[Next-up\] for items ready to begin,

  - \[WIP\] for work actively in progress,

  - \[PENDING\] for items blocked on an external dependency, and

  - \[FROZEN\] for items that are known but will not be worked on until explicitly raised.

  - \[DONE\] for completed tasks

- New items are added at the top with an incremented number, making the newest item always the highest-numbered.

### working-methods.md

- The master protocol document for all Developer and Author working sessions on the Mybizz project

- It opens with context explaining why strict protocols exist

- (documented failures across prior sessions involving false progress reports, skipped verification, and token waste),

- defines 23 numbered sections covering many operational areas:

- session start and close sequences,
- interim vs full stage close distinctions,
- degradation handling,
- task boundary rules,
- the two-folder rules file loading system,
- Anvil.works Designer verification steps,
- wireframe standards,
- the to-do status tagging system,
- build progress chart format,
- code draft and prompt template protocols,
- token efficiency and caching strategy,
- UTF-8 encoding requirements,
- Task 7a source-file authority rules,
- check file management,
- Uplink testing account setup,
- agent scope containment,
- Task 7b criterion counting,
- current model roster with file locations,
- full reference system maintenance protocol.

## The Prompt System

The prompt system consists of the following elements:

- Prompt template
- Prompt example
- Final prompt

### Prompt template

The prompt template consists of two elements:

- The prompt notes
- The prompt template

#### Prompt notes

- The prompt note consists of three sections

- The three elements of the prompt system work together in a defined sequence.

- The template provides the stable structure and the accumulated rules for this task type.

- The example file provides concrete reference --- lessons learned and techniques worth reemploying, kept separate from the notes to prevent them from becoming unwieldy.

- Author reads both before producing anything. Using the template as the guide and the example as the reference,

- Author produces the final prompt for the Agent.

- File naming reflects the role of each element:

- templates are prefixed tpl-,
- example files are prefixed eg-, and
- final ready-to-run prompts follow the pattern prompt-{stage}-call{N}-{description}.yaml.

- All files are stored in C:\_Data\_Mybizz\mybizz-core\prompts\\

#### Prompt example file

- The example file is a curated collection of lessons learned, structural techniques, and implementation quirks worth carrying forward into future prompts.

- It is not an example of a complete prompt.

- It exists so that Author has concrete reference when writing the final prompt --- not just abstract rules, but actual demonstrated approaches.

- If a technique in the example file becomes obsolete it is struck from the file. If a new technique emerges during a stage that is worth reemploying but does not belong in the rules or the template notes, it is added to the example file.

- This keeps the notes section lean.

- Example files follow the naming pattern eg-{stage}-task{N}-{description}.yaml.

#### What a filled/final prompt is

A prompt template contains placeholders --- marked sections that must be substituted with stage-specific and task-specific content before the prompt can be run.

The filled/final prompt is the result of that substitution process: every placeholder replaced with actual values, and the usage notes block removed entirely.

It is the document that gets handed to the Agent to execute.

The naming convention reflects this --- a template is prefixed tpl-, while a filled prompt is named prompt-{stage}-call{N}-{description}.yaml, making clear it is a specific, ready-to-run instance rather than a reusable template.

## Prompt notes construction

### Notes Components

- Section 1 --- What this template is and how to use it.

- Section 2 --- Generic rules for this task type:

- Section 3 --- Stage-specific context.  
  The notes in this section applies to a specific developmental stage:

### Section 1 --- Template Purpose and Usage

The **template file**, **example file**, and **notes** are internal documents written by the **Author for the Author**. The **Developer does not access or use these documents directly**. All Developer--Author interaction occurs in chat; the Author translates outcomes into the documentation.

#### Template File Structure

The template file contains two components:

1.  **Notes (three sections)** -- explanatory and operational guidance for the Author.

2.  **Structured prompt format** -- a mostly finalized prompt specification including:

    - agent instructions
    - rule set
    - checklist
    - output format

This section is **not a placeholder framework**. It represents the **actual prompt architecture** used as the basis when composing the final prompt.

#### Example File Purpose

The example file stores **implementation insights**, including:

- previously discovered quirks
- reusable techniques
- structural patterns worth retaining

It is **not a full prompt example**. Its function is to provide **concrete reference material** so the Author does not rely solely on abstract descriptions.

Maintenance rules:

- **Obsolete techniques** → removed or struck.
- **New structural practices** useful for future prompts but inappropriate for formal rules → added to the example file.

This separation prevents the notes section from expanding excessively.

#### Final Prompt

The **final prompt** is the artifact produced by the **Author for the Agent**, constructed using:

- the **template** (structure and rules)
- the **example file** (reference patterns)

#### Typical Workflow Cycle

1.  **Stage completion** → Developer and Author review results.

2.  Identify:
    - failure modes
    - rule refinements
    - additional constraints
    - improved context definitions

3.  **Author updates template notes** accordingly.

4.  **Author creates a new Section 3** for the next stage.

5.  **Prompt format section is finalized.**

6.  **Developer and Author review and approve.**

7.  **Author generates the final prompt** for the Agent.

### Section 2 --- Task-Specific Criteria

This section defines **template-specific rules** for a given task class (e.g., **Code Draft, Code Polish, Local Testing, Uplink Testing, Checks Build, Checks Scan**).

All entries here are **global constraints** for the template and apply **to every stage** in which the template is used.

#### Scope

The section records the **non-negotiable execution requirements** for the task type, including:

- operational rules
- standards and conventions
- known failure patterns
- structural or environmental constraints

These elements distinguish this template from all other template types.

#### Knowledge Accumulation

When a **new failure pattern or constraint** is discovered during any stage:

1.  It is **added to this section** of the corresponding template.

2.  The rule becomes **automatically applicable to all future stages** using that template.

#### Function

This section acts as a **persistent knowledge layer**. It encodes lessons learned during development so that **process improvements propagate forward automatically**.

As the project progresses, the section **expands incrementally**, preserving operational knowledge and reducing recurrence of previously identified failures.

### Section 3 --- Stage-Specific Context

Section 3 contains **stage-exclusive context** and is **fully replaced for each new stage**. No content is carried forward automatically. All entries apply **only to the current stage**.

#### Purpose

Sections 1--2 define **template structure and global rules**, but cannot encode stage-specific requirements. Section 3 provides the **operational context unique to the current stage**.

#### Required Contents

**1. Schema Excerpt**

- Include **only tables and columns used in the stage**.
- Do **not** include the full schema.
- Column names must match **anvil.yaml exactly**.
- Record **data types** and **relevant constraints** affecting code behavior.

**2. Component Names**

- List **exact UI component identifiers** referenced by the code.
- Names must be verified against **form_template.yaml** for the stage.
- **No inference or assumption**; names must be confirmed.

**3. Stage-Specific Security Boundaries**

- Identify **fields, tables, or operations intentionally excluded** from the stage.
- Mark them as **deferred to later stages**.
- Provide the **reason for deferral** to prevent misinterpretation as omission.

**4. Functions to Preserve**

- Specify existing functions that **must not be modified, removed, or overwritten**.
- Include a **justification for preservation**.

**5. Anvil Designer Workarounds**

- Document **component properties or behaviors** that cannot be configured in the **Anvil Designer**.
- Indicate whether configuration must occur **in code** or **in the designer**.

**6. Ordering Constraints**

- Define **required execution order**, particularly in \_\_init\_\_ or initialization logic.
- Include constraints tied to **component setup or data-loading dependencies**.

**7. Known Issues / Deferred Fixes**

- Record **identified issues** from earlier tasks in the stage.
- Mark items the agent **must be aware of but must not fix** during the current task.

**8. Stage-Specific Compliance Notes**

- Clarify **how Section 2 rules apply in this stage** when the generic rule alone is insufficient.

#### Update Policy

For each new stage:

- **Rewrite Section 3 from scratch** using **verified artifacts**.
- **Do not carry forward content** from previous stages unless **explicitly revalidated** as applicable.

## UI Scope and UI Design & Build

### UI Scope (Task 1)

**Objective:** Define the complete UI requirements for the current stage.

#### Process

The Author:

1.  Reads all **relevant rules files**.

2.  Identifies all required UI elements, including:
    - screens
    - forms
    - panels
    - interactive components

3.  Specifies:
    - **data displayed or captured** by each component
    - **navigation logic**
    - **visibility conditions**

#### Output

A **structured UI Scope document** containing:

- complete UI component inventory
- component data requirements
- navigation structure
- visibility logic

#### Constraints

- **No wireframes are produced in this task.**
- Output is **scope definition only**.

#### Approval Gate

- The **Developer reviews and approves** the scope.
- **Task 2 cannot begin until approval is granted.**

### UI Design & Build (Task 2)

**Objective:** Convert the approved UI scope into implementable UI specifications and construct the UI.

#### Author Responsibilities

The Author produces **wireframes** including:

1.  **Layout diagrams** showing component placement.

2.  A **component properties table** specifying:
    - component names
    - labels
    - functional roles
    - placeholder text

#### Constraints

- **No aesthetic properties** (styling, colors, etc.) are defined.

#### Developer Responsibilities

The Developer:

1.  Builds the UI using the **Anvil Designer**.

2.  Ensures **all component names match the wireframe specification exactly**.

#### Verification Process

After UI construction:

1.  Developer exports **form_template.yaml** from the Anvil app.

2.  Author performs **component-by-component verification** against the wireframe.

Verification rules:

- Each component receives an **explicit pass/fail result**.
- **General confirmation is not permitted.**

#### Stage Gate

- The stage proceeds to **Task 3 only after YAML verification passes**.
