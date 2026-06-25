# Style Migration Prompt — Elux Project Tracker

## Agent Strategy

**Spawn multiple subagents and run them in parallel.** Do not execute these steps sequentially yourself. Each step below maps to one agent. Dispatch all agents at the same time, then wait for all to complete before doing a final integration pass.

Suggested agent breakdown:

| Agent | Responsibility |
|---|---|
| **Agent 1 — Tokens & Typography** | Steps 1 & 2: extract design tokens from HTML, write to `assets/css/main.css`, configure Geist font |
| **Agent 2 — Layout Shell** | Step 3: sidebar, topbar, main content wrapper |
| **Agent 3 — KPI Cards** | Step 4: KPI card strip component |
| **Agent 4 — Critical Issues + Activity** | Steps 5 & 7: CI widget and activity feed |
| **Agent 5 — Projects Table** | Step 6: projects table, row styles, badges, progress bars |
| **Agent 6 — Peek Panels** | Steps 8 & 9: all three side panels, backdrop, dropdown filter buttons |
| **Agent 7 — Icon Migration** | Step 10: replace all Phosphor icons with Tabler Icons across the entire codebase |

Each agent must:
1. Read `dashboard-mockup-v3.html` to get exact CSS values for its scope
2. Read the existing Vue component(s) it is modifying before making changes
3. Only touch files within its assigned scope — no cross-agent file conflicts
4. Leave a one-line comment `// styled: agent-N` at the top of each file it modifies

After all agents complete, do a final pass to:
- Verify no design token is hardcoded (all colors must use CSS variables)
- Run `nuxt build` or `nuxt typecheck` to confirm no broken imports
- Check the verification checklist at the bottom of this prompt

---

## Context

You are working on the Elux Project Tracker — an internal tool built with **Nuxt 4 + Nuxt UI v3 + Tailwind v4**. A high-fidelity HTML/CSS/JS mockup has been attached (`dashboard-mockup-v3.html`). Your job is to extract the visual design system from that file and apply it precisely to the existing Vue/Nuxt codebase.

Do not rewrite logic or change routing. Only update visual presentation: CSS/Tailwind classes, layout structure, spacing, color, typography, and component patterns.

---

## Step 1 — Extract the Design Tokens

Read the `:root` block inside `<style>` in the attached HTML. It defines the full color palette as CSS custom properties. Map these to Tailwind v4 CSS variables in `assets/css/main.css` (or equivalent):

```css
/* Example mapping — read actual values from the HTML */
--gray-50, --gray-100 ... --gray-900
--blue-50, --blue-500, --blue-600
--green-500, --amber-500, --red-500
--indigo-500, --indigo-600
```

In Tailwind v4, register these as theme variables:
```css
@theme {
  --color-gray-50: <value from HTML>;
  --color-blue-500: <value from HTML>;
  /* etc */
}
```

---

## Step 2 — Typography

The mockup uses **Geist** (Google Fonts CDN). Apply to the project:

1. Add Geist to the Nuxt font config (via `@nuxtjs/fonts` or `nuxt.config.ts` head)
2. Set `font-family: 'Geist', -apple-system, sans-serif` as the base body font
3. Key type scale (read exact values from HTML):
   - Labels/metadata: 11–11.5px, `font-weight: 500`, `color: var(--gray-400)`
   - Body text: 13px, `color: var(--gray-700)`
   - Subheadings: 13–14px, `font-weight: 600`, `color: var(--gray-900)`
   - Section titles: 12px, `font-weight: 700`, uppercase, `letter-spacing: 0.06em`, `color: var(--gray-400)`
   - Page title: 20–22px, `font-weight: 700`
   - Large KPI numbers: 28–36px, `font-weight: 700`, `letter-spacing: -0.02em`

---

## Step 3 — Layout Shell

The app shell has three zones. Read the HTML structure carefully:

```
┌─────────────────────────────────────────────────────┐
│ sidebar (60px wide, icons only, left-fixed)          │
│ ─────────────────────────────────────────────────── │
│  topbar (full width, fixed, 52px tall)               │
│  ─────────────────────────────────────────────────  │
│  main content (scrollable, padding ~24px)            │
└─────────────────────────────────────────────────────┘
```

Key layout rules:
- Sidebar: `position: fixed`, `width: 60px`, `background: var(--gray-900)`, icon-only nav
- Active sidebar item: `background: rgba(255,255,255,0.1)`, `border-radius: 8px`
- Topbar: `background: white`, `border-bottom: 1px solid var(--gray-100)`, contains page title + search + "New Task" CTA
- "New Task" button: `background: var(--gray-900)`, `color: white`, `border-radius: 8px`, `font-weight: 600`
- Main content background: `#fafafa`
- Content max-width: unconstrained (full width within sidebar)

---

## Step 4 — KPI Card Strip

The dashboard opens with a horizontal row of metric cards. Read the `.kpi-card` styles from the HTML.

