# Elux Project Tracker — Wireframe Specifications

**Version:** 1.0
**Project:** Elux Project Tracker Revamp
**Last updated:** 2026-06-17

Reference aesthetic: Linear (speed, density, keyboard-first), Vercel Dashboard (immediate orientation), Superlist (My Work calm), Craft.do (Docs hierarchy).

---

## Layout Conventions Used in This Document

```
[ label ]        = clickable element / button
[ label ▾ ]      = dropdown trigger
< text >         = text content / label
{ ... }          = dynamic / variable content
│                = vertical border / divider
─────            = horizontal divider
▓▓▓░░░           = progress bar (filled / empty)
●                = avatar / dot indicator
↓                = collapsed section
→                = navigation / click action
```

---

## 1. App Shell

The outermost layout wrapping all pages.

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  SIDEBAR (240px, fixed)   │   MAIN AREA (flex-1, scrollable)       │
│                           │                                          │
│  ┌─────────────────────┐  │  ┌──────────────────────────────────┐  │
│  │ WORKSPACE HEADER    │  │  │ PAGE HEADER (sticky, 48px)        │  │
│  │ [Elux ▾]        ⚙  │  │  │ < Page Title >  [actions...]      │  │
│  └─────────────────────┘  │  └──────────────────────────────────┘  │
│                           │                                          │
│  NAV                      │  PAGE CONTENT AREA                      │
│  [ ◻ Dashboard       ]   │  (padding: 32px horizontal, 24px top)   │
│  [ ⊙ Goals           ]   │                                          │
│  [ ⚡ Epics          ]   │                                          │
│  [ ⊞ Board           ]   │                                          │
│  [ ✓ My Work         ]   │                                          │
│  [ ☀ My Day          ]   │                                          │
│  [ ◍ Team Workload   ]   │                                          │
│  [ ⊟ Docs Hub        ]   │                                          │
│                           │                                          │
│  ─────────────────────    │                                          │
│                           │                                          │
│  PROJECTS  [ + ]          │                                          │
│  [● Alpha Project    ]   │                                          │
│  [● Beta Launch      ]   │                                          │
│  [● Internal Tools   ]   │                                          │
│                           │                                          │
│  ─────────────────────    │                                          │
│                           │                                          │
│  [● Rasya         ⚙ ]   │                                          │
└─────────────────────────────────────────────────────────────────────┘
```

**Global elements overlaid:**
- Command palette (⌘K) — fixed center top, z-50
- AI Assistant panel — fixed right, z-40
- Notification panel — fixed right, z-40 (slides over content)
- Toast stack — fixed bottom-right, z-200

### Interactions

| Trigger                          | Action                                               |
|----------------------------------|------------------------------------------------------|
| Click nav item                   | Navigate to that page, highlight active              |
| ⌘K anywhere                      | Open command palette                                 |
| Click workspace name             | Open workspace switcher dropdown                     |
| Click ⚙ (bottom)                | Navigate to Settings                                 |
| Click project name               | Navigate to that project's Epics list                |
| Click [ + ] next to Projects     | Open "New Project" modal                             |
| Click Bell icon (page header)    | Open notification panel (slide from right)           |
| Click Sparkle icon (page header) | Open AI Assistant panel (slide from right)           |

### Responsive Consideration

Mobile (< 768px): sidebar collapses to 0px width with a slide-in hamburger trigger. Bottom navigation bar appears with 5 primary icons: Dashboard, My Work, Board, Search, Profile.

---

## 2. Dashboard

### Purpose

Helicopter view. First load should answer: What's behind? What's at risk? Where do I need to act?

### Layout

```
PAGE HEADER
[ ◻ Dashboard ]                          [ + New ]  [🔔 3]  [✦ AI]

────────────────────────────────────────────────────────────────────

STAT CARDS ROW (4 cards, equal width, gap: 16px)
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Open Tasks  │  │ At Risk     │  │ Due This Wk │  │ Completed   │
│             │  │             │  │             │  │             │
│   < 42 >    │  │   < 7 >     │  │   < 11 >    │  │   < 28 >    │
│             │  │             │  │             │  │             │
│ ↑3 vs last  │  │ ● HIGH: 2   │  │ → 4 overdue │  │ ↑5 vs last  │
│ week        │  │ ● MED: 5    │  │             │  │ week        │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘

────────────────────────────────────────────────────────────────────

PROJECTS SECTION HEADER
< Projects >   (showing 3)                       [ View all ] [ + ]

