# Elux Project Tracker — Design System

**Version:** 1.0
**Project:** Elux Project Tracker Revamp
**Tech stack:** Nuxt 4 + Nuxt UI v3 + Tailwind CSS v4 + Phosphor Icons
**Last updated:** 2026-06-17

---

## 1. Design Philosophy

### Core Principles

**Speed over decoration.** Every visual decision is justified by function. If removing an element doesn't break understanding, remove it. Linear earns its reputation not from visual flair but from the feeling that nothing is in the way.

**Information density without clutter.** Vercel's dashboard shows you everything you need on first load. No scrolling required to orient yourself. Density is achieved through tight spacing, consistent type scale, and purposeful use of color — not by cramming more into every pixel.

**Calm focus.** My Work and My Day take cues from Superlist: personal, quiet, action-oriented. The interface recedes. The task is the thing.

**Readable hierarchy.** Craft.do's document model proves that hierarchy — through indentation, weight, and size contrast — can carry more meaning than color alone. Docs should feel like writing, not filling out a form.

### What This Means in Practice

- No gradients. No decorative illustrations. No hero images inside the app.
- Borders are 1px, neutral, and used to separate — not to frame.
- Color is reserved for meaning: status, risk, priority, and interactive state.
- Motion is functional: confirms an action, reveals new content, guides attention.
- Dark mode is not an afterthought — tokens are defined for both from day one.

---

## 2. Accent Color Recommendation

**Recommendation: Blue (`#2563EB` / Tailwind `blue-600`)**

Rationale:
- Elux currently uses purple. Purple reads as creative-brand. For an internal tool used daily by 8–12 people, blue is cognitively lighter — it signals "system" not "brand," which reduces visual fatigue.
- Blue is Linear's accent. Since this is explicitly a Linear-inspired tracker, visual continuity with the reference is appropriate.
- Blue does not collide with any status color (green = on track, amber = at risk, red = delayed). Purple's saturation can bleed into red territory at small sizes.
- If the team prefers brand continuity with the existing purple: `#7C3AED` (violet-600) works. It is distinct enough from status colors and has excellent contrast ratios in both light and dark.

**Final recommendation: `#2563EB` (blue). Fall back to `#7C3AED` (violet) if brand alignment is required.**

---

## 3. Color System

### 3.1 Design Token Strategy

All colors are defined as CSS custom properties. Tailwind CSS v4 reads them from `@theme` in the global CSS. Every component references tokens, never raw hex values.

### 3.2 Light Mode Tokens

```css
@theme {
  /* Backgrounds */
  --color-bg-base:       #ffffff;   /* Page background */
  --color-bg-subtle:     #f9fafb;   /* Sidebar, secondary panels */
  --color-bg-muted:      #f3f4f6;   /* Hover states, code blocks */
  --color-bg-overlay:    #ffffff;   /* Modals, dropdowns */

  /* Surfaces */
  --color-surface-1:     #ffffff;   /* Cards, panels */
  --color-surface-2:     #f9fafb;   /* Nested cards, inner sections */
  --color-surface-3:     #f3f4f6;   /* Disabled areas */

  /* Borders */
  --color-border:        #e5e7eb;   /* Default border (gray-200) */
  --color-border-strong: #d1d5db;   /* Emphasized borders (gray-300) */
  --color-border-focus:  #2563eb;   /* Focus ring */

  /* Text */
  --color-text-primary:  #111827;   /* Headings, primary content */
  --color-text-secondary:#374151;   /* Body text, descriptions */
  --color-text-muted:    #6b7280;   /* Labels, placeholders, metadata */
  --color-text-disabled: #9ca3af;   /* Disabled state text */
  --color-text-inverse:  #ffffff;   /* Text on dark/accent backgrounds */

  /* Accent */
  --color-accent:        #2563eb;   /* Primary interactive, links */
  --color-accent-hover:  #1d4ed8;   /* Accent hover state */
  --color-accent-subtle: #eff6ff;   /* Accent backgrounds, highlights */
  --color-accent-muted:  #bfdbfe;   /* Accent borders, decorative */

  /* Status: On Track */
  --color-status-on-track:        #16a34a;  /* green-600 */
  --color-status-on-track-bg:     #f0fdf4;  /* green-50 */
  --color-status-on-track-border: #bbf7d0;  /* green-200 */

  /* Status: Delayed */
  --color-status-delayed:         #dc2626;  /* red-600 */
  --color-status-delayed-bg:      #fef2f2;  /* red-50 */
  --color-status-delayed-border:  #fecaca;  /* red-200 */

  /* Status: At Risk */
  --color-status-at-risk:         #d97706;  /* amber-600 */
  --color-status-at-risk-bg:      #fffbeb;  /* amber-50 */
  --color-status-at-risk-border:  #fde68a;  /* amber-200 */

  /* Status: Not Started */
  --color-status-not-started:        #6b7280;  /* gray-500 */
  --color-status-not-started-bg:     #f9fafb;  /* gray-50 */
  --color-status-not-started-border: #e5e7eb;  /* gray-200 */

  /* Status: Done */
  --color-status-done:        #2563eb;  /* blue-600 */
  --color-status-done-bg:     #eff6ff;  /* blue-50 */
  --color-status-done-border: #bfdbfe;  /* blue-200 */

  /* Risk: High */
  --color-risk-high:        #dc2626;  /* red-600 */
  --color-risk-high-bg:     #fef2f2;
  --color-risk-high-border: #fecaca;

  /* Risk: Medium */
  --color-risk-medium:        #d97706;  /* amber-600 */
  --color-risk-medium-bg:     #fffbeb;
  --color-risk-medium-border: #fde68a;

  /* Risk: Low */
  --color-risk-low:        #16a34a;  /* green-600 */
  --color-risk-low-bg:     #f0fdf4;
  --color-risk-low-border: #bbf7d0;

  /* Priority dots */
  --color-priority-high:   #ef4444;  /* red-500 — slightly lighter for small dot use */
  --color-priority-medium: #f59e0b;  /* amber-500 */
  --color-priority-low:    #9ca3af;  /* gray-400 */

  /* Destructive */
  --color-destructive:       #dc2626;
  --color-destructive-hover: #b91c1c;
  --color-destructive-bg:    #fef2f2;
}
```

