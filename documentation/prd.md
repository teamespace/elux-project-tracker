# Product Requirements Document
## Elux Project Tracker — Full Revamp

**Version:** 1.0
**Date:** 2026-06-17
**Author:** Elux Product Team
**Status:** Draft — Pending Review

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Problem Statement](#2-problem-statement)
3. [User Personas](#3-user-personas)
4. [Success Metrics and KPIs](#4-success-metrics-and-kpis)
5. [Product Principles](#5-product-principles)
6. [Feature Requirements (MoSCoW)](#6-feature-requirements-moscow)
7. [Out of Scope](#7-out-of-scope)
8. [Assumptions and Dependencies](#8-assumptions-and-dependencies)
9. [Open Questions](#9-open-questions)

---

## 1. Product Vision

### 1.1 Vision Statement

Elux Project Tracker is the operating layer for how Elux runs its projects — a tool that gives every team member, regardless of seniority or role, an immediate and accurate picture of where work stands, what needs attention today, and where risk is building.

### 1.2 Mission Statement

Build an internal project management tool that matches the way Elux actually works: fast-moving, design-led, multi-project, AI-native. The tracker must eliminate the friction between knowing what to do and actually doing it. It should feel less like a project management tool and more like a shared brain for the team.

### 1.3 Product Direction

The revamp is not a feature expansion. It is first a reliability and clarity fix, then a thoughtful feature addition. The guiding direction: the tool should answer the three questions every team member asks every morning — "What am I doing today?", "What's blocking me?", and "Are we on track?" — within ten seconds of opening it.

---

## 2. Problem Statement

### 2.1 The Current State

The current Elux Project Tracker was built iteratively as the team grew. It functions as a task list but fails as a project management tool. The core problems are:

**Orientation failure.** The dashboard opens to a view that does not tell users what to do next. There is no hierarchy of urgency, no project-level summary, and no quick-action entry point. Users described feeling "lost" on the dashboard in interviews.

**No helicopter view.** Managers and the PM cannot see across all active projects simultaneously. There is no view that aggregates progress, risk, or workload at the portfolio level. Decisions that should be data-informed are instead made from memory.

**Data inconsistency.** The most critical trust-breaking issue: the dashboard reports 19 tasks for a user while My Work reports 30 for the same user. When a tool's numbers do not match each other, users stop trusting any number the tool produces. This undermines the entire value proposition.

**No write feedback.** Creating a task, updating a status, or moving a card produces no visible confirmation. Users do not know if their action succeeded. This leads to double-submissions and uncertainty.

**Broken deep links.** Sharing a direct URL to an epic (e.g., `/epic/[id]`) returns a 404. This prevents async communication about specific work items, forces context-switching to Slack or Notion to share references, and makes the tool feel incomplete.

**Task creation is buried.** Tasks can only be created from inside an Epic. There is no global "add task" action, no creation from the Board view, and no creation from My Work. This adds friction to the most common daily action.

**Non-functional notifications.** The notification bell shows `9+` but clicking it does nothing. This is not a minor bug — it signals to users that the tool is not maintained, which reduces trust in the whole product.

**No risk visibility.** Projects can drift toward failure silently. There is no mechanism for surfacing HIGH/MEDIUM/LOW risk signals, no critical issues section, and no proactive alerts. Managers discover problems in standup rather than from the tool.

### 2.2 Why It Matters

Elux is an AI-native design agency. The quality of internal operations directly affects how the company presents itself to clients. When internal tooling is unreliable, it creates operational overhead — status checks happen in Slack instead of the tracker, decisions are made on gut instead of data, and onboarding new team members takes longer because the tool cannot be trusted to represent reality.

The revamp is justified on two grounds: (1) reducing the coordination cost that currently gets absorbed by Slack messages and manual status calls, and (2) building the internal infrastructure needed to scale to a larger team without proportional management overhead.

---

## 3. User Personas

### 3.1 Persona: The Admin

**Name:** System Admin (internal IT / founding team member)
**Role:** Admin
**Access level:** Full — all projects, all settings, all users

**Goals:**
- Maintain a clean, reliable system with accurate data across all views
- Manage user accounts and permissions without needing developer intervention
- Have visibility into system health and audit trails
- Be able to onboard new team members quickly

**Frustrations:**
- Data inconsistencies between dashboard and My Work mean manual reconciliation
- No audit log makes it hard to understand who changed what and when
- User permission management is opaque — it's unclear what each role can and cannot do
- Cannot fix broken notification system without backend access

**Daily Workflow:**
Opens the tracker once in the morning. Checks if any system-level flags are visible. Reviews user access if someone new joined. Does not use the tracker for task management — uses it for oversight and configuration.

**Key Jobs to Be Done:**
- Trust that the data shown is accurate
- Manage users and permissions through a UI, not a database
- Identify and resolve data anomalies

---

### 3.2 Persona: Lintang — The Project Manager

**Name:** Lintang
**Role:** Manager
**Access level:** Create and assign epics, goals, and tasks across all projects

**Goals:**
- Know the status of all active projects at a glance every morning
- Identify which projects are at risk before they become emergencies
- Assign and redistribute work based on actual team capacity, not guesswork
- Run weekly syncs and standups using the tracker as the single source of truth
- Create new epics and goals without needing to involve a developer

**Frustrations:**
- No portfolio-level view forces reliance on memory and Slack for project status
- Cannot see team workload — does not know who is overloaded
- No risk indicators mean problems are discovered late
- Broken deep links force copying task details into Slack manually
- The notification system is broken and therefore ignored entirely

**Daily Workflow:**
Opens the tracker first thing. Wants to see: active projects, their health, any HIGH risk items, and what her team has on their plates today. Throughout the day, creates or reviews epics, assigns tasks to team members, and checks progress. In weekly syncs, uses the tracker to walk through project status with clients or leadership.

**Key Jobs to Be Done:**
- Portfolio overview in under 30 seconds
- Risk surfacing without manual investigation
- Team workload balance at a glance
- Deep-linkable epics and tasks to share in Slack

---

### 3.3 Persona: Ahrasya — The Designer

**Name:** Ahrasya
**Role:** Member
**Access level:** Create and edit own tasks; view all project tasks

**Goals:**
- Know exactly what to work on today with minimal decision fatigue
- Log tasks quickly without navigating through multiple layers
- Track personal progress across projects
- Communicate blockers early without needing to interrupt Lintang on Slack

**Frustrations:**
- Cannot create a task from the Board — has to navigate into an Epic first, which adds four or more clicks to the most common action
- My Work shows 30 tasks but the dashboard shows 19 — does not know which number is real
- No confirmation when creating or updating a task — has to manually check if the action worked
- No "My Day" concept means the full task list feels overwhelming with no prioritization aid

**Daily Workflow:**
Opens the tracker in the morning. Checks My Work to see what is assigned. Picks the highest priority items. Works through the day. Updates task status when done. Logs new tasks as they come up in client calls. Checks in the afternoon to see if anything new was assigned.

**Key Jobs to Be Done:**
- Create a task in three clicks or fewer from anywhere in the app
- Know that a task was saved (confirmation feedback)
- See a focused "today" view separate from the full task backlog
- Tag blockers without leaving the task view

---

### 3.4 Persona: The Intern

**Name:** Generic Intern (rotating, multiple per year)
**Role:** Intern
**Access level:** View all; limited task status updates (own tasks only)

**Goals:**
- Understand project structure quickly after joining
- Know what is expected of them on any given day
- Mark their tasks as done or in progress
- Not accidentally break or modify something they should not

**Frustrations:**
- The tool does not explain itself — there is no onboarding or contextual help
- Cannot tell which tasks are assigned to them versus the whole team
- The data inconsistency is especially confusing for someone new — they do not know what to trust
- Notification bell creating false expectations

**Daily Workflow:**
Opens the tracker. Finds their assigned tasks. Works through them. Updates status on completion. Looks at the broader project for context when needed. Does not create tasks. Does not manage others.

**Key Jobs to Be Done:**
- Clear visual indication of "my tasks" vs. "team tasks"
- Simple status updates without requiring understanding of the whole system
- Enough project context to understand where their work fits

---

## 4. Success Metrics and KPIs

### 4.1 Reliability Metrics (non-negotiable baseline)

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Data consistency between views | 100% match | Automated test: same user, Dashboard vs. My Work count |
| Deep link success rate | 0 404s on valid routes | QA test suite on all defined routes |
| Write operation feedback | 100% of create/update actions show toast or confirmation | Manual QA across all write flows |
| Notification bell functionality | Functional by launch | QA: notifications trigger and route correctly |

### 4.2 Adoption Metrics (30 days post-launch)

| Metric | Target | Baseline |
|--------|--------|----------|
| Daily active users (of 8-12 team) | ≥ 80% of team opens tracker daily | Unknown (assumed low given trust issues) |
| Sessions per user per day | ≥ 2 sessions/day | Unknown |
| Tasks created via tracker (vs. Slack/Notion) | ≥ 90% of project tasks logged in tracker | Unknown |
| Dashboard as entry point | ≥ 70% of sessions start on Dashboard | Unknown |

### 4.3 Efficiency Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Time to create a task (from anywhere in app) | ≤ 30 seconds | User testing with stopwatch |
| Time to find project status (for PM) | ≤ 60 seconds from login | User testing with Lintang |
| Task update frequency per user per week | ≥ 5 updates/user/week | Database query on status_changed_at |
| Standup prep time (for PM) | Reduced from baseline by ≥ 50% | Self-reported survey, 4-week post-launch |

### 4.4 Trust and Satisfaction Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Team NPS for internal tool | ≥ 8/10 average | Anonymous survey, 4 weeks post-launch |
| Reported data trust issues | 0 reported in first 30 days | Slack/retrospective tracking |
| Tool-related status-check Slack messages | Reduced by ≥ 60% | Slack analytics (manual count) |

---

## 5. Product Principles

### P1: Clarity Over Features

When in doubt, remove. Every element on screen should earn its place by answering a question the user actually has. The Dashboard should orient, not overwhelm. Navigation should predict, not require memory.

### P2: Fast Daily Use

The tracker is opened every single day by every team member. It must be fast to load, fast to navigate, and fast to act on. No important action should take more than three clicks from anywhere in the app. Optimized for repeat use, not first-time discovery.

### P3: Feedback for Every Action

Every write operation — task creation, status update, assignment change, comment — must produce visible feedback. Users should never have to wonder if their action worked. Toast notifications and optimistic UI updates are the default.

### P4: The Manager and the Member Have Equal Priority

The tool is not primarily a PM tool with member views bolted on, nor is it a personal task list with manager views added. Both experiences are first-class. The Dashboard serves the PM. My Work and My Day serve the member. Neither experience should compromise the other.

### P5: Trust is Built Through Consistency

Data shown in one view must exactly match data shown in another. A count shown on the Dashboard must match what My Work shows. A status updated in the Board must reflect in the Task Detail. Inconsistency is the single fastest way to make a team abandon a tool.

### P6: Risk Should Be Visible, Not Hunted

Problems should surface to the people who can act on them, not wait to be discovered in standup. Risk indicators, critical issue flagging, and workload signals should be prominent, not buried in settings or reports.

### P7: AI is an Accelerator, Not a Replacement

AI features (task generation from brief, weekly summary, risk detection) are additive. They speed up work that already happens manually. They do not replace human judgment on priorities, assignments, or decisions. AI is the last layer, not the foundation.

---

## 6. Feature Requirements (MoSCoW)

### 6.1 Must Have — Core Reliability (Phase 1–2)

These fix broken trust and baseline functionality. The revamp cannot ship without these.

**M1 — Data Consistency Fix**
- Dashboard task counts must match My Work counts for the same user at all times
- All task counts across views must derive from a single query source
- Acceptance: automated test passes comparing counts across three views

**M2 — Write Operation Feedback**
- Every create/update/delete action must display a toast notification (success or error)
- Toast must specify what changed (e.g., "Task 'Redesign hero' created in Sprint 2")
- Optimistic UI: UI updates immediately, rolls back on error
- Acceptance: all write flows confirmed in QA checklist

**M3 — Deep Link Resolution**
- All routes (`/epic/[id]`, `/task/[id]`, `/project/[id]`) must resolve without 404
- Unauthenticated users redirected to login, then forwarded to intended URL after auth
- Acceptance: full route QA with logged-in and logged-out user

**M4 — Functional Notification Bell**
- Notifications must be stored and displayed when bell is clicked
- Minimum notification triggers: task assigned to you, task status changed on your task, comment added to your task
- Bell count must reflect actual unread count, not a static badge
- Acceptance: trigger each notification type in QA, confirm bell behavior

**M5 — Global Task Creation**
- "New Task" action available from: Board view, My Work, My Day, and via keyboard shortcut
- Task creation does not require navigating into an Epic first (Epic assignment is optional at creation time)
- Acceptance: task created from Board successfully appears in Epic and My Work

**M6 — Dashboard Orientation (Helicopter View)**
- Dashboard shows: active projects with status summary, HIGH risk items, tasks due today (for current user), and team-level workload signal
- Dashboard is the first screen seen after login
- Acceptance: Lintang can answer "which projects need attention?" within 30 seconds using only the Dashboard

### 6.2 Must Have — Core Features (Phase 2–3)

**M7 — Goals View**
- Create, edit, and close Goals at the project level
- Goals linked to Epics
- Goal progress calculated from linked Epic status
- Acceptance: create a goal, link an epic, verify progress updates when epic status changes

**M8 — Epics with Side Panel**
- Epic detail opens in a side panel (does not navigate away from current view)
- Side panel shows: epic description, task list, status, assignees, changelog
- Acceptance: open epic side panel from Board and from Goals view without page navigation

**M9 — Board / Kanban View**
- Drag-and-drop task cards between status columns
- Column headers show task count and optionally workload signal
- Board filterable by assignee, epic, and priority
- Acceptance: drag a task from In Progress to Done, confirm status updates in DB

**M10 — My Work View**
- Shows all tasks assigned to the current user across all projects
- Grouped by project or epic (user toggle)
- Filterable by status, priority, due date
- Count matches Dashboard count exactly

**M11 — My Day View**
- Shows tasks the user has flagged for today, plus tasks due today
- "Add to My Day" action available from any task
- Acceptance: flag a task for My Day, confirm it appears in My Day view and not in other users' My Day

**M12 — Team Workload View**
- Shows each team member with their active task count and estimated load
- Manageable only by Admin and Manager roles
- Acceptance: Lintang can see at a glance who has more than 5 active tasks

**M13 — Global Search**
- Search across tasks, epics, projects, and docs
- Results grouped by type
- Keyboard shortcut to open search from anywhere
- Acceptance: search returns a task by title fragment within 500ms

**M14 — Task Detail View**
- Full task detail accessible from all contexts (Board, My Work, My Day, Global Search)
- Fields: title, description, status, assignee, epic, priority, due date, dependencies, time tracking, comments
- Inline editing on all fields (no separate edit mode)
- Acceptance: edit five fields in a single task session without a page reload

### 6.3 Should Have — Enhancements (Phase 4)

**S1 — Risk Indicators**
- Tasks and Epics can be flagged as HIGH / MEDIUM / LOW risk
- Dashboard surfaces all HIGH risk items as a Critical Issues section
- Risk flag visible on Board cards, Epic side panel, and Goals view

**S2 — Activity Feed**
- Per-project and per-epic activity feed showing all changes with timestamp and author
- Available in Epic side panel and on the Dashboard (team-level feed)
- Acceptance: create a task, change its status, add a comment — all three appear in the feed

**S3 — Epic Changelog**
- Automatic log of all status changes to an epic
- Viewable in the epic side panel
- Acceptance: change epic status three times, verify all three entries appear in changelog

**S4 — Task Dependencies**
- Tasks can be marked as blocked by another task
- Blocked tasks visually distinguished on the Board
- Acceptance: mark Task B as blocked by Task A; Task A displays blocker badge on Board

**S5 — Template System**
- Admins and Managers can create project and epic templates
- New project or epic can optionally be created from a template
- Acceptance: create a template with three epics, create a new project from that template, verify three epics are pre-created

**S6 — Docs Hub**
- Each project has a lightweight documentation space
- Documents are structured text (not a full CMS)
- Documents linkable from tasks and epics
- Acceptance: create a doc, link it to an epic, confirm link appears in epic side panel

**S7 — Time Tracking**
- Tasks have a time estimate field and a time logged field
- Team members can log time against a task from the task detail view
- No timer required (manual log entry is acceptable)
- Acceptance: log 2 hours against a task, verify time appears on the task and in workload view

### 6.4 Could Have — Future Enhancements (Phase 4–5)

**C1 — AI Assistant Panel**
- Dedicated AI sidebar accessible from any view
- Context-aware: knows which project/epic/task the user is viewing
- Capabilities: generate tasks from a brief, summarize weekly project activity, flag risk signals
- This is the last priority item in the entire roadmap

**C2 — Weekly AI Summary**
- Automated weekly digest per project: what was completed, what is in progress, what is at risk
- Delivered as a Docs Hub entry or as an in-app notification
- Depends on AI Assistant Panel being in place

**C3 — Sprint / Iteration Grouping**
- Tasks and Epics can be grouped into time-boxed sprints
- Sprint progress shown on Board
- Could Have because current team workflow is not sprint-based

**C4 — Custom Status Columns**
- Board columns configurable per project
- Default columns provided, overridable by Admin/Manager

### 6.5 Won't Have — Explicitly Out of Scope

**W1 — Vendor Portal**
- External-facing access for vendors or clients
- Deferred indefinitely — not an internal tool use case at current scale

**W2 — Real-time Messaging**
- In-app messaging, direct messages, or team chat
- Slack serves this need; duplication adds maintenance cost without proportional benefit

**W3 — Gantt Chart**
- Timeline-based project visualization
- The team's workflow is not deadline-bound in a way that Gantt serves; Kanban is sufficient

**W4 — Client-Facing Access**
- No client login, no shareable read-only project views to external parties
- Out of scope for this revamp; may be revisited if client reporting becomes a need

**W5 — Mobile Application**
- No native iOS or Android app
- Responsive web is acceptable; native mobile is not a justified investment at team size 8–12

---

## 7. Out of Scope

The following are acknowledged needs but explicitly excluded from this revamp:

- **Billing and invoicing** — not a project tracker concern
- **Client portal** — see W4 above
- **Third-party integrations** (Figma, Slack notifications, Google Calendar sync) — could be revisited in a future phase but adds engineering complexity with unclear ROI at this scale
- **Advanced reporting and analytics** — basic workload and status reporting is in scope; custom report builders, CSV exports, and business intelligence integrations are not
- **User-level notification preferences** — all users receive the same notification types; per-user customization is a post-launch enhancement
- **Offline mode** — the tool requires an internet connection; no service worker or offline caching is in scope
- **PocketBase to Cloudflare migration** — the backend migration is a Phase 3 infrastructure task, not a product feature. It is a dependency, not a deliverable for product requirements

---

## 8. Assumptions and Dependencies

### 8.1 Assumptions

| # | Assumption | Risk if Wrong |
|---|-----------|---------------|
| A1 | The team will use the tracker daily if the reliability issues are fixed | Adoption may require training and change management beyond a technical fix |
| A2 | Nuxt 4 + Cloudflare D1 is production-stable enough for internal use | May require fallback to Nuxt 3 or a different DB if stability issues emerge |
| A3 | The current PocketBase data can be migrated to D1 without data loss | Migration failure could result in loss of historical task data |
| A4 | Team size remains 8–12 during the revamp | Significant growth would change workload view requirements |
| A5 | Lintang (PM) is the primary driver of adoption — if she uses it, others will | If PM doesn't adopt, adoption across team will be difficult to enforce |
| A6 | Phosphor Icons and Nuxt UI v3 are sufficient for all visual needs | May need additional icon sets or custom components for edge cases |

### 8.2 Technical Dependencies

| Dependency | Owner | Required by |
|-----------|-------|------------|
| Nuxt 4 stable release | Framework (external) | Phase 2 frontend development |
| Cloudflare D1 production readiness | Cloudflare (external) | Phase 3 backend migration |
| Nuxt UI v3 component library | NuxtLabs (external) | Phase 1 design + Phase 2 development |
| PocketBase data export | Current backend owner | Phase 3 migration |
| Design system tokens (Tailwind v4 config) | Design team | Phase 1 — must precede frontend development |
| Phosphor Icons package | External package | Phase 2 |

### 8.3 Process Dependencies

- Design Foundation (Phase 1) must be complete before any frontend work begins in Phase 2
- Phase 2 frontend with dummy data must be signed off before Phase 3 backend migration begins
- All Phase 2 and 3 work must be complete before Phase 4 new features are scoped in detail
- Risk indicator feature (S1) requires design definition before development — what constitutes HIGH vs. MEDIUM vs. LOW risk must be documented

---

## 9. Open Questions

| # | Question | Owner | Priority | Due |
|---|---------|-------|----------|-----|
| OQ1 | What defines HIGH risk on a task or epic? Is it manual (a user flags it) or automatic (based on rules like overdue + no update in 7 days)? | Lintang + Product | High | Before Phase 4 |
| OQ2 | Should the notification bell trigger real-time push (WebSocket) or poll? What is acceptable latency for notifications? | Engineering | High | Before Phase 3 |
| OQ3 | What is the exact data model difference causing the Dashboard vs. My Work count discrepancy? Is it a query bug or a data integrity issue? | Engineering | Critical | Before Phase 2 |
| OQ4 | Should the AI Assistant be a separate panel or a command palette (like Linear's Cmd+K)? | Design + PM | Medium | Before Phase 4 |
| OQ5 | Does time tracking need to integrate with any billing system, or is it purely for internal workload awareness? | PM + Admin | Medium | Before S7 development |
| OQ6 | What is the retention policy for activity feed and changelog entries? How many entries per epic/project? | Engineering | Low | Before Phase 3 |
| OQ7 | Are there any existing tasks or projects in PocketBase that must be preserved exactly, or is a clean start acceptable? | Admin + PM | High | Before Phase 3 |
| OQ8 | Who is responsible for setting and updating risk flags — only Managers, or also Members? | PM | High | Before Phase 4 |
| OQ9 | Should "My Day" reset at midnight automatically, or require the user to manually clear it each morning? | Design | Medium | Before Phase 2 |
| OQ10 | What is the rollout plan — does the whole team switch on one day, or is there a parallel-run period with the old system? | PM + Admin | High | Before Phase 2 |

---

*Document maintained by: Elux Product Team*
*Next review: End of Phase 1*
*Changes tracked in: project-tracker/documentation/changelog.md*
