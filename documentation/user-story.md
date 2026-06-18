# User Stories
## Elux Project Tracker — Full Revamp

**Version:** 1.0  
**Date:** 2026-06-17  
**Company:** Elux — AI-native product design agency  
**Roles covered:** Admin · Manager · Member · Intern

---

## Table of Contents

1. [Dashboard](#1-dashboard)
2. [Goals](#2-goals)
3. [Epics](#3-epics)
4. [Board / Kanban](#4-board--kanban)
5. [My Work](#5-my-work)
6. [My Day](#6-my-day)
7. [Team Workload](#7-team-workload)
8. [Docs Hub](#8-docs-hub)
9. [Task Detail](#9-task-detail)
10. [Global Search](#10-global-search)
11. [AI Assistant](#11-ai-assistant)
12. [Settings & RBAC](#12-settings--rbac)
13. [Notifications](#13-notifications)
14. [Error States & Edge Cases](#14-error-states--edge-cases)

---

## Priority Definitions

- **P0** — Must have for launch. Core functionality or critical bug fix.
- **P1** — Should have. Significant user value; acceptable to defer by one sprint.
- **P2** — Nice to have. Enhancements that improve experience but are not blockers.

---

## 1. Dashboard

---

**US-001**
**As an Admin**, I want to see a helicopter-view of all active projects on the Dashboard so that I can quickly assess overall project health without navigating into each project.

**Acceptance Criteria:**
- **Given** I am logged in as Admin and there are active projects,
- **When** I navigate to the Dashboard,
- **Then** I see a card for each project showing: project name, total tasks, overdue tasks, completion percentage, and current risk level.

**Priority:** P0  
**Linked Feature:** F-01

---

**US-002**
**As a Manager**, I want the Dashboard metrics (task counts, completion %) to be consistent with what I see on the Board so that I can trust the numbers I report to stakeholders.

**Acceptance Criteria:**
- **Given** I am viewing the Dashboard and the Board for the same project,
- **When** I compare the task counts,
- **Then** the total task count on the Dashboard card matches the count on the Board with no filters applied.

**Priority:** P0  
**Linked Feature:** F-01, BF-04

---

**US-003**
**As a Manager**, I want to see a Critical Issues widget on the Dashboard so that I can immediately identify tasks that are blocking progress without digging through the Board.

**Acceptance Criteria:**
- **Given** there are overdue or critical-priority tasks in any of my projects,
- **When** I view the Dashboard,
- **Then** the Critical Issues widget shows up to 10 items sorted by due date, each with task title, epic name, assignee, and overdue indicator.

**Priority:** P0  
**Linked Feature:** F-12

---

**US-004**
**As a Member**, I want to see an Activity Feed on the Dashboard so that I can catch up on what my teammates did while I was away.

**Acceptance Criteria:**
- **Given** team members have been active on tasks and epics,
- **When** I open the Dashboard,
- **Then** the Activity Feed shows the 20 most recent actions with actor name, action description, entity link, and relative timestamp.

**Priority:** P1  
**Linked Feature:** F-13

---

**US-005**
**As an Intern**, I want to see only projects I am assigned to on the Dashboard so that I am not overwhelmed by projects irrelevant to my work.

**Acceptance Criteria:**
- **Given** I am logged in as Intern and I am assigned to 2 out of 5 projects,
- **When** I view the Dashboard,
- **Then** I see only the 2 projects I am assigned to; the other 3 are not visible.

**Priority:** P0  
**Linked Feature:** F-01

---

**US-006**
**As an Admin**, I want the Dashboard to show no projects empty state with a call-to-action so that new workspace setups guide users toward creating their first project.

**Acceptance Criteria:**
- **Given** no projects exist in the workspace,
- **When** I open the Dashboard,
- **Then** I see an empty state with the message "Create your first project" and a button to do so.

**Priority:** P1  
**Linked Feature:** F-01

---

**US-007**
**As a Manager**, I want to click a metric on the Dashboard (e.g., "8 overdue tasks") and be taken to a filtered Board view so that I can act on that data immediately.

**Acceptance Criteria:**
- **Given** I see "8 overdue tasks" on a project card,
- **When** I click that number,
- **Then** I am taken to the Board filtered by overdue status for that project.

**Priority:** P1  
**Linked Feature:** F-01

---

## 2. Goals

---

**US-008**
**As an Admin**, I want to create a Goal with a title, description, target date, and KPIs so that the team has a clear strategic objective to work toward.

**Acceptance Criteria:**
- **Given** I am on the Goals page,
- **When** I click "Create Goal" and fill in title, description, target date, and at least one KPI, then submit,
- **Then** the goal appears in the Goals list with the correct data and I see a "Goal created" success toast.

**Priority:** P0  
**Linked Feature:** F-02, BF-03

---

**US-009**
**As a Manager**, I want to add KPIs to a Goal from the Goal Detail page so that I can define measurable success criteria after the goal is created.

**Acceptance Criteria:**
- **Given** I am viewing a Goal Detail page as Manager,
- **When** I click "Add KPI" and enter KPI name, target value, current value, and unit,
- **Then** the KPI appears in the KPI table on the Goal Detail page.

**Priority:** P0  
**Linked Feature:** F-02, BF-08

---

**US-010**
**As a Manager**, I want to link an Epic to a Goal so that the goal's progress is automatically derived from the linked epics' task completion.

**Acceptance Criteria:**
- **Given** I am on the Goal Detail page and there are existing epics,
- **When** I click "Link Epic" and search for and select an epic,
- **Then** the epic appears in the linked epics list and the goal's progress bar updates to reflect the epic's current completion percentage.

**Priority:** P0  
**Linked Feature:** F-02, BF-08

---

**US-011**
**As a Member**, I want to view Goals and their progress so that I understand how my tasks contribute to the company's strategic objectives.

**Acceptance Criteria:**
- **Given** I am logged in as Member,
- **When** I navigate to the Goals page,
- **Then** I can see all goals with their progress bars, KPI summaries, and linked epics count — but I cannot see Create, Edit, or Delete buttons.

**Priority:** P1  
**Linked Feature:** F-02

---

**US-012**
**As an Admin**, I want Goal progress to update automatically when linked epic tasks are completed so that I do not have to manually recalculate and update goal percentages.

**Acceptance Criteria:**
- **Given** a Goal is linked to an Epic,
- **When** a task in that Epic is marked Done,
- **Then** the Goal's progress percentage updates within 5 seconds without a manual page refresh.

**Priority:** P0  
**Linked Feature:** F-02

---

**US-013**
**As a Manager**, I want to filter goals by status and owner so that I can quickly find goals at risk or goals owned by a specific person.

**Acceptance Criteria:**
- **Given** I am on the Goals page with multiple goals,
- **When** I apply a filter for status = "At Risk" and owner = "Rini",
- **Then** only goals matching both conditions are shown.

**Priority:** P1  
**Linked Feature:** F-02

---

## 3. Epics

---

**US-014**
**As an Admin**, I want to create an Epic with a title, description, due date, and assigned team members so that I can scope a body of work for my team.

**Acceptance Criteria:**
- **Given** I am on the Epics page,
- **When** I click "Create Epic", fill in all required fields, and submit,
- **Then** the epic appears in the list with correct data and I see an "Epic created" success toast.

**Priority:** P0  
**Linked Feature:** F-03, BF-03

---

**US-015**
**As a Manager**, I want the Epic's status to automatically change to "Done" when all of its tasks are marked complete so that I don't have to manually update it.

**Acceptance Criteria:**
- **Given** an Epic has 5 tasks all in "Done" status,
- **When** the last task is marked Done,
- **Then** the Epic's status badge updates to "Done" within 2 seconds.

**Priority:** P0  
**Linked Feature:** F-03, BF-06

---

**US-016**
**As a Member**, I want to click an epic row and have a side panel slide in from the right so that I can see the epic details without losing my place in the list.

**Acceptance Criteria:**
- **Given** I am on the Epics list page,
- **When** I click an epic row,
- **Then** a side panel slides in from the right showing the epic's Overview tab with title, description, status, risk, progress, and assignees.

**Priority:** P0  
**Linked Feature:** F-14

---

**US-017**
**As a Member**, I want to navigate to an epic via a direct URL (e.g., /epic/123) so that I can share a link to a specific epic with a teammate.

**Acceptance Criteria:**
- **Given** I have the URL `/epic/123` for an existing epic,
- **When** I paste the URL in a browser and press Enter,
- **Then** the epic detail view loads correctly with a 200 status, not a 404.

**Priority:** P0  
**Linked Feature:** F-03, BF-01

---

**US-018**
**As a Manager**, I want to see the risk level badge on each epic row so that I can prioritize which epics need attention at a glance.

**Acceptance Criteria:**
- **Given** I am on the Epics list,
- **When** an epic has overdue tasks,
- **Then** a red "HIGH" risk badge is visible on that epic's row.

**Priority:** P0  
**Linked Feature:** F-11

---

**US-019**
**As a Member**, I want to see the Changelog tab in the Epic Side Panel so that I understand what changed, when, and who made the change.

**Acceptance Criteria:**
- **Given** I am viewing an Epic Side Panel,
- **When** I click the "Changelog" tab,
- **Then** I see a chronological list of changes with: event type, actor name, old value, new value, and timestamp.

**Priority:** P1  
**Linked Feature:** F-15

---

**US-020**
**As an Intern**, I want to view epics but not see Edit or Delete buttons so that I cannot accidentally modify work I am not responsible for.

**Acceptance Criteria:**
- **Given** I am logged in as Intern and viewing the Epics list,
- **When** I hover over an epic row,
- **Then** no Edit or Delete action is visible in the row action menu.

**Priority:** P0  
**Linked Feature:** F-03, BF-09

---

**US-021**
**As a Manager**, I want to manually override an epic's risk level with a reason so that I can flag a risk that the automated rules have not caught.

**Acceptance Criteria:**
- **Given** I am viewing an Epic Side Panel as Manager,
- **When** I click the risk badge and select "Override to HIGH" and enter a reason "Client deadline moved up",
- **Then** the risk badge updates to HIGH and "Client deadline moved up" is shown as the reason in the badge tooltip.

**Priority:** P1  
**Linked Feature:** F-11

---

## 4. Board / Kanban

---

**US-022**
**As a Member**, I want to see all tasks organized in four Kanban columns (To Do, In Progress, Review, Done) so that I can get an instant visual overview of work status.

**Acceptance Criteria:**
- **Given** I am on the Board page,
- **When** the page loads,
- **Then** I see four columns: To Do, In Progress, Review, Done — each with a task count in the column header.

**Priority:** P0  
**Linked Feature:** F-04

---

**US-023**
**As a Member**, I want to drag a task card from "In Progress" to "Review" so that I can update its status without opening the task detail.

**Acceptance Criteria:**
- **Given** I have a task in the "In Progress" column,
- **When** I drag it to the "Review" column,
- **Then** the task card moves to "Review" and the column task counts update immediately. The status change persists after page refresh.

**Priority:** P0  
**Linked Feature:** F-04

---

**US-024**
**As a Manager**, I want to create a task directly from the Board page so that I don't have to navigate away when I think of a new task while reviewing the board.

**Acceptance Criteria:**
- **Given** I am on the Board page,
- **When** I click the "Create Task" button in the page header or the "+ Add Task" at the bottom of any column,
- **Then** a task creation modal opens. The status is pre-set to the column I clicked "+ Add Task" from.

**Priority:** P0  
**Linked Feature:** F-04, BF-07

---

**US-025**
**As a Manager**, I want to filter the Board by assignee and priority so that I can focus on a specific person's work or on critical tasks only.

**Acceptance Criteria:**
- **Given** I am on the Board,
- **When** I select Assignee = "Dio" and Priority = "High",
- **Then** only tasks assigned to Dio with High priority are shown across all columns. The task counts update accordingly.

**Priority:** P0  
**Linked Feature:** F-04

---

**US-026**
**As an Admin**, I want the Board to load without 503 errors even when there are 200+ tasks so that the team can always access the board.

**Acceptance Criteria:**
- **Given** there are 300 tasks across all columns,
- **When** I navigate to the Board,
- **Then** the page loads without a 503 error, showing the first 50 tasks per column with a "Load more" button.

**Priority:** P0  
**Linked Feature:** F-04, BF-02

---

**US-027**
**As a Member**, I want empty columns to show a clear empty state with a "+" icon so that I know I can add a task there, rather than seeing a blank space that looks broken.

**Acceptance Criteria:**
- **Given** the "Review" column has no tasks,
- **When** I view the Board,
- **Then** the "Review" column shows an empty state card with a "+" icon.

**Priority:** P1  
**Linked Feature:** F-04

---

**US-028**
**As an Intern**, I want to view the Board and see task cards but not be able to drag cards between columns so that I cannot accidentally change task statuses.

**Acceptance Criteria:**
- **Given** I am logged in as Intern,
- **When** I try to drag a card on the Board,
- **Then** the drag action is disabled and the cards do not move.

**Priority:** P0  
**Linked Feature:** F-04, BF-09

---

**US-029**
**As a Member**, I want to navigate to a task via direct URL (/task/[id]) so that I can share a link to a task in a message and have the recipient land on the correct page.

**Acceptance Criteria:**
- **Given** I have the URL `/task/456` for an existing task,
- **When** I open it in a browser,
- **Then** the task detail view loads correctly, not a 404.

**Priority:** P0  
**Linked Feature:** F-04, F-09, BF-01

---

## 5. My Work

---

**US-030**
**As a Member**, I want to see only my assigned tasks grouped by status on the My Work page so that I have a personal to-do view without the noise of the full board.

**Acceptance Criteria:**
- **Given** I have tasks assigned to me in To Do, In Progress, and Review,
- **When** I navigate to My Work,
- **Then** I see three sections (To Do, In Progress, Review), each with the correct count, containing only my tasks. The Done section is collapsed by default.

**Priority:** P0  
**Linked Feature:** F-05

---

**US-031**
**As a Member**, I want to collapse and expand status sections in My Work so that I can reduce visual noise when I'm focused on a specific status group.

**Acceptance Criteria:**
- **Given** I am on the My Work page,
- **When** I click a section header (e.g., "To Do (4)"),
- **Then** the section collapses. Clicking it again expands it. The collapsed/expanded state is preserved after page refresh.

**Priority:** P1  
**Linked Feature:** F-05

---

**US-032**
**As a Member**, I want to change a task's status directly from the My Work row so that I can update a task quickly without opening the full Task Detail panel.

**Acceptance Criteria:**
- **Given** I am on My Work and I have a task in "In Progress",
- **When** I click the status badge on the row and select "Review",
- **Then** the task moves to the "Review" section immediately and a success toast confirms the update.

**Priority:** P0  
**Linked Feature:** F-05, BF-03

---

**US-033**
**As a Manager**, I want to see tasks with past due dates highlighted in red in My Work so that I can immediately spot what I'm late on.

**Acceptance Criteria:**
- **Given** I have tasks in My Work where the due date is yesterday or earlier, and the tasks are not Done,
- **When** I view My Work,
- **Then** those tasks' due dates are rendered in red.

**Priority:** P1  
**Linked Feature:** F-05

---

**US-034**
**As an Intern**, I want to view My Work in read-only mode so that I can see what's assigned to me, but changes must go through a manager.

**Acceptance Criteria:**
- **Given** I am logged in as Intern,
- **When** I view My Work,
- **Then** there are no inline status dropdowns or action menus; I can only click tasks to view their detail.

**Priority:** P0  
**Linked Feature:** F-05, BF-09

---

## 6. My Day

---

**US-035**
**As a Member**, I want to see only today's priority tasks in My Day so that I can start each morning with a clear, focused plan.

**Acceptance Criteria:**
- **Given** I have tasks due today and tasks I've manually added to My Day,
- **When** I navigate to My Day,
- **Then** I see all tasks due today plus manually added ones. Tasks from other days are not shown.

**Priority:** P0  
**Linked Feature:** F-06

---

**US-036**
**As a Member**, I want to add any of my assigned tasks to My Day from the My Work page so that I can curate my daily focus list.

**Acceptance Criteria:**
- **Given** I have a task in My Work that is not due today,
- **When** I right-click the task row and select "Add to My Day",
- **Then** the task appears in My Day immediately.

**Priority:** P0  
**Linked Feature:** F-06

---

**US-037**
**As a Member**, I want to see a progress indicator on My Day (e.g., "3/7 done today") so that I have a sense of momentum during the day.

**Acceptance Criteria:**
- **Given** I have 7 tasks in My Day and I complete 3,
- **When** I view My Day,
- **Then** the header shows "3/7 done today" and updates each time I mark a task Done.

**Priority:** P1  
**Linked Feature:** F-06

---

**US-038**
**As a Member**, I want to see a celebration animation when I complete all My Day tasks so that finishing feels rewarding.

**Acceptance Criteria:**
- **Given** I have tasks in My Day,
- **When** I mark the last task Done,
- **Then** a confetti animation plays and the page shows "All done for today! Great work."

**Priority:** P2  
**Linked Feature:** F-06

---

**US-039**
**As a Member**, I want My Day tasks to persist across page reloads so that refreshing the browser does not reset my daily focus list.

**Acceptance Criteria:**
- **Given** I have added tasks to My Day,
- **When** I refresh the browser,
- **Then** all the same tasks are still in My Day.

**Priority:** P0  
**Linked Feature:** F-06

---

## 7. Team Workload

---

**US-040**
**As a Manager**, I want to see all team members' task loads across all statuses so that I can identify imbalances and redistribute work before someone burns out.

**Acceptance Criteria:**
- **Given** I am on the Team Workload page,
- **When** the page loads,
- **Then** I see each active team member with a stacked bar chart showing their task count across To Do, In Progress, Review, and Done.

**Priority:** P0  
**Linked Feature:** F-07

---

**US-041**
**As a Manager**, I want overloaded team members to be visually highlighted so that I know who to prioritize when redistributing tasks.

**Acceptance Criteria:**
- **Given** a team member has more than 5 tasks In Progress,
- **When** I view Team Workload,
- **Then** that member's row has an amber warning indicator.

**Priority:** P1  
**Linked Feature:** F-07

---

**US-042**
**As a Manager**, I want to expand a team member's row to see their tasks grouped by epic so that I understand the context of their workload.

**Acceptance Criteria:**
- **Given** I am on Team Workload,
- **When** I click a member row to expand it,
- **Then** the row expands inline showing that member's tasks grouped by epic, with task title, priority, and due date.

**Priority:** P1  
**Linked Feature:** F-07

---

**US-043**
**As a Manager**, I want to reassign a task directly from the Team Workload view so that I can redistribute work without navigating to the task detail.

**Acceptance Criteria:**
- **Given** I have expanded a team member's row and I see a task I want to reassign,
- **When** I click the task and select a new assignee,
- **Then** the task moves to the new assignee's row immediately and a success toast confirms the change.

**Priority:** P1  
**Linked Feature:** F-07

---

**US-044**
**As an Admin**, I want to filter Team Workload by project so that I can see workload distribution within a specific project only.

**Acceptance Criteria:**
- **Given** I am on Team Workload,
- **When** I select Project = "Brand Refresh",
- **Then** only tasks from the "Brand Refresh" project count toward each member's workload bar.

**Priority:** P1  
**Linked Feature:** F-07

---

**US-045**
**As an Intern**, I want to be blocked from accessing Team Workload so that sensitive capacity data is not visible to junior team members.

**Acceptance Criteria:**
- **Given** I am logged in as Intern,
- **When** I try to navigate to the Team Workload page,
- **Then** I see a 403 "Access denied" page, not the workload data.

**Priority:** P0  
**Linked Feature:** F-07, BF-09

---

## 8. Docs Hub

---

**US-046**
**As a Member**, I want to browse all project documentation in the Docs Hub so that I can find context, specs, or decisions without asking teammates.

**Acceptance Criteria:**
- **Given** there are documents in the Docs Hub,
- **When** I navigate to Docs Hub,
- **Then** I see a list of documents with title, linked epic, author, and last updated date, sorted by most recently updated.

**Priority:** P1  
**Linked Feature:** F-10

---

**US-047**
**As a Manager**, I want to create a new document in the Docs Hub linked to an epic so that design decisions and briefs are organized by scope.

**Acceptance Criteria:**
- **Given** I am on the Docs Hub page,
- **When** I click "New Doc", give it a title, link it to an epic, and write content in the rich text editor,
- **Then** the document is saved and appears in the Docs Hub list under the linked epic.

**Priority:** P1  
**Linked Feature:** F-10

---

**US-048**
**As a Member**, I want to search documents by keyword so that I can quickly find the right brief or spec without scrolling through a long list.

**Acceptance Criteria:**
- **Given** there are documents in the Docs Hub,
- **When** I type a keyword in the Docs Hub search bar,
- **Then** results appear within 300ms matching documents by title or body content.

**Priority:** P1  
**Linked Feature:** F-10

---

**US-049**
**As a Member**, I want to access an epic's docs directly from the Epic Side Panel so that I don't have to leave the epic context to find related documents.

**Acceptance Criteria:**
- **Given** I have the Epic Side Panel open for an epic with linked documents,
- **When** I click the "Docs" tab in the panel,
- **Then** I see a list of documents linked to that epic with title, author, and last updated date.

**Priority:** P1  
**Linked Feature:** F-14, F-10

---

**US-050**
**As an Intern**, I want to read documents in the Docs Hub so that I can get context on a project without editing privileges.

**Acceptance Criteria:**
- **Given** I am logged in as Intern and there are documents in Docs Hub,
- **When** I navigate to Docs Hub and click a document,
- **Then** the document opens in read-only view. I do not see Edit or Delete buttons.

**Priority:** P0  
**Linked Feature:** F-10, BF-09

---

## 9. Task Detail

---

**US-051**
**As a Member**, I want to add subtasks to a task so that I can break down my work into smaller checkable steps.

**Acceptance Criteria:**
- **Given** I am viewing a Task Detail panel,
- **When** I click "Add Subtask" and enter a title,
- **Then** the subtask appears in the subtask checklist with an unchecked checkbox. Checking it marks it as Done.

**Priority:** P0  
**Linked Feature:** F-09

---

**US-052**
**As a Member**, I want to add comments to a task so that I can communicate updates and ask questions in context.

**Acceptance Criteria:**
- **Given** I am viewing a Task Detail panel,
- **When** I type a comment and click "Post",
- **Then** the comment appears in the comments section with my avatar, name, and timestamp.

**Priority:** P0  
**Linked Feature:** F-09

---

**US-053**
**As a Manager**, I want to see a Changelog tab on the Task Detail so that I have a full audit trail of who changed what and when.

**Acceptance Criteria:**
- **Given** I am viewing a Task Detail panel,
- **When** I click the "Changelog" tab,
- **Then** I see a list of all changes in reverse chronological order: field name, old value, new value, actor, and timestamp.

**Priority:** P1  
**Linked Feature:** F-09

---

**US-054**
**As a Member**, I want every task update to show a success or error toast so that I know whether my save worked or not.

**Acceptance Criteria:**
- **Given** I change the task status from "In Progress" to "Done",
- **When** the change is saved,
- **Then** a green "Task updated" toast appears. If it fails, a red "Failed to update task. Try again." toast appears.

**Priority:** P0  
**Linked Feature:** F-09, BF-03

---

**US-055**
**As a Manager**, I want to add a "Blocked by" dependency on a task so that the team knows this task cannot proceed until another is resolved.

**Acceptance Criteria:**
- **Given** I am viewing a Task Detail panel as Manager,
- **When** I click "Add Dependency" > "Blocked by" and search for and select another task,
- **Then** the selected task appears under "Blocked by" and the current task shows a "Blocked" indicator badge.

**Priority:** P1  
**Linked Feature:** F-16

---

**US-056**
**As a Member**, I want to be warned if I try to mark a task Done while it still has open subtasks so that I don't accidentally close out incomplete work.

**Acceptance Criteria:**
- **Given** a task has 3 incomplete subtasks,
- **When** I change the task status to "Done",
- **Then** a confirmation dialog appears: "This task has 3 incomplete subtasks. Mark Done anyway?" with Confirm and Cancel buttons.

**Priority:** P1  
**Linked Feature:** F-09

---

**US-057**
**As a Member**, I want to start a timer on a task so that my time is logged automatically while I work.

**Acceptance Criteria:**
- **Given** I am viewing a Task Detail panel,
- **When** I click "Start Timer",
- **Then** a timer begins counting up. A floating timer chip appears in the app bottom bar. Clicking "Stop" creates a time log entry.

**Priority:** P1  
**Linked Feature:** F-18

---

**US-058**
**As an Admin**, I want to manually log time on a task for a specific date so that I can back-fill time I forgot to track in real time.

**Acceptance Criteria:**
- **Given** I am in the Time Tracking section of a Task Detail,
- **When** I click "Add Manual Entry", select yesterday's date, enter 2 hours 30 minutes, and an optional note,
- **Then** the entry appears in the time log and the total logged time updates.

**Priority:** P1  
**Linked Feature:** F-18

---

**US-059**
**As a Member**, I want to be notified when a task that is blocking mine is marked Done so that I know I can proceed.

**Acceptance Criteria:**
- **Given** my task is "Blocked by" Task X,
- **When** Task X is marked Done,
- **Then** I receive a notification: "Task 'Task X' is now complete. You can proceed with '[my task title]'."

**Priority:** P1  
**Linked Feature:** F-16

---

**US-060**
**As a Member**, I want to add a task to My Day from the Task Detail panel so that I can flag it as today's priority without going to the My Work page.

**Acceptance Criteria:**
- **Given** I am viewing a Task Detail panel for a task assigned to me,
- **When** I toggle "Add to My Day",
- **Then** the task appears in My Day and the toggle shows as active.

**Priority:** P1  
**Linked Feature:** F-06, F-09

---

## 10. Global Search

---

**US-061**
**As a Member**, I want to open a search palette with ⌘K so that I can find any task, epic, or doc instantly without navigating through menus.

**Acceptance Criteria:**
- **Given** I am on any page in the application,
- **When** I press ⌘K (or Ctrl+K on Windows),
- **Then** a centered search overlay opens with an auto-focused text input.

**Priority:** P0  
**Linked Feature:** F-08

---

**US-062**
**As a Member**, I want search results to appear within 300ms and be grouped by entity type so that I can quickly identify what I'm looking for.

**Acceptance Criteria:**
- **Given** the search palette is open,
- **When** I type "redesign",
- **Then** results appear within 300ms, grouped into sections: Goals, Epics, Tasks, Docs.

**Priority:** P0  
**Linked Feature:** F-08

---

**US-063**
**As a Manager**, I want to use keyboard arrow keys to navigate search results and press Enter to open a result so that I never have to touch the mouse during search.

**Acceptance Criteria:**
- **Given** search results are shown in the palette,
- **When** I press the down arrow key,
- **Then** the first result is highlighted. Pressing down again highlights the second. Pressing Enter opens the highlighted result's detail view.

**Priority:** P0  
**Linked Feature:** F-08

---

**US-064**
**As a Member**, I want recent searches to appear when I open the search palette with an empty input so that I can quickly re-access entities I visited recently.

**Acceptance Criteria:**
- **Given** I have previously searched for "onboarding epic",
- **When** I press ⌘K without typing anything,
- **Then** "onboarding epic" appears in a "Recent" section in the palette.

**Priority:** P2  
**Linked Feature:** F-08

---

**US-065**
**As a Member**, I want the search palette to include quick-action items like "Create Task" and "Go to Dashboard" so that I can use it as a command launcher, not just for search.

**Acceptance Criteria:**
- **Given** the search palette is open with an empty input,
- **When** I look at the palette,
- **Then** I see quick-action items at the top: "Create Task", "Create Epic", "Go to Dashboard", "Go to My Work".

**Priority:** P1  
**Linked Feature:** F-08

---

## 11. AI Assistant

---

**US-066**
**As a Manager**, I want to open an AI Assistant panel from anywhere in the app so that I can get help with project tasks without navigating away.

**Acceptance Criteria:**
- **Given** I am on any page in the application,
- **When** I click the AI Assistant icon in the sidebar,
- **Then** an AI panel opens as a right-side drawer without navigating away from my current page.

**Priority:** P1  
**Linked Feature:** F-19

---

**US-067**
**As a Manager**, I want to paste meeting notes into the AI Assistant and have it generate a structured task list so that I can convert discussions into actionable items fast.

**Acceptance Criteria:**
- **Given** the AI panel is open,
- **When** I type "Generate tasks from these notes: [meeting notes]" and send,
- **Then** the assistant responds with a structured list of tasks with titles, suggested priorities, and estimated times. I can review, edit, and click "Create all tasks" to bulk-create them.

**Priority:** P1  
**Linked Feature:** F-19

---

**US-068**
**As a Manager**, I want the AI Assistant to be aware of the epic I'm currently viewing so that I don't have to re-explain the context.

**Acceptance Criteria:**
- **Given** I have the Epic Side Panel open for "Brand Refresh Sprint 3",
- **When** I open the AI panel and ask "How many tasks are still In Progress?",
- **Then** the assistant answers with the correct count for "Brand Refresh Sprint 3" without me needing to specify the epic.

**Priority:** P1  
**Linked Feature:** F-19

---

**US-069**
**As a Manager**, I want the AI Assistant to generate a weekly progress summary on demand so that I can quickly produce a report for my stakeholders.

**Acceptance Criteria:**
- **Given** the AI panel is open,
- **When** I ask "Generate a weekly summary",
- **Then** the assistant produces a written summary covering: tasks completed this week, tasks in progress, overdue items, and team highlights — based on live project data.

**Priority:** P1  
**Linked Feature:** F-19

---

**US-070**
**As an Admin**, I want the AI Assistant to proactively flag risks it detects in the project so that I catch problems that the automated risk rules might miss.

**Acceptance Criteria:**
- **Given** there is a pattern of stalled tasks in an epic (e.g., 5 tasks in Review for 5 days),
- **When** I ask "What risks do you see in the current project?",
- **Then** the assistant surfaces the stalled tasks as a risk: "5 tasks in Review have had no movement in 5 days. This could delay the epic."

**Priority:** P2  
**Linked Feature:** F-19

---

**US-071**
**As an Admin**, I want all AI-generated content to require my confirmation before being created so that the AI cannot write to the database without my approval.

**Acceptance Criteria:**
- **Given** the AI has generated a list of 5 tasks from a brief,
- **When** I review the list,
- **Then** I see a "Create all tasks" button. Nothing is created until I click it. I can also delete individual items before confirming.

**Priority:** P0  
**Linked Feature:** F-19

---

**US-072**
**As an Intern**, I want to be blocked from the AI Assistant so that I cannot accidentally generate or act on AI content without oversight.

**Acceptance Criteria:**
- **Given** I am logged in as Intern,
- **When** I try to open the AI Assistant panel,
- **Then** the panel does not appear and the AI icon is not visible in the navigation.

**Priority:** P0  
**Linked Feature:** F-19, BF-09

---

**US-073**
**As a Manager**, I want the AI Assistant to show a graceful error message when the Claude API is unavailable so that I know it's a temporary issue, not a broken app.

**Acceptance Criteria:**
- **Given** the Claude API is returning errors,
- **When** I send a message in the AI panel,
- **Then** the panel shows "AI assistant is temporarily unavailable. Try again." with a retry button. The rest of the app works normally.

**Priority:** P0  
**Linked Feature:** F-19

---

## 12. Settings & RBAC

---

**US-074**
**As an Admin**, I want to assign roles (Admin, Manager, Member, Intern) to team members so that each person's permissions are correctly enforced across the app.

**Acceptance Criteria:**
- **Given** I am on the Team Settings page as Admin,
- **When** I change a user's role from "Member" to "Manager" and save,
- **Then** the user's role updates and they gain Manager-level permissions on their next action.

**Priority:** P0  
**Linked Feature:** BF-09

---

**US-075**
**As an Admin**, I want the UI to only show Edit/Delete buttons to users with the correct role so that Members and Interns cannot accidentally trigger privileged actions.

**Acceptance Criteria:**
- **Given** I am logged in as Member and I view an epic,
- **When** the Epic Side Panel is open,
- **Then** I do not see any "Edit", "Delete", or "Change Status" buttons that are reserved for Admin/Manager.

**Priority:** P0  
**Linked Feature:** BF-09

---

**US-076**
**As an Admin**, I want role checks enforced on the API level so that even a technically savvy Member cannot bypass UI restrictions by calling APIs directly.

**Acceptance Criteria:**
- **Given** a Member calls the `DELETE /api/epic/[id]` endpoint directly via a REST client,
- **When** the server receives the request,
- **Then** the server returns a 403 Forbidden response and does not delete the epic.

**Priority:** P0  
**Linked Feature:** BF-09

---

**US-077**
**As an Admin**, I want to create Epic and Task templates so that recurring project types can be set up in seconds instead of minutes.

**Acceptance Criteria:**
- **Given** I am on the Templates page,
- **When** I click "New Template", select type "Epic", name it "Design Sprint Template", and add 5 default tasks with titles and priorities,
- **Then** the template is saved and appears in the template list and in the "Use a Template" picker when creating a new epic.

**Priority:** P1  
**Linked Feature:** F-17

---

**US-078**
**As a Manager**, I want to apply a Task Template when creating a task so that standard task types are set up consistently without manual effort.

**Acceptance Criteria:**
- **Given** there is a Task Template called "UX Review Task",
- **When** I create a new task and click "Use a Template" and select "UX Review Task",
- **Then** the task creation form is pre-filled with the template's default title pattern, subtasks, priority, and estimated time. All values remain editable.

**Priority:** P1  
**Linked Feature:** F-17

---

## 13. Notifications

---

**US-079**
**As a Member**, I want the notification bell in the header to open a panel listing my unread notifications so that I can see what needs my attention.

**Acceptance Criteria:**
- **Given** I have unread notifications,
- **When** I click the notification bell icon,
- **Then** a notification panel opens listing my unread notifications with message, timestamp, and a link to the relevant entity.

**Priority:** P0  
**Linked Feature:** BF-05

---

**US-080**
**As a Member**, I want the notification badge count on the bell to accurately reflect my unread count so that I can tell at a glance how many items need attention.

**Acceptance Criteria:**
- **Given** I have 3 unread notifications,
- **When** I look at the notification bell,
- **Then** the badge shows "3". When I read all notifications, the badge disappears.

**Priority:** P0  
**Linked Feature:** BF-05

---

**US-081**
**As a Member**, I want to mark all notifications as read in one click so that I can clear the badge quickly.

**Acceptance Criteria:**
- **Given** the notification panel is open with 5 unread items,
- **When** I click "Mark all as read",
- **Then** all items are marked read, the panel shows them in a dimmed/read state, and the badge disappears.

**Priority:** P0  
**Linked Feature:** BF-05

---

## 14. Error States & Edge Cases

---

**US-082**
**As any user**, I want to see an error toast when any save operation fails so that I know my change was not persisted and I need to try again.

**Acceptance Criteria:**
- **Given** a network error occurs while saving a task field,
- **When** the error response is received,
- **Then** a red toast appears: "Failed to save. Please try again." The field rolls back to its previous value.

**Priority:** P0  
**Linked Feature:** BF-03

---

**US-083**
**As any user**, I want to see an offline indicator banner when I lose network connectivity so that I know the app may not reflect the latest data.

**Acceptance Criteria:**
- **Given** my device loses internet connectivity while the app is open,
- **When** the app detects the connection loss,
- **Then** a banner appears at the top of the screen: "You are offline. Some features may not be available."

**Priority:** P1  
**Linked Feature:** NFR-09

---

**US-084**
**As a Member**, I want to see a 403 page when I try to access a resource I don't have permission for so that I understand why it's not loading, rather than getting a blank or broken page.

**Acceptance Criteria:**
- **Given** I am logged in as Member and I navigate to a Team Workload URL directly,
- **When** the server evaluates my role,
- **Then** I see a styled 403 "Access Denied" page with a back button, not a blank page or console error.

**Priority:** P0  
**Linked Feature:** BF-09

---

**US-085**
**As a Manager**, I want a warning when trying to create a circular task dependency so that I cannot accidentally create an unsolvable block.

**Acceptance Criteria:**
- **Given** Task A is blocked by Task B,
- **When** I try to add Task A as a blocker for Task B,
- **Then** the system rejects it with the message "Circular dependency detected. Task B is already blocked by Task A."

**Priority:** P1  
**Linked Feature:** F-16

---

**US-086**
**As a Member**, I want to see a "Page not found" message when I navigate to a non-existent URL so that I don't see a blank white screen.

**Acceptance Criteria:**
- **Given** I navigate to `/epic/99999` where epic 99999 does not exist,
- **When** the server resolves the route,
- **Then** I see a styled 404 "Page not found" page with a link back to the Dashboard.

**Priority:** P0  
**Linked Feature:** BF-01

---

**US-087**
**As an Admin**, I want the system to prevent me from starting a second timer while one is already running so that time logs stay clean.

**Acceptance Criteria:**
- **Given** I have an active timer running on Task A,
- **When** I click "Start Timer" on Task B,
- **Then** a dialog appears: "You have an active timer on 'Task A'. Stop it and start a new one?" with Confirm and Cancel.

**Priority:** P1  
**Linked Feature:** F-18

---

**US-088**
**As a Member**, I want stale My Day tasks (from previous days that weren't completed) to remain in My Day automatically so that I don't miss yesterday's unfinished work.

**Acceptance Criteria:**
- **Given** I had 2 uncompleted tasks in My Day yesterday,
- **When** I open My Day today,
- **Then** those 2 tasks are still present with a label indicating they are from the previous day.

**Priority:** P1  
**Linked Feature:** F-06

---

**US-089**
**As a Manager**, I want deleted users to appear as "[Deleted User]" in activity feeds and changelogs so that historical records remain coherent.

**Acceptance Criteria:**
- **Given** a user who made changes to a task is later deleted from the system,
- **When** I view the task's Changelog,
- **Then** entries for that user show "[Deleted User]" instead of their name.

**Priority:** P1  
**Linked Feature:** F-13, F-15

---

**US-090**
**As a Manager**, I want the Epic Side Panel to close gracefully if the epic is deleted by another user while I'm viewing it so that I don't end up in a broken state.

**Acceptance Criteria:**
- **Given** I have the Epic Side Panel open for Epic X,
- **When** another Admin deletes Epic X,
- **Then** the panel shows "This epic no longer exists" with a close button. Clicking close returns me to the Epic list.

**Priority:** P1  
**Linked Feature:** F-14

---

*End of User Stories Document*  
*Total stories: 90 across 14 sections, covering all 4 roles (Admin, Manager, Member, Intern)*
