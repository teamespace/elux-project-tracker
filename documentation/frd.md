# Functional Requirements Document
## Elux Project Tracker — Full Revamp

**Version:** 1.0  
**Date:** 2026-06-17  
**Company:** Elux — AI-native product design agency  
**Stack:** Nuxt 4 · Cloudflare Pages · Cloudflare D1 · Nuxt UI v3 · Tailwind v4 · Phosphor Icons

---

## Table of Contents

1. [Scope & Overview](#1-scope--overview)
2. [Roles & Permissions Matrix](#2-roles--permissions-matrix)
3. [Feature Hierarchy](#3-feature-hierarchy)
4. [Core Features](#4-core-features)
   - F-01 Dashboard
   - F-02 Goals
   - F-03 Epics
   - F-04 Board / Kanban
   - F-05 My Work
   - F-06 My Day
   - F-07 Team Workload
   - F-08 Global Search
   - F-09 Task Detail
   - F-10 Docs Hub
5. [Enhancement Features](#5-enhancement-features)
   - F-11 Risk Indicators
   - F-12 Critical Issues
   - F-13 Activity Feed
   - F-14 Epic Side Panel
   - F-15 Changelog per Epic
   - F-16 Task Dependencies
   - F-17 Template System
   - F-18 Time Tracking
6. [AI Features](#6-ai-features)
   - F-19 AI Assistant Panel
7. [Bug Fix Requirements](#7-bug-fix-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Integration Requirements](#9-integration-requirements)

---

## 1. Scope & Overview

This document defines functional requirements for the full revamp of the Elux Project Tracker — an internal tool used by Elux's product design teams to manage goals, epics, tasks, and documentation across projects.

The revamp addresses known bugs, introduces new features, and re-architects the system on a modern stack (Nuxt 4 + Cloudflare D1) with a redesigned UI using Nuxt UI v3, Tailwind v4, and Phosphor Icons.

The feature hierarchy is: **Goal → Epic → Task → Subtask**.

---

## 2. Roles & Permissions Matrix

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| Create / edit / delete Goals | ✓ | ✓ | — | — |
| Create / edit / delete Epics | ✓ | ✓ | — | — |
| Create / edit Tasks | ✓ | ✓ | ✓ | — |
| Delete Tasks | ✓ | ✓ | — | — |
| Create Subtasks | ✓ | ✓ | ✓ | — |
| Comment on Tasks | ✓ | ✓ | ✓ | ✓ |
| View all projects | ✓ | ✓ | ✓ | ✓ |
| Manage team members | ✓ | ✓ | — | — |
| Assign tasks | ✓ | ✓ | ✓ | — |
| Manage templates | ✓ | ✓ | — | — |
| View Team Workload | ✓ | ✓ | ✓ | — |
| Use AI Assistant | ✓ | ✓ | ✓ | — |
| Edit Docs Hub | ✓ | ✓ | ✓ | — |
| View Docs Hub | ✓ | ✓ | ✓ | ✓ |
| Manage RBAC / roles | ✓ | — | — | — |
| View Dashboard | ✓ | ✓ | ✓ | ✓ |
| Track time on tasks | ✓ | ✓ | ✓ | ✓ |

---

## 3. Feature Hierarchy

```
Goal
└── Epic
    ├── Task
    │   └── Subtask
    └── Doc
```

- **Goal:** High-level strategic objective with KPIs. Progress is derived from linked epics.
- **Epic:** A scoped body of work. Contains tasks, docs, changelog. Status auto-updates from task completion.
- **Task:** A single unit of work. Has status, assignee, priority, subtasks, comments, time tracking, dependencies.
- **Subtask:** Lightweight checklist item under a task.

---

## 4. Core Features

---

### F-01 — Dashboard

**Description:** The Dashboard is the primary landing page. It provides a helicopter-view of all projects, risk indicators, critical issues, and recent team activity.

#### Functional Requirements

**FR-01-01:** The Dashboard must display a summary panel for each active project containing: project name, total epics count, total tasks count, overdue tasks count, completion percentage, and current risk level.

**FR-01-02:** The completion percentage on each project card must be computed from the ratio of `Done` tasks to total tasks across all epics in that project. It must match the same calculation used inside each Epic detail.

**FR-01-03:** The Dashboard must display a "Critical Issues" widget (see F-12) showing tasks that are overdue or flagged as urgent, limited to the 10 most recent items.

**FR-01-04:** The Dashboard must display a Risk Indicators section (see F-11) showing each epic's current risk level (HIGH / MEDIUM / LOW) with a one-line reason.

**FR-01-05:** The Dashboard must display an Activity Feed (see F-13) showing the 20 most recent actions taken by any team member across all projects.

**FR-01-06:** The Dashboard must include quick-action buttons: "Create Epic", "Create Task", "View Board". Each button must navigate to the correct page or open the correct modal.

**FR-01-07:** Dashboard metrics (task counts, completion %) must be computed server-side at request time and must not rely on cached totals stored in a separate column. This eliminates the inconsistency bug (BF-05).

**FR-01-08:** All metric values on the Dashboard must link to their respective filtered views. Clicking "8 overdue tasks" must navigate to a Board filtered by overdue status.

#### Acceptance Criteria

- Dashboard loads with accurate, consistent metrics across all widgets.
- Completion % on a project card matches the completion % computed inside each epic belonging to that project.
- Critical Issues widget is visible and shows a maximum of 10 items.
- Activity Feed shows the 20 most recent actions with timestamps.
- Quick-action buttons are functional.

#### Edge Cases

- No projects exist: show empty state with a "Create your first project" CTA.
- All tasks are done: completion % shows 100% and risk level shows LOW.
- A project has zero tasks: completion % shows 0% (not a divide-by-zero error).

#### Role-Based Access

- All roles can view the Dashboard.
- Admin and Manager see all projects.
- Member and Intern see only projects they are assigned to.

#### UI Behavior Notes

- Project cards are arranged in a responsive grid (2-col on desktop, 1-col on mobile).
- Risk badges use color coding: red = HIGH, amber = MEDIUM, green = LOW.
- The Activity Feed uses infinite scroll or a "Load more" button, not pagination.

---

### F-02 — Goals

**Description:** Goals represent strategic objectives. Each goal has KPIs and links to one or more epics. Goal progress is derived from the aggregate completion of its linked epics.

#### Functional Requirements

**FR-02-01:** Goals must have the following fields: title, description, owner (user), start date, target date, status (On Track / At Risk / Off Track / Completed), and linked epics.

**FR-02-02:** Goal progress percentage must be computed as the average completion percentage across all linked epics. If no epics are linked, progress = 0%.

**FR-02-03:** Each goal must support one or more KPIs. A KPI has: name, target value, current value, unit (e.g., %, count, $), and a status derived from current vs. target.

**FR-02-04:** The Goal list view must show all goals with: title, owner avatar, progress bar, status badge, linked epics count, target date, and KPI summary (e.g., "2/3 KPIs on track").

**FR-02-05:** Clicking a goal must open the Goal Detail page showing full description, KPI table, linked epics list with their individual completion %, and a progress timeline.

**FR-02-06:** Admin and Manager must be able to add KPIs from the Goal Detail page via an "Add KPI" button. This fixes BF-08.

**FR-02-07:** Admin and Manager must be able to link or unlink epics from the Goal Detail page via a "Link Epic" button that opens a searchable epic picker. This fixes BF-08.

**FR-02-08:** Goals must support sorting by: target date (asc/desc), progress (asc/desc), status, and creation date.

**FR-02-09:** Goals must support filtering by: status, owner, and date range.

#### Acceptance Criteria

- Goal progress updates automatically when a linked epic's task completion changes.
- "Add KPI" button is visible and functional on Goal Detail for Admin and Manager.
- "Link Epic" button opens an epic picker with search; selected epic appears in the list.
- KPI current values can be edited inline by Admin and Manager.
- Goal status badge updates when progress crosses defined thresholds.

#### Edge Cases

- Goal with no linked epics: progress shows 0%, with a prompt to link an epic.
- All linked epics are at 100%: goal progress shows 100% and status auto-suggests Completed.
- KPI target value set to 0: system must prevent divide-by-zero and show a validation error.
- Goal target date is in the past with progress < 100%: status badge shows "Off Track".

#### Role-Based Access

- Admin, Manager: create, edit, delete goals; add KPIs; link epics.
- Member, Intern: view only.

#### UI Behavior Notes

- Goal list is a table/card hybrid — card view on mobile, table on desktop.
- Progress bar uses a gradient fill. Color shifts from green (≥70%) to amber (40–69%) to red (<40%).
- KPI table in Goal Detail has inline editing for current value for Admin/Manager.

---

### F-03 — Epics

**Description:** Epics are the primary unit of project scope. Each epic belongs to a project, contains tasks, has associated docs, and maintains an audit changelog.

#### Functional Requirements

**FR-03-01:** Epics must have the following fields: title, description, project, owner, assignees, start date, due date, status (Planned / In Progress / Review / Done / Blocked), priority (Low / Medium / High / Critical), risk level, and linked goal.

**FR-03-02:** Epic status must auto-update when task completion thresholds are crossed:
- 0% tasks done → Planned
- 1–99% tasks done → In Progress
- 100% tasks done → Done (auto, with a confirmation prompt if status was manually set to something else)

**FR-03-03:** The Epic list view must display: title, status badge, priority badge, assignee avatars, task completion bar (e.g., "12/20 tasks"), due date, risk badge, and a row action menu (Edit / Delete for Admin/Manager only).

**FR-03-04:** Clicking an epic row must open the Epic Side Panel (see F-14) — a slide-in panel from the right — rather than navigating away from the list.

**FR-03-05:** The Epic list must support filtering by: status, priority, assignee, risk level, and linked goal.

**FR-03-06:** The Epic list must support sorting by: due date, priority, progress, and creation date.

**FR-03-07:** Direct URL navigation to `/epic/[id]` must resolve correctly and render the epic detail view. This fixes BF-01.

**FR-03-08:** Epics must display a task completion progress bar computed from Done tasks / total tasks. This value must be consistent with what the Dashboard shows for the same epic.

#### Acceptance Criteria

- Epic list loads with correct data and no 503 errors.
- Clicking an epic row opens the side panel, not a separate page.
- `/epic/[id]` URL resolves and renders correctly.
- Epic status auto-updates to "Done" when all tasks are marked Done.
- Edit/Delete actions are hidden for Member and Intern roles.

#### Edge Cases

- Epic with zero tasks: progress shows 0%, status stays Planned.
- All tasks deleted from an epic: progress resets to 0%, status reverts to Planned.
- Epic due date is today: due date renders with an amber highlight.
- Epic due date is in the past: due date renders with a red highlight.

#### Role-Based Access

- Admin, Manager: create, edit, delete epics.
- Member, Intern: view only; cannot see Edit/Delete in the row action menu.

#### UI Behavior Notes

- The epic list is a full-width table with sticky header.
- Row hover reveals the action menu icon.
- Task completion bar is a thin horizontal bar (4px height) below the epic title in the row.

---

### F-04 — Board / Kanban

**Description:** The Board provides a visual Kanban interface for managing tasks. Tasks are organized into four columns: To Do, In Progress, Review, Done.

#### Functional Requirements

**FR-04-01:** The Board must display exactly four columns: To Do, In Progress, Review, Done. Column headers must show the column name and the count of tasks in that column.

**FR-04-02:** Tasks must be draggable between columns. Dropping a task into a column must update the task's status in the database immediately (optimistic UI update).

**FR-04-03:** The Board must support the following filters: Assignee, Priority, Epic, Due Date (overdue / due today / due this week). Filters must be combinable.

**FR-04-04:** The Board must include a "Create Task" button in the page header and also a "+ Add Task" affordance at the bottom of each column. Both must open the task creation modal pre-filled with the appropriate status. This fixes BF-07.

**FR-04-05:** Task cards on the Board must display: title, assignee avatar, priority badge, due date, subtask count (e.g., "2/5 subtasks"), and epic tag.

**FR-04-06:** Task data must be fetched using cursor-based or keyset pagination with a maximum of 50 tasks per request. The `perPage=1000` pattern is prohibited. This fixes BF-02.

**FR-04-07:** Clicking a task card must open the Task Detail panel (see F-09).

**FR-04-08:** Direct URL navigation to `/task/[id]` must resolve correctly. This fixes BF-01.

**FR-04-09:** The Board must display a loading skeleton while data is being fetched.

**FR-04-10:** If a column has more than 50 tasks, it must show a "Load more" button at the bottom of that column.

#### Acceptance Criteria

- All four columns render with correct task counts.
- Drag-and-drop moves a task and persists the new status.
- "Create Task" button is visible and functional on the Board page.
- No 503 errors when loading the Board.
- Filters apply correctly and combine with AND logic.
- Task cards display all required fields.

#### Edge Cases

- Column is empty: show an empty state with a "+" icon to create a task in that column.
- Drag-and-drop fails (network error): roll back the optimistic update and show an error toast.
- Task has no assignee: show a default avatar placeholder.
- All filters active but no matching tasks: show a "No tasks match your filters" empty state with a "Clear filters" link.

#### Role-Based Access

- Admin, Manager, Member: can move tasks between columns.
- Intern: can view the board but cannot drag tasks or create tasks.
- Edit/Delete task actions in the card menu are hidden from Intern.

#### UI Behavior Notes

- Columns have a fixed width on desktop; horizontal scrolling is enabled on mobile.
- Dragging a card highlights the target column with a subtle drop zone indicator.
- Priority badge colors: Critical = red, High = orange, Medium = amber, Low = gray.

---

### F-05 — My Work

**Description:** My Work shows the authenticated user's personal task list, grouped by status, with collapsible sections.

#### Functional Requirements

**FR-05-01:** My Work must display only tasks assigned to the currently authenticated user.

**FR-05-02:** Tasks must be grouped into collapsible sections by status: To Do, In Progress, Review, Done.

**FR-05-03:** Each section header must show the section name and the count of tasks in that section. Clicking the header toggles the section open/closed.

**FR-05-04:** Each task row must show: title, epic tag, priority badge, due date, and subtask completion (e.g., "1/3").

**FR-05-05:** Clicking a task row must open the Task Detail panel.

**FR-05-06:** My Work must support sorting within each group by: due date (asc/desc) and priority.

**FR-05-07:** My Work must support a filter by: epic, priority, and due date range.

**FR-05-08:** Users must be able to change a task's status directly from the My Work row via a status dropdown, without opening the full Task Detail.

#### Acceptance Criteria

- Only tasks assigned to the logged-in user appear.
- Sections are collapsible and persist their collapsed/expanded state in localStorage.
- Status can be changed inline from the row.
- Task count in each section header is accurate.

#### Edge Cases

- No tasks assigned: show an empty state "You have no tasks assigned. Enjoy the silence."
- All tasks are Done: Done section is open by default; all other sections show "(0)".
- Task due date is in the past and not Done: due date renders in red.

#### Role-Based Access

- All roles see their own My Work.
- Intern can view tasks but cannot change status inline (read-only row).

#### UI Behavior Notes

- "Done" section is collapsed by default to reduce visual noise.
- Row hover reveals a quick-action menu: Mark Done, Open Detail, Remove Assignee (Admin/Manager only).

---

### F-06 — My Day

**Description:** My Day is a focused subset of My Work. It shows only tasks the user has flagged as today's priorities.

#### Functional Requirements

**FR-06-01:** My Day must display only tasks that are: (a) due today, or (b) manually added to My Day by the user.

**FR-06-02:** Users must be able to add any of their assigned tasks to My Day via a "Add to My Day" toggle in the Task Detail panel and in the My Work row action menu.

**FR-06-03:** Tasks added to My Day must persist across sessions (stored in the database, not just localStorage).

**FR-06-04:** My Day must show a task count for the day and a simple progress indicator (e.g., "3/7 done today").

**FR-06-05:** Completing all My Day tasks must trigger a celebration micro-animation (e.g., confetti burst).

**FR-06-06:** At the start of each day (midnight local time), tasks that were in My Day from the previous day and are still not Done must remain in My Day. Tasks that are Done are removed.

**FR-06-07:** My Day must show a date header (e.g., "Tuesday, June 17") and a motivational or contextual subtitle (e.g., "You have 5 tasks to complete today.").

#### Acceptance Criteria

- Only today's tasks (due today or manually added) appear in My Day.
- "Add to My Day" toggle works from Task Detail and My Work row.
- Progress indicator updates as tasks are completed.
- My Day persists correctly after page reload.

#### Edge Cases

- No tasks for today: show an empty state "Nothing on your plate today."
- Task added to My Day is deleted by a Manager: task disappears from My Day silently.
- Task due today is reassigned to another user: it must be removed from the original user's My Day.

#### Role-Based Access

- All roles have access to My Day.
- Intern can view My Day but cannot mark tasks as Done (read-only).

#### UI Behavior Notes

- My Day uses a clean, distraction-free layout with no sidebar clutter.
- Each task row has a large checkbox for quick completion.
- Completed tasks are shown with strikethrough and moved to the bottom of the list.

---

### F-07 — Team Workload

**Description:** Team Workload provides a capacity overview of all team members, showing how many tasks each person has across all statuses.

#### Functional Requirements

**FR-07-01:** Team Workload must display all active team members with their task counts broken down by status: To Do, In Progress, Review, Done.

**FR-07-02:** Each member row must show: avatar, name, role, and a horizontal stacked bar chart visualizing their task distribution across statuses.

**FR-07-03:** The view must include all task statuses — not just In Progress. This addresses the incomplete workload picture from the previous version.

**FR-07-04:** Clicking a member row must expand an inline detail section showing that member's tasks grouped by epic, with task titles, priorities, and due dates.

**FR-07-05:** Team Workload must support filtering by: project, epic, and date range.

**FR-07-06:** Admin and Manager must be able to reassign tasks directly from the Team Workload view by clicking a task in the expanded row and selecting a new assignee.

**FR-07-07:** The view must highlight overloaded members — those with more than a configurable threshold of active tasks (default: 5 In Progress tasks) — with an amber warning indicator.

#### Acceptance Criteria

- All active team members appear with accurate task counts.
- Stacked bar chart reflects all four statuses.
- Expanding a member row shows their tasks by epic.
- Reassignment from the workload view persists to the database.
- Overloaded members are visually highlighted.

#### Edge Cases

- Member has zero tasks: row shows empty bar with "No tasks assigned" text.
- Member is deactivated mid-session: they are removed from the view on next load.
- All team members are overloaded: all rows show amber indicators; no false sense of balance.

#### Role-Based Access

- Admin, Manager, Member: can view Team Workload.
- Admin, Manager: can reassign tasks from this view.
- Intern: cannot access Team Workload.

#### UI Behavior Notes

- Stacked bar uses consistent status colors across the app: blue = In Progress, gray = To Do, amber = Review, green = Done.
- The member list can be sorted by: total task count, In Progress count, or name.

---

### F-08 — Global Search

**Description:** Global Search is a ⌘K command palette that enables quick navigation and cross-entity search across Goals, Epics, Tasks, Docs, and Team Members.

#### Functional Requirements

**FR-08-01:** Global Search must be triggered by the keyboard shortcut ⌘K (macOS) / Ctrl+K (Windows/Linux) from anywhere in the application.

**FR-08-02:** The search palette must appear as a centered modal overlay with a text input field auto-focused on open.

**FR-08-03:** Search must query across all entity types: Goals, Epics, Tasks (by title), Docs, and Team Members. Results must be grouped by entity type.

**FR-08-04:** Search results must appear within 300ms of the user stopping typing (debounced at 200ms).

**FR-08-05:** Each result item must show: entity type icon, entity title, and a secondary context string (e.g., Epic name for tasks, Project name for epics).

**FR-08-06:** Clicking or pressing Enter on a result must navigate to the correct detail view for that entity.

**FR-08-07:** The search palette must support keyboard navigation: arrow keys to move between results, Enter to select, Escape to close.

**FR-08-08:** Recent searches (last 5) must be shown when the palette is opened with an empty input.

**FR-08-09:** The search palette must include quick-action items: "Create Task", "Create Epic", "Go to Dashboard", "Go to My Work". These are always visible above search results.

**FR-08-10:** Search must be scoped to entities the current user has permission to view.

#### Acceptance Criteria

- ⌘K / Ctrl+K opens the search palette from any page.
- Results appear within 300ms of typing.
- Results are grouped by entity type.
- Keyboard navigation works end-to-end.
- Selecting a result navigates to the correct page.
- Escape closes the palette.

#### Edge Cases

- Search query returns no results: show "No results for '[query]'" with a suggestion to try a shorter term.
- Search backend times out: show "Search unavailable. Try again." with retry button.
- User types a single character: search fires but results may be broad; show up to 5 results per category.

#### Role-Based Access

- All roles can use Global Search.
- Results are filtered to entities the user has view access to.

#### UI Behavior Notes

- The palette uses a frosted glass / backdrop blur background.
- Entity type icons use Phosphor Icons: Target (Goals), Stack (Epics), CheckSquare (Tasks), FileText (Docs), Users (Members).
- The palette closes when clicking outside it.

---

### F-09 — Task Detail

**Description:** Task Detail is the canonical view for a single task. It contains all task metadata, subtasks, comments, time tracking, dependencies, and a changelog.

#### Functional Requirements

**FR-09-01:** Task Detail must display and allow editing of the following fields (subject to role): title, description (rich text), status, assignee, priority, due date, start date, epic, labels/tags, and estimated time.

**FR-09-02:** Task Detail must support subtasks. A subtask has: title, status (Done / Not Done), and optional assignee. Subtasks are displayed as a checklist.

**FR-09-03:** Task Detail must support comments. A comment has: author, timestamp, rich text body, and an edit/delete option for the comment author or Admin.

**FR-09-04:** Task Detail must support time tracking (see F-18): start/stop timer and manual time entry. Total logged time must be displayed.

**FR-09-05:** Task Detail must support dependencies (see F-16): "Blocked by" and "Blocks" relationships to other tasks. Each dependency must show the linked task title, status, and a link to that task.

**FR-09-06:** All field changes in Task Detail must trigger a success toast notification ("Task updated") or an error toast ("Failed to update task. Try again."). This fixes BF-03.

**FR-09-07:** Task Detail must have a Changelog tab showing a timestamped audit trail of all changes: field changed, old value, new value, changed by, timestamp.

**FR-09-08:** Direct URL navigation to `/task/[id]` must resolve and render the Task Detail correctly. This fixes BF-01.

**FR-09-09:** Task Detail must include an "Add to My Day" toggle visible to the assigned user.

**FR-09-10:** Task status changes must be reflected immediately in the Board, My Work, and Team Workload views (real-time or optimistic update).

#### Acceptance Criteria

- All fields are editable by Admin/Manager; Member can edit status, add comments, log time, and add subtasks only.
- Success and error toasts appear on every write operation.
- Subtask checklist updates persist immediately.
- Changelog shows accurate history of all changes.
- `/task/[id]` resolves correctly.
- Dependencies display correctly with linked task status.

#### Edge Cases

- Task has 50+ comments: paginate comments (20 per page) or use infinite scroll.
- Dependency target task is deleted: show "[Deleted Task]" with a warning icon in the dependencies section.
- Rich text body contains images: images must render inline; broken image links show a placeholder.
- Task is marked Done but has open subtasks: show a warning dialog "This task has 3 incomplete subtasks. Mark Done anyway?"

#### Role-Based Access

- Admin, Manager: edit all fields, delete task, manage dependencies.
- Member: edit status, add subtasks, comment, log time, add to My Day.
- Intern: view only, add comments only.

#### UI Behavior Notes

- Task Detail opens as a right-side panel (drawer) by default on desktop; full-screen on mobile.
- The panel has a two-column layout: main content (left) and metadata sidebar (right).
- Rich text editor uses a lightweight editor (e.g., Tiptap) with: bold, italic, code, bullet list, numbered list, and link.

---

### F-10 — Docs Hub

**Description:** Docs Hub is a cross-epic documentation space where teams can create, organize, and search documents linked to epics or projects.

#### Functional Requirements

**FR-10-01:** Docs Hub must display all documents across all epics, filterable and searchable.

**FR-10-02:** Each document has: title, body (rich text), linked epic, author, created date, last updated date, and labels/tags.

**FR-10-03:** Docs Hub must support full-text search across document titles and body content.

**FR-10-04:** Docs Hub must support filtering by: linked epic, author, label, and date range (created or updated).

**FR-10-05:** Docs Hub must support sorting by: last updated (default), creation date, title (alphabetical).

**FR-10-06:** Clicking a document must open it in a full-page editor view with a clean reading/editing layout.

**FR-10-07:** Documents must also be accessible from within the Epic Side Panel (see F-14) under the "Docs" tab, showing only docs linked to that epic.

**FR-10-08:** Admin, Manager, and Member must be able to create new documents from the Docs Hub via a "New Doc" button.

**FR-10-09:** Documents must support a "linked mentions" feature: typing `@task` or `@epic` in the body autocompletes and creates a live link to that entity.

#### Acceptance Criteria

- All documents appear in Docs Hub with correct metadata.
- Full-text search returns accurate results within 300ms.
- Filters and sort work correctly.
- Creating a new document via "New Doc" opens a blank editor.
- Documents linked to an epic appear in the Epic Side Panel Docs tab.

#### Edge Cases

- No documents exist: show empty state "No docs yet. Create the first one."
- Document body is very large (>50,000 characters): editor must handle without freezing; auto-save triggers every 30 seconds.
- Search query matches a doc body but not the title: result must still appear, with the matching body excerpt as the result description.

#### Role-Based Access

- Admin, Manager, Member: create, edit, delete docs.
- Intern: view only.

#### UI Behavior Notes

- Docs Hub uses a two-column layout: doc list on the left, document preview/editor on the right.
- The editor uses the same Tiptap instance as Task Detail, extended with headings (H1–H3), horizontal rule, and image upload.
- Auto-save indicator shows "Saving..." and "Saved" states.

---

## 5. Enhancement Features

---

### F-11 — Risk Indicators

**Description:** Risk indicators provide a visual signal of project health at the epic and project level, with a machine-computed or manually overridden risk level.

#### Functional Requirements

**FR-11-01:** Each epic must have a computed risk level: HIGH, MEDIUM, or LOW. The computation rules are:
- HIGH: epic has ≥ 1 overdue task, OR epic due date is within 3 days and completion < 50%.
- MEDIUM: epic due date is within 7 days and completion < 75%, OR has ≥ 3 tasks in Review with no movement in 48 hours.
- LOW: all other cases.

**FR-11-02:** Admin and Manager must be able to manually override the computed risk level. The override must be stored with an optional reason string and the user who set it.

**FR-11-03:** Risk level must be visible: on the epic row in the list view, on the Dashboard project card, and in the Epic Side Panel header.

**FR-11-04:** A risk reason string must be shown as a tooltip or sub-label below the risk badge (e.g., "3 tasks overdue" or "Due in 2 days, 30% complete").

**FR-11-05:** Risk levels must recompute automatically when task states change (computed at query time, not via a background job, to ensure freshness).

#### Acceptance Criteria

- Risk level appears on epic rows, Dashboard, and side panel.
- Computation rules produce correct levels based on task data.
- Manual override persists and shows the override author.
- Reason string is visible below/beside the badge.

#### Edge Cases

- Epic has no tasks: risk defaults to LOW until a due date is set within 7 days.
- Manual override is set to HIGH but all tasks are Done: override remains until manually cleared; a warning indicator notes "Risk manually overridden — all tasks are Done."

#### Role-Based Access

- Admin, Manager: set manual overrides.
- All roles: view risk levels.

#### UI Behavior Notes

- Risk badges: red pill for HIGH, amber for MEDIUM, green for LOW.
- Tooltip on hover shows full reason string and override author if applicable.

---

### F-12 — Critical Issues

**Description:** Critical Issues is a dashboard widget and a dedicated filterable list that surfaces tasks requiring immediate attention.

#### Functional Requirements

**FR-12-01:** A task qualifies as a Critical Issue if it meets any of the following: (a) overdue (due date < today, status ≠ Done), (b) priority = Critical, (c) marked as "Urgent" by Admin or Manager.

**FR-12-02:** The Dashboard widget must show the top 10 Critical Issues, sorted by due date ascending.

**FR-12-03:** Each Critical Issue item must show: task title, epic name, assignee avatar, due date (with overdue indicator), and reason for being critical.

**FR-12-04:** Clicking a Critical Issue item must open the Task Detail panel for that task.

**FR-12-05:** Admin and Manager must be able to mark any task as "Urgent" from the Task Detail panel or from the Critical Issues list.

**FR-12-06:** Critical Issues must have a dedicated full-page view accessible from the Dashboard widget header ("View all critical issues").

**FR-12-07:** The full Critical Issues page must support filtering by: reason type (overdue / critical priority / urgent), assignee, and epic.

#### Acceptance Criteria

- Dashboard widget shows up to 10 critical issues.
- Overdue tasks automatically appear without manual intervention.
- "Urgent" flag can be set/unset by Admin and Manager.
- Clicking an item opens Task Detail.

#### Edge Cases

- Zero critical issues: widget shows "No critical issues. All good." with a green checkmark.
- Critical issue is resolved (marked Done): it disappears from the list on next load or within 5 seconds via polling.

#### Role-Based Access

- Admin, Manager: mark tasks as Urgent; view and interact with Critical Issues.
- Member, Intern: view Critical Issues, cannot mark as Urgent.

---

### F-13 — Activity Feed

**Description:** The Activity Feed provides a real-time or near-real-time stream of team actions, giving visibility into what the team has been doing.

#### Functional Requirements

**FR-13-01:** The Activity Feed must record the following event types: task created, task status changed, task assigned, task completed, epic created, epic status changed, comment added, doc created, time logged.

**FR-13-02:** Each activity item must display: actor avatar, actor name, action description, entity name (linked), and timestamp (relative, e.g., "2 minutes ago").

**FR-13-03:** The Dashboard Activity Feed shows the 20 most recent events across all projects the user has access to.

**FR-13-04:** Activity Feed must support filtering by: event type, actor, and project.

**FR-13-05:** Activity items must link to the relevant entity (task, epic, doc) — clicking the entity name in the feed opens that entity's detail view.

**FR-13-06:** The feed must refresh at a maximum interval of 30 seconds via polling (WebSocket or SSE is a future enhancement).

#### Acceptance Criteria

- All listed event types are captured and appear in the feed.
- Relative timestamps are accurate.
- Entity links in feed items navigate correctly.
- Feed refreshes within 30 seconds of an action.

#### Edge Cases

- Actor is deleted from the system: show "[Deleted User]" in the activity item.
- Entity linked in the feed is deleted: show "[Deleted Item]" and disable the link.
- Feed has 1000+ items: only the most recent 20 are shown on Dashboard; full feed page supports pagination.

---

### F-14 — Epic Side Panel

**Description:** The Epic Side Panel is a slide-in drawer from the right that provides access to an epic's full detail without leaving the epic list view.

#### Functional Requirements

**FR-14-01:** The Epic Side Panel must slide in from the right side of the screen when an epic row is clicked.

**FR-14-02:** The panel must have three tabs: Overview, Tasks, Docs.

**FR-14-03:** The Overview tab must display: epic title, description, status badge, risk badge, progress bar, assignees, due date, linked goal, and key metrics (total tasks, done tasks, overdue tasks).

**FR-14-04:** The Tasks tab must display all tasks belonging to the epic, grouped by status, with the same task row format used in My Work.

**FR-14-05:** The Docs tab must display all documents linked to this epic (from Docs Hub), with title, author, and last updated date.

**FR-14-06:** Admin and Manager must be able to edit the epic fields (title, description, dates, assignees) directly within the Overview tab via inline editing or an "Edit" button that activates edit mode.

**FR-14-07:** The panel must not obscure more than 60% of the screen width on desktop. The epic list must remain partially visible behind the panel.

**FR-14-08:** The panel must close when: the Escape key is pressed, the close (X) button is clicked, or the user clicks on the epic list area behind the panel.

**FR-14-09:** Navigating to the next/previous epic must be possible from within the panel via arrow buttons (← →) without closing and reopening.

#### Acceptance Criteria

- Panel slides in from the right when an epic is clicked.
- All three tabs render with correct content.
- Editing in Overview tab persists changes with success/error toast.
- Panel closes on Escape, X button, and outside click.
- Navigation arrows cycle through epics.

#### Edge Cases

- Epic has no tasks: Tasks tab shows "No tasks yet" with a "Create Task" button.
- Epic has no docs: Docs tab shows "No documents linked" with a "Create Doc" button.
- Panel is open and the epic is deleted by another user: panel shows "This epic no longer exists" with a close button.

---

### F-15 — Changelog per Epic

**Description:** Each epic maintains an audit changelog recording all changes made to the epic's fields and to tasks within it.

#### Functional Requirements

**FR-15-01:** The changelog must be accessible as a tab ("Changelog") added to the Epic Side Panel (making it a 4-tab panel: Overview, Tasks, Docs, Changelog).

**FR-15-02:** Each changelog entry must record: event type, field changed (if applicable), old value, new value, actor, and timestamp.

**FR-15-03:** The following events must be recorded in the epic changelog: epic field changes (title, status, dates, assignees), task added to epic, task status changed, task deleted, task assignee changed, comment added to a task in this epic.

**FR-15-04:** Changelog entries must be immutable — they cannot be edited or deleted by any role.

**FR-15-05:** The changelog must support filtering by: event type and actor.

**FR-15-06:** Changelog entries must be paginated (20 per page) with oldest entries accessible via "Load more".

#### Acceptance Criteria

- Changelog tab appears in Epic Side Panel.
- All listed events create entries.
- Entries are immutable (no edit/delete UI).
- Filter by event type and actor works.

#### Edge Cases

- Epic has no changelog entries yet: show "No changes recorded yet."
- Actor in a changelog entry is deleted: show "[Deleted User]".

---

### F-16 — Task Dependencies

**Description:** Tasks can declare dependencies on other tasks: a task can be "blocked by" another task, and can "block" other tasks.

#### Functional Requirements

**FR-16-01:** Each task must support a "Blocked by" list and a "Blocks" list. Each entry is a link to another task within the same project.

**FR-16-02:** Admin and Manager must be able to add/remove dependencies from the Task Detail panel via a searchable task picker.

**FR-16-03:** When a task has open "Blocked by" dependencies, its status must show a "Blocked" indicator badge in addition to its normal status. The task can still be moved to any status manually, but the indicator persists until all blocking tasks are Done.

**FR-16-04:** On the Task Detail panel, each dependency must show: linked task title, status badge, assignee, and a clickable link to open that task.

**FR-16-05:** Circular dependencies must be prevented. If adding task B as a dependency of task A would create a cycle, the system must reject it with an error: "Circular dependency detected."

**FR-16-06:** When a blocking task is marked Done, the system must notify the assignee of the blocked task: "Task '[blocking task title]' is now complete. You can proceed with '[blocked task title]'."

#### Acceptance Criteria

- "Blocked by" and "Blocks" lists appear in Task Detail.
- Adding a dependency via task picker persists correctly.
- Blocked indicator appears on tasks with open blockers.
- Circular dependency is rejected with an error message.
- Notification is sent when a blocker is resolved.

#### Edge Cases

- Linked dependency task is deleted: show "[Deleted Task]" in the dependency list with a warning icon.
- Task blocks 10+ other tasks: list is scrollable within the panel.

---

### F-17 — Template System

**Description:** Admin and Manager can create reusable templates for Epics and Tasks, reducing setup time for recurring project types.

#### Functional Requirements

**FR-17-01:** A Template can be of type: Epic Template or Task Template.

**FR-17-02:** An Epic Template contains: title pattern, description, default assignees, a set of Task Templates (pre-defined tasks with titles, priorities, and estimated times).

**FR-17-03:** A Task Template contains: title pattern, description, priority, estimated time, and a checklist of default subtasks.

**FR-17-04:** Admin and Manager must be able to create, edit, and delete templates from a dedicated Templates page accessible from the Settings or sidebar.

**FR-17-05:** When creating a new Epic or Task, Admin and Manager must be offered an option to "Use a Template" which opens a template picker.

**FR-17-06:** Applying a template must pre-fill the creation form with the template's default values. All values remain editable before submission.

**FR-17-07:** Templates must be organization-scoped (visible to all Admin and Manager users in the workspace).

#### Acceptance Criteria

- Templates page lists all templates with type, name, and action menu.
- Creating an epic or task from a template pre-fills the form.
- Template values are editable before final submission.
- Deleted templates do not affect existing epics/tasks created from them.

#### Edge Cases

- Template has a task with an assignee who has since left the organization: assignee field is left blank on apply; user is notified.
- User applies a template with 20 default tasks to an epic: all 20 tasks are created in a single batch operation.

#### Role-Based Access

- Admin, Manager: create, edit, delete, apply templates.
- Member, Intern: cannot access templates.

---

### F-18 — Time Tracking

**Description:** Users can log time against tasks using a start/stop timer or manual time entry.

#### Functional Requirements

**FR-18-01:** Each task must have a time tracking section in its Task Detail panel showing: estimated time, total logged time, and a list of time log entries.

**FR-18-02:** A time log entry has: user, start datetime, end datetime (or duration), and an optional note.

**FR-18-03:** Users must be able to start a timer on a task. The timer runs until stopped. Stopping it creates a time log entry with start and end times.

**FR-18-04:** Only one timer can run at a time per user. Starting a new timer while one is already running must prompt: "You have an active timer on '[task title]'. Stop it and start a new one?"

**FR-18-05:** Users must be able to add manual time entries: select date, input duration (hours and minutes), add an optional note.

**FR-18-06:** Time log entries created by the user themselves can be edited or deleted by that user or by Admin/Manager.

**FR-18-07:** The active timer must persist across page navigation within the app (shown as a floating timer chip in the bottom bar).

**FR-18-08:** Total logged time must be visible on the task card on the Board and in the My Work row.

#### Acceptance Criteria

- Start/stop timer creates accurate time log entries.
- Manual time entry form validates duration input.
- Only one timer active per user at a time.
- Active timer chip is visible when navigating between pages.
- Total logged time is accurate on task card.

#### Edge Cases

- User closes the browser tab with an active timer: timer continues server-side and can be stopped on next login.
- Manual entry with duration = 0: validation error "Duration must be greater than 0."
- Time log entry is edited to overlap with another entry: show a warning but do not block.

---

## 6. AI Features

---

### F-19 — AI Assistant Panel

**Description:** A persistent, context-aware AI panel powered by the Claude API, accessible from anywhere in the application. It can generate tasks and epics, answer project status questions, produce weekly summaries, and detect risks.

#### Functional Requirements

**FR-19-01:** The AI Assistant panel must be accessible via a persistent button (e.g., a sparkle icon) in the navigation sidebar or bottom bar, visible from every page.

**FR-19-02:** The panel opens as a right-side drawer or modal. It must not block core content when open.

**FR-19-03:** The AI Assistant must be context-aware: it must know which project, epic, or task the user is currently viewing and incorporate that context into its responses without the user needing to specify it.

**FR-19-04:** The assistant must support the following capabilities:

  **FR-19-04a (Generate Tasks):** Given a brief or meeting notes pasted by the user, the assistant must generate a structured list of tasks with titles, priorities, and suggested assignees. The user can review, edit, and bulk-create the generated tasks.

  **FR-19-04b (Generate Epics):** Given a project brief, the assistant must generate a structured epic with title, description, and a set of default tasks. The user can review and create the epic from the preview.

  **FR-19-04c (Answer Status Questions):** The assistant must answer natural language questions about project status, e.g., "How many tasks are overdue in Epic X?" or "Who is the most loaded team member this week?" using live data from the application.

  **FR-19-04d (Weekly Summary):** On demand, the assistant must generate a written weekly progress summary covering: tasks completed this week, tasks in progress, overdue items, and team highlights.

  **FR-19-04e (Risk Detection):** The assistant must proactively surface risks not captured by the automated risk rules in F-11, based on task comments, stalled work, or velocity drops.

**FR-19-05:** All AI-generated content is a suggestion and requires explicit user confirmation before being written to the database.

**FR-19-06:** The assistant must maintain conversational context within a session (last 10 turns) so follow-up questions work naturally.

**FR-19-07:** The assistant must display a typing indicator while a response is being streamed.

**FR-19-08:** Token usage and response time must not block the UI. The panel must remain independently scrollable while a response is generating.

**FR-19-09:** If the Claude API returns an error, the panel must show: "AI assistant is temporarily unavailable. Try again." with a retry button.

**FR-19-10:** AI features must be available to Admin, Manager, and Member roles only. Intern cannot access the AI panel.

#### Acceptance Criteria

- AI panel opens from any page without navigating away.
- Context is injected automatically (current page entity).
- Task generation from brief produces structured, reviewable task list.
- Weekly summary generates with accurate data.
- Errors are handled gracefully with a retry option.
- All generated content requires explicit confirmation before creation.

#### Edge Cases

- Project has no tasks yet: AI can still generate tasks from a brief; answers about status return "No data available yet."
- Brief pasted for task generation is very long (>5000 tokens): system must truncate or chunk the input and notify the user.
- User asks a question outside project scope (e.g., "What is the weather?"): assistant responds "I can only help with project-related questions."

---

## 7. Bug Fix Requirements

**BF-01 — Direct URL 404 for /epic/[id] and /task/[id]**
- **Requirement:** Nuxt 4 dynamic route files must exist at `pages/epic/[id].vue` and `pages/task/[id].vue`. Server-side rendering must resolve these routes. Direct navigation, page refresh, and link sharing must all work.
- **Acceptance Criteria:** Navigating to `/epic/123` and `/task/456` directly returns the correct page with a 200 status, not a 404.

**BF-02 — 503 errors on Board from perPage=1000**
- **Requirement:** All database queries fetching tasks must use cursor-based pagination with a max page size of 50. The `perPage=1000` query parameter must be removed from all task-fetching API calls. Board columns must implement "Load more" for >50 tasks.
- **Acceptance Criteria:** Board loads without 503 errors. No API call fetches more than 50 tasks at once.

**BF-03 — No feedback on write operations**
- **Requirement:** Every mutation (create, update, delete) across all entities must trigger either a success toast ("Task created", "Epic updated", etc.) or an error toast ("Failed to create task. Please try again.") within 500ms of the operation completing or failing.
- **Acceptance Criteria:** Creating a task shows a success toast. A network failure on save shows an error toast. No write operation is silent.

**BF-04 — Dashboard metric inconsistency**
- **Requirement:** All task counts displayed on the Dashboard must be computed from the same query and the same data source. The discrepancy between 19 and 30 tasks was caused by separate count queries with different scopes; this must be unified.
- **Acceptance Criteria:** Task count on Dashboard project card matches the count on the Board for the same project with no filters applied.

**BF-05 — Notification bell broken**
- **Requirement:** The notification bell in the header must open a notification panel listing all unread notifications. The badge count must accurately reflect unread count (not be hard-coded or stuck at 9+). Notifications must be markable as read individually or all-at-once.
- **Acceptance Criteria:** Clicking the bell opens a panel with actual notifications. The badge count decrements when notifications are read. The badge disappears when all are read.

**BF-06 — Epic status not auto-updating at 100%**
- **Requirement:** When the last task in an epic is marked Done, a server-side trigger (or computed field) must update the epic's status to Done. This must be reflected in the UI within 2 seconds (polling or optimistic update).
- **Acceptance Criteria:** Marking the last task Done in an epic updates the epic status badge to "Done" within 2 seconds without a manual page refresh.

**BF-07 — Create Task not available on Board**
- **Requirement:** The Board page must include a "Create Task" button in the page header and a "+ Add Task" at the bottom of each column. Both must open the task creation modal.
- **Acceptance Criteria:** A "Create Task" button is visible on the Board page and creates a task successfully.

**BF-08 — Goal detail missing Add KPI and Link Epic**
- **Requirement:** The Goal Detail page must render an "Add KPI" button and a "Link Epic" button for Admin and Manager. Both buttons must be functional.
- **Acceptance Criteria:** Admin/Manager can add a KPI and link an epic from the Goal Detail page.

**BF-09 — RBAC not enforced in UI**
- **Requirement:** All Edit/Delete/Create action buttons and menu items must be conditionally rendered based on the authenticated user's role. Member and Intern must not see Edit/Delete buttons for Goals, Epics, or Tasks they do not own. Role checks must be applied both in the UI (component-level) and server-side (API-level).
- **Acceptance Criteria:** A Member logged in sees no "Delete Epic" option anywhere in the UI. API calls attempting privileged actions by non-privileged roles return 403.

---

## 8. Non-Functional Requirements

### Performance

**NFR-01:** Initial page load (Time to Interactive) must be under 2 seconds on a standard broadband connection (≥10 Mbps).

**NFR-02:** API response time for all read operations must be under 500ms at the 95th percentile.

**NFR-03:** API response time for all write operations must be under 1 second at the 95th percentile.

**NFR-04:** The Board must support up to 200 visible tasks across all columns without UI lag. Virtualization (windowing) must be used for columns with more than 50 tasks.

**NFR-05:** Global Search must return results within 300ms of the debounce period ending.

**NFR-06:** No database query may use `LIMIT` values above 50 without cursor-based pagination. The `perPage=1000` antipattern is explicitly prohibited.

### Reliability

**NFR-07:** The application must handle Cloudflare D1 transient errors with automatic retry (up to 3 attempts with exponential backoff) before surfacing an error to the user.

**NFR-08:** All forms must implement optimistic UI: the UI updates immediately on submit, then rolls back with an error toast if the server returns an error.

**NFR-09:** The application must be functional with no data loss if the user loses network connectivity briefly (offline detection banner must appear).

### Security

**NFR-10:** All API endpoints must validate the authenticated user's role server-side before performing any read or write operation. Client-side RBAC is supplementary only.

**NFR-11:** All user inputs must be sanitized server-side to prevent XSS and SQL injection. Rich text content must be sanitized using a server-side HTML sanitizer before storage.

**NFR-12:** Authentication must use secure, HTTP-only cookies for session tokens. No sensitive data may be stored in localStorage.

### Accessibility

**NFR-13:** All interactive elements must have ARIA labels. The application must be navigable by keyboard only.

**NFR-14:** Color must not be the sole means of conveying information (e.g., risk badges must include text labels, not just color).

**NFR-15:** The application must meet WCAG 2.1 AA contrast ratios for all text and interactive elements.

### Scalability

**NFR-16:** The application must remain performant with up to 10,000 tasks, 500 epics, and 100 users in a single workspace.

---

## 9. Integration Requirements

### IR-01 — Claude API (AI Assistant)

- **Provider:** Anthropic Claude API
- **Model:** Claude claude-sonnet-4-6 or equivalent production-ready model
- **Authentication:** API key stored server-side as a Cloudflare environment variable. Never exposed to the client.
- **Invocation:** All Claude API calls must be made from a Nuxt server route (not from the client directly).
- **Context injection:** Each API call must include a system prompt that describes the current user's role, current project/epic/task context, and relevant data (task counts, overdue items, etc.).
- **Streaming:** Responses must be streamed to the client using Server-Sent Events (SSE) for real-time typing effect in the AI panel.
- **Rate limiting:** API calls must be rate-limited per user to prevent abuse (max 20 requests per minute per user).
- **Cost control:** Long contexts (>8000 tokens) must be truncated with a warning. The system must log token usage per request to Cloudflare Analytics.
- **Error handling:** API errors (rate limit, service unavailable) must be caught server-side and returned as structured error responses; the panel shows a user-friendly message.

### IR-02 — Cloudflare D1

- **Usage:** Primary relational database for all application data.
- **Migrations:** All schema changes must be managed via Drizzle ORM migration files. No ad-hoc schema changes.
- **Query constraints:** All list queries must use keyset pagination. Aggregation queries (counts, averages) must use D1-supported SQL aggregations, not client-side computation.

### IR-03 — Cloudflare Pages

- **Deployment:** Nuxt 4 app deployed as a Cloudflare Pages project with server-side rendering via Cloudflare Workers.
- **Environment variables:** All secrets (Claude API key, etc.) stored in Cloudflare Pages environment variables, never in code.

---

*End of Functional Requirements Document*
