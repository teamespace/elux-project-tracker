# Fix: KPI Cards — Delta Logic, Colors & Completion Rate Layout

## Context

The KPI card strip on the dashboard has 4 issues identified from comparing the current implementation against the design reference (`dashboard-mockup-v3.html`). Fix only what's listed here — do not touch other components.

The 4 cards are: **Open Tasks · At Risk · Due This Week · Completion Rate**

---

## Fix 1 — Delta direction is context-aware, not always ↑

**Problem:** Every delta currently shows `↑` regardless of whether the metric went up or down.

**Rule:** The delta indicator (`^` or `-` caret/dash, small, inline) must reflect the *actual direction of change*, not always point up.

```
Open Tasks:       42  ^ 12%  vs last week      ← went UP   (more tasks = neutral/bad, but show direction)
At Risk:           7  - 3    fewer this week    ← went DOWN (fewer at-risk tasks)
Due This Week:    11  ^ 5%   vs last month      ← went UP
Completion Rate: 72%  ^ 8%   this week          ← went UP
```

**Implementation:**
- Use a small caret `^` (not a large arrow `↑`) for increases
- Use a dash `-` for decreases  
- The symbol is small (font-size ~12px), the percentage/number next to it is the same size
- Do NOT use `↑` or `↓` arrow characters — use `^` and `-`

---

## Fix 2 — Delta color follows card theme, not "good/bad" semantics

**Problem:** "At Risk" card shows red + ↑ together, which reads as "danger increased" — but the card is red by theme, not because the delta is bad.

**Rule:** Delta color matches the card's accent color, not a universal green/red good/bad system.

| Card | Accent color | Delta color |
|---|---|---|
| Open Tasks | Blue (`#2563EB`) | Green (`#16A34A`) for the delta text |
| At Risk | Red (`#DC2626`) | Red (`#DC2626`) — matches card theme, not a warning |
| Due This Week | Amber (`#D97706`) | Green (`#16A34A`) for the delta text |
| Completion Rate | Green (`#16A34A`) | Green (`#16A34A`) |

For "At Risk": show `- 3 fewer this week` in red. Red here signals "this is the at-risk metric", not "something went wrong". The label text "fewer this week" clarifies the direction is actually positive.

---

## Fix 3 — Completion Rate card: color-code the 28 / 9 / 5 stats

**Problem:** The breakdown numbers (28 Done · 9 Active · 5 At Risk) are currently plain black/gray. They should each match their corresponding segment in the stacked bar.

**Rule:** Each number is colored to match its bar segment:

```
28  Done    →  color: #16A34A  (green,  matches green bar segment)
 9  Active  →  color: #6366F1  (indigo, matches blue bar segment)
 5  At Risk →  color: #D97706  (amber,  matches orange bar segment)
```

The label below each number ("Done", "Active", "At Risk") stays in `color: var(--gray-400)` muted gray.

**Layout:** Number (colored, font-weight 700) on top, label (muted, font-size 11px) below. The three pairs sit in a row below the stacked bar.

---

## Fix 4 — Due This Week sparkline shape

**Problem:** The sparkline currently trends upward linearly. It should show a realistic deadline distribution — peaks mid-period then curves back down.

**Rule:** The SVG sparkline path for "Due This Week" should follow a bell-curve-like shape: starts low, rises to a peak around 60% of the x-axis, then descends. End with a small filled circle dot at the last data point.

Example data points (relative, not real): `[2, 4, 6, 9, 11, 10, 8, 6, 4, 11]` — adjust to match the actual data but ensure the general arc shape.

The line is `stroke: #16A34A` (green), `stroke-width: 1.5`, no fill, with a `fill: #DCFCE7` area fill at low opacity (~0.3) beneath it.

---

## What NOT to change

- Card border, border-radius, padding, background
- Icon chip colors and sizes
- Card titles ("Open Tasks", "At Risk", etc.)
- The Overdue / Blocked bar rows inside "At Risk" card
- Progress bar in "Open Tasks" card
- Any other dashboard component outside the KPI strip
