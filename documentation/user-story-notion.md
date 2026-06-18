# User Stories
**Elux Project Tracker — Revamp**
Version 1.0 · 2026-06-17 · 90 stories · 4 roles: Admin · Manager · Member · Intern

---

> **Priority:** 🔴 P0 = must have for launch · 🟡 P1 = should have · ⚪ P2 = nice to have

---

## 1. Dashboard

### US-001
**Role:** Admin · **Priority:** 🔴 P0

As an **Admin**, I want to see a helicopter-view of all active projects on the Dashboard so that I can quickly assess overall project health without navigating into each project.

**Acceptance Criteria:**
- Given I am logged in as Admin and there are active projects
- When I navigate to the Dashboard
- Then I see a card for each project showing: project name, total tasks, overdue tasks, completion %, and current risk level

---

### US-002
**Role:** Manager · **Priority:** 🔴 P0

As a **Manager**, I want the Dashboard metrics to be consistent with what I see on the Board so that I can trust the numbers I report to stakeholders.

**Acceptance Criteria:**
- Given I am viewing the Dashboard and the Board for the same project
- When I compare the task counts
- Then the total task count on the Dashboard matches the Board with no filters applied

---

### US-003
**Role:** Manager · **Priority:** 🔴 P0

As a **Manager**, I want to see a Critical Issues widget on the Dashboard so that I can immediately identify tasks blocking progress without digging through the Board.

**Acceptance Criteria:**
- Given there are overdue or critical-priority tasks in any project
- When I view the Dashboard
- Then the Critical Issues widget shows up to 10 items sorted by due date, each with task title, epic name, assignee, and overdue indicator

---

### US-004
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want to see an Activity Feed on the Dashboard so that I can catch up on what my teammates did while I was away.

**Acceptance Criteria:**
- Given team members have been active on tasks and epics
- When I open the Dashboard
- Then the Activity Feed shows the 20 most recent actions with actor name, action description, entity link, and relative timestamp

---

### US-005
**Role:** Intern · **Priority:** 🔴 P0

As an **Intern**, I want to see only projects I am assigned to on the Dashboard so that I am not overwhelmed by irrelevant projects.

**Acceptance Criteria:**
- Given I am logged in as Intern and I am assigned to 2 out of 5 projects
- When I view the Dashboard
- Then I see only the 2 projects I am assigned to

---

### US-006
**Role:** Admin · **Priority:** 🟡 P1

As an **Admin**, I want the Dashboard to show an empty state with a CTA when no projects exist so that new workspace setups guide users to create their first project.

**Acceptance Criteria:**
- Given no projects exist in the workspace
- When I open the Dashboard
- Then I see an empty state with "Create your first project" and a button to do so

---

### US-007
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want to click a metric on the Dashboard (e.g., "8 overdue tasks") and be taken to a filtered Board view so that I can act on that data immediately.

**Acceptance Criteria:**
- Given I see "8 overdue tasks" on a project card
- When I click that number
- Then I am taken to the Board filtered by overdue status for that project

---

## 2. Goals

### US-008
**Role:** Admin · **Priority:** 🔴 P0

As an **Admin**, I want to create a Goal with a title, description, target date, and KPIs so that the team has a clear strategic objective to work toward.

**Acceptance Criteria:**
- Given I am on the Goals page
- When I click "Create Goal", fill in all fields, and submit
- Then the goal appears in the list and I see a "Goal created" success toast

---

### US-009
**Role:** Manager · **Priority:** 🔴 P0

As a **Manager**, I want to add KPIs to a Goal from the Goal Detail page so that I can define measurable success criteria after the goal is created.

**Acceptance Criteria:**
- Given I am viewing a Goal Detail page as Manager
- When I click "Add KPI" and enter KPI name, target value, current value, and unit
- Then the KPI appears in the KPI table

---

### US-010
**Role:** Manager · **Priority:** 🔴 P0

As a **Manager**, I want to link an Epic to a Goal so that the goal's progress is automatically derived from the linked epics' task completion.

**Acceptance Criteria:**
- Given I am on the Goal Detail page and there are existing epics
- When I click "Link Epic" and select an epic
- Then the epic appears in the linked epics list and the goal's progress bar updates

---

### US-011
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want to view Goals and their progress so that I understand how my tasks contribute to the company's strategic objectives.