### 3.3 Dark Mode Tokens

```css
.dark {
  /* Backgrounds */
  --color-bg-base:       #0a0a0a;
  --color-bg-subtle:     #111111;
  --color-bg-muted:      #1a1a1a;
  --color-bg-overlay:    #141414;

  /* Surfaces */
  --color-surface-1:     #141414;
  --color-surface-2:     #1a1a1a;
  --color-surface-3:     #222222;

  /* Borders */
  --color-border:        #262626;
  --color-border-strong: #333333;
  --color-border-focus:  #3b82f6;

  /* Text */
  --color-text-primary:  #f9fafb;
  --color-text-secondary:#d1d5db;
  --color-text-muted:    #6b7280;
  --color-text-disabled: #4b5563;
  --color-text-inverse:  #111827;

  /* Accent */
  --color-accent:        #3b82f6;   /* blue-500 — slightly lighter for dark bg */
  --color-accent-hover:  #2563eb;
  --color-accent-subtle: #172554;   /* blue-950 */
  --color-accent-muted:  #1e3a8a;   /* blue-900 */

  /* Status: On Track */
  --color-status-on-track:        #4ade80;  /* green-400 */
  --color-status-on-track-bg:     #052e16;  /* green-950 */
  --color-status-on-track-border: #14532d;  /* green-900 */

  /* Status: Delayed */
  --color-status-delayed:         #f87171;  /* red-400 */
  --color-status-delayed-bg:      #450a0a;  /* red-950 */
  --color-status-delayed-border:  #7f1d1d;  /* red-900 */

  /* Status: At Risk */
  --color-status-at-risk:         #fbbf24;  /* amber-400 */
  --color-status-at-risk-bg:      #451a03;  /* amber-950 */
  --color-status-at-risk-border:  #78350f;  /* amber-900 */

  /* Status: Not Started */
  --color-status-not-started:        #6b7280;
  --color-status-not-started-bg:     #111111;
  --color-status-not-started-border: #262626;

  /* Status: Done */
  --color-status-done:        #60a5fa;  /* blue-400 */
  --color-status-done-bg:     #172554;  /* blue-950 */
  --color-status-done-border: #1e3a8a;  /* blue-900 */

  /* Risk */
  --color-risk-high:        #f87171;
  --color-risk-high-bg:     #450a0a;
  --color-risk-high-border: #7f1d1d;

  --color-risk-medium:        #fbbf24;
  --color-risk-medium-bg:     #451a03;
  --color-risk-medium-border: #78350f;

  --color-risk-low:        #4ade80;
  --color-risk-low-bg:     #052e16;
  --color-risk-low-border: #14532d;

  /* Priority */
  --color-priority-high:   #f87171;
  --color-priority-medium: #fbbf24;
  --color-priority-low:    #6b7280;

  /* Destructive */
  --color-destructive:       #f87171;
  --color-destructive-hover: #ef4444;
  --color-destructive-bg:    #450a0a;
}
```