Key patterns:
- Cards: `background: white`, `border: 1px solid var(--gray-100)`, `border-radius: 14px`, `padding: 18px`
- Each card has: an icon chip (colored square, `border-radius: 8px`), a large number, a delta indicator (↑/↓ + percentage/count), a subline
- The completion rate card is larger and contains a stacked bar + legend
- Icon chips use distinct background colors per metric type (blue, red, amber, green)
- Delta positive: `color: var(--green-500)`, negative: `color: var(--red-500)`, neutral: `color: var(--gray-400)`

---

## Step 5 — Critical Issues Widget

Located in the left column of the dashboard grid. Read `.ci-card` and related styles.

Key patterns:
- Section header: label + count badge + "View all" link
- Issue items grouped by priority: HIGH (red dot) / MEDIUM (amber dot)
- Each issue card: `background: white`, `border: 1px solid var(--gray-100)`, `border-radius: 10px`, title + project + assignee + status badge
- Priority badge: HIGH = `background: #FEE2E2; color: #DC2626`, MED = `background: #FEF3C7; color: #D97706`
- Status badge: Overdue = `background: #FEE2E2; color: #DC2626`, At Risk = `background: #FEF3C7; color: #D97706`, Not Started = `background: var(--gray-100); color: var(--gray-600)`

---

## Step 6 — Projects Table

The main projects list is a table. Read `.projects-table` and `.proj-row` styles.

Key patterns:
- Table header: 11px, uppercase, `font-weight: 600`, `color: var(--gray-400)`, `border-bottom: 1px solid var(--gray-100)`
- Row hover: `background: var(--gray-50)`, cursor pointer
- Row click opens a side peek panel (see Step 8)
- Status badges: pill shape, small, color-coded (On Track = green, At Risk = amber, Not Started = gray, Overdue = red)
- Progress bar: `height: 4px`, `border-radius: 2px`, colored by status
- People avatars: 24px circles, overlapping (`margin-left: -6px`), colored by person
- Priority badge: same pattern as CI widget above
- Deadline text: overdue dates in red (`color: var(--red-500)`, `font-weight: 600`)

---

## Step 7 — Recent Activity Feed

Right column widget. Read `.act-item` styles.

Key patterns:
- Each item: avatar (28px circle, colored initials) + content block
- Content: `"Name" action "item"` — person name is `font-weight: 600`, action text is normal, linked items in `color: var(--blue-600)` and underlined on hover
- Project tag: small pill below the text, `background: var(--gray-100)`, `border-radius: 4px`, `font-size: 11px`
- Timestamp: `font-size: 11.5px`, `color: var(--gray-400)`
- "View All" link: top right of section, `color: var(--blue-600)`, `font-size: 13px`

---

## Step 8 — Side Peek Panels

Three panels exist: Critical Issues detail, Recent Activity detail, Project detail. Read `#ci-modal`, `#act-modal`, `#project-modal` CSS.

Key patterns (ALL panels):
- `position: fixed`, `width: 640px`, slides in from right
- When open: `right: 8px`, `top: 8px`, `bottom: 8px`, `height: auto` (floating, NOT full height)
- `border-radius: 14px`, `border: 1px solid rgba(0,0,0,0.07)`, `box-shadow: 0 24px 64px rgba(0,0,0,0.16)`
- Backdrop: `background: rgba(0,0,0,0.2)`, `backdrop-filter: blur(2px)`, click to close
- Topbar (all panels): action icons LEFT (expand + layout toggle), close ✕ RIGHT — no breadcrumb text
- Transition: `right 0.24s cubic-bezier(.4,0,.2,1)`

**Project panel specifics:**
- Project title: `font-size: 20px`, `font-weight: 700`
- Status/priority/owner chips below title
- Properties in a 2-column grid: key is `10.5px uppercase font-weight:600 color:gray-400`, value is `13px font-weight:500`
- Description textarea: borderless, auto-resize, `background: var(--gray-50)` on focus
- Tasks section: progress bar + checklist items with due dates
- Tab bar (Comments / Activities / Attachments): `border-bottom: 1px solid var(--gray-100)`, active tab has `border-bottom: 2px solid var(--blue-600)`, `color: var(--blue-600)`
- Comment input: sticky at bottom, avatar + input field + send button

---

## Step 9 — Dropdown Filter Buttons

Used inside peek panels. Read `.peek-fdd-btn` and `.peek-fdd-menu` styles.

Pattern:
- Button: `border: 1px solid var(--gray-200)`, `border-radius: 8px`, `padding: 5px 11px`, `font-size: 12.5px`, dropdown chevron SVG
- Active (filter applied): `border-color: var(--blue-500)`, `color: var(--blue-600)`, `background: var(--blue-50)`
- Dropdown menu: `position: absolute`, `border-radius: 10px`, `box-shadow: 0 8px 24px rgba(0,0,0,0.1)`, checkbox items
- Each item: `display: flex; align-items: center; gap: 9px; padding: 7px 10px; font-size: 13px`

---

## Step 9b — Interaction & Motion Rules