**Acceptance Criteria:**
- Given I am logged in as Member
- When I navigate to the Goals page
- Then I can see all goals with progress bars, KPI summaries, and linked epic counts — but no Create, Edit, or Delete buttons

---

### US-012
**Role:** Admin · **Priority:** 🔴 P0

As an **Admin**, I want Goal progress to update automatically when linked epic tasks are completed so that I don't have to manually recalculate percentages.

**Acceptance Criteria:**
- Given a Goal is linked to an Epic
- When a task in that Epic is marked Done
- Then the Goal's progress % updates within 5 seconds without a manual refresh

---

### US-013
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want to filter goals by status and owner so that I can quickly find goals at risk or owned by a specific person.

**Acceptance Criteria:**
- Given I am on the Goals page with multiple goals
- When I apply filter for status = "At Risk" and owner = "Rini"
- Then only goals matching both conditions are shown

---

## 3. Epics

### US-014
**Role:** Admin · **Priority:** 🔴 P0

As an **Admin**, I want to create an Epic with a title, description, due date, and assigned team members so that I can scope a body of work for my team.

**Acceptance Criteria:**
- Given I am on the Epics page
- When I click "Create Epic", fill in all required fields, and submit
- Then the epic appears in the list with correct data and an "Epic created" success toast

---

### US-015
**Role:** Manager · **Priority:** 🔴 P0

As a **Manager**, I want the Epic's status to automatically change to "Done" when all tasks are marked complete so that I don't have to update it manually.

**Acceptance Criteria:**
- Given an Epic has 5 tasks all in "Done" status
- When the last task is marked Done
- Then the Epic's status badge updates to "Done" within 2 seconds

---

### US-016
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to click an epic row and have a side panel slide in from the right so that I can see epic details without losing my place in the list.

**Acceptance Criteria:**
- Given I am on the Epics list page
- When I click an epic row
- Then a side panel slides in from the right showing: title, description, status, risk, progress, and assignees

---

### US-017
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to navigate to an epic via a direct URL (/epic/123) so that I can share a link with a teammate.

**Acceptance Criteria:**
- Given I have the URL `/epic/123` for an existing epic
- When I paste the URL in a browser and press Enter
- Then the epic detail view loads correctly with a 200 status, not a 404

---

### US-018
**Role:** Manager · **Priority:** 🔴 P0

As a **Manager**, I want to see the risk level badge on each epic row so that I can prioritize which epics need attention at a glance.

**Acceptance Criteria:**
- Given I am on the Epics list
- When an epic has overdue tasks
- Then a red "HIGH" risk badge is visible on that epic's row

---

### US-019
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want to see the Changelog tab in the Epic Side Panel so that I understand what changed, when, and who made the change.

**Acceptance Criteria:**
- Given I am viewing an Epic Side Panel
- When I click the "Changelog" tab
- Then I see a chronological list: event type, actor name, old value, new value, timestamp

---

### US-020
**Role:** Intern · **Priority:** 🔴 P0

As an **Intern**, I want to view epics but not see Edit or Delete buttons so that I cannot accidentally modify work I'm not responsible for.

**Acceptance Criteria:**
- Given I am logged in as Intern and viewing the Epics list
- When I hover over an epic row
- Then no Edit or Delete action is visible

---

### US-021
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want to manually override an epic's risk level with a reason so that I can flag a risk the automated rules haven't caught.

**Acceptance Criteria:**
- Given I am viewing an Epic Side Panel as Manager
- When I click the risk badge, select "Override to HIGH", and enter a reason
- Then the risk badge updates to HIGH and the reason appears in the badge tooltip

---

## 4. Board / Kanban

### US-022
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to see all tasks in four Kanban columns (To Do, In Progress, Review, Done) so that I can get an instant visual overview of work status.

**Acceptance Criteria:**
- Given I am on the Board page
- When the page loads
- Then I see four columns with task count in each column header

---

### US-023
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to drag a task card from one column to another so that I can update its status without opening the task detail.

**Acceptance Criteria:**
- Given I have a task in "In Progress"
- When I drag it to "Review"
- Then the task moves to "Review", column counts update, and the change persists after refresh

---

### US-024
**Role:** Manager · **Priority:** 🔴 P0

As a **Manager**, I want to create a task directly from the Board page so that I don't have to navigate away when I think of a new task.