---

## 4. Typography

### 4.1 Font Family

```css
--font-sans: 'Geist', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-mono: 'Geist Mono', 'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace;
```

**Geist** is the primary choice — it is Vercel's typeface, designed for UI interfaces, and used by Linear as well. It has excellent legibility at small sizes (11–13px labels), good number tabular alignment, and a clean neutral character. Load from Vercel's CDN or self-host via `nuxt-fonts`.

**Inter** is the fallback — same x-height, similar metrics, widely available.

### 4.2 Type Scale

| Token       | Size  | Line Height | Weight       | Use case                                      |
|-------------|-------|-------------|--------------|-----------------------------------------------|
| `text-xs`   | 11px  | 16px        | 400, 500     | Metadata labels, timestamps, badge text       |
| `text-sm`   | 12px  | 18px        | 400, 500     | Secondary text, sidebar items, table cells    |
| `text-base` | 14px  | 20px        | 400, 500     | Body text, form labels, card text (base unit) |
| `text-md`   | 15px  | 22px        | 500          | Emphasized body, section subheadings          |
| `text-lg`   | 16px  | 24px        | 500, 600     | Panel headings, page sub-titles               |
| `text-xl`   | 18px  | 26px        | 600          | Page titles (secondary pages)                 |
| `text-2xl`  | 22px  | 30px        | 600, 700     | Dashboard section headers                     |
| `text-3xl`  | 28px  | 36px        | 700          | Reserved — Goal/Epic titles at top of detail  |

> Note: `text-base` is 14px, not the Tailwind default of 16px. This matches Linear and Vercel's UI density. Set `font-size: 14px` on the root.

### 4.3 Font Weights

| Weight | Token      | Use                                                |
|--------|------------|----------------------------------------------------|
| 400    | `font-normal` | Body, descriptions, metadata                    |
| 500    | `font-medium` | Labels, nav items, table headers, badge text    |
| 600    | `font-semibold` | Section titles, button labels, page headings  |
| 700    | `font-bold`   | Rarely used — only for metric numbers on dashboard |

Do not use 300 (too thin for data-heavy UI) or 800+ (too heavy, breaks the neutral aesthetic).

### 4.4 Line Heights

Line height is set per scale step and should not be overridden per-component except for mono:
- Body text: 1.5 line height
- Headings: 1.3 line height
- Labels (xs, sm): 1.4 line height
- Code/mono: 1.6 line height

### 4.5 Letter Spacing

- Headings (text-2xl, text-3xl): `-0.02em` (tighter, like Linear)
- Body: `0` (default)
- Labels, caps (uppercase metadata): `0.04em`

---

## 5. Spacing System

**Base unit: 8px**

All spacing values are multiples or half-multiples of 8.

| Token    | Value | CSS          | Use                                              |
|----------|-------|--------------|--------------------------------------------------|
| `space-0.5` | 4px  | `0.5rem`   | Icon-to-label gap, tight inline spacing          |
| `space-1`   | 8px  | `1rem`     | Compact padding (badge, avatar chip)             |
| `space-1.5` | 12px | `1.5rem`   | Row padding (table, sidebar nav items)           |
| `space-2`   | 16px | `2rem`     | Card padding (small), section gaps              |
| `space-3`   | 24px | `3rem`     | Card padding (standard), section padding        |
| `space-4`   | 32px | `4rem`     | Page content padding (horizontal)               |
| `space-6`   | 48px | `6rem`     | Section vertical rhythm                         |
| `space-8`   | 64px | `8rem`     | Page-level vertical margins                     |

**Sidebar padding:** 12px horizontal, 8px vertical for items.
**Content area padding:** 32px horizontal, 24px top.
**Card inner padding:** 16px.
**Modal padding:** 24px.

---

## 6. Border Radius System

| Token     | Value | Use                                                   |
|-----------|-------|-------------------------------------------------------|
| `rounded-sm`  | 4px  | Badges, small chips, code spans                    |
| `rounded`     | 6px  | Buttons, inputs, small cards                       |
| `rounded-md`  | 8px  | Cards, dropdowns, tooltips                         |
| `rounded-lg`  | 10px | Modals, panels, side panels                        |
| `rounded-xl`  | 12px | Floating AI panel, large card surfaces             |
| `rounded-full`| 9999px | Avatars, priority dots, toggle switches           |