- All hover transitions: `0.1s` or `0.12s` ease
- Panel open/close: `right` transition `0.24s cubic-bezier(.4,0,.2,1)`
- Button press: no scale transform — keep flat
- No drop shadows on hover state changes (use background color change instead)
- Focus rings: `outline: 2px solid var(--blue-200)`, `outline-offset: 2px`
- Scrollbars: thin, `width: 6px`, `border-radius: 3px`, `background: var(--gray-200)`

---

## Step 10 — Icon Migration: Phosphor → Tabler Icons

**Agent 7 owns this step exclusively.** No other agent should touch icon-related code.

### Installation

```bash
npm install @tabler/icons-vue
```

Tabler provides individual Vue components per icon. Import only what you use — do not do a wildcard import.

```vue
<script setup>
import { IconHome, IconSettings, IconUser } from '@tabler/icons-vue'
</script>

<template>
  <IconHome :size="20" :stroke-width="1.5" />
</template>
```

### Migration rules

1. **Find all Phosphor icon usages** — grep for `Ph` prefix components (e.g. `PhHouse`, `PhGear`, `PhUser`) and `phosphor-icons` imports across all `.vue` files
2. **Map each Phosphor icon to its Tabler equivalent** — use the mapping table below
3. **Replace import statements** — swap `from '@phosphor-icons/vue'` with `from '@tabler/icons-vue'`
4. **Adjust props** — Phosphor uses `weight="regular"` / `size="20"`, Tabler uses `:stroke-width="1.5"` / `:size="20"`. Remove all `weight` props.
5. **Naming convention** — Tabler components are prefixed with `Icon`: `PhHouse` → `IconHome`, `PhGear` → `IconSettings`

### Phosphor → Tabler mapping (common icons in this codebase)

| Phosphor | Tabler | Usage |
|---|---|---|
| `PhHouse` | `IconHome` | Dashboard nav |
| `PhTarget` | `IconTarget` | Goals nav |
| `PhFolder` | `IconFolder` | Projects nav |
| `PhKanban` | `IconLayoutKanban` | Board nav |
| `PhListChecks` | `IconChecklist` | My Work nav |
| `PhUsers` | `IconUsers` | Team nav |
| `PhFileText` | `IconFileText` | Docs nav |
| `PhGear` | `IconSettings` | Settings |
| `PhQuestion` | `IconHelp` | Get Help |
| `PhBell` | `IconBell` | Notifications |
| `PhMagnifyingGlass` | `IconSearch` | Search |
| `PhPlus` | `IconPlus` | New Task button |
| `PhDotsThree` | `IconDots` | Row actions menu |
| `PhArrowUp` | `IconArrowUp` | Delta up indicator |
| `PhArrowDown` | `IconArrowDown` | Delta down indicator |
| `PhCalendar` | `IconCalendar` | Dates |
| `PhFlag` | `IconFlag` | Priority |
| `PhWarning` | `IconAlertTriangle` | At Risk / warnings |
| `PhCheckCircle` | `IconCircleCheck` | Completed status |
| `PhCircle` | `IconCircle` | Not Started status |
| `PhX` | `IconX` | Close / dismiss |
| `PhArrowSquareOut` | `IconExternalLink` | Open in new tab |
| `PhLayout` | `IconLayout` | Layout toggle |

For any Phosphor icon NOT in this table, find the closest match at **tabler-icons.io** — search by concept, not by exact name.

### Default props to apply globally

All Tabler icons in this codebase should use:
- `:stroke-width="1.5"` — slightly thinner than default (2), matches the design system aesthetic
- Size varies by context: `20` for nav/topbar, `16` for inline/table, `18` for buttons

Create a wrapper component if needed to avoid repeating props everywhere:

```vue
<!-- components/AppIcon.vue -->
<script setup>
defineProps({ icon: Object, size: { default: 18 }, strokeWidth: { default: 1.5 } })
</script>
<template>
  <component :is="icon" :size="size" :stroke-width="strokeWidth" />
</template>
```

### Uninstall Phosphor after migration

```bash
npm uninstall @phosphor-icons/vue
```

Confirm zero remaining `phosphor` references with: `grep -r "phosphor" src/`

---

## What NOT to change

- Routing and navigation logic
- API calls and data fetching
- Authentication/auth guards
- Component business logic
- Pinia store structure
- Server routes

---

## Verification checklist

After applying styles, confirm:
- [ ] Geist font loads correctly
- [ ] Color tokens match the HTML `:root` exactly
- [ ] Sidebar is 60px, dark background, icon-only
- [ ] KPI cards have correct border-radius, padding, and typography
- [ ] Project table rows are clickable, hover state correct
- [ ] All three peek panels slide from right with 8px gap from viewport edges
- [ ] Peek panel topbar: icons left, close right, no breadcrumb
- [ ] Dropdown filter buttons appear and function correctly
- [ ] Backdrop blur appears behind open panels
- [ ] No horizontal scroll on the main dashboard
- [ ] No Phosphor icons remain (`grep -r "phosphor" src/` returns empty)
- [ ] All icons use `:stroke-width="1.5"` and correct size per context