**Acceptance Criteria:**
- Given I am on the Board page
- When I click "Create Task" in the header or "+ Add Task" at the bottom of a column
- Then a task creation modal opens, with status pre-set to that column

---

### US-025
**Role:** Manager · **Priority:** 🔴 P0

As a **Manager**, I want to filter the Board by assignee and priority so that I can focus on a specific person's work or on critical tasks only.

**Acceptance Criteria:**
- Given I am on the Board
- When I select Assignee = "Dio" and Priority = "High"
- Then only Dio's High priority tasks are shown across all columns

---

### US-026
**Role:** Admin · **Priority:** 🔴 P0

As an **Admin**, I want the Board to load without 503 errors even with 200+ tasks so that the team can always access the board.

**Acceptance Criteria:**
- Given there are 300 tasks across all columns
- When I navigate to the Board
- Then the page loads without 503 errors, showing first 50 tasks per column with a "Load more" button

---

### US-027
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want empty columns to show a clear empty state with a "+" icon so that I know I can add a task there.

**Acceptance Criteria:**
- Given the "Review" column has no tasks
- When I view the Board
- Then the "Review" column shows an empty state with a "+" icon

---

### US-028
**Role:** Intern · **Priority:** 🔴 P0

As an **Intern**, I want to view the Board but not be able to drag cards between columns so that I cannot accidentally change task statuses.

**Acceptance Criteria:**
- Given I am logged in as Intern
- When I try to drag a card on the Board
- Then the drag action is disabled and cards do not move

---

### US-029
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to navigate to a task via direct URL (/task/[id]) so that I can share a task link and have the recipient land on the correct page.

**Acceptance Criteria:**
- Given I have the URL `/task/456` for an existing task
- When I open it in a browser
- Then the task detail view loads correctly, not a 404

---

## 5. My Work

### US-030
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to see only my assigned tasks grouped by status on My Work so that I have a personal to-do view without the noise of the full board.

**Acceptance Criteria:**
- Given I have tasks in To Do, In Progress, and Review
- When I navigate to My Work
- Then I see three sections with only my tasks. Done section is collapsed by default.

---

### US-031
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want to collapse and expand status sections in My Work so that I can reduce visual noise when focused on a specific group.

**Acceptance Criteria:**
- Given I am on the My Work page
- When I click a section header (e.g., "To Do (4)")
- Then the section collapses/expands. State is preserved after page refresh.

---

### US-032
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to change a task's status directly from the My Work row so that I can update quickly without opening Task Detail.

**Acceptance Criteria:**
- Given I have a task in "In Progress"
- When I click the status badge on the row and select "Review"
- Then the task moves to the "Review" section and a success toast confirms the update

---

### US-033
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want tasks with past due dates highlighted in red in My Work so that I can immediately spot what I'm late on.

**Acceptance Criteria:**
- Given I have tasks where the due date is yesterday or earlier and status is not Done
- When I view My Work
- Then those tasks' due dates are rendered in red

---

### US-034
**Role:** Intern · **Priority:** 🔴 P0

As an **Intern**, I want to view My Work in read-only mode so that I can see what's assigned to me but changes must go through a manager.

**Acceptance Criteria:**
- Given I am logged in as Intern
- When I view My Work
- Then there are no inline status dropdowns or action menus — I can only click tasks to view detail

---

## 6. My Day

### US-035
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to see only today's priority tasks in My Day so that I can start each morning with a clear, focused plan.

**Acceptance Criteria:**
- Given I have tasks due today and tasks I've manually added to My Day
- When I navigate to My Day
- Then I see all tasks due today plus manually added ones. Tasks from other days are not shown.

---

### US-036
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to add any assigned task to My Day from My Work so that I can curate my daily focus list.

**Acceptance Criteria:**
- Given I have a task in My Work that is not due today
- When I right-click the task row and select "Add to My Day"
- Then the task appears in My Day immediately

---

### US-037
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want to see a progress indicator on My Day (e.g., "3/7 done today") so that I have a sense of momentum during the day.

**Acceptance Criteria:**
- Given I have 7 tasks in My Day and I complete 3
- When I view My Day
- Then the header shows "3/7 done today" and updates each time I mark a task Done

---

### US-038
**Role:** Member · **Priority:** ⚪ P2

As a **Member**, I want to see a celebration animation when I complete all My Day tasks so that finishing feels rewarding.