No `rounded-2xl` or larger — that reads as consumer, not tool.

---

## 7. Shadow System

Shadows are minimal. They serve one purpose: layering (indicating z-depth), not decoration.

```css
--shadow-xs:  0 1px 2px 0 rgba(0,0,0,0.05);                        /* Subtle card lift */
--shadow-sm:  0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10); /* Dropdown */
--shadow-md:  0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10); /* Modal, panel */
--shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10); /* Command palette */
```

Dark mode: replace `rgba(0,0,0,...)` with `rgba(0,0,0,...)` at higher opacity (0.3–0.5), plus a 1px inset border on the surface itself:
```css
/* Dark mode elevation approach */
--shadow-sm: 0 0 0 1px var(--color-border), 0 2px 4px rgba(0,0,0,0.4);
```

**No box-shadow for hover states.** Use background color change instead.

---

## 8. Component Specifications

### 8.1 Sidebar

**Dimensions:**
- Width: `240px` (fixed, not resizable in v1)
- Background: `var(--color-bg-subtle)`
- Border-right: `1px solid var(--color-border)`

**Structure:**
```
Sidebar
├── Header (48px height)
│   ├── Logo / Workspace name (14px semibold)
│   └── Collapse trigger (optional v2 feature)
├── Nav section: Main (flex-col gap-0.5)
│   ├── Nav item × N
│   └── ...
├── Divider (1px border, mx-3)
├── Nav section: Projects
│   ├── Section label ("Projects" — 11px medium uppercase, color-text-muted, px-3 py-1)
│   ├── Project item × N
│   └── [+ New Project] button
└── Footer (mt-auto)
    ├── User avatar + name
    └── Settings icon
```

**Nav item — default:**
```
height: 32px
padding: 0 12px
border-radius: 6px
display: flex, align-items: center, gap: 8px
font: 14px / 500 / text-secondary
icon: 16px, color: text-muted
background: transparent
cursor: pointer
```

**Nav item — hover:**
```
background: var(--color-bg-muted)
text: text-primary
icon: text-secondary
transition: background 100ms ease
```

**Nav item — active:**
```
background: var(--color-accent-subtle)
text: var(--color-accent)  [font-weight: 500]
icon: var(--color-accent)
border: none (no left border stripe — cleaner than Linear's approach)
```

**Project item — same as nav item** but with an additional colored dot (4px circle, project color) before the project name.

---

### 8.2 Navigation Items

Icon sizes within nav:
- Standard nav icon: `16px` (Phosphor `size={16}`)
- Active nav icon: same size, color changes to accent
- Badge count on nav (e.g., notifications): `height: 18px`, `min-width: 18px`, `padding: 0 5px`, `border-radius: 9px`, `font: 11px/500`, `background: accent`, `color: inverse`

---

### 8.3 Buttons

All buttons: `border-radius: 6px`, `font: 14px / 500`, `height: 32px`, `padding: 0 12px`, `transition: all 150ms ease`, `cursor: pointer`.

**Primary**
```
background: var(--color-accent)
color: #ffffff
border: 1px solid var(--color-accent)

:hover  → background: var(--color-accent-hover)
:focus  → outline: 2px solid var(--color-border-focus), outline-offset: 2px
:active → opacity: 0.9, transform: scale(0.98)
:disabled → opacity: 0.4, cursor: not-allowed
```

**Secondary**
```
background: var(--color-bg-base)
color: var(--color-text-secondary)
border: 1px solid var(--color-border-strong)

:hover  → background: var(--color-bg-muted), border-color: var(--color-border-strong)
:focus  → outline: 2px solid var(--color-border-focus), outline-offset: 2px
:active → background: var(--color-bg-muted)
:disabled → opacity: 0.4, cursor: not-allowed
```

**Ghost**
```
background: transparent
color: var(--color-text-muted)
border: none

:hover  → background: var(--color-bg-muted), color: var(--color-text-primary)
:focus  → outline: 2px solid var(--color-border-focus), outline-offset: 2px
:active → background: var(--color-bg-subtle)
```

**Destructive**
```
background: var(--color-destructive)
color: #ffffff
border: 1px solid var(--color-destructive)

:hover  → background: var(--color-destructive-hover)
:focus  → outline: 2px solid #fca5a5, outline-offset: 2px
```

