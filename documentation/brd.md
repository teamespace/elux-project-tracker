# Business Requirements Document
## Elux Project Tracker — Full Revamp

**Version:** 1.0
**Date:** 2026-06-17
**Author:** Elux Operations / Product Team
**Status:** Draft — Pending Stakeholder Review

---

## Table of Contents

1. [Business Context](#1-business-context)
2. [Business Objectives](#2-business-objectives)
3. [Stakeholder Map](#3-stakeholder-map)
4. [Current-State Pain Points and Business Impact](#4-current-state-pain-points-and-business-impact)
5. [Stakeholder Requirements](#5-stakeholder-requirements)
6. [Constraints](#6-constraints)
7. [Risk Register](#7-risk-register)
8. [Success Criteria — Business Perspective](#8-success-criteria--business-perspective)
9. [Approval and Sign-Off](#9-approval-and-sign-off)

---

## 1. Business Context

### 1.1 About Elux

Elux is an AI-native product design agency based in Indonesia. The company operates at the intersection of strategic design and AI-augmented delivery, serving clients who need fast, high-quality digital product work. The team is small (8–12 people) but operates with the complexity of a much larger organization — multiple simultaneous client projects, cross-functional work streams, and a rapid pace of delivery.

"AI-native" is not a marketing claim for Elux — it describes how the team actually works. Processes, workflows, and tooling are all expected to incorporate AI either natively or by design. The tracker revamp falls directly within this operating philosophy.

### 1.2 Why Internal Tooling Matters for a Design Agency

A design agency's core deliverable is its output quality. But output quality depends on execution quality, which depends on coordination quality. For a team of 8–12 people managing multiple concurrent client projects, the internal tracker is not an administrative utility — it is the operational backbone of the business.

When the tracker is unreliable:
- Coordination happens through informal channels (Slack, verbal), which does not scale
- Project status is held in individuals' heads rather than shared systems
- Risk is discovered late, in client-facing moments, not pre-empted internally
- Onboarding new team members takes longer because the tool cannot be trusted to represent reality

A reliable, well-designed internal tracker is therefore a direct investment in delivery quality and agency capacity.

### 1.3 Why a Full Revamp, Not a Patch

The existing tracker was built incrementally as the team grew. This is common for internal tools. The cost of incremental fixes is that the structural issues (data architecture, navigation model, role-based experience) cannot be addressed without rebuilding the foundation.

Three specific factors justify a full revamp over a patch:

1. **The data inconsistency is a structural issue.** The mismatch between Dashboard and My Work counts suggests the problem is in how data is queried or scoped, not a single bug. Patching it risks introducing regressions elsewhere.

2. **The stack has been decided.** The team is moving to Nuxt 4 + Cloudflare (Pages + D1) + Nuxt UI v3 + Tailwind v4. This migration would require a rebuild regardless. The product decision to revamp features is therefore aligned with the technical decision to rebuild the stack.

3. **The tool needs to scale.** As Elux grows from 8–12 to 20+ people, the current architecture and feature set will not support it. Building the right foundation now is cheaper than patching and re-patching a crumbling one.

### 1.4 Scope of This Document

This BRD covers the business justification, stakeholder needs, constraints, and success criteria for the full revamp of the Elux Project Tracker. It is intended as a companion to the Product Requirements Document (PRD), which covers user-facing feature requirements in detail. The BRD focuses on organizational needs and business outcomes.

---

## 2. Business Objectives

### 2.1 Primary Objectives

**BO1 — Establish the tracker as the single source of truth for all project work**

Currently, project status information lives across the tracker, Slack, Notion, and individual memories. This fragmentation creates coordination cost and inconsistency. The tracker must become the authoritative record of what is being worked on, by whom, and in what state.

*Measurable outcome:* Within 30 days of launch, all active project tasks are logged and maintained in the tracker. Status-check Slack messages decrease by ≥ 60%.

**BO2 — Reduce coordination overhead for the PM and project leads**

Lintang's current workflow includes manual status aggregation before standups and weekly syncs. This is time that could be spent on higher-value work: client communication, design direction, and strategic prioritization.

*Measurable outcome:* Standup preparation time for the PM reduces from baseline by ≥ 50% within 30 days of launch, as reported by Lintang.

**BO3 — Enable proactive risk management, not reactive fire-fighting**

Currently, project risks are discovered during client conversations or team standups. The tracker provides no early-warning system. As Elux takes on more concurrent client projects, the inability to detect risk early is a growing liability.

*Measurable outcome:* At least one HIGH risk item is flagged and acted on before a client-visible issue occurs within the first 60 days post-launch. Risk flag feature is used actively by PM within 14 days of launch.

**BO4 — Support team growth without proportional management overhead**

The current tracker does not support a team larger than ~12 without significant manual coordination. The revamp must be designed to remain effective at 20–30 people without requiring a second revamp.

*Measurable outcome:* When team grows to 15+ (expected within 12 months), the Team Workload view and role-based access controls accommodate growth without architectural changes.

**BO5 — Demonstrate Elux's own operational excellence as a design agency**

Elux advises clients on product design and digital operations. Using an unreliable internal tool is an internal contradiction. The revamped tracker, built on the same stack and design principles Elux recommends to clients, is itself a demonstration of the agency's capabilities.

*Measurable outcome:* The tracker can be cited as a case study in Elux's own operational methodology within 90 days of launch.

### 2.2 Secondary Objectives

**BO6 — Build internal AI tooling competency**

The AI Assistant feature (Phase 4 / lowest priority) is not just a productivity feature — it is a proof of concept for how Elux integrates AI into operational tools. Building it internally develops competency that can be applied to client AI projects.

**BO7 — Reduce dependency on external project management tools**

The tracker reduces the need for external tools (Notion for docs, spreadsheets for workload tracking, memory for project status). Each function brought in-house reduces subscription cost and context-switching.

---

## 3. Stakeholder Map

### 3.1 Primary Stakeholders (Direct Users)

| Stakeholder | Role | Primary Interest | Engagement Level |
|------------|------|-----------------|-----------------|
| Lintang | Project Manager | Portfolio visibility, risk surfacing, workload management | High — daily user, primary driver of adoption |
| Ahrasya | Designer / Member | Fast task creation, personal workload clarity, My Day | High — daily user |
| Other Members (4–6) | Designers / Developers | Task management, status updates, My Work | High — daily users |
| Interns (1–3, rotating) | Interns | View tasks, update own status | Medium — limited use |
| Admin (1) | System Administrator | Data integrity, user management, access control | Low frequency, high authority |

### 3.2 Secondary Stakeholders (Indirectly Affected)

| Stakeholder | Interest | Impact of Revamp |
|------------|---------|-----------------|
| Elux Leadership / Founders | Operational efficiency, agency health | Improved project visibility reduces firefighting escalations |
| Elux Clients | Not direct users, but benefit from better-managed delivery | Better risk detection → fewer delivery surprises → stronger client relationships |
| Future Team Members | Onboarding experience | A reliable, self-explanatory tool reduces ramp-up time |

### 3.3 Technical Stakeholders

| Stakeholder | Role | Involvement |
|------------|------|------------|
| Frontend Developer(s) | Build Phase 2 (Nuxt 4 frontend) | High involvement in Phase 2–3 |
| Backend Developer(s) | Phase 3 migration to Cloudflare D1 | High involvement in Phase 3 |
| Design Lead | Phase 1 design foundation, component system | High involvement in Phase 1, ongoing in Phase 2 |
| DevOps / Infra | Cloudflare Pages deployment, D1 configuration | Involvement in Phase 3 |

### 3.4 Stakeholder Needs Summary

| Stakeholder | Needs | Would Block Sign-Off If Missing |
|------------|-------|-------------------------------|
| Lintang (PM) | Portfolio view, risk indicators, team workload, deep links | Yes |
| Ahrasya (Designer) | Task creation from Board, My Day, write feedback | Yes |
| Admin | Data accuracy, user management UI | Yes |
| Leadership | Reliable single source of truth | Yes |
| Interns | Clear personal task view, simple status updates | No — will follow PM adoption |

---

## 4. Current-State Pain Points and Business Impact

### 4.1 Pain Point to Impact Matrix

| Pain Point | Operational Impact | Business Impact | Severity |
|-----------|-------------------|-----------------|---------|
| Data inconsistency (Dashboard 19 vs. My Work 30) | Team cannot trust any metric in the tool | Decisions made on bad data; risk of missing work | Critical |
| No helicopter/portfolio view for PM | PM spends manual time aggregating status before every sync | Coordination overhead, slower response to risk | High |
| No write operation feedback | Users submit actions multiple times, creating duplicate data | Data pollution, time lost to cleanup | High |
| Deep links broken (404 on /epic/[id]) | All async task communication must go through Slack (copy-paste) | Coordination friction, longer response loops | High |
| Tasks only creatable from inside an Epic | Most common action is unnecessarily slow (4+ clicks) | Reduced task logging frequency, tasks fall through the cracks | High |
| Notification bell non-functional | Team ignores notifications; assignment changes go unnoticed | Delayed task starts, PM must chase via Slack | Medium |
| No risk visibility | Problems discovered in standups or client calls | Client delivery risk, relationship damage | High |
| No My Day / focus view | Members manage focus through Slack or personal notes | Cognitive load; misaligned daily priorities | Medium |
| No team workload visibility | PM cannot rebalance assignments without manual inquiry | Uneven workload distribution, burnout risk | Medium |

### 4.2 Cost Quantification (Estimated)

The following are rough estimates based on team size and meeting frequency, not formal time studies. They are directional, not precise.

**Standup preparation time:**
- Lintang spends approximately 15–20 minutes before each standup manually checking project status across Slack, the tracker, and notes.
- 5 standups per week × 20 minutes = 100 minutes/week = ~1.5 hours/week of PM time on manual aggregation.
- Over 12 months: ~75 hours of PM time on a task that a functioning tool should eliminate.

**Duplicate task submissions / data cleanup:**
- No write feedback leads to re-submissions and duplicate tasks. Estimated 20–30 minutes per week on cleanup across the team (conservative).
- Over 12 months: ~20–25 hours across the team on cleanup that should not exist.

**Status-check Slack messages:**
- Estimated 3–5 "what's the status of X?" Slack messages per day across the team that could be answered by the tracker.
- At 2 minutes of interruption cost per message, that is 6–10 minutes of interrupted work per day.
- Over 12 months: ~40–65 hours of interrupted work time.

These numbers are not the primary justification for the revamp — the strategic rationale is. But they illustrate that the current tool's unreliability has a real and growing cost.

---

## 5. Stakeholder Requirements

### 5.1 Leadership / Founders

**BR-L1:** The tracker must be the authoritative source for project status. Leadership must be able to get a project health snapshot in under 2 minutes without asking anyone.

**BR-L2:** The tool must support team growth to 20+ people without a rebuild. Scalable role model, data architecture, and navigation.

**BR-L3:** Cloudflare infrastructure is a business decision (cost, performance, regional compliance). The tracker must run entirely on Cloudflare (Pages + D1). No exceptions.

**BR-L4:** The revamp must be completed with the existing team. No external contractors unless a specific, bounded scope is agreed in advance.

**BR-L5:** The AI features represent Elux's commitment to being AI-native. At least one AI feature must ship within 6 months of the initial revamp launch.

### 5.2 Project Manager (Lintang)

**BR-PM1:** Dashboard must provide a portfolio-level view — all active projects, their health, and any HIGH risk items — on first load.

**BR-PM2:** Team Workload view must be accessible without more than two clicks from Dashboard.

**BR-PM3:** All epics must be deep-linkable. Sharing a URL in Slack must take the recipient directly to the correct epic after login.

**BR-PM4:** Notifications must be functional and actionable. When a task is assigned or a status changes, Lintang must receive a notification that links directly to the relevant item.

**BR-PM5:** Risk flagging must be available on both tasks and epics. The PM must be able to set and change risk levels without developer intervention.

**BR-PM6:** The tool must support Lintang's use of the tracker as the visual aid for client-facing syncs. The Board and Goals views must be presentable in a screenshare context (clean, no internal noise).

### 5.3 Members (Designers, Developers)

**BR-M1:** Task creation must be possible from any view in the application. Maximum three clicks or one keyboard shortcut.

**BR-M2:** Every create, update, and delete action must produce visible, specific feedback. "Task saved" is not sufficient — "Task 'X' moved to In Progress" is.

**BR-M3:** My Work must show an accurate count of all tasks assigned to the current user. This count must match any count shown on the Dashboard.

**BR-M4:** My Day must allow members to curate a focused daily task list independently of the full backlog.

**BR-M5:** Task dependencies must be visible on the Board. A member should not start a blocked task without knowing it is blocked.

### 5.4 Interns

**BR-I1:** The interface must make it clear which tasks are assigned to the current user, with no ambiguity.

**BR-I2:** Status updates on own tasks must be possible without navigating away from the current view.

**BR-I3:** Role permissions must prevent interns from accidentally modifying or deleting items outside their scope, with no confirmation dialogs required (permissions enforced silently at the UI and API level).

### 5.5 Admin

**BR-A1:** Data integrity must be verifiable. Admin must have access to a view (even a basic one) that shows raw task counts per user, to confirm consistency across views.

**BR-A2:** User management (invite, role change, deactivate) must be possible through the UI without database access.

**BR-A3:** Role definitions must be clearly documented and enforced. Changes to role permissions must require Admin approval.

**BR-A4:** Activity logs must be retained for a minimum of 90 days for audit purposes.

---

## 6. Constraints

### 6.1 Technical Constraints

**TC1 — Infrastructure: Cloudflare Only**
The tracker must run entirely on Cloudflare infrastructure: Cloudflare Pages for hosting, Cloudflare D1 for the database. This is a firm business decision, not a preference. No AWS, GCP, Azure, or self-hosted alternatives.

**TC2 — Frontend Framework: Nuxt 4**
The frontend is Nuxt 4. This constrains which SSR patterns, routing conventions, and rendering modes are available. Phase 2 must account for Nuxt 4's server-side rendering model and route structure.

**TC3 — Component Library: Nuxt UI v3**
Nuxt UI v3 provides the base component set. Custom components must be built on top of (not replacing) Nuxt UI v3 primitives where possible, to reduce maintenance surface.

**TC4 — Styling: Tailwind CSS v4**
Tailwind v4 changes the configuration model relative to v3 (CSS-first configuration, no `tailwind.config.js`). The design token system must be built for Tailwind v4's native approach.

**TC5 — Icons: Phosphor Icons**
Phosphor Icons is the exclusive icon set. No Heroicons, Lucide, or custom SVGs outside the Phosphor library.

**TC6 — Data Migration: PocketBase → Cloudflare D1**
All existing production data in PocketBase must be migrated to D1 during Phase 3. The migration must preserve task history, user records, and project structure. No clean-slate restart unless explicitly approved by Admin and PM.

**TC7 — No Third-Party Project Management SaaS**
The tracker is custom-built, not configured from Jira, Linear, Asana, or any other third-party tool. This is intentional — Elux needs full control over the data model and user experience.

### 6.2 Timeline Constraints

**TL1 — Phase sequencing is strict:**
Phase 0 (Documentation) → Phase 1 (Design Foundation) → Phase 2 (Frontend, Dummy Data) → Phase 3 (Backend Migration) → Phase 4 (New Features) → Phase 5 (Polish + Deploy)

No phase may begin until the prior phase deliverables are signed off. Phase 2 frontend work against dummy data must not be blocked waiting for Phase 3 backend work.

**TL2 — Phase 0 and Phase 1 must complete before any frontend code is written.**
Writing frontend code before the design system is established creates rework. This constraint is both technical and business: rework time is wasted capacity for a team of 8–12.

**TL3 — Target for Phase 2 completion (internal beta):** To be set at the end of Phase 1 design review, based on engineering capacity.

**TL4 — AI features (Phase 4, low priority) must not delay Phase 2 and Phase 3 delivery.** If the team is at capacity, AI features are deferred beyond the initial launch.

### 6.3 Team Capacity Constraints

**CP1 — The revamp is built by the same team that is delivering client work.** There is no dedicated revamp team. Engineering and design capacity for the tracker competes with client project capacity.

**CP2 — Phases must be sized to fit part-time availability.** Phases should be planned in 2–4 week windows, not 2–3 month waterfall blocks, to accommodate the reality of a client-servicing team.

**CP3 — The design phase (Phase 1) is a full-team design resource commitment.** The Design Lead must be available for Phase 1 without simultaneous client design commitments of the same scale.

### 6.4 Budget Constraints

**BG1 — Infrastructure costs must remain within Cloudflare's free or low-cost tier for a team of 8–12.** Cloudflare D1, Pages, and Workers pricing must be evaluated at the Phase 3 planning stage.

**BG2 — No paid third-party component libraries or icon sets beyond what is already in the stack.** Nuxt UI v3 (open source), Tailwind v4 (open source), and Phosphor Icons (open source) are the permitted components.

---

## 7. Risk Register

### 7.1 Technical Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| TR1 | Nuxt 4 has breaking changes or instability that blocks Phase 2 development | Medium | High | Pin to a specific Nuxt 4 minor version. Have a fallback plan to Nuxt 3 for Phase 2 if Nuxt 4 is not stable at development start. |
| TR2 | Cloudflare D1 has performance or query limitations that don't meet the tracker's needs | Low | High | Evaluate D1 for the tracker's data model in Phase 0/1 before committing Phase 3. Identify query patterns that may hit D1 row limits. |
| TR3 | Data migration from PocketBase to D1 results in data loss or corruption | Low | Critical | Full PocketBase export and backup before migration. Migration run in staging environment with data validation before production cutover. |
| TR4 | The root cause of the Dashboard vs. My Work count inconsistency is a data integrity issue (not just a query bug), requiring data cleanup before migration | Medium | High | Audit the PocketBase data model and query layer in Phase 0. Document the root cause before Phase 3 begins. |
| TR5 | Nuxt UI v3 does not have components needed for key interactions (e.g., side panel, complex drag-and-drop Board) | Medium | Medium | Evaluate component coverage during Phase 1. Identify gaps early so custom component development can be scoped into Phase 2. |

### 7.2 Product and Adoption Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| PR1 | Team does not adopt the new tracker despite reliability fixes | Medium | High | Involve Lintang and two members in Phase 1 design review. The PM's adoption drives team adoption — if the tool solves her problems, she will require its use. |
| PR2 | Feature scope expands during development (scope creep), delaying core reliability fixes | High | High | MoSCoW prioritization is enforced. Must Have features are locked. Should Have features require explicit PM approval to add to any phase before Must Have items are complete. |
| PR3 | The revamp takes long enough that the team builds workarounds that become entrenched | Medium | Medium | Phase 2 (internal beta with Must Have items only) should be usable within 8 weeks of Phase 1 completion. An incomplete but improved tool is better than waiting for the perfect tool. |
| PR4 | AI features create unrealistic expectations that delay the core revamp | Low | Medium | AI is explicitly the last priority. All communications about the revamp must frame AI as Phase 4, not Phase 1. |
| PR5 | Team members do not update task status in the new tracker consistently | Medium | High | My Day view is designed specifically for this — it creates a daily habit loop. Write feedback makes the act of updating feel rewarding. Lintang will be equipped with a Team Workload view to identify and address non-updaters. |

### 7.3 Organizational Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| OR1 | Key person dependency — if Lintang is not available during the revamp, there is no PM to drive adoption decisions | Medium | High | Document requirements thoroughly in this BRD and the PRD so decisions can be made without real-time PM input. Identify a backup decision-maker for design reviews. |
| OR2 | Client project pressure squeezes out revamp capacity entirely | High | Medium | Time-box phases. If a phase cannot proceed due to client pressure, it waits — but the phase sequence is maintained. No partial phases shipped without completing prior phase deliverables. |
| OR3 | The revamp is perceived by the team as extra work rather than a quality-of-life improvement | Low | Medium | Involve the team in pain point validation (which has already been done through audits and interviews). Share the "why" clearly in the Phase 0 documentation. |
| OR4 | New team members join during the revamp and onboard onto the old tool, then need to re-onboard | Low | Low | If possible, pause new-member onboarding onto the tracker until Phase 2 is live. If not possible, brief new members on the revamp timeline. |

### 7.4 Risk Summary by Severity

**Critical risks requiring immediate action:**
- TR3 (data migration loss) — mitigated by backup protocol
- TR4 (data integrity root cause) — must be investigated in Phase 0

**High risks requiring active monitoring:**
- TR1 (Nuxt 4 stability)
- TR2 (Cloudflare D1 limitations)
- PR1 (team adoption)
- PR2 (scope creep)
- OR1 (PM availability)
- OR2 (client pressure on capacity)

---

## 8. Success Criteria — Business Perspective

### 8.1 Must Be True at Launch (Phase 5 — Production)

**SC1 — Data accuracy:** Zero reported data inconsistency incidents in the first 30 days post-launch. Dashboard counts, My Work counts, and Board task counts match for all users.

**SC2 — Route integrity:** All defined application routes resolve without errors for authenticated users. Zero 404s on valid internal routes.

**SC3 — Write reliability:** All create, update, and delete operations produce visible confirmation. Zero user-reported "I don't know if it saved" incidents in the first 30 days.

**SC4 — Notification functionality:** The notification bell is functional. Users receive notifications for task assignment and status changes on their tasks.

**SC5 — Task creation accessibility:** A task can be created from at least three distinct contexts in the application (Board, My Work, Global/Command). The creation action takes no more than 30 seconds from trigger to confirmed save.

### 8.2 Must Be True Within 30 Days of Launch

**SC6 — Daily active usage:** At least 80% of the team (excluding interns on leave) opens the tracker on at least 4 out of 5 working days in the 30-day period.

**SC7 — PM workflow adoption:** Lintang uses the tracker as the primary visual aid for at least 2 standups or syncs in the first 30 days, with no supplementary manual status aggregation required.

**SC8 — Task logging:** At least 90% of new project tasks are created in the tracker (not in Slack, Notion, or spreadsheets) in the 30-day period.

**SC9 — Slack coordination reduction:** The number of "what's the status of X?" or "who's working on Y?" messages in the primary project Slack channel decreases by ≥ 50% compared to the 30 days before launch. (Measured manually by counting tagged messages in the relevant channel.)

### 8.3 Must Be True Within 90 Days of Launch

**SC10 — Risk feature active use:** The risk indicator feature (HIGH/MEDIUM/LOW) is used on at least one active epic per project. At least one risk flag has been acted on (either resolved or escalated) without a client-visible incident.

**SC11 — Team NPS:** Average team NPS for the tracker is ≥ 8/10 in a survey conducted at the 90-day mark.

**SC12 — PM time savings:** Lintang self-reports that standup preparation time has decreased by ≥ 50% compared to before the revamp.

### 8.4 Business Outcome Measures (6 Months Post-Launch)

**SC13 — Tool longevity:** No second revamp is required within 6 months. The architecture supports current and projected team needs without structural changes.

**SC14 — AI feature readiness:** The AI Assistant panel (even in MVP form) is in development or complete within 6 months of the core revamp launch.

**SC15 — Scalability proof:** When team grows to 15+ members (expected within 12 months), the Team Workload view and role-based access model support the expanded team without architectural changes.

---

## 9. Approval and Sign-Off

### 9.1 Approval Requirements

This BRD requires review and approval from the following stakeholders before Phase 1 (Design Foundation) begins:

| Stakeholder | Role | Required Action | Sign-Off Method |
|------------|------|----------------|----------------|
| Elux Leadership | Strategic approver | Confirm business objectives align with company direction | Written approval (email or Notion comment) |
| Lintang | PM / Primary Stakeholder | Confirm PM requirements are complete and accurate | Written approval |
| Admin | Technical / Data Stakeholder | Confirm data constraints and admin requirements are accurate | Written approval |
| Design Lead | Phase 1 Owner | Confirm design phase constraints and deliverables are feasible | Written approval |
| Engineering Lead | Phase 2–3 Owner | Confirm technical constraints are accurate and implementable | Written approval |

### 9.2 Review Milestones

| Milestone | Document | Reviewer | Timing |
|----------|---------|---------|--------|
| BRD + PRD Initial Review | brd.md, prd.md | All primary stakeholders | End of Phase 0 |
| Design Foundation Review | Design system, component specs | PM, Design Lead, Engineering Lead | End of Phase 1 |
| Frontend Beta Sign-Off | Phase 2 build with dummy data | PM, 2 Members (including Ahrasya) | End of Phase 2 |
| Backend Migration Sign-Off | Data integrity check, route validation | Admin, Engineering Lead, PM | End of Phase 3 |
| Pre-Launch Review | Full feature set, QA results | All primary stakeholders | End of Phase 4 |
| Launch Approval | Final QA checklist, rollout plan | PM + Leadership | Beginning of Phase 5 |

### 9.3 Change Management Process

Any changes to the requirements documented in this BRD or the companion PRD after initial sign-off must follow this process:

1. The change requestor documents the proposed change with: what is changing, why, and the impact on scope/timeline/constraints.
2. The change is reviewed by Lintang (PM) and Engineering Lead.
3. If the change affects the Must Have feature set, it requires Leadership approval.
4. Approved changes are versioned in this document with a changelog entry.
5. No changes are acted on without written approval from both the PM and the Engineering Lead.

### 9.4 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-17 | Elux Product Team | Initial draft |

---

*Document maintained by: Elux Product / Operations Team*
*Next scheduled review: End of Phase 1*
*This document is internal only — not for external distribution*