**Acceptance Criteria:**
- Given I have tasks in My Day
- When I mark the last task Done
- Then a confetti animation plays and the page shows "All done for today! Great work."

---

### US-039
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want My Day tasks to persist across page reloads so that refreshing the browser doesn't reset my daily focus list.

**Acceptance Criteria:**
- Given I have added tasks to My Day
- When I refresh the browser
- Then all the same tasks are still in My Day

---

## 7. Team Workload

### US-040
**Role:** Manager · **Priority:** 🔴 P0

As a **Manager**, I want to see all team members' task loads across all statuses so that I can identify imbalances and redistribute work.

**Acceptance Criteria:**
- Given I am on the Team Workload page
- When the page loads
- Then I see each team member with a stacked bar chart showing task count across To Do, In Progress, Review, and Done

---

### US-041
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want overloaded team members to be visually highlighted so that I know who to prioritize when redistributing tasks.

**Acceptance Criteria:**
- Given a team member has more than 5 tasks In Progress
- When I view Team Workload
- Then that member's row has an amber warning indicator

---

### US-042
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want to expand a team member's row to see their tasks grouped by epic so that I understand the context of their workload.

**Acceptance Criteria:**
- Given I am on Team Workload
- When I click a member row to expand it
- Then the row expands inline showing tasks grouped by epic, with task title, priority, and due date

---

### US-043
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want to reassign a task directly from the Team Workload view so that I can redistribute work without navigating to the task detail.

**Acceptance Criteria:**
- Given I have expanded a team member's row
- When I click a task and select a new assignee
- Then the task moves to the new assignee's row and a success toast confirms the change

---

### US-044
**Role:** Admin · **Priority:** 🟡 P1

As an **Admin**, I want to filter Team Workload by project so that I can see workload distribution within a specific project only.

**Acceptance Criteria:**
- Given I am on Team Workload
- When I select Project = "Brand Refresh"
- Then only tasks from that project count toward each member's workload bar

---

### US-045
**Role:** Intern · **Priority:** 🔴 P0

As an **Intern**, I want to be blocked from accessing Team Workload so that sensitive capacity data is not visible to me.

**Acceptance Criteria:**
- Given I am logged in as Intern
- When I try to navigate to Team Workload
- Then I see a 403 "Access denied" page, not the workload data

---

## 8. Docs Hub

### US-046
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want to browse all project documentation in Docs Hub so that I can find context, specs, or decisions without asking teammates.

**Acceptance Criteria:**
- Given there are documents in the Docs Hub
- When I navigate to Docs Hub
- Then I see a list of documents with title, linked epic, author, and last updated date

---

### US-047
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want to create a new document in Docs Hub linked to an epic so that design decisions and briefs are organized by scope.

**Acceptance Criteria:**
- Given I am on the Docs Hub page
- When I click "New Doc", give it a title, link it to an epic, and write content
- Then the document is saved and appears in the Docs Hub list under the linked epic

---

### US-048
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want to search documents by keyword so that I can quickly find the right brief or spec.

**Acceptance Criteria:**
- Given there are documents in Docs Hub
- When I type a keyword in the search bar
- Then results appear within 300ms matching documents by title or body content

---

### US-049
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want to access an epic's docs from the Epic Side Panel so that I don't have to leave the epic context to find related documents.

**Acceptance Criteria:**
- Given the Epic Side Panel is open for an epic with linked documents
- When I click the "Docs" tab
- Then I see a list of documents linked to that epic with title, author, and last updated date

---

### US-050
**Role:** Intern · **Priority:** 🔴 P0

As an **Intern**, I want to read documents in Docs Hub so that I can get context on a project without editing privileges.

**Acceptance Criteria:**
- Given I am logged in as Intern
- When I navigate to Docs Hub and click a document
- Then the document opens in read-only view. No Edit or Delete buttons are visible.

---

## 9. Task Detail

### US-051
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to add subtasks to a task so that I can break down my work into smaller checkable steps.

**Acceptance Criteria:**
- Given I am viewing a Task Detail panel
- When I click "Add Subtask" and enter a title
- Then the subtask appears in the checklist with an unchecked checkbox

---

### US-052
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to add comments to a task so that I can communicate updates and ask questions in context.

**Acceptance Criteria:**
- Given I am viewing a Task Detail panel
- When I type a comment and click "Post"
- Then the comment appears with my avatar, name, and timestamp

---