**Icon button (square)**
```
width: 32px, height: 32px, padding: 0
display: flex, align-items: center, justify-content: center
Uses: Ghost variant by default
Icon size: 16px
```

**Size variants:**
- `sm`: height 28px, padding 0 10px, font 13px
- `md`: height 32px (default)
- `lg`: height 36px, padding 0 16px, font 15px

---

### 8.4 Badges

All badges: `border-radius: 4px`, `font: 11px / 500`, `padding: 2px 6px`, `display: inline-flex`, `align-items: center`, `gap: 4px`, `white-space: nowrap`.

**Status badges:**

| Status      | Text color                          | Background                         | Border                              |
|-------------|-------------------------------------|------------------------------------|-------------------------------------|
| On Track    | `--color-status-on-track`           | `--color-status-on-track-bg`       | `--color-status-on-track-border`    |
| Delayed     | `--color-status-delayed`            | `--color-status-delayed-bg`        | `--color-status-delayed-border`     |
| At Risk     | `--color-status-at-risk`            | `--color-status-at-risk-bg`        | `--color-status-at-risk-border`     |
| Not Started | `--color-status-not-started`        | `--color-status-not-started-bg`    | `--color-status-not-started-border` |
| Done        | `--color-status-done`               | `--color-status-done-bg`           | `--color-status-done-border`        |

Badge border: `1px solid [border token]`.

**Risk badges:**

Same structure as status, using `--color-risk-*` tokens. Include a small circle (5px) before the text to reinforce meaning at small sizes.

**Priority indicators:**

Priority uses a dot, not a full badge:
```
width: 8px, height: 8px, border-radius: 50%
background: var(--color-priority-[level])
display: inline-block
```

For list/table contexts, combine dot + label (optional — label can be hidden to save space). Label: 12px / 500 / text-secondary.

---

### 8.5 Cards

**Task card (Kanban)**
```
background: var(--color-surface-1)
border: 1px solid var(--color-border)
border-radius: 8px
padding: 12px
width: 100% of column (column width: ~240px)
cursor: pointer

Content layout (vertical stack, gap: 8px):
├── Row 1: Epic label (badge, xs) + [spacer] + Priority dot
├── Row 2: Task title (14px / 400 / text-primary, 2-line clamp)
├── Row 3: Status badge
└── Row 4: [Assignee avatar 20px] + [Due date xs muted] + [Comment count icon+count xs]

:hover → background: var(--color-bg-subtle), border-color: var(--color-border-strong)
:active → transform: scale(0.99)
```

**Epic card (list item)**
```
background: var(--color-surface-1)
border: 1px solid var(--color-border)
border-radius: 8px
padding: 16px
cursor: pointer

Content layout:
├── Row 1: Epic title (15px / 500 / text-primary) + [spacer] + Status badge + Risk badge
├── Row 2: Description (13px / 400 / text-muted, 1-line clamp)
├── Row 3: Progress bar (full width, 4px height) + [progress %]
└── Row 4: [Goal chip] + [Task count] + [Assignee avatars, max 3 stacked] + [Due date]

:hover → border-color: var(--color-border-strong), shadow: var(--shadow-xs)
```

**Project card (Dashboard grid)**
```
background: var(--color-surface-1)
border: 1px solid var(--color-border)
border-radius: 8px
padding: 20px
cursor: pointer

Content layout:
├── Row 1: [Project color dot 10px] + Project name (15px / 600) + [spacer] + Risk badge
├── Row 2: Description (13px / 400 / text-muted, 2-line clamp)
├── Row 3: Progress bar + [progress %] + [Sprint/Cycle label]
├── Row 4: [Open task count] + [At risk task count badge] + [spacer] + [Team avatars]
└── Footer: Due date + Status badge

:hover → border-color: var(--color-border-strong)
```

---

### 8.6 Input Fields

```
height: 32px
padding: 0 10px
border: 1px solid var(--color-border)
border-radius: 6px
background: var(--color-bg-base)
font: 14px / 400 / text-primary
color: var(--color-text-primary)
placeholder-color: var(--color-text-muted)

:focus → border-color: var(--color-border-focus), outline: none, box-shadow: 0 0 0 3px var(--color-accent-subtle)
:hover → border-color: var(--color-border-strong)
:disabled → background: var(--color-surface-3), color: var(--color-text-disabled), cursor: not-allowed
:error → border-color: var(--color-status-delayed), box-shadow: 0 0 0 3px var(--color-status-delayed-bg)
```

