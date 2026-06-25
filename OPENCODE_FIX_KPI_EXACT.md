# Fix: KPI Cards — Copy Exact Code from Reference

## Instruction

**Stop recreating the KPI cards from scratch.** The reference file `dashboard-mockup-v3.html` already contains the exact, correct HTML structure and CSS. Your job is to port it 1:1 into the Vue component — no interpretation, no redesign.

Replace the entire KPI card component with the structure below. Swap hardcoded values for reactive props/data as needed, but **do not change any class names, layout structure, or inline styles**.

---

## Step 1 — Add these CSS classes

Add to `assets/css/main.css` (or the component's `<style>` block). Do not modify or rename any class.

```css
/* ─── KPI STRIP ─── */
.kpi-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  flex-shrink: 0;
}

.kpi-cell {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 16px 18px 16px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.kpi-cell.kpi-has-chart { padding-bottom: 0; }

.kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 8px;
}
.kpi-header-left { display: flex; align-items: center; gap: 8px; }

.kpi-icon {
  width: 28px; height: 28px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.kpi-icon svg { color: white; }
.kpi-icon-blue   { background: #3B82F6; }
.kpi-icon-red    { background: #EF4444; }
.kpi-icon-amber  { background: #F59E0B; }
.kpi-icon-green  { background: #22C55E; }

.kpi-label {
  font-size: 12px;
  font-weight: 500;
  color: #4B5563;
}

.kpi-info-btn {
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 1px solid #D1D5DB;
  background: none;
  color: #9CA3AF;
  font-size: 10px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  line-height: 1;
}

.kpi-num-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.kpi-number {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
  letter-spacing: -0.02em;
}

.kpi-delta {
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.kpi-delta.up   { color: #16A34A; }
.kpi-delta.down { color: #DC2626; }

.kpi-delta-label {
  font-size: 12px;
  color: #9CA3AF;
}

.kpi-progress {
  height: 5px;
  background: #F3F4F6;
  border-radius: 3px;
  margin-top: 14px;
  overflow: hidden;
}
.kpi-progress-fill { height: 100%; border-radius: 3px; }

.kpi-caption {
  font-size: 11px;
  color: #9CA3AF;
  margin-top: 7px;
}

/* At Risk — mini bars */
.kpi-mini-bars { display: flex; flex-direction: column; gap: 9px; margin-top: auto; }
.kpi-mini-bar-row { display: flex; align-items: center; gap: 8px; }
.kpi-mini-bar-label { font-size: 11px; color: #6B7280; width: 50px; flex-shrink: 0; }
.kpi-mini-bar-track { flex: 1; height: 5px; background: #F3F4F6; border-radius: 3px; overflow: hidden; }
.kpi-mini-bar-fill  { height: 100%; border-radius: 3px; }
.kpi-mini-bar-val   { font-size: 12px; font-weight: 600; color: #374151; width: 14px; text-align: right; flex-shrink: 0; }

/* Due This Week — full-width chart */
.kpi-chart-full {
  margin-top: 12px;
  margin-left: -18px;
  margin-right: -18px;
  height: 58px;
  flex-shrink: 0;
}
.kpi-chart-full svg { width: 100%; height: 100%; display: block; }

/* Completion Rate */
.kpi-pct-big { font-size: 32px; font-weight: 700; color: #111827; line-height: 1; letter-spacing: -0.02em; }
.kpi-completion-body { display: flex; align-items: center; gap: 16px; margin-top: auto; }
.kpi-stacked { margin-top: auto; }
.kpi-stacked-track {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  gap: 2px;
}
.kpi-stacked-seg { height: 100%; }
.kpi-stacked-labels { display: flex; margin-top: 10px; }
.kpi-stacked-lbl { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.kpi-stacked-lbl:not(:first-child) { border-left: 1px solid #F3F4F6; padding-left: 10px; }
.kpi-stacked-lbl-val  { font-size: 14px; font-weight: 700; line-height: 1.2; }
.kpi-stacked-lbl-text { font-size: 10.5px; color: #9CA3AF; }
```

---

## Step 2 — Replace the KPI HTML with this exact structure

In the dashboard Vue component, replace the entire KPI section with:

```html
<div class="kpi-strip">

  <!-- Card 1: Open Tasks -->
  <div class="kpi-cell">
    <div class="kpi-header">
      <div class="kpi-header-left">
        <div class="kpi-icon kpi-icon-blue">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </div>
        <span class="kpi-label">Open Tasks</span>
      </div>
      <button class="kpi-info-btn">i</button>
    </div>
    <div class="kpi-num-row">
      <span class="kpi-number">42</span>
      <span class="kpi-delta up">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5l7 7H5l7-7z"/></svg>
        12%
      </span>
      <span class="kpi-delta-label">vs last week</span>
    </div>
    <div style="flex:1"></div>
    <div class="kpi-progress">
      <div class="kpi-progress-fill" style="width:68%;background:#22C55E"></div>
    </div>
    <div class="kpi-caption" style="margin-bottom:2px">68% of weekly target complete</div>
  </div>

  <!-- Card 2: At Risk -->
  <div class="kpi-cell">
    <div class="kpi-header">
      <div class="kpi-header-left">
        <div class="kpi-icon kpi-icon-red">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <span class="kpi-label">At Risk</span>
      </div>
      <button class="kpi-info-btn">i</button>
    </div>
    <div class="kpi-num-row">
      <span class="kpi-number" style="color:#DC2626">7</span>
      <span class="kpi-delta up" style="color:#DC2626">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 19l7-7H5l7 7z"/></svg>
        3
      </span>
      <span class="kpi-delta-label">fewer this week</span>
    </div>
    <div class="kpi-mini-bars">
      <div class="kpi-mini-bar-row">
        <span class="kpi-mini-bar-label">Overdue</span>
        <div class="kpi-mini-bar-track">
          <div class="kpi-mini-bar-fill" style="width:71%;background:#EF4444"></div>
        </div>
        <span class="kpi-mini-bar-val">5</span>
      </div>
      <div class="kpi-mini-bar-row">
        <span class="kpi-mini-bar-label">Blocked</span>
        <div class="kpi-mini-bar-track">
          <div class="kpi-mini-bar-fill" style="width:29%;background:#F59E0B"></div>
        </div>
        <span class="kpi-mini-bar-val">2</span>
      </div>
    </div>
  </div>

  <!-- Card 3: Due This Week -->
  <div class="kpi-cell kpi-has-chart">
    <div class="kpi-header">
      <div class="kpi-header-left">
        <div class="kpi-icon kpi-icon-amber">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <span class="kpi-label">Due This Week</span>
      </div>
      <button class="kpi-info-btn">i</button>
    </div>
    <div class="kpi-num-row">
      <span class="kpi-number">11</span>
      <span class="kpi-delta up">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5l7 7H5l7-7z"/></svg>
        5%
      </span>
      <span class="kpi-delta-label">vs last month</span>
    </div>
    <div class="kpi-chart-full">
      <svg viewBox="0 0 300 58" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lgFull" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#22C55E" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#22C55E" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <line x1="0" y1="32" x2="300" y2="32" stroke="#F3F4F6" stroke-dasharray="5 4" stroke-width="1"/>
        <path d="M 0,48 C 25,46 35,42 60,44 C 85,46 95,36 120,32 C 145,28 155,36 180,30 C 205,24 215,18 240,20 L 300,16 L 300,58 L 0,58 Z" fill="url(#lgFull)"/>
        <path d="M 0,48 C 25,46 35,42 60,44 C 85,46 95,36 120,32 C 145,28 155,36 180,30 C 205,24 215,18 240,20 L 300,16" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        <circle cx="240" cy="20" r="3.5" fill="#22C55E" stroke="white" stroke-width="2"/>
      </svg>
    </div>
  </div>

  <!-- Card 4: Completion Rate -->
  <div class="kpi-cell">
    <div class="kpi-header">
      <div class="kpi-header-left">
        <div class="kpi-icon kpi-icon-green">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <span class="kpi-label">Completion Rate</span>
      </div>
      <button class="kpi-info-btn">i</button>
    </div>
    <div class="kpi-completion-body">
      <div class="kpi-completion-left">
        <span class="kpi-pct-big">72%</span>
        <div style="display:flex;align-items:center;gap:4px;margin-top:4px">
          <span class="kpi-delta up">↑ 8%</span>
          <span class="kpi-delta-label">this week</span>
        </div>
      </div>
      <div class="kpi-stacked" style="flex:1">
        <div class="kpi-stacked-track">
          <div class="kpi-stacked-seg" style="flex:72;background:#22C55E;border-radius:4px 0 0 4px"></div>
          <div class="kpi-stacked-seg" style="flex:21;background:#3B82F6"></div>
          <div class="kpi-stacked-seg" style="flex:7;background:#F59E0B;border-radius:0 4px 4px 0"></div>
        </div>
        <div class="kpi-stacked-labels" style="margin-top:8px">
          <div class="kpi-stacked-lbl">
            <span class="kpi-stacked-lbl-val" style="color:#16A34A">28</span>
            <span class="kpi-stacked-lbl-text">Done</span>
          </div>
          <div class="kpi-stacked-lbl">
            <span class="kpi-stacked-lbl-val" style="color:#2563EB">9</span>
            <span class="kpi-stacked-lbl-text">Active</span>
          </div>
          <div class="kpi-stacked-lbl">
            <span class="kpi-stacked-lbl-val" style="color:#D97706">5</span>
            <span class="kpi-stacked-lbl-text">At Risk</span>
          </div>
        </div>
      </div>
    </div>
  </div>

</div><!-- /kpi-strip -->
```

---

## What NOT to change (KPI section)

- Any other dashboard component outside the `.kpi-strip`
- The data/props feeding into these cards — only replace the template and styles
- Do not add Chart.js, recharts, or any chart library — the sparkline is a raw inline SVG path
- Do not wrap cards in extra `<div>` containers not present in the structure above

---

# Fix: Projects Table — Copy Exact Code from Reference

## Instruction

**Same rule applies.** Do not rebuild the projects table. Port the exact HTML + CSS below. Replace static values with reactive data, but do not change any class names or layout structure.

---

## Step 1 — Add these CSS classes

```css
/* ─── PROJECTS TABLE ─── */
.proj-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.proj-table thead th {
  padding: 8px 12px;
  text-align: left;
  font-size: 11.5px;
  font-weight: 500;
  color: #9CA3AF;
  border-bottom: 1px solid #F3F4F6;
  white-space: nowrap;
  background: white;
}

.proj-table thead th:first-child { padding-left: 14px; width: 32px; }
.proj-table thead th:last-child  { width: 28px; text-align: center; }

.proj-table tbody tr {
  border-bottom: 1px solid #F3F4F6;
  transition: background 0.1s;
  cursor: pointer;
}
.proj-table tbody tr:last-child { border-bottom: none; }
.proj-table tbody tr:hover { background: #F9FAFB; }

.proj-table td {
  padding: 10px 12px;
  vertical-align: middle;
}
.proj-table td:first-child { padding-left: 14px; }

.col-check input[type="checkbox"] {
  width: 14px; height: 14px;
  accent-color: #2563EB;
  cursor: pointer;
}

.col-name {
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
}

.col-deadline { color: #6B7280; white-space: nowrap; }
.col-deadline.overdue { color: #EF4444; font-weight: 500; }
.col-people { white-space: nowrap; }

/* Progress bar in table */
.tbl-prog { min-width: 110px; display: flex; align-items: center; gap: 8px; }
.tbl-prog-track { flex: 1; height: 4px; background: #F3F4F6; border-radius: 99px; overflow: hidden; }
.tbl-prog-fill  { height: 100%; border-radius: 99px; }
.tbl-prog-label { font-size: 11px; font-weight: 500; color: #6B7280; white-space: nowrap; flex-shrink: 0; }

/* Status pills */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
}
.status-pill::before {
  content: '';
  width: 7px; height: 7px;
  border-radius: 2px;
  flex-shrink: 0;
}
.status-pill.at-risk     { background: #FFFBEB; color: #92400E; border: 1px solid #FDE68A; }
.status-pill.at-risk::before { background: #F59E0B; }
.status-pill.on-track    { background: #F0FDF4; color: #166534; border: 1px solid #BBF7D0; }
.status-pill.on-track::before { background: #22C55E; }
.status-pill.not-started { background: #F8FAFC; color: #6B7280; border: 1px solid #E5E7EB; }
.status-pill.not-started::before { background: #9CA3AF; border-radius: 50%; }

/* Priority pills */
.priority-pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
}
.priority-pill.high   { background: #FEE2E2; color: #B91C1C; }
.priority-pill.medium { background: #FEF3C7; color: #92400E; }
.priority-pill.low    { background: #D1FAE5; color: #065F46; }

/* Avatar stack */
.avatar-stack { display: flex; align-items: center; }
.avatar-sm {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 2px solid white;
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin-left: -7px; flex-shrink: 0; color: white;
}
.avatar-sm:first-child { margin-left: 0; }
.avatar-overflow {
  width: 28px; height: 28px;
  border-radius: 50%; border: 2px solid white;
  margin-left: -7px;
  background: #E5E7EB; color: #4B5563;
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

/* Avatar colors */
.av-ra { background: #6366F1; }
.av-m  { background: #10B981; }
.av-d  { background: #F59E0B; }
.av-r  { background: #EC4899; }
.av-l  { background: #8B5CF6; }
.av-a  { background: #3B82F6; }

/* Row action button (vertical dots) */
.proj-more-btn {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
  border: none; background: transparent;
  border-radius: 6px; color: #D1D5DB;
  cursor: pointer; transition: background 0.1s, color 0.1s;
}
.proj-more-btn:hover { background: #F3F4F6; color: #374151; }

/* Section header */
.panel-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px 10px;
  border-bottom: 1px solid #F3F4F6;
  flex-shrink: 0;
}
.panel-title {
  font-size: 13px; font-weight: 600; color: #111827;
  display: flex; align-items: center; gap: 7px;
}
.panel-count {
  font-size: 11px; font-weight: 500; color: #9CA3AF;
  background: #F3F4F6; border-radius: 10px; padding: 1px 7px;
}
.link-sm {
  font-size: 12px; color: #9CA3AF; text-decoration: none;
  cursor: pointer; transition: color 0.1s;
}
.link-sm:hover { color: #374151; }

/* Filter button */
.filter-btn {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 500; color: #4B5563;
  background: white; border: 1px solid #E5E7EB;
  border-radius: 7px; padding: 4px 10px; cursor: pointer;
  transition: background 0.1s, border-color 0.1s;
}
.filter-btn:hover { background: #F9FAFB; border-color: #D1D5DB; }
.filter-btn.active { background: #EFF6FF; border-color: #DBEAFE; color: #2563EB; }

/* Filter dropdown */
.filter-dropdown {
  display: none; position: absolute; top: calc(100% + 6px); right: 0;
  background: white; border: 1px solid #E5E7EB; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1); padding: 12px; z-index: 200;
  min-width: 220px;
}
.filter-dropdown.open { display: block; }
.filter-group { margin-bottom: 12px; }
.filter-group:last-child { margin-bottom: 0; }
.filter-group-label { font-size: 10.5px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.filter-chips { display: flex; flex-wrap: wrap; gap: 5px; }
.filter-chip {
  font-size: 11.5px; padding: 3px 10px; border-radius: 20px;
  border: 1px solid #E5E7EB; background: white; color: #4B5563;
  cursor: pointer; transition: all 0.1s;
}
.filter-chip.on { background: #EFF6FF; border-color: #BFDBFE; color: #2563EB; }
.filter-actions { display: flex; justify-content: flex-end; gap: 6px; margin-top: 12px; padding-top: 10px; border-top: 1px solid #F3F4F6; }
.filter-clear { font-size: 12px; color: #6B7280; background: none; border: none; cursor: pointer; }
.filter-apply { font-size: 12px; font-weight: 500; color: white; background: #2563EB; border: none; border-radius: 6px; padding: 4px 12px; cursor: pointer; }

/* Context menu */
.ctx-menu {
  display: none; position: fixed;
  background: white; border: 1px solid #E5E7EB; border-radius: 9px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); padding: 4px; z-index: 300; min-width: 160px;
}
.ctx-menu.open { display: block; }
.ctx-item {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px; font-size: 13px; color: #374151;
  border-radius: 6px; cursor: pointer; transition: background 0.1s;
}
.ctx-item:hover { background: #F9FAFB; }
.ctx-item.danger { color: #DC2626; }
.ctx-item.danger:hover { background: #FEF2F2; }
.ctx-divider { height: 1px; background: #F3F4F6; margin: 4px 0; }
```

---

## Step 2 — Replace the projects table HTML with this exact structure

**Header (no view switcher tabs):**

```html
<div class="panel-header" style="position:relative">
  <div class="panel-title">
    Projects
    <span class="panel-count">5</span>
  </div>
  <div style="display:flex;align-items:center;gap:8px">
    <button class="filter-btn" @click="toggleFilter">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
      </svg>
      Filter
    </button>
    <!-- filter dropdown omitted for brevity — port from reference or use component -->
    <a class="link-sm" href="#">View all</a>
  </div>
</div>
```

**Table (map over your `projects` array using `v-for`):**

```html
<table class="proj-table">
  <thead>
    <tr>
      <th class="col-check"><input type="checkbox"></th>
      <th>Project Name</th>
      <th>Status</th>
      <th>Progress</th>
      <th>Deadline</th>
      <th>People</th>
      <th>Priority</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="p in projects" :key="p.id"
        @click="openProjectPanel(p)">
      <td class="col-check"><input type="checkbox" @click.stop></td>
      <td class="col-name">{{ p.name }}</td>
      <td>
        <span :class="['status-pill', p.statusClass]">{{ p.statusLabel }}</span>
      </td>
      <td>
        <div class="tbl-prog">
          <div class="tbl-prog-track">
            <div class="tbl-prog-fill" :style="{ width: p.progress + '%', background: p.progressColor }"></div>
          </div>
          <div class="tbl-prog-label">{{ p.progress }}%</div>
        </div>
      </td>
      <td :class="['col-deadline', p.overdue ? 'overdue' : '']">{{ p.deadline }}</td>
      <td class="col-people">
        <div class="avatar-stack">
          <div v-for="a in p.assignees" :key="a.initials"
               :class="['avatar-sm', a.colorClass]">{{ a.initials }}</div>
          <div v-if="p.extraCount" class="avatar-overflow">+{{ p.extraCount }}</div>
        </div>
      </td>
      <td>
        <span :class="['priority-pill', p.priorityClass]">{{ p.priority }}</span>
      </td>
      <td class="col-more">
        <button class="proj-more-btn" @click.stop="openCtxMenu($event, p)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
      </td>
    </tr>
  </tbody>
</table>
```

**Status class mapping** (use in your data or computed):

| Status | `statusClass` | `progressColor` |
|---|---|---|
| On Track | `on-track` | `#22C55E` |
| At Risk | `at-risk` | `#EF4444` |
| Not Started | `not-started` | `#9CA3AF` |

**Priority class mapping:**

| Priority | `priorityClass` |
|---|---|
| High | `high` |
| Medium | `medium` |
| Low | `low` |

---

## What NOT to change (table section)

- Row click logic — keep opening the project peek panel
- Any filter / context menu business logic already in the codebase
- Do not add Nuxt UI `<UTable>` — use the raw `<table>` structure above
- Do not add a view switcher (Kanban / List / Calendar tabs)