### US-053
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want to see a Changelog tab on Task Detail so that I have a full audit trail of who changed what and when.

**Acceptance Criteria:**
- Given I am viewing a Task Detail panel
- When I click the "Changelog" tab
- Then I see all changes in reverse chronological order: field name, old value, new value, actor, timestamp

---

### US-054
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want every task update to show a success or error toast so that I know whether my save worked or not.

**Acceptance Criteria:**
- Given I change the task status
- When the change is saved
- Then a green "Task updated" toast appears. If it fails, a red "Failed to update. Try again." toast appears.

---

### US-055
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want to add a "Blocked by" dependency on a task so that the team knows this task cannot proceed until another is resolved.

**Acceptance Criteria:**
- Given I am viewing a Task Detail panel as Manager
- When I click "Add Dependency" → "Blocked by" and select another task
- Then the selected task appears under "Blocked by" and the current task shows a "Blocked" badge

---

### US-056
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want to be warned if I try to mark a task Done while it still has open subtasks so that I don't accidentally close incomplete work.

**Acceptance Criteria:**
- Given a task has 3 incomplete subtasks
- When I change the task status to "Done"
- Then a dialog appears: "This task has 3 incomplete subtasks. Mark Done anyway?" with Confirm and Cancel

---

### US-057
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want to start a timer on a task so that my time is logged automatically while I work.

**Acceptance Criteria:**
- Given I am viewing a Task Detail panel
- When I click "Start Timer"
- Then a timer begins counting up. A floating timer chip appears in the app bottom bar. Clicking "Stop" creates a time log entry.

---

### US-058
**Role:** Admin · **Priority:** 🟡 P1

As an **Admin**, I want to manually log time on a task for a specific date so that I can back-fill time I forgot to track.

**Acceptance Criteria:**
- Given I am in the Time Tracking section of a Task Detail
- When I click "Add Manual Entry", select a date, enter duration, and an optional note
- Then the entry appears in the time log and total logged time updates

---

### US-059
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want to be notified when a task blocking mine is marked Done so that I know I can proceed.

**Acceptance Criteria:**
- Given my task is "Blocked by" Task X
- When Task X is marked Done
- Then I receive a notification: "Task X is now complete. You can proceed with [my task title]."

---

### US-060
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want to add a task to My Day from the Task Detail panel so that I can flag it as today's priority without going to My Work.

**Acceptance Criteria:**
- Given I am viewing a Task Detail for a task assigned to me
- When I toggle "Add to My Day"
- Then the task appears in My Day and the toggle shows as active

---

## 10. Global Search

### US-061
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to open a search palette with ⌘K so that I can find any task, epic, or doc instantly.

**Acceptance Criteria:**
- Given I am on any page in the application
- When I press ⌘K (or Ctrl+K on Windows)
- Then a centered search overlay opens with an auto-focused text input

---

### US-062
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want search results to appear within 300ms and be grouped by entity type so that I can quickly identify what I'm looking for.

**Acceptance Criteria:**
- Given the search palette is open
- When I type "redesign"
- Then results appear within 300ms, grouped into: Goals, Epics, Tasks, Docs

---

### US-063
**Role:** Manager · **Priority:** 🔴 P0

As a **Manager**, I want to use keyboard arrow keys to navigate results and press Enter to open one so that I never have to touch the mouse during search.

**Acceptance Criteria:**
- Given search results are shown
- When I press the down arrow key
- Then the first result highlights. Pressing Enter opens it.

---

### US-064
**Role:** Member · **Priority:** ⚪ P2

As a **Member**, I want recent searches to appear when I open the palette with an empty input so that I can quickly re-access recent entities.

**Acceptance Criteria:**
- Given I have previously searched for "onboarding epic"
- When I press ⌘K without typing
- Then "onboarding epic" appears in a "Recent" section

---

### US-065
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want the search palette to include quick-action items like "Create Task" and "Go to Dashboard" so that I can use it as a command launcher.

**Acceptance Criteria:**
- Given the search palette is open with an empty input
- When I look at the palette
- Then I see quick-action items at the top: Create Task, Create Epic, Go to Dashboard, Go to My Work

---

## 11. AI Assistant

### US-066
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want to open an AI Assistant panel from anywhere in the app so that I can get help without navigating away.

**Acceptance Criteria:**
- Given I am on any page
- When I click the AI Assistant icon in the sidebar
- Then an AI panel opens as a right-side drawer without leaving my current page