**Textarea:**
Same as input but `min-height: 80px`, `padding: 8px 10px`, `resize: vertical`.

**Search input:**
Same but with a leading search icon (16px, `MagnifyingGlass` from Phosphor) inside at `left: 10px`, and `padding-left: 34px`.

**Label:**
```
font: 13px / 500 / text-secondary
margin-bottom: 4px
display: block
```

**Helper text / Error message:**
```
font: 12px / 400
margin-top: 4px
color: text-muted (helper) or status-delayed (error)
```

---

### 8.7 Modals

```
backdrop: rgba(0,0,0,0.4) — no blur (blur is slow, feels heavy)
panel:
  background: var(--color-bg-overlay)
  border: 1px solid var(--color-border)
  border-radius: 10px
  box-shadow: var(--shadow-lg)
  max-width: 480px (default) / 640px (wide) / 800px (form-heavy)
  width: calc(100vw - 48px)
  max-height: calc(100vh - 96px)
  overflow-y: auto

Structure:
├── Header (padding: 20px 24px 0 24px)
│   ├── Title (16px / 600 / text-primary)
│   └── Close button (icon, top-right, absolute)
├── Body (padding: 16px 24px)
│   └── Content
└── Footer (padding: 0 24px 20px 24px, border-top: 1px border, padding-top: 16px)
    └── [Cancel] [Confirm] — right-aligned
```

**Animation:**
- Entry: `opacity 0→1` + `translateY(8px)→0`, `duration: 150ms`, `ease-out`
- Exit: `opacity 1→0` + `translateY(0)→4px`, `duration: 100ms`, `ease-in`

---

### 8.8 Side Panel

Used for Epic detail, Notification panel, AI Assistant (wide mode).

```
position: fixed, right: 0, top: 0, bottom: 0
width: 480px (default) / 600px (wide — task detail)
background: var(--color-bg-base)
border-left: 1px solid var(--color-border)
box-shadow: var(--shadow-md)
z-index: 50
overflow-y: auto

Animation:
  Entry: translateX(100%) → translateX(0), duration: 200ms, ease-out
  Exit: translateX(0) → translateX(100%), duration: 150ms, ease-in
```

**Structure:**
```
├── Panel header (48px, sticky top, border-bottom)
│   ├── Title or breadcrumb
│   ├── [spacer]
│   ├── Action buttons (maximize, external link, close)
│   └── Close button (X icon, ghost)
├── Tab bar (if tabbed — e.g., Epic panel)
│   └── [Overview] [Tasks] [Docs] — 14px/500, active: accent underline 2px
├── Panel body (padding: 20px 24px)
└── Panel footer (sticky bottom, if needed — for comment input, etc.)
```

---

### 8.9 Avatar

```
Sizes:
  xs:  20px × 20px — task cards, inline
  sm:  24px × 24px — table rows
  md:  32px × 32px — sidebar user section, comment thread
  lg:  40px × 40px — profile views, My Work header
  xl:  48px × 48px — team workload row

Shape: border-radius: 50%
Background: seeded by user ID → one of 8 accent colors (from a defined palette)
Text: initials, font: 11–14px (scales with size) / 600 / white

Stacked avatars (max 3 shown + "+N"):
  overlap: -6px margin-left from second onward
  border: 2px solid var(--color-bg-base)
```

---

### 8.10 Progress Bar

```
Container:
  height: 4px (compact, on cards) or 6px (in detail panels)
  background: var(--color-bg-muted)
  border-radius: 9999px
  overflow: hidden

Fill:
  height: 100%
  border-radius: 9999px
  background: determined by progress:
    0%       → var(--color-status-not-started)
    1–33%    → var(--color-status-at-risk) [amber, just started]
    34–66%   → var(--color-accent) [blue, in progress]
    67–99%   → var(--color-status-on-track) [green, nearly done]
    100%     → var(--color-status-done) [blue, complete]
  transition: width 300ms ease
```

---

### 8.11 Dropdown / Combobox

```
Trigger: same as Secondary button or Input
Menu:
  position: absolute, z-index: 100
  background: var(--color-bg-overlay)
  border: 1px solid var(--color-border)
  border-radius: 8px
  box-shadow: var(--shadow-sm)
  padding: 4px
  min-width: 160px
  max-height: 320px
  overflow-y: auto

Menu item:
  height: 32px
  padding: 0 8px
  border-radius: 4px
  font: 14px / 400 / text-secondary
  display: flex, align-items: center, gap: 8px
  cursor: pointer

  :hover → background: var(--color-bg-muted), color: text-primary
  :selected → background: var(--color-accent-subtle), color: accent, font-weight: 500
  :disabled → opacity: 0.4, cursor: not-allowed

Divider between groups: 1px border, margin: 4px 0
Section label: 11px / 500 / text-muted / uppercase / px-2 py-1

Animation: opacity + scaleY from transform-origin top, 120ms ease-out
```

