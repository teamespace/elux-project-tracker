# Fix: Projects Table — 5 Issues

## Context

The projects table on the dashboard has 5 visual issues. Fix only the components listed here. Reference: `dashboard-mockup-v3.html` for correct values.

---

## Fix 1 — Remove view switcher tabs (Kanban / List / Calendar)

**Problem:** A "Kanban | List | Calendar" tab bar was added to the projects section header. It does not exist in the design reference.

**Fix:** Remove the view toggle / tab switcher entirely from the projects section header. The header should only contain:
- Left: "Projects" title + count badge
- Right: Filter button + "View all" link

Do not add any other controls.

---

## Fix 2 — Status badges are broken / text wrapping

**Problem:** Status badges (At Risk, On Track, Not Started) appear as large stretched ovals with text wrapping onto multiple lines.

**Fix:** Status badge must be a compact single-line pill. Exact CSS from reference:

```css
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px 3px 7px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;   /* CRITICAL — prevents wrapping */
}

/* Dot before text */
.status-pill::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Colors */
.status-pill.at-risk     { background: #FFFBEB; color: #92400E; border: 1px solid #FDE68A; }
.status-pill.at-risk::before { background: #F59E0B; }
.status-pill.on-track    { background: #F0FDF4; color: #166534; border: 1px solid #BBF7D0; }
.status-pill.on-track::before { background: #22C55E; }
.status-pill.not-started { background: #F8FAFC; color: #6B7280; border: 1px solid #E5E7EB; }
.status-pill.not-started::before { background: #9CA3AF; }
```

The pill must never wrap. If text overflows, the cell clips it — never wraps the badge itself.

---

## Fix 3 — Table rows too tall / table too long vertically

**Problem:** Rows have too much vertical padding, making the table take up too much vertical space.

**Fix:** Tighten row padding so the table hugs its content. Exact values from reference:

```css
.proj-table td {
  padding: 10px 12px;
  vertical-align: middle;
}

.proj-table td:first-child { padding-left: 14px; }
```

Row height should visually feel compact — roughly 44–48px total per row. Do not add extra `line-height` or vertical padding beyond what's specified.

Progress bar track height: `height: 4px` (not 8px or taller).

```css
.tbl-prog-track { flex: 1; height: 4px; background: #F3F4F6; border-radius: 99px; overflow: hidden; }
.tbl-prog-fill  { height: 100%; border-radius: 99px; }
```

---

## Fix 4 — People avatars too small

**Problem:** Avatar circles in the People column are too small and hard to distinguish.

**Fix:** Increase to 28px (from 24px). Exact values:

```css
.avatar-sm {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid white;
  margin-left: -7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.avatar-sm:first-child { margin-left: 0; }

.avatar-overflow {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid white;
  margin-left: -7px;
  background: #E5E7EB;
  color: #4B5563;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
}
```

Avatar colors (use existing colored background classes — do not change them):
- av-a: `#6366F1` (indigo)
- av-d: `#EC4899` (pink)
- av-m: `#F59E0B` (amber)
- av-r: `#10B981` (emerald)
- av-ra: `#8B5CF6` (violet)

---

## Fix 5 — Three-dot action icon is wrong

**Problem:** The row action trigger is either plain text `···` or a horizontal ellipsis `…`. It should be a vertical three-dot icon (⋮).

**Fix:** Replace with a proper vertical dots SVG icon. The button is in the last column of each row (`col-more`):

```html
<!-- Replace the existing trigger with this -->
<button class="proj-more-btn" onclick="showCtxMenu(event, this)">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
  </svg>
</button>
```

```css
.proj-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #D1D5DB;
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}

.proj-more-btn:hover {
  background: #F3F4F6;
  color: #374151;
}
```

If the project uses Tabler Icons, use `<IconDotsVertical :size="16" :stroke-width="2" />` instead of the SVG inline.

---

## What NOT to change

- Row click behavior (opening project peek panel)
- Checkbox column
- Project name column
- Priority badges (those are correct)
- Deadline column (red for overdue is correct)
- Filter dropdown behavior
- Anything outside the projects table section