---

### US-067
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want to paste meeting notes into the AI Assistant and have it generate a structured task list so that I can convert discussions into actionable items fast.

**Acceptance Criteria:**
- Given the AI panel is open
- When I type "Generate tasks from these notes: [meeting notes]" and send
- Then the assistant responds with a task list with titles, priorities, and estimated times. I can review, edit, and click "Create all tasks" to bulk-create them.

---

### US-068
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want the AI Assistant to be aware of the epic I'm currently viewing so that I don't have to re-explain the context.

**Acceptance Criteria:**
- Given I have the Epic Side Panel open for "Brand Refresh Sprint 3"
- When I open the AI panel and ask "How many tasks are still In Progress?"
- Then the assistant answers with the correct count for that epic without me needing to specify it

---

### US-069
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want the AI Assistant to generate a weekly progress summary on demand so that I can quickly produce a report for stakeholders.

**Acceptance Criteria:**
- Given the AI panel is open
- When I ask "Generate a weekly summary"
- Then the assistant produces a summary covering: tasks completed this week, tasks in progress, overdue items, and team highlights

---

### US-070
**Role:** Admin · **Priority:** ⚪ P2

As an **Admin**, I want the AI Assistant to proactively flag risks it detects so that I catch problems the automated rules might miss.

**Acceptance Criteria:**
- Given there is a pattern of stalled tasks (e.g., 5 tasks in Review for 5+ days)
- When I ask "What risks do you see?"
- Then the assistant surfaces the stalled tasks as a risk with an explanation

---

### US-071
**Role:** Admin · **Priority:** 🔴 P0

As an **Admin**, I want all AI-generated content to require my confirmation before being created so that the AI cannot write to the database without my approval.

**Acceptance Criteria:**
- Given the AI has generated a list of 5 tasks from a brief
- When I review the list
- Then I see a "Create all tasks" button. Nothing is created until I click it. I can delete individual items before confirming.

---

### US-072
**Role:** Intern · **Priority:** 🔴 P0

As an **Intern**, I want to be blocked from the AI Assistant so that I cannot generate or act on AI content without oversight.

**Acceptance Criteria:**
- Given I am logged in as Intern
- When I try to open the AI Assistant panel
- Then the panel does not appear and the AI icon is not visible in the navigation

---

### US-073
**Role:** Manager · **Priority:** 🔴 P0

As a **Manager**, I want the AI Assistant to show a graceful error when the API is unavailable so that I know it's a temporary issue, not a broken app.

**Acceptance Criteria:**
- Given the Claude API is returning errors
- When I send a message in the AI panel
- Then the panel shows "AI assistant is temporarily unavailable. Try again." with a retry button. The rest of the app works normally.

---

## 12. Settings & RBAC

### US-074
**Role:** Admin · **Priority:** 🔴 P0

As an **Admin**, I want to assign roles to team members so that each person's permissions are correctly enforced across the app.

**Acceptance Criteria:**
- Given I am on the Team Settings page as Admin
- When I change a user's role from "Member" to "Manager" and save
- Then the user gains Manager-level permissions on their next action

---

### US-075
**Role:** Admin · **Priority:** 🔴 P0

As an **Admin**, I want the UI to only show Edit/Delete buttons to users with the correct role so that Members and Interns cannot trigger privileged actions.

**Acceptance Criteria:**
- Given I am logged in as Member and I view an epic
- When the Epic Side Panel is open
- Then I do not see any Edit, Delete, or Change Status buttons reserved for Admin/Manager

---

### US-076
**Role:** Admin · **Priority:** 🔴 P0

As an **Admin**, I want role checks enforced at the API level so that a Member cannot bypass UI restrictions by calling APIs directly.

**Acceptance Criteria:**
- Given a Member calls DELETE /api/epic/[id] via a REST client
- When the server receives the request
- Then the server returns 403 Forbidden and does not delete the epic

---

### US-077
**Role:** Admin · **Priority:** 🟡 P1

As an **Admin**, I want to create Epic and Task templates so that recurring project types can be set up in seconds.

**Acceptance Criteria:**
- Given I am on the Templates page
- When I click "New Template", name it, and add 5 default tasks with priorities
- Then the template is saved and appears in the "Use a Template" picker when creating a new epic

---