---

### 8.12 Command Palette (⌘K)

```
Overlay: rgba(0,0,0,0.5) — slightly darker than modal
Panel:
  position: fixed, top: 15vh, left: 50%, transform: translateX(-50%)
  width: min(640px, calc(100vw - 32px))
  background: var(--color-bg-overlay)
  border: 1px solid var(--color-border-strong)
  border-radius: 10px
  box-shadow: var(--shadow-lg)
  overflow: hidden

Search input:
  padding: 14px 16px
  font: 15px / 400 / text-primary
  border: none, border-bottom: 1px solid var(--color-border)
  background: transparent
  width: 100%
  outline: none
  Leading icon: MagnifyingGlass 18px, text-muted

Results area:
  padding: 8px
  max-height: 400px
  overflow-y: auto

Result group header:
  font: 11px / 500 / text-muted / uppercase
  padding: 8px 8px 4px
  letter-spacing: 0.04em

Result item:
  height: 36px
  padding: 0 8px
  border-radius: 6px
  display: flex, align-items: center, gap: 10px
  font: 14px / 400 / text-primary
  cursor: pointer

  :hover / keyboard-selected → background: var(--color-bg-muted)
  Sub-label: float right, 12px / text-muted

Keyboard shortcut chips (right side of item):
  font: 11px / 500 / mono
  background: var(--color-bg-muted)
  border: 1px solid var(--color-border)
  border-radius: 4px
  padding: 2px 5px

Footer:
  border-top: 1px solid var(--color-border)
  padding: 8px 12px
  display: flex, gap: 12px
  font: 11px / text-muted
  Shows: ↑↓ navigate • ↵ open • esc close

Animation: opacity + scale(0.97→1.0) from center, 120ms ease-out
```

---

### 8.13 Toast Notifications

```
Position: bottom-right, fixed, z-index: 200
Stack gap: 8px (newest on top)
Max visible: 3

Toast:
  background: var(--color-bg-overlay)
  border: 1px solid var(--color-border)
  border-radius: 8px
  box-shadow: var(--shadow-md)
  padding: 12px 14px
  min-width: 280px
  max-width: 380px
  display: flex, gap: 10px

  Icon (left, 18px): color matches type
  Content:
    Title: 14px / 500 / text-primary
    Message (optional): 13px / 400 / text-muted
  Close button (right, ghost, 16px X)

Types + left border (3px solid):
  success  → var(--color-status-on-track)
  error    → var(--color-status-delayed)
  warning  → var(--color-status-at-risk)
  info     → var(--color-accent)

Animation:
  Entry: translateX(100%) → translateX(0), opacity 0→1, 200ms ease-out
  Exit: translateX(0) → translateX(100%), opacity 1→0, 150ms ease-in
  Auto-dismiss: 4000ms (success/info), 6000ms (warning), no auto-dismiss (error)
```

---

## 9. Animation Principles

### Rules

1. **Duration budget:** UI transitions are 100–200ms. Nothing lingers. Linear uses 150ms for most state changes — match that.
2. **Easing:** `ease-out` for entries (fast start, soft end feels responsive). `ease-in` for exits (clean disappear). `ease-in-out` for transforms mid-interaction.
3. **No bounces, no springs in data-heavy UI.** Physics-based springs are charming in consumer apps. In a project tracker used 8 hours a day, they become noise.
4. **Reduced motion:** All transitions must respect `prefers-reduced-motion: reduce`. Use `@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important; } }`.
5. **Skeleton screens** over spinners for page-level loading. Spinners for inline/button loading states.

### Transition Reference