PROJECT CARDS GRID (2-column, or 3-column on wide screens)
┌──────────────────────────────┐  ┌──────────────────────────────┐
│ ● Alpha Project   [AT RISK]  │  │ ● Beta Launch  [ON TRACK]    │
│ Redesigning core product UX  │  │ Public launch milestone Q3   │
│ ▓▓▓▓▓▓▓░░░  62%  Sprint 3   │  │ ▓▓▓▓▓▓▓▓░░  78%  Sprint 5   │
│ 14 open  ●●● +2              │  │ 9 open   ●●                  │
│ Due: Aug 30  [DELAYED]       │  │ Due: Jul 15  [ON TRACK]      │
└──────────────────────────────┘  └──────────────────────────────┘
┌──────────────────────────────┐
│ ● Internal Tools [NOT STARTED│
│ Tracker revamp, design sys.  │
│ ░░░░░░░░░░  0%               │
│ 0 open                       │
│ Start: Jun 20                │
└──────────────────────────────┘

────────────────────────────────────────────────────────────────────

TWO-COLUMN: CRITICAL ISSUES (left, ~60%) │ RECENT ACTIVITY (right, ~40%)

CRITICAL ISSUES                           │ RECENT ACTIVITY
< Items needing attention >               │
                                          │ Today
┌─────────────────────────────────┐       │ ● Rasya moved "Login flow"
│ [HIGH] Auth redesign — Late 3d  │       │   → In Review  · 10m ago
│ Alpha Project · Assigned: Dito  │       │
│ [OVERDUE] [Go →]               │       │ ● Maya created Epic
└─────────────────────────────────┘       │   "Analytics v2" · 1h ago
┌─────────────────────────────────┐       │
│ [HIGH] API rate limit spec      │       │ ● Dito completed
│ Beta Launch · Unassigned        │       │   "DB schema review" · 2h ago
│ [AT RISK] [Go →]               │       │
└─────────────────────────────────┘       │ Yesterday
┌─────────────────────────────────┐       │ ● Rasya added comment on
│ [MED] Onboarding copy TBD      │       │   "Figma export spec"
│ Internal Tools · Assigned: Rara │       │
│ [NOT STARTED] [Go →]           │       │ ● System: Sprint 4 ended
└─────────────────────────────────┘       │
                                          │ [ Load more ]
[ View all critical issues ]              │
```

### Interactions

| Trigger                         | Action                                     |
|---------------------------------|--------------------------------------------|
| Click stat card                 | Navigate to filtered task list for that stat |
| Click project card              | Navigate to that project's Epics list      |
| Click critical issue row        | Open task detail (side panel or full page) |
| Click activity item             | Navigate to relevant task/epic             |
| Click [ + New ]                 | Open quick-create dropdown (task / epic / goal / project) |

### Empty State

When no projects exist:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│         ◻  No projects yet                     │
│                                                 │
│   Create your first project to get started.    │
│                                                 │
│          [ + Create Project ]                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Loading State

Stat cards: 4 skeleton rectangles (same card dimensions, animated shimmer).
Project cards: 2 skeleton cards.
Critical issues: 3 skeleton rows.

### Error State

If data fetch fails: inline error banner at top of content area:
```
⚠ Could not load dashboard data. [ Retry ]
```

---

## 3. Goals List

### Layout

```
PAGE HEADER
< Goals >                              [ + New Goal ]  [🔔]  [✦]

FILTER BAR
[ All ▾ ]  [ Status ▾ ]  [ Owner ▾ ]  [ Quarter ▾ ]   [⌕ Search goals]

GOALS LIST (vertical stack, gap: 8px)

┌────────────────────────────────────────────────────────────────┐
│ < Q3 2026: Ship Product Redesign >           [ON TRACK]        │
│ Owner: ● Rasya    3 KPIs · 2 Linked Epics    Due: Sep 30       │
│ ▓▓▓▓▓▓░░░░  58%                                               │
└────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────┐
│ < Q3 2026: Improve Dev Velocity >            [AT RISK]         │
│ Owner: ● Maya     5 KPIs · 3 Linked Epics    Due: Sep 30       │
│ ▓▓▓░░░░░░░  28%                                               │
└────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────┐
│ < Q4 2026: Launch Beta to 100 Users >        [NOT STARTED]     │
│ Owner: ● Dito     2 KPIs · 0 Linked Epics    Due: Dec 31       │
│ ░░░░░░░░░░  0%                                                │
└────────────────────────────────────────────────────────────────┘
```

### Interactions

| Trigger               | Action                                                   |
|-----------------------|----------------------------------------------------------|
| Click goal row        | Navigate to Goal Detail page                             |
| Click [ + New Goal ]  | Open New Goal modal (title, owner, due date, quarter)    |
| Click Status filter   | Filter list by status                                    |
| Click Owner filter    | Filter list by assigned owner                            |
| Type in Search        | Live-filter goals by title                               |
| Hover goal row        | Show [...] more-options button (right side)              |
| Click [...]           | Dropdown: Edit, Duplicate, Archive, Delete               |

### Empty State

```
⊙  No goals yet
Define your quarterly objectives to track team direction.
[ + Create Goal ]
```

### Loading State

3 skeleton goal rows.

---

## 4. Goal Detail

### Layout

```
BREADCRUMB: Goals → Q3 2026: Ship Product Redesign

PAGE HEADER
< Q3 2026: Ship Product Redesign >               [Edit]  [...]

META ROW (14px, text-muted, gap: 24px)
Owner: ● Rasya   │   Due: Sep 30, 2026   │   Quarter: Q3   │   [ON TRACK]

PROGRESS SUMMARY
Overall Progress
▓▓▓▓▓▓░░░░  58%
< Based on 3 KPIs >

────────────────────────────────────────────────────────────────────

KPIs SECTION
< KPIs >  (3)                                    [ + Add KPI ]

┌────────────────────────────────────────────────────────────────┐
│ < NPS Score ≥ 45 >                             [AT RISK]       │
│ Current: 38 / Target: 45                                       │
│ ▓▓▓▓▓▓▓░░░  84%                                              │
│ Owner: ● Rasya    Due: Sep 30                                  │
└────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────┐
│ < Reduce page load < 2s >                      [ON TRACK]      │
│ Current: 2.1s / Target: 2.0s                                   │
│ ▓▓▓▓▓▓▓▓░░  95%                                              │
│ Owner: ● Dito    Due: Aug 15                                   │
└────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────┐
│ < Launch 3 core features >                     [DELAYED]       │
│ Current: 1 / Target: 3                                         │
│ ▓▓░░░░░░░░  33%                                              │
│ Owner: ● Maya    Due: Sep 30                                   │
└────────────────────────────────────────────────────────────────┘

────────────────────────────────────────────────────────────────────

LINKED EPICS SECTION
< Linked Epics >  (2)                            [ + Link Epic ]

┌────────────────────────────────────────────────────────────────┐
│ ⚡ Auth & Onboarding Redesign     [AT RISK]    ▓▓▓▓▓▓░░ 62%  │
│ Alpha Project · 8 tasks open                                   │
└────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────┐
│ ⚡ Core Dashboard v2              [ON TRACK]   ▓▓▓▓▓▓▓▓░ 78% │
│ Beta Launch · 4 tasks open                                     │
└────────────────────────────────────────────────────────────────┘
```

### Interactions

| Trigger              | Action                                              |
|----------------------|-----------------------------------------------------|
| Click KPI row        | Expand inline for editing (or open edit modal)      |
| Click [ + Add KPI ]  | Inline new KPI form below list                      |
| Click linked epic    | Navigate to Epic side panel (or Epic detail)        |
| Click [ + Link Epic ]| Open combobox/search to link existing epic          |
| Click [Edit]         | Open edit modal for goal metadata                   |
| Click [...]          | Dropdown: Archive, Delete, Change Status            |

### Empty States

- KPIs empty: "No KPIs defined. [ + Add KPI ]"
- Linked Epics empty: "No epics linked. [ + Link Epic ]"

---

## 5. Epics List

### Layout

```
PAGE HEADER
< Epics >                         [⊞ Group by ▾]  [⊟ Filter ▾]  [ + New Epic ]

FILTER BAR (shown when filter is active)
Filters: [Status: At Risk ×]  [Project: Alpha ×]          [ Clear all ]

EPICS LIST (vertical stack, gap: 8px, grouped by project if Group by is active)

─── Alpha Project ─────────────────────────────────────────────────────

┌──────────────────────────────────────────────────────────────────────┐
│ ⚡ Auth & Onboarding Redesign                [AT RISK]  [HIGH]       │
│ Revamp login, signup, and onboarding flow                            │
│ ▓▓▓▓▓▓░░░░  62%                                                     │
│ Goal: Q3 Ship Product · 8 tasks · ●●● · Due: Aug 10                │
└──────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────┐
│ ⚡ Settings & Profile                        [ON TRACK] [LOW]        │
│ User settings, profile management, preferences                       │
│ ▓▓▓▓▓▓▓░░░  70%                                                     │
│ Goal: Q3 Ship Product · 5 tasks · ●●  · Due: Aug 30                │
└──────────────────────────────────────────────────────────────────────┘

─── Beta Launch ────────────────────────────────────────────────────────

┌──────────────────────────────────────────────────────────────────────┐
│ ⚡ API Documentation                         [ON TRACK] [MED]        │
│ Developer docs for public API v1                                     │
│ ▓▓▓▓▓▓▓▓░░  80%                                                     │
│ Goal: —    · 3 tasks · ● · Due: Jul 20                             │
└──────────────────────────────────────────────────────────────────────┘
```

When an epic row is clicked, the side panel slides in from the right (page content shifts left by panel width on desktop).

### Interactions

| Trigger                    | Action                                                  |
|----------------------------|---------------------------------------------------------|
| Click epic row             | Open Epic side panel (slide from right)                 |
| Click [ + New Epic ]       | Open New Epic modal                                     |
| Click [ Group by ▾ ]       | Dropdown: By Project, By Status, By Goal, None          |
| Click [ Filter ▾ ]         | Dropdown multi-select filter panel                      |
| Click [ × ] on filter chip | Remove that filter                                      |
| Hover epic row             | Show [...] more-options button                          |

### Empty State

```
⚡  No epics yet
[ + Create Epic ]
```

### Loading State

4 skeleton epic rows.

---

## 6. Epic Side Panel

Slides in from right over the Epics list. 480px wide on desktop.

### Layout

```
┌────────────────────────────────────────────────────────┐
│ PANEL HEADER                                           │
│ ← Epics  ·  Alpha Project        [↗]  [⋯]  [✕]       │
├────────────────────────────────────────────────────────┤
│ TAB BAR                                                │
│ [ Overview ]  [ Tasks (8) ]  [ Docs (2) ]             │
├────────────────────────────────────────────────────────┤
│ PANEL BODY                                             │
│                                                        │
│  ── OVERVIEW TAB ─────────────────────────────────    │
│                                                        │
│  < Auth & Onboarding Redesign >         [AT RISK]     │
│  [HIGH]                                               │
│                                                        │
│  Description                                          │
│  < Revamp login, signup, and onboarding UX to         │
│    reduce drop-off and improve time-to-value. >       │
│                                                        │
│  Fields (2-column grid)                               │
│  Status       [AT RISK ▾]   Risk     [HIGH ▾]        │
│  Owner        [● Rasya ▾]   Goal     [Q3 Ship ▾]     │
│  Start Date   Jun 15        Due Date Aug 10           │
│  Project      Alpha Project                          │
│                                                        │
│  Progress                                             │
│  ▓▓▓▓▓▓░░░░  62%  (5/8 tasks done)                   │
│                                                        │
│  ── TASKS TAB ─────────────────────────────────────   │
│                                                        │
│  [ ⊟ Filter ▾ ]  [ Sort ▾ ]           [ + Add Task ] │
│                                                        │
│  TODO  (3)                                            │
│  ┌─────────────────────────────────────────────────┐  │
│  │ ● Login page redesign       [HIGH] ● Rasya      │  │
│  │ [TODO] Due: Jul 10                              │  │
│  └─────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────┐  │
│  │ ● Signup form validation    [MED]  ● Unassigned │  │
│  │ [TODO] Due: Jul 15                              │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  IN PROGRESS  (2)                                     │
│  ...                                                  │
│                                                        │
│  ── DOCS TAB ──────────────────────────────────────   │
│                                                        │
│  [ + New Doc ]                                        │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ ⊟ Auth Flow Spec    Rasya · Jun 10 · 3 min read │  │
│  └─────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────┐  │
│  │ ⊟ Figma Handoff Notes  Dito · Jun 12            │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Interactions

| Trigger                  | Action                                                       |
|--------------------------|--------------------------------------------------------------|
| Click [Overview] tab     | Show overview content                                        |
| Click [Tasks] tab        | Show task list grouped by status                             |
| Click [Docs] tab         | Show doc list                                                |
| Click task row           | Open Task Detail (replaces or stacks on panel)               |
| Click [ + Add Task ]     | Inline task creation form at bottom of list                  |
| Click [↗] (expand)       | Navigate to full Epic Detail page                            |
| Click [✕]                | Close panel, restore full-width epics list                   |
| Click field value        | Inline edit that field                                       |
| Click doc row            | Open doc in Docs Hub (or inline panel)                       |

### Empty States

- Tasks tab empty: "No tasks in this epic. [ + Add Task ]"
- Docs tab empty: "No docs attached. [ + New Doc ]"

---

## 7. Board / Kanban

### Layout

```
PAGE HEADER
< Board >                    [Project: Alpha ▾]  [Assignee ▾]  [⊟ Filter ▾]  [ + New Task ]

BOARD AREA (horizontal scroll on overflow)

┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ TODO      (6)  │  │ IN PROGRESS (4)│  │ IN REVIEW  (3) │  │ DONE      (12) │
│                │  │                │  │                │  │                │
│ ┌────────────┐ │  │ ┌────────────┐ │  │ ┌────────────┐ │  │ ┌────────────┐ │
│ │ [Auth] ●H  │ │  │ │ [Auth] ●H  │ │  │ │ [Auth] ●M  │ │  │ ┌────────────┐ │
│ │ Login page │ │  │ │ Signup form│ │  │ │ Email verif│ │  │ │ [Done] ✓   │ │
│ │ redesign   │ │  │ │ validation │ │  │ │ flow       │ │  │ └────────────┘ │
│ │ [TODO]     │ │  │ │ [IN PROG]  │ │  │ │ [REVIEW]   │ │  │                │
│ │ ● Rasya    │ │  │ │ ● Dito     │ │  │ │ ● Maya     │ │  │ ...            │
│ │ Jul 10     │ │  │ │ Jul 15     │ │  │ │ Jul 8      │ │  │                │
│ └────────────┘ │  │ └────────────┘ │  │ └────────────┘ │  │                │
│                │  │                │  │                │  │                │
│ ┌────────────┐ │  │ ┌────────────┐ │  │ ┌────────────┐ │  │                │
│ │ [Core] ●M  │ │  │ │ [Core] ●L  │ │  │ │            │ │  │                │
│ │ KPI chart  │ │  │ │ Sidebar    │ │  │ │            │ │  │                │
│ │ component  │ │  │ │ nav refine │ │  │ │            │ │  │                │
│ │ [TODO]     │ │  │ │ [IN PROG]  │ │  │ │            │ │  │                │
│ │ Unassigned │ │  │ │ ● Rasya    │ │  │ │            │ │  │                │
│ └────────────┘ │  │ └────────────┘ │  │ └────────────┘ │  │                │
│                │  │                │  │                │  │                │
│ [ + Add task ] │  │ [ + Add task ] │  │ [ + Add task ] │  │                │
└────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘
```

Column width: `~264px`. Column gap: `16px`. Board area: horizontally scrollable.
Column header: sticky top within scroll container. Column body: scrollable vertically within fixed column height (full viewport height minus header).

### Interactions

| Trigger                         | Action                                                   |
|---------------------------------|----------------------------------------------------------|
| Click task card                 | Open Task Detail side panel                              |
| Drag task card to another column| Update task status (optimistic UI — update immediately, sync async) |
| Drag task card within column    | Reorder within status group                              |
| Click [ + Add task ]            | Inline creation at bottom of column: title input appears |
| Press Enter on inline title     | Create task, clear input                                 |
| Click [ + New Task ] (header)   | Open full New Task modal                                 |
| Click column header             | Collapse/expand that column (toggle)                     |
| Click [Project ▾]               | Filter board by project                                  |
| Click [Assignee ▾]              | Filter board by assignee                                 |

### Drag Behavior

- Dragging: card gets `opacity: 0.5`, `scale: 1.02`, `shadow-md`
- Drop target column: column background shifts to `accent-subtle`
- Drop target position: dashed placeholder card shows where item will land
- After drop: smooth transition to final position, status badge updates

### Empty Column State

```
┌────────────────┐
│ TODO       (0) │
│                │
│    Nothing     │
│    here yet    │
│                │
│ [ + Add task ] │
└────────────────┘
```

### Loading State

Skeleton cards (2 per column), shimmer animation.

### Mobile Consideration

Board becomes a single-column view. A horizontal tab bar at top allows switching between columns: [TODO] [IN PROGRESS] [IN REVIEW] [DONE]. No drag-and-drop on mobile — task status changed via task detail form.

---

## 8. Task Card (Kanban)

Detailed specification for the compact card used inside Board columns.

### Layout

```
┌──────────────────────────────────────────────────┐
│ [⚡ Auth]                              ●(H red)  │  ← Row 1: Epic chip + Priority dot
│                                                  │
│ Login page redesign with new Figma              │  ← Row 2: Title (2-line clamp)
│ component system                                │
│                                                  │
│ [TODO]                                          │  ← Row 3: Status badge
│                                                  │
│ ● Rasya              Jul 10    💬 3             │  ← Row 4: Avatar + Due + Comments
└──────────────────────────────────────────────────┘
```

Dimensions: width = column width minus 2×8px padding. Height: auto (min ~88px).

Epic chip: 11px, accent-subtle background, accent text.
Title: 14px / 400 / text-primary.
Status badge: full badge component.
Due date: 12px / text-muted. Red if overdue.
Comment count: 12px / text-muted, ChatCircle icon 12px.

Hover state: Background shifts to `bg-subtle`, border to `border-strong`.

---

## 9. Task Detail Page

Full-page (or wide panel 600px) view of a single task.

### Layout

```
BREADCRUMB: Alpha Project › Auth & Onboarding › Login page redesign

PAGE HEADER
< Login page redesign >                       [Edit title]  [⋯]  [✕]

────────────────────────────────────────────────────────────────────

TWO-COLUMN LAYOUT: MAIN (flex-1) │ SIDEBAR (280px, fixed right)

MAIN COLUMN                       │ SIDEBAR
                                  │
DESCRIPTION                       │ STATUS
< Full task description text.     │ [IN PROGRESS ▾]
  Supports rich text — headers,   │
  lists, inline code. >           │ PRIORITY
[+ Add description]               │ ● HIGH ▾
                                  │
SUBTASKS (3)                      │ ASSIGNEE
[✓] Create Figma mockup  ● Rasya │ ● Rasya Ardiansyah ▾
[ ] Write component spec          │
[ ] Review with team              │ EPIC
[ + Add subtask ]                 │ ⚡ Auth & Onboarding ▾
                                  │
ATTACHMENTS (1)                   │ PROJECT
[📎] figma-auth-v3.fig  2.1MB    │ Alpha Project ▾
[ + Add attachment ]              │
                                  │ DUE DATE
DEPENDENCIES                      │ Jul 10, 2026 ▾
→ Blocked by: Signup form spec   │
← Blocking: Email verification   │ START DATE
[ + Add dependency ]              │ Jun 15, 2026 ▾
                                  │
TIME TRACKING                     │ RISK
Logged: 4h 30m                    │ [HIGH ▾]
[ + Log time ]                    │
                                  │ LABELS
────────────                      │ [design ×] [auth ×]
                                  │ [ + Add label ]
ACTIVITY & COMMENTS               │
                                  │ CREATED BY
[ ● me | Write a comment... ]     │ ● Rasya · Jun 15
                                  │
────────────                      │ LAST UPDATED
                                  │ Jun 17, 10:42am
Jun 17, 10:30am                  │
● Rasya: "Flagged this as high    │ CHANGELOG [ ↓ ]
priority, needs to ship by 10th" │
                                  │
Jun 16, 3:15pm                   │
● System: Status changed         │
  TODO → IN PROGRESS             │
                                  │
Jun 15, 9:00am                   │
● System: Task created by Rasya  │
```

### Interactions

| Trigger                    | Action                                                          |
|----------------------------|-----------------------------------------------------------------|
| Click title                | Inline edit                                                     |
| Click description area     | Activate rich text editor (Tiptap or ProseMirror)               |
| Click [STATUS ▾]           | Open status dropdown                                            |
| Click [PRIORITY ▾]         | Open priority dropdown                                          |
| Click [ASSIGNEE ▾]         | Open member picker combobox                                     |
| Click [EPIC ▾]             | Open epic combobox                                              |
| Click date fields          | Open date picker                                                |
| Click [ + Add subtask ]    | Inline input at end of subtask list                             |
| Click subtask checkbox     | Toggle completion, strikethrough title                          |
| Submit comment             | Append comment, clear input, scroll to bottom                   |
| Click [ + Log time ]       | Open time entry modal (hours, date, note)                       |
| Click [ ↓ ] changelog      | Expand full history of all field changes                        |
| Click dependency link      | Navigate to that task                                           |
| Click [⋯]                  | Dropdown: Duplicate, Move, Archive, Delete                      |

### Loading State

Skeleton: title placeholder, sidebar field placeholders, description area skeleton.

### Error State

"Could not load task. [ Retry ]" — centered in content area.

---

## 10. My Work

Personal view — all tasks assigned to the current user.

### Layout

```
PAGE HEADER
< My Work >                          [ ⊟ Group by ▾ ]  [ Sort ▾ ]

SUMMARY ROW (4 mini stats)
[ In Progress: 5 ]  [ Due This Week: 3 ]  [ Overdue: 1 ]  [ Completed: 28 ]

────────────────────────────────────────────────────────────────────

OVERDUE (1)  [ ↓ collapse ]
┌────────────────────────────────────────────────────────────────────┐
│ ● (H) Login page redesign     [⚡ Auth]   [OVERDUE]   Jul 10 ←   │
└────────────────────────────────────────────────────────────────────┘

IN PROGRESS (3)  [ ↓ collapse ]
┌────────────────────────────────────────────────────────────────────┐
│ ● (H) Signup form validation  [⚡ Auth]   [IN PROG]   Jul 15      │
└────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────┐
│ ● (M) KPI chart component     [⚡ Core]   [IN PROG]   Jul 20      │
└────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────┐
│ ● (L) Sidebar nav refinement  [⚡ Core]   [IN PROG]   Jul 22      │
└────────────────────────────────────────────────────────────────────┘

TODO (4)  [ ↓ collapse ]
┌────────────────────────────────────────────────────────────────────┐
│ ● (M) Write component spec    [⚡ Auth]   [TODO]      Jul 18      │
└────────────────────────────────────────────────────────────────────┘
...

IN REVIEW (1)  [ ↓ collapse ]
...

DONE THIS WEEK (8)  [ ↓ collapse ]
...
```

Row anatomy:
```
│ ● (priority dot)  Task title (flex-1)   [Epic chip]   [Status badge]   Due date  │
```
Row height: 36px. Row hover: background bg-muted. Click: opens task detail.

### Interactions

| Trigger                      | Action                                                |
|------------------------------|-------------------------------------------------------|
| Click task row               | Open Task Detail side panel                           |
| Click section header         | Collapse/expand that section                          |
| Click [ Group by ▾ ]         | Switch grouping: by Status, by Epic, by Priority, by Due Date |
| Click [ Sort ▾ ]             | Sort tasks: by Due Date, by Priority, by Created date |
| Hover task row               | Show quick-action buttons: [✓ Done] [Reassign]        |
| Click [✓ Done] on hover      | Mark complete immediately, move to Done group          |

### Empty State

```
✓  You're all caught up
No tasks assigned to you right now.
```

### Loading State

Skeleton rows grouped by section.

---

## 11. My Day

Focused today view. Minimal. No clutter.

### Layout

```
PAGE HEADER
< My Day >                                Today — Jun 17, 2026

CENTER COLUMN (max-width: 600px, centered in content area)

GREETING
< Good morning, Rasya. >

TODAY'S FOCUS (tasks selected by user or AI-suggested)
─────────────────────────────────────────────────────
Planned today  (3)                    [ + Add task ]

[ ] Login page redesign              ● HIGH · Jul 10
[ ] KPI chart component              ● MED  · Jul 20
[ ] Write component spec             ● MED  · Jul 18

─────────────────────────────────────────────────────

SUGGESTED BY AI  (collapsed by default)
↓ Rasya, these 2 tasks are due soon  [ Dismiss ]

OVERDUE FROM YESTERDAY
─────────────────────────────────────────────────────
[ ] API rate limit spec              ● HIGH · Jul 8 ⚠
─────────────────────────────────────────────────────

COMPLETED TODAY  (2)  [ ↓ show ]
─────────────────────────────────────────────────────
[✓] Figma export review
[✓] Stand-up prep notes
─────────────────────────────────────────────────────
```

Checkbox: large, 20px. Checked state: strikethrough title, muted color, moves to Completed section.

### Interactions

| Trigger                    | Action                                                    |
|----------------------------|-----------------------------------------------------------|
| Click checkbox             | Complete task, animate to bottom completed group          |
| Click task title           | Open Task Detail side panel                               |
| Click [ + Add task ]       | Inline input, pulls from "My Work" task list or creates new |
| Click AI suggestion        | Add that task to today's focus list                       |
| Click [Dismiss]            | Hide AI suggestion block                                  |
| Click [↓ show] Completed   | Expand completed tasks                                    |

### Empty State (no tasks planned)

```
☀  Nothing planned for today
[ + Add tasks to your day ]
```

### Mobile Consideration

Full screen single column. Bottom sheet for task detail. Checkbox size increases to 24px for touch targets.

---

## 12. Team Workload

### Layout

```
PAGE HEADER
< Team Workload >              [ Week ▾ ]  [ Jun 9–15 ▾ ]  [ Project: All ▾ ]

────────────────────────────────────────────────────────────────────

COLUMN HEADERS
< Member >            │  Workload (by task count)  │  TODO  │  IN PROG  │  DONE
──────────────────────┼────────────────────────────┼────────┼───────────┼──────

● Rasya Ardiansyah   │  ████████████░░░░   8/12    │   3    │     5     │   4
                     │  [AT CAPACITY]              │        │           │

● Maya Putri         │  ██████░░░░░░░░░   4/12     │   2    │     2     │   6
                     │  [AVAILABLE]                │        │           │

● Dito Santoso       │  ████████████████  12/12    │   4    │     8     │   2
                     │  [OVERLOADED]               │        │           │

● Rara Wijaya        │  ████░░░░░░░░░░░   3/12     │   1    │     2     │   8
                     │  [AVAILABLE]                │        │           │

● [Unassigned]       │  ─────────────────   6      │   6    │     0     │   0
                     │  [NEEDS ASSIGNMENT]         │        │           │
```

Workload bar colors:
- 0–50% capacity: green (`status-on-track`)
- 51–80%: amber (`status-at-risk`)
- 81–100%: red (`status-delayed`) — "AT CAPACITY"
- >100%: dark red — "OVERLOADED"

Capacity baseline: configurable per member (default: 12 tasks/week — can be changed in Settings).

### Interactions

| Trigger                        | Action                                                  |
|--------------------------------|---------------------------------------------------------|
| Click member row               | Expand to show all tasks for that member (inline)       |
| Click task in expanded row     | Open Task Detail side panel                             |
| Click [Week ▾]                 | Switch view: Week / Sprint / Month                      |
| Click date range [Jun 9–15 ▾]  | Open date range picker                                  |
| Click [Project: All ▾]         | Filter by project                                       |
| Click workload bar             | Same as clicking member row (expand)                    |
| Click [Unassigned] row         | Expand to show unassigned tasks, click "Assign" per row |

### Expanded Member Row

```
● Rasya Ardiansyah   │  ████████████░░░░   8/12    │   3    │     5     │   4
─────────────────────────────────────────────────────────────────────────────
  ▸ Login page redesign            [HIGH]  [IN PROG]  Jul 10
  ▸ KPI chart component            [MED]   [IN PROG]  Jul 20
  ▸ Component spec                 [MED]   [TODO]     Jul 18
  ▸ ...
```

### Empty State

"No team members found for this period."

### Loading State

Skeleton rows for each team member, shimmer on workload bars.

---

## 13. Docs Hub

### Layout

```
PAGE HEADER
< Docs >                      [ ⊟ Type ▾ ]  [ ⚡ Epic ▾ ]  [ ⌕ Search docs ]

TOOLBAR ROW
All (14)  │  Spec (6)  │  Brief (3)  │  Notes (5)   [ + New Doc ]

DOCS GRID (2-column on desktop, 1 on mobile, card layout)

─── Auth & Onboarding ─────────────────────────────────────────────────

┌──────────────────────────────┐  ┌──────────────────────────────┐
│ ⊟ Auth Flow Spec             │  │ ⊟ Figma Handoff Notes        │
│ Auth & Onboarding Redesign   │  │ Auth & Onboarding Redesign   │
│                              │  │                              │
│ ● Rasya · Jun 10             │  │ ● Dito · Jun 12              │
│ 3 min read · [Spec]          │  │ 1 min read · [Notes]         │
└──────────────────────────────┘  └──────────────────────────────┘

─── Core Dashboard v2 ──────────────────────────────────────────────────

┌──────────────────────────────┐  ┌──────────────────────────────┐
│ ⊟ Dashboard Design Brief     │  │ ⊟ Component Audit            │
│ Core Dashboard v2             │  │ Core Dashboard v2             │
│                              │  │                              │
│ ● Maya · Jun 8               │  │ ● Rara · Jun 14              │
│ 5 min read · [Brief]         │  │ 2 min read · [Notes]         │
└──────────────────────────────┘  └──────────────────────────────┘
```

### Interactions

| Trigger                       | Action                                                     |
|-------------------------------|------------------------------------------------------------|
| Click doc card                | Open doc in full reading/editing view (new page or modal)  |
| Click [ + New Doc ]           | Open doc creation: title, type, linked epic selector        |
| Click type tab (Spec, Brief)  | Filter to that doc type                                    |
| Click [ Epic ▾ ]              | Filter by epic                                             |
| Type in search                | Live filter doc list by title                              |
| Hover doc card                | Show [...] options: Edit, Move, Duplicate, Delete          |

### Empty State

```
⊟  No docs yet
[ + Create your first doc ]
```

### Loading State

Skeleton doc cards.

---

## 14. Global Search (⌘K)

### Layout

```
OVERLAY (semi-transparent)
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ⌕  Search tasks, epics, docs, members...          [ESC]   │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │                                                            │  │
│  │  RECENT                                                    │  │
│  │  ─────────────────────────────────────────                │  │
│  │  ● Login page redesign          Task · Auth              │  │
│  │  ⚡ Auth & Onboarding           Epic · Alpha              │  │
│  │  ⊟ Auth Flow Spec              Doc                       │  │
│  │                                                            │  │
│  │  (after typing "login")                                    │  │
│  │                                                            │  │
│  │  TASKS                                                     │  │
│  │  ─────────────────────────────────────────                │  │
│  │  ✓ Login page redesign          IN PROGRESS · Jul 10     │  │
│  │  ✓ Login error states           TODO · Jul 15            │  │
│  │                                                            │  │
│  │  EPICS                                                     │  │
│  │  ─────────────────────────────────────────                │  │
│  │  ⚡ Auth & Onboarding Redesign  Alpha Project             │  │
│  │                                                            │  │
│  │  DOCS                                                      │  │
│  │  ─────────────────────────────────────────                │  │
│  │  ⊟ Auth Flow Spec               Rasya · Jun 10           │  │
│  │                                                            │  │
│  │  MEMBERS                                                   │  │
│  │  ─────────────────────────────────────────                │  │
│  │  ● Rasya Ardiansyah             rasya@queebo.chat         │  │
│  │                                                            │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ ↑↓ navigate  ·  ↵ open  ·  esc dismiss                   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Interactions

| Trigger                     | Action                                                      |
|-----------------------------|-------------------------------------------------------------|
| ⌘K anywhere in app          | Open palette, focus input                                   |
| Type query                  | Live search, debounce 150ms                                 |
| ↑ / ↓ arrow                 | Move keyboard selection through results                     |
| ↵ Enter on result           | Navigate to that item (task detail, epic, doc, member)      |
| ESC                         | Close palette                                               |
| Click overlay               | Close palette                                               |
| Click result                | Navigate to that item                                       |
| Type "/"                    | Show command list (create task, create epic, go to page...) |

### Empty / No Results State

```
⌕  No results for "xyzzy"
Try searching for a task, epic, doc, or team member.
```

### Loading State

"Searching..." spinner replaces result list during initial debounce window.

---

## 15. AI Assistant Panel

Floating panel, slides in from right. Context-aware — knows what page you're on, what task/epic is open.

### Layout

```
┌────────────────────────────────────────────────────────┐
│ PANEL HEADER                                           │
│ ✦ AI Assistant                       [⋯]   [✕]        │
│ Viewing: Auth & Onboarding Redesign [Epic]             │
├────────────────────────────────────────────────────────┤
│ CONTEXT BADGE (small, top of messages)                 │
│ [📎 Auth & Onboarding Redesign]                        │
├────────────────────────────────────────────────────────┤
│ CHAT AREA (flex-col, overflow-y: auto)                 │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ ✦ AI                                           │   │
│  │ This epic has 3 tasks overdue and is marked    │   │
│  │ AT RISK. The main blocker seems to be the      │   │
│  │ "Login page redesign" task (unreviewed for     │   │
│  │ 4 days). Want me to draft a status update?     │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ You                                            │   │
│  │ Yes, and suggest who should be reassigned      │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ ✦ AI  (typing...)                              │   │
│  │ ████████░░░░                                   │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│ QUICK SUGGESTIONS (chips, shown when no active query)  │
│ [ Summarize this epic ]  [ Find blockers ]             │
│ [ Draft status update ]  [ Show overdue tasks ]        │
│                                                        │
├────────────────────────────────────────────────────────┤
│ INPUT AREA                                             │
│ ┌──────────────────────────────────┐  [↵ Send]        │
│ │ Ask anything about this epic...  │                  │
│ └──────────────────────────────────┘                  │
└────────────────────────────────────────────────────────┘
```

Width: `380px` (narrower than Epic panel — non-blocking). Opens alongside side panel on wide screens (> 1280px). On narrower screens: replaces visible content area temporarily.

Context badge shows current page/item. Changes as user navigates.

### Interactions

| Trigger                     | Action                                                        |
|-----------------------------|---------------------------------------------------------------|
| Click ✦ AI icon (header)    | Open/close AI panel                                           |
| Type + Enter / Click Send   | Send message, show typing indicator, stream response          |
| Click suggestion chip       | Pre-fill and send that query                                  |
| Click [✕]                   | Close panel                                                   |
| Navigate to new page        | Context badge updates, AI knows new context                   |
| Click [⋯]                   | Dropdown: Clear chat, Copy last response, Settings            |

### Empty / New Session State

```
✦  Hi, Rasya.

I can see you're working on the Elux Project Tracker.
Ask me anything about your projects, tasks, or team.

[ Summarize today's priorities ]
[ What's overdue? ]
[ Show team blockers ]
```

### Loading / Streaming State

Typing indicator: animated dots. Response streams token by token.

---

## 16. Notification Panel

Slides in from right. 400px wide.

### Layout

```
┌──────────────────────────────────────────────────────────┐
│ PANEL HEADER                                             │
│ < Notifications >  (6 unread)   [Mark all read]  [✕]    │
├──────────────────────────────────────────────────────────┤
│ FILTER TABS                                              │
│ [ All (6) ]  [ Mentions (2) ]  [ Updates (4) ]          │
├──────────────────────────────────────────────────────────┤
│ NOTIFICATION LIST                                        │
│                                                          │
│ TODAY                                                    │
│ ─────────────────────────────────────────────────────   │
│ ┌──────────────────────────────────────────────────┐   │
│ │ ● Maya mentioned you in                     10m  │   │
│ │ "Auth Flow Spec" — "@Rasya can you check        │   │
│ │ the edge case on password reset?"              │   │
│ │ [Auth & Onboarding]  [ Go → ]                  │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ ● Dito assigned you a task               1h     │   │
│ │ "Email verification flow"                       │   │
│ │ [Auth & Onboarding]  [ Go → ]                  │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ ⚠ Status Update: Auth epic → AT RISK      2h    │   │
│ │ Triggered by 2 overdue tasks.                   │   │
│ │ [Auth & Onboarding]  [ Go → ]                  │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ YESTERDAY                                                │
│ ─────────────────────────────────────────────────────   │
│ ┌──────────────────────────────────────────────────┐   │
│ │ ✓ Sprint 4 ended — 8 tasks completed      1d    │   │
│ │ [ View summary → ]                              │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ [ Load older notifications ]                            │
└──────────────────────────────────────────────────────────┘
```

Unread notifications: left border `3px solid accent`. Read: no border, slightly lower contrast.

### Interactions

| Trigger                           | Action                                                  |
|-----------------------------------|---------------------------------------------------------|
| Click Bell icon in header         | Open notification panel                                 |
| Click notification row            | Mark as read + navigate to linked item                  |
| Click [ Go → ]                    | Navigate to linked item without dismissing panel        |
| Click [Mark all read]             | Mark all as read, remove unread indicators              |
| Click filter tab                  | Filter notifications by type                            |
| Click [✕]                         | Close panel                                             |
| Click [Load older notifications]  | Append older notifications to list (pagination)         |

### Empty State

```
🔔  You're all caught up
No new notifications.
```

### Loading State

Skeleton notification rows, 3–4 of them, shimmer animation.

---

## Global Interaction Patterns

### Inline Editing

Any field on any detail view (task, epic, goal) can be clicked to edit inline. Pattern:
1. Click field value → value becomes editable input
2. Click outside or press Enter → save, show updated value
3. Press ESC → cancel, restore original value
4. If save fails → show error toast, restore original value, leave input active

### Optimistic Updates

Board drag, task status change, checkbox completion: UI updates immediately. If API call fails, revert with error toast.

### Keyboard Shortcuts

| Shortcut  | Action                         |
|-----------|--------------------------------|
| ⌘K        | Open command palette           |
| ⌘/        | Toggle AI Assistant panel      |
| ⌘N        | New task (context-aware)       |
| ESC       | Close modal / panel / palette  |
| J / K     | Navigate list items down/up    |
| E         | Edit selected task (focus mode)|
| C         | Create task (shortcut alias)   |

Keyboard shortcuts are shown in command palette footer and discoverable via `?` shortcut (shows shortcuts modal).

### Error Boundary

Every page has a fallback:
```
⚠  Something went wrong loading this page.
[ Try again ]  [ Go to Dashboard ]
```

---

*End of wireframe.md*