### US-078
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want to apply a Task Template when creating a task so that standard task types are set up consistently.

**Acceptance Criteria:**
- Given there is a Task Template called "UX Review Task"
- When I create a new task and select "Use a Template" → "UX Review Task"
- Then the form is pre-filled with the template's defaults. All values remain editable.

---

## 13. Notifications

### US-079
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want the notification bell to open a panel listing my unread notifications so that I can see what needs my attention.

**Acceptance Criteria:**
- Given I have unread notifications
- When I click the notification bell icon
- Then a panel opens listing notifications with message, timestamp, and a link to the relevant entity

---

### US-080
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want the notification badge count to accurately reflect my unread count so that I can tell at a glance how many items need attention.

**Acceptance Criteria:**
- Given I have 3 unread notifications
- When I look at the notification bell
- Then the badge shows "3". When I read all notifications, the badge disappears.

---

### US-081
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to mark all notifications as read in one click so that I can clear the badge quickly.

**Acceptance Criteria:**
- Given the notification panel is open with 5 unread items
- When I click "Mark all as read"
- Then all items are marked read and the badge disappears

---

## 14. Error States & Edge Cases

### US-082
**Role:** Any user · **Priority:** 🔴 P0

As **any user**, I want to see an error toast when any save operation fails so that I know my change was not persisted.

**Acceptance Criteria:**
- Given a network error occurs while saving
- When the error response is received
- Then a red toast appears: "Failed to save. Please try again." The field rolls back to its previous value.

---

### US-083
**Role:** Any user · **Priority:** 🟡 P1

As **any user**, I want to see an offline indicator banner when I lose network connectivity so that I know the app may not reflect the latest data.

**Acceptance Criteria:**
- Given my device loses internet while the app is open
- When the app detects the connection loss
- Then a banner appears: "You are offline. Some features may not be available."

---

### US-084
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to see a 403 page when I try to access a resource I don't have permission for so that I understand why it's not loading.

**Acceptance Criteria:**
- Given I am logged in as Member and navigate to Team Workload URL directly
- When the server evaluates my role
- Then I see a styled 403 "Access Denied" page with a back button, not a blank page

---

### US-085
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want a warning when creating a circular task dependency so that I cannot create an unsolvable block.

**Acceptance Criteria:**
- Given Task A is blocked by Task B
- When I try to add Task A as a blocker for Task B
- Then the system rejects it: "Circular dependency detected. Task B is already blocked by Task A."

---

### US-086
**Role:** Member · **Priority:** 🔴 P0

As a **Member**, I want to see a "Page not found" message when navigating to a non-existent URL so that I don't see a blank white screen.

**Acceptance Criteria:**
- Given I navigate to `/epic/99999` where that epic does not exist
- When the server resolves the route
- Then I see a styled 404 "Page not found" page with a link back to Dashboard

---

### US-087
**Role:** Admin · **Priority:** 🟡 P1

As an **Admin**, I want the system to prevent me from starting a second timer while one is already running so that time logs stay clean.

**Acceptance Criteria:**
- Given I have an active timer running on Task A
- When I click "Start Timer" on Task B
- Then a dialog appears: "You have an active timer on 'Task A'. Stop it and start a new one?"

---

### US-088
**Role:** Member · **Priority:** 🟡 P1

As a **Member**, I want stale My Day tasks from previous days to remain so that I don't miss yesterday's unfinished work.

**Acceptance Criteria:**
- Given I had 2 uncompleted tasks in My Day yesterday
- When I open My Day today
- Then those 2 tasks are still present with a label indicating they are from the previous day

---

### US-089
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want deleted users to appear as "[Deleted User]" in activity feeds and changelogs so that historical records stay coherent.

**Acceptance Criteria:**
- Given a user who made changes is later deleted
- When I view the task's Changelog
- Then entries for that user show "[Deleted User]" instead of their name

---

### US-090
**Role:** Manager · **Priority:** 🟡 P1

As a **Manager**, I want the Epic Side Panel to close gracefully if the epic is deleted by another user while I'm viewing it so that I don't end up in a broken state.

**Acceptance Criteria:**
- Given I have the Epic Side Panel open for Epic X
- When another Admin deletes Epic X
- Then the panel shows "This epic no longer exists" with a close button. Clicking close returns me to the Epic list.

---

*90 stories · 14 sections · 4 roles (Admin · Manager · Member · Intern)*