| Interaction                    | Duration | Easing    | Property                  |
|-------------------------------|----------|-----------|---------------------------|
| Button hover                   | 100ms    | ease      | background                |
| Nav item hover/active          | 100ms    | ease      | background, color         |
| Dropdown open                  | 120ms    | ease-out  | opacity, transform        |
| Side panel open                | 200ms    | ease-out  | transform (translateX)    |
| Side panel close               | 150ms    | ease-in   | transform                 |
| Modal open                     | 150ms    | ease-out  | opacity, transform (Y)    |
| Modal close                    | 100ms    | ease-in   | opacity, transform        |
| Command palette open           | 120ms    | ease-out  | opacity, scale            |
| Toast entry                    | 200ms    | ease-out  | transform (X), opacity    |
| Progress bar fill              | 300ms    | ease      | width                     |
| Kanban drag placeholder        | 150ms    | ease      | opacity, scale            |
| Skeleton shimmer               | 1500ms   | ease-in-out (loop) | background-position |

---

## 10. Icon Usage Guidelines

**Library:** Phosphor Icons (`phosphor-vue` for Nuxt/Vue)
**Default weight:** `regular` (outlined)

### Weight Guidelines

| Weight    | Use case                                                         |
|-----------|------------------------------------------------------------------|
| `regular` | All navigation icons, action icons, inline icons in body text    |
| `bold`    | Empty state hero icons, alert/error icons where emphasis needed  |
| `fill`    | Active/selected states (e.g., active nav item icon, filled star) |
| `duotone` | Not used — too decorative for this aesthetic                     |
| `thin`    | Not used — too fragile at small sizes                            |
| `light`   | Not used — same reason as thin                                   |

### Size Reference

| Context                        | Size |
|-------------------------------|------|
| Sidebar nav items              | 16px |
| Toolbar / action bar buttons   | 16px |
| Table row icons (inline)       | 14px |
| Badge icons (leading)          | 12px |
| Toast icons                    | 18px |
| Empty state hero icon          | 40px |
| Command palette result icons   | 16px |
| Priority dot (not an icon)     | 8px dot |

### Icon Color

- Default: `var(--color-text-muted)` (gray)
- Active/hover: `var(--color-text-secondary)` or `var(--color-accent)`
- Status icons: match status color token
- Destructive actions: `var(--color-destructive)`

### Common Icons Mapping

| Feature                | Phosphor Icon        |
|------------------------|----------------------|
| Dashboard              | `SquaresFour`        |
| Goals                  | `Target`             |
| Epics                  | `Lightning`          |
| Board/Kanban           | `Kanban`             |
| My Work                | `CheckSquare`        |
| My Day                 | `Sun`                |
| Team Workload          | `Users`              |
| Docs Hub               | `Files`              |
| Global Search          | `MagnifyingGlass`    |
| AI Assistant           | `Sparkle`            |
| Notifications          | `Bell`               |
| Settings               | `GearSix`            |
| Add / Create           | `Plus`               |
| Delete                 | `Trash`              |
| Edit                   | `PencilSimple`       |
| Link / Dependency      | `Link`               |
| Assignee               | `UserCircle`         |
| Due Date               | `CalendarBlank`      |
| Priority               | `ArrowUp` (high) / `ArrowRight` (medium) / `ArrowDown` (low) |
| Comment                | `ChatCircle`         |
| Attachment             | `Paperclip`          |
| Time tracking          | `Clock`              |
| Filter                 | `Funnel`             |
| Sort                   | `ArrowsDownUp`       |
| Collapse/Expand        | `CaretRight` / `CaretDown` |
| Close / Dismiss        | `X`                  |
| External link          | `ArrowSquareOut`     |
| Copy                   | `Copy`               |
| More options (…)       | `DotsThree`          |

---

## 11. Interaction States Summary

Every interactive element must have all five states defined:
1. **Default** — resting state
2. **Hover** — cursor over element
3. **Focus** — keyboard focus (ring visible)
4. **Active** — pressed / selected
5. **Disabled** — non-interactive

Focus rings:
- All interactive elements: `outline: 2px solid var(--color-border-focus)`, `outline-offset: 2px`
- Do not use `outline: none` without providing an alternative visible focus indicator

---

## 12. Tailwind CSS v4 Configuration Notes

Tailwind v4 reads design tokens from `@theme {}` in your main CSS file. Map all tokens above:

```css
/* main.css */
@import "tailwindcss";

@theme {
  --font-sans: 'Geist', 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, monospace;

  /* All color tokens defined in Section 3 go here */
  /* ... */

  --spacing-0-5: 4px;
  --spacing-1:   8px;
  --spacing-1-5: 12px;
  --spacing-2:   16px;
  --spacing-3:   24px;
  --spacing-4:   32px;
  --spacing-6:   48px;
  --spacing-8:   64px;

  --radius-sm: 4px;
  --radius:    6px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-xl: 12px;
}
```

---

*End of design.md*
