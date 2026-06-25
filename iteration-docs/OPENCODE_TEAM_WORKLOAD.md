# OPENCODE PROMPT — Team Workload Page

## Goal
Rebuild `app/pages/team.vue` to exactly match `#page-team` in `dashboard-mockup-v3.html`. The current page has the workload table but is missing: KPI cards strip at the top, filter chips, legend row, and the full workload bar with tick marks. The avatar source also needs updating to use open-peeps (consistent with dashboard).

## Target file
- `app/pages/team.vue` — full template rewrite

---

## 1. Add these CSS classes to `app/assets/css/main.css`

```css
/* ─── TEAM WORKLOAD PAGE ─── */
.tw-filters { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.tw-filter-chip { font-size: 12px; padding: 4px 12px; border-radius: 20px; border: 1px solid #E5E7EB; background: white; color: #4B5563; cursor: pointer; transition: all 0.1s; }
.tw-filter-chip.active { background: oklch(96% 0.04 292.717); border-color: oklch(85% 0.13 292.717); color: oklch(52% 0.27 292.717); }
.tw-legend { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #6B7280; flex-wrap: wrap; }
.tw-legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.tw-legend-dot.available  { background: #22C55E; }
.tw-legend-dot.balanced   { background: #F59E0B; }
.tw-legend-dot.capacity   { background: #F97316; }
.tw-legend-dot.overloaded { background: #EF4444; }
.tw-sep { color: #D1D5DB; }
.tw-table-wrap { background: white; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; }
.tw-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.tw-table th { font-size: 11px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: .05em; padding: 10px 16px; border-bottom: 1px solid #F3F4F6; background: #F9FAFB; text-align: left; }
.tw-table th.right { text-align: right; }
.tw-table td { padding: 14px 16px; border-bottom: 1px solid #F3F4F6; vertical-align: middle; }
.tw-table tbody tr:last-child td { border-bottom: none; }
.tw-table tbody tr:hover { background: #F9FAFB; cursor: pointer; }
.tw-member-cell { display: flex; align-items: center; gap: 10px; }
.tw-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.tw-member-name { font-size: 13.5px; font-weight: 500; color: #1F2937; }
.tw-member-role { font-size: 11.5px; color: #9CA3AF; }
.tw-bar-wrap { display: flex; align-items: center; gap: 10px; }
.tw-bar-track { flex: 1; height: 8px; background: #F3F4F6; border-radius: 4px; overflow: visible; position: relative; }
.tw-bar-fill { height: 100%; border-radius: 4px; transition: width .3s; }
.tw-bar-fill.available  { background: #22C55E; }
.tw-bar-fill.balanced   { background: #F59E0B; }
.tw-bar-fill.capacity   { background: #F97316; }
.tw-bar-fill.overloaded { background: #EF4444; }
.tw-bar-track::before { content: ''; position: absolute; top: -2px; bottom: -2px; width: 1.5px; background: #D1D5DB; border-radius: 1px; left: 25%; }
.tw-bar-track::after  { content: ''; position: absolute; top: -2px; bottom: -2px; width: 1.5px; background: #D1D5DB; border-radius: 1px; left: 75%; }
.tw-count { font-size: 13px; font-weight: 600; color: #374151; min-width: 36px; text-align: right; white-space: nowrap; }
.tw-status-badge { font-size: 10.5px; font-weight: 700; letter-spacing: .04em; padding: 2px 8px; border-radius: 20px; white-space: nowrap; }
.tw-status-badge.available  { background: #F0FDF4; color: #15803D; }
.tw-status-badge.balanced   { background: #FFFBEB; color: #B45309; }
.tw-status-badge.capacity   { background: #FFF7ED; color: #C2410C; }
.tw-status-badge.overloaded { background: #FEF2F2; color: #B91C1C; }
.tw-num-cell { font-size: 13px; text-align: right; padding-right: 20px !important; }
.tw-num-cell.in-prog { color: oklch(52% 0.27 292.717); font-weight: 500; }
.tw-unassigned-row td { background: oklch(96% 0.04 292.717 / 0.4); }
.tw-unassigned-row:hover td { background: oklch(92% 0.08 292.717 / 0.4) !important; }
```

---

## 2. Full rewrite of `app/pages/team.vue`

```vue
<script setup lang="ts">
definePageMeta({ layout: 'default', title: 'Team Workload' })

const timeFilter = ref<'week' | 'sprint' | 'month'>('week')

interface Member {
  name: string; role: string; avatar: string
  capacity: number; assigned: number
  todo: number; inProgress: number; done: number
  status: 'available' | 'balanced' | 'capacity' | 'overloaded'
  statusLabel: string
}

const members: Member[] = [
  { name: 'Rasya Ardiansyah', role: 'Product Designer', avatar: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Rasya&backgroundColor=b6e3f4&backgroundType=solid', capacity: 12, assigned: 8, todo: 3, inProgress: 5, done: 4, status: 'capacity', statusLabel: 'AT CAPACITY' },
  { name: 'Maya Putri', role: 'UX Researcher', avatar: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Maya&backgroundColor=ffd5dc&backgroundType=solid', capacity: 12, assigned: 4, todo: 2, inProgress: 2, done: 6, status: 'available', statusLabel: 'AVAILABLE' },
  { name: 'Dito Santoso', role: 'Full Stack Engineer', avatar: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Dito&backgroundColor=c0aede&backgroundType=solid', capacity: 12, assigned: 12, todo: 4, inProgress: 8, done: 2, status: 'overloaded', statusLabel: 'OVERLOADED' },
  { name: 'Rara Hapsari', role: 'Content Strategist', avatar: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Rara&backgroundColor=f9a8d4&backgroundType=solid', capacity: 12, assigned: 5, todo: 2, inProgress: 3, done: 7, status: 'balanced', statusLabel: 'BALANCED' },
  { name: 'Lintang Dewi', role: 'Mobile Developer', avatar: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Lintang&backgroundColor=a5f3fc&backgroundType=solid', capacity: 12, assigned: 0, todo: 0, inProgress: 0, done: 3, status: 'available', statusLabel: 'AVAILABLE' },
]

function barPct(m: Member) {
  return Math.min(100, Math.round((m.assigned / m.capacity) * 100))
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="mw-header">
      <div>
        <div class="mw-title">Team Workload</div>
        <div class="mw-subtitle">This week · Jun 16–22, 2026</div>
      </div>
      <button class="inline-flex items-center gap-1.5 rounded-lg px-3.5 h-[34px] text-[13px] font-medium text-white" style="background:oklch(60.6% 0.25 292.717)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Assign task
      </button>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-strip">
      <!-- Total Tasks -->
      <div class="kpi-cell">
        <div class="kpi-header">
          <div class="kpi-header-left">
            <div class="kpi-icon kpi-icon-blue">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <span class="kpi-label">Total Tasks</span>
          </div>
          <button class="kpi-info-btn">i</button>
        </div>
        <div class="kpi-num-row">
          <span class="kpi-number">29</span>
          <span class="kpi-delta up">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5l7 7H5l7-7z"/></svg>
            +4
          </span>
          <span class="kpi-delta-label">this week</span>
        </div>
        <div class="kpi-caption">Across 4 active members</div>
      </div>

      <!-- Overloaded -->
      <div class="kpi-cell">
        <div class="kpi-header">
          <div class="kpi-header-left">
            <div class="kpi-icon kpi-icon-red">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <span class="kpi-label">Overloaded</span>
          </div>
          <button class="kpi-info-btn">i</button>
        </div>
        <div class="kpi-num-row">
          <span class="kpi-number" style="color:#DC2626">1</span>
        </div>
        <div class="kpi-progress"><div class="kpi-progress-fill" style="background:#EF4444;width:100%"></div></div>
        <div class="kpi-caption">Dito Santoso · 12/12 tasks</div>
      </div>

      <!-- Unassigned -->
      <div class="kpi-cell">
        <div class="kpi-header">
          <div class="kpi-header-left">
            <div class="kpi-icon kpi-icon-amber">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><line x1="19" y1="8" x2="23" y2="8"/></svg>
            </div>
            <span class="kpi-label">Unassigned</span>
          </div>
          <button class="kpi-info-btn">i</button>
        </div>
        <div class="kpi-num-row">
          <span class="kpi-number" style="color:#D97706">6</span>
          <span class="kpi-delta" style="color:#D97706">tasks</span>
        </div>
        <div class="kpi-caption">Need immediate assignment</div>
      </div>

      <!-- Avg Workload -->
      <div class="kpi-cell">
        <div class="kpi-header">
          <div class="kpi-header-left">
            <div class="kpi-icon kpi-icon-green">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <span class="kpi-label">Avg. Workload</span>
          </div>
          <button class="kpi-info-btn">i</button>
        </div>
        <div class="kpi-num-row">
          <span class="kpi-number">6.5</span>
          <span class="kpi-delta-label">tasks/member</span>
        </div>
        <div class="kpi-progress"><div class="kpi-progress-fill" style="background:#22C55E;width:54%"></div></div>
        <div class="kpi-caption">Capacity utilization 54%</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="tw-filters">
      <div style="display:flex;gap:4px">
        <button class="tw-filter-chip" :class="{ active: timeFilter === 'week' }" @click="timeFilter = 'week'">This week</button>
        <button class="tw-filter-chip" :class="{ active: timeFilter === 'sprint' }" @click="timeFilter = 'sprint'">This sprint</button>
        <button class="tw-filter-chip" :class="{ active: timeFilter === 'month' }" @click="timeFilter = 'month'">This month</button>
      </div>
      <select class="mw-select">
        <option>All Projects</option>
        <option>Alpha Project</option>
        <option>Beta Launch</option>
        <option>Mobile App MVP</option>
        <option>Design System v2</option>
      </select>
    </div>

    <!-- Legend -->
    <div class="tw-legend">
      <span class="tw-legend-dot available"></span> Available &lt;3 tasks
      <span class="tw-sep">·</span>
      <span class="tw-legend-dot balanced"></span> Balanced 3–5
      <span class="tw-sep">·</span>
      <span class="tw-legend-dot capacity"></span> At capacity 6–9
      <span class="tw-sep">·</span>
      <span class="tw-legend-dot overloaded"></span> Overloaded &gt;9
    </div>

    <!-- Table -->
    <div class="tw-table-wrap">
      <table class="tw-table">
        <thead>
          <tr>
            <th style="width:220px">Member</th>
            <th>Workload (by task count)</th>
            <th class="right" style="width:72px">TODO</th>
            <th class="right" style="width:72px">IN PROG</th>
            <th class="right" style="width:72px">DONE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in members" :key="m.name">
            <td>
              <div class="tw-member-cell">
                <img class="tw-avatar" :src="m.avatar" :alt="m.name">
                <div>
                  <div class="tw-member-name">{{ m.name }}</div>
                  <div class="tw-member-role">{{ m.role }}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="tw-bar-wrap">
                <div class="tw-bar-track">
                  <div class="tw-bar-fill" :class="m.status" :style="{ width: barPct(m) + '%' }"></div>
                </div>
                <span class="tw-count">{{ m.assigned }}/{{ m.capacity }}</span>
                <span class="tw-status-badge" :class="m.status">{{ m.statusLabel }}</span>
              </div>
            </td>
            <td class="tw-num-cell">{{ m.todo }}</td>
            <td class="tw-num-cell in-prog">{{ m.inProgress }}</td>
            <td class="tw-num-cell">{{ m.done }}</td>
          </tr>
          <!-- Unassigned row -->
          <tr class="tw-unassigned-row">
            <td>
              <div class="tw-member-cell">
                <div class="tw-avatar" style="background:#F3F4F6;display:flex;align-items:center;justify-content:center;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><line x1="19" y1="8" x2="23" y2="8"/></svg>
                </div>
                <div>
                  <div class="tw-member-name" style="color:#6B7280">Unassigned tasks</div>
                  <div class="tw-member-role">Needs assignment</div>
                </div>
              </div>
            </td>
            <td>
              <div class="tw-bar-wrap">
                <div class="tw-bar-track" style="background:#F3F4F6"></div>
                <span class="tw-count" style="color:#6B7280">6/—</span>
                <span class="tw-status-badge needs" style="background:#F3F4F6;color:#6B7280">UNASSIGNED</span>
              </div>
            </td>
            <td class="tw-num-cell" style="color:#6B7280">6</td>
            <td class="tw-num-cell" style="color:#6B7280">0</td>
            <td class="tw-num-cell" style="color:#6B7280">0</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
```

## Key behaviors
- KPI strip uses existing `.kpi-*` CSS classes (already defined in main.css)
- Bar fill class matches member status: `available` / `balanced` / `capacity` / `overloaded`
- Two vertical tick marks on bar track via `::before` (25%) and `::after` (75%) pseudo-elements
- Unassigned row has light purple-tinted background
- Time filter chips toggle `timeFilter` ref (UI only, data is static)
