# OPENCODE PROMPT — Settings Page (Left-Nav Layout)

## Goal
Rebuild `app/pages/settings.vue` to use a left-nav sidebar layout instead of horizontal tabs. The current version uses horizontal top tabs. The target matches `#page-settings` in `dashboard-mockup-v3.html`: a 220px left nav with grouped nav items + full-width right content column. Remove the Appearance and Billing tabs — they are not in the mockup.

## Target file
- `app/pages/settings.vue` — full rewrite
- Keep `app/components/settings/` tab components as-is, just swap the layout wrapper

---

## 1. Add these CSS classes to `app/assets/css/main.css`

```css
/* ─── SETTINGS PAGE ─── */
.s-layout { display: flex; flex-direction: row; gap: 0; height: 100%; overflow: hidden; margin: -20px -24px; }
.s-leftnav { width: 220px; flex-shrink: 0; border-right: 1px solid #F3F4F6; padding: 28px 16px; display: flex; flex-direction: column; gap: 2px; height: 100%; overflow-y: auto; }
.s-leftnav-title { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 20px; padding-left: 8px; }
.s-leftnav-group-label { font-size: 10.5px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: .07em; padding: 0 8px; margin-bottom: 4px; margin-top: 16px; }
.s-leftnav-group-label:first-of-type { margin-top: 0; }
.s-navitem { display: flex; align-items: center; gap: 9px; padding: 8px 10px; border-radius: 8px; border: none; background: none; font-size: 13.5px; font-weight: 500; color: #4B5563; cursor: pointer; font-family: inherit; text-align: left; width: 100%; transition: background .12s, color .12s; }
.s-navitem:hover { background: #F3F4F6; color: #1F2937; }
.s-navitem.active { background: oklch(92% 0.08 292.717); color: oklch(52% 0.27 292.717); }
.s-navitem.danger { color: #6B7280; }
.s-navitem.danger:hover { background: #FEF2F2; color: #DC2626; }
.s-navitem.danger.active { background: #FEF2F2; color: #DC2626; }
.s-rightcol { flex: 1; padding: 32px 36px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
.s-card { background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px 22px; box-shadow: 0 1px 3px rgba(0,0,0,.04); }
.s-card-head { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 0; }
.s-card-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: oklch(92% 0.08 292.717); }
.s-card-title { font-size: 14px; font-weight: 600; color: #1F2937; margin-bottom: 2px; }
.s-card-desc { font-size: 12.5px; color: #9CA3AF; line-height: 1.5; }
.s-divider { height: 1px; background: #F3F4F6; margin: 18px 0; }
.s-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 16px; }
.s-field { display: flex; flex-direction: column; gap: 5px; }
.s-label { font-size: 12px; font-weight: 500; color: #374151; }
.s-input { height: 36px; padding: 0 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 13px; color: #111827; font-family: inherit; outline: none; transition: border-color .15s; background: white; }
.s-input:focus { border-color: oklch(60.6% 0.25 292.717); }
.s-select { height: 36px; padding: 0 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 13px; color: #111827; font-family: inherit; background: white; cursor: pointer; outline: none; }
.s-btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; border: none; background: oklch(60.6% 0.25 292.717); color: white; font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer; transition: background .15s; }
.s-btn-primary:hover { background: oklch(52% 0.27 292.717); }
.s-btn-secondary { display: inline-flex; align-items: center; padding: 6px 12px; border-radius: 7px; border: 1px solid #E5E7EB; background: white; color: #374151; font-size: 12px; font-weight: 500; font-family: inherit; cursor: pointer; }
.s-btn-ghost { display: inline-flex; align-items: center; padding: 6px 12px; border-radius: 7px; border: none; background: none; color: #9CA3AF; font-size: 12px; cursor: pointer; }
.s-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #F9FAFB; }
.s-toggle-row:last-child { border-bottom: none; }
.s-toggle-label { font-size: 13px; font-weight: 500; color: #111827; }
.s-toggle-sub { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
.s-toggle { position: relative; width: 36px; height: 20px; flex-shrink: 0; }
.s-toggle input { opacity: 0; width: 0; height: 0; }
.s-toggle-slider { position: absolute; inset: 0; border-radius: 20px; background: #D1D5DB; transition: background .2s; cursor: pointer; }
.s-toggle-slider::before { content: ''; position: absolute; width: 14px; height: 14px; border-radius: 50%; background: white; top: 3px; left: 3px; transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2); }
.s-toggle input:checked + .s-toggle-slider { background: oklch(60.6% 0.25 292.717); }
.s-toggle input:checked + .s-toggle-slider::before { transform: translateX(16px); }
.s-members-table { width: 100%; border-collapse: collapse; }
.s-members-table th { font-size: 11px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: .05em; padding: 8px 12px; border-bottom: 1px solid #F3F4F6; text-align: left; }
.s-members-table td { padding: 10px 12px; border-bottom: 1px solid #F9FAFB; font-size: 13px; color: #374151; }
.s-members-table tbody tr:last-child td { border-bottom: none; }
.s-danger-card { border-color: #FECACA; }
.s-danger-title { font-size: 13.5px; font-weight: 600; color: #DC2626; margin-bottom: 4px; }
.s-danger-desc { font-size: 12.5px; color: #6B7280; line-height: 1.5; }
.s-btn-danger { display: inline-flex; align-items: center; padding: 8px 16px; border-radius: 8px; border: 1px solid #FECACA; background: white; color: #DC2626; font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer; transition: background .15s; }
.s-btn-danger:hover { background: #FEF2F2; }
```

---

## 2. Full rewrite of `app/pages/settings.vue`

```vue
<script setup lang="ts">
definePageMeta({ layout: 'default', title: 'Settings' })

type Tab = 'general' | 'members' | 'notifications' | 'profile' | 'danger'
const activeTab = ref<Tab>('general')

const notifSettings = reactive([
  { key: 'task_assigned', label: 'Task assigned to me', sub: 'Get notified when someone assigns you a task', enabled: true },
  { key: 'task_overdue', label: 'Task overdue', sub: 'Reminder when a task is past its due date', enabled: true },
  { key: 'comment', label: 'New comment', sub: 'Someone commented on your task or project', enabled: true },
  { key: 'project_update', label: 'Project status update', sub: 'When a project status changes', enabled: false },
  { key: 'weekly_digest', label: 'Weekly digest', sub: 'Summary of your work every Monday', enabled: true },
])

const members = [
  { name: 'Rasya Ardiansyah', email: 'rasya@queebo.chat', role: 'Admin', avatar: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Rasya&backgroundColor=b6e3f4&backgroundType=solid' },
  { name: 'Maya Putri', email: 'maya@queebo.chat', role: 'Member', avatar: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Maya&backgroundColor=ffd5dc&backgroundType=solid' },
  { name: 'Dito Santoso', email: 'dito@queebo.chat', role: 'Member', avatar: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Dito&backgroundColor=c0aede&backgroundType=solid' },
  { name: 'Rara Hapsari', email: 'rara@queebo.chat', role: 'Member', avatar: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Rara&backgroundColor=f9a8d4&backgroundType=solid' },
  { name: 'Lintang Dewi', email: 'lintang@queebo.chat', role: 'Member', avatar: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=Lintang&backgroundColor=a5f3fc&backgroundType=solid' },
]
</script>

<template>
  <div class="s-layout">
    <!-- Left nav -->
    <div class="s-leftnav">
      <div class="s-leftnav-title">Settings</div>

      <div class="s-leftnav-group-label">Workspace</div>
      <button class="s-navitem" :class="{ active: activeTab === 'general' }" @click="activeTab = 'general'">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        General
      </button>
      <button class="s-navitem" :class="{ active: activeTab === 'members' }" @click="activeTab = 'members'">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Members
      </button>
      <button class="s-navitem" :class="{ active: activeTab === 'notifications' }" @click="activeTab = 'notifications'">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        Notifications
      </button>

      <div class="s-leftnav-group-label">Account</div>
      <button class="s-navitem" :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        Profile
      </button>
      <button class="s-navitem danger" :class="{ active: activeTab === 'danger' }" @click="activeTab = 'danger'">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
        Danger Zone
      </button>
    </div>

    <!-- Right content -->
    <div class="s-rightcol">

      <!-- GENERAL -->
      <template v-if="activeTab === 'general'">
        <div class="s-card">
          <div class="s-card-head">
            <div class="s-card-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(52% 0.27 292.717)" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <div>
              <div class="s-card-title">Workspace</div>
              <div class="s-card-desc">Configure your workspace name, language, and regional settings.</div>
            </div>
          </div>
          <div class="s-divider"></div>
          <div class="s-field-grid">
            <div class="s-field" style="grid-column:1/-1">
              <label class="s-label">Workspace name</label>
              <input class="s-input" type="text" value="Elux Space">
            </div>
            <div class="s-field">
              <label class="s-label">Language</label>
              <select class="s-select"><option>English</option><option>Bahasa Indonesia</option></select>
            </div>
            <div class="s-field">
              <label class="s-label">Date format</label>
              <select class="s-select"><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select>
            </div>
            <div class="s-field">
              <label class="s-label">Timezone</label>
              <select class="s-select"><option>Asia/Jakarta (WIB, UTC+7)</option><option>Asia/Singapore (SGT, UTC+8)</option><option>UTC</option></select>
            </div>
            <div class="s-field">
              <label class="s-label">First day of week</label>
              <select class="s-select"><option>Monday</option><option>Sunday</option></select>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:20px">
            <button class="s-btn-primary">Save changes</button>
          </div>
        </div>
      </template>

      <!-- MEMBERS -->
      <template v-if="activeTab === 'members'">
        <div class="s-card">
          <div class="s-card-head">
            <div class="s-card-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(52% 0.27 292.717)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div style="flex:1">
              <div class="s-card-title">Team Members</div>
              <div class="s-card-desc">Manage who has access to this workspace.</div>
            </div>
            <button class="s-btn-primary">Invite member</button>
          </div>
          <div class="s-divider"></div>
          <table class="s-members-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in members" :key="m.email">
                <td>
                  <div style="display:flex;align-items:center;gap:9px">
                    <img :src="m.avatar" style="width:28px;height:28px;border-radius:50%;object-fit:cover">
                    <span style="font-weight:500;color:#111827">{{ m.name }}</span>
                  </div>
                </td>
                <td style="color:#6B7280">{{ m.email }}</td>
                <td>
                  <span style="font-size:11.5px;font-weight:600;padding:2px 9px;border-radius:5px" :style="m.role === 'Admin' ? 'background:oklch(92% 0.08 292.717);color:oklch(52% 0.27 292.717)' : 'background:#F3F4F6;color:#374151'">
                    {{ m.role }}
                  </span>
                </td>
                <td>
                  <button v-if="m.role !== 'Admin'" class="s-btn-ghost" style="font-size:12px;color:#9CA3AF">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- NOTIFICATIONS -->
      <template v-if="activeTab === 'notifications'">
        <div class="s-card">
          <div class="s-card-head">
            <div class="s-card-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(52% 0.27 292.717)" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <div>
              <div class="s-card-title">Notification preferences</div>
              <div class="s-card-desc">Choose which notifications you want to receive.</div>
            </div>
          </div>
          <div class="s-divider"></div>
          <div v-for="n in notifSettings" :key="n.key" class="s-toggle-row">
            <div>
              <div class="s-toggle-label">{{ n.label }}</div>
              <div class="s-toggle-sub">{{ n.sub }}</div>
            </div>
            <label class="s-toggle">
              <input type="checkbox" v-model="n.enabled">
              <span class="s-toggle-slider"></span>
            </label>
          </div>
        </div>
      </template>

      <!-- PROFILE -->
      <template v-if="activeTab === 'profile'">
        <div class="s-card">
          <div class="s-card-head">
            <div class="s-card-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(52% 0.27 292.717)" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
            <div>
              <div class="s-card-title">Personal profile</div>
              <div class="s-card-desc">Your name, role, and avatar visible to teammates.</div>
            </div>
          </div>
          <div class="s-divider"></div>
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
            <img src="https://api.dicebear.com/9.x/open-peeps/svg?seed=Rasya&backgroundColor=b6e3f4&backgroundType=solid" style="width:56px;height:56px;border-radius:50%;object-fit:cover;border:2px solid #E5E7EB">
            <div>
              <div style="font-size:13.5px;font-weight:500;color:#1F2937;margin-bottom:5px">Rasya Ardiansyah</div>
              <div style="display:flex;gap:8px">
                <button class="s-btn-secondary">Change photo</button>
                <button class="s-btn-ghost">Remove</button>
              </div>
            </div>
          </div>
          <div class="s-field-grid">
            <div class="s-field">
              <label class="s-label">Full name</label>
              <input class="s-input" type="text" value="Rasya Ardiansyah">
            </div>
            <div class="s-field">
              <label class="s-label">Role / title</label>
              <input class="s-input" type="text" value="Product Designer">
            </div>
            <div class="s-field" style="grid-column:1/-1">
              <label class="s-label">Email address</label>
              <input class="s-input" type="email" value="rasya@queebo.chat">
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:20px">
            <button class="s-btn-primary">Save changes</button>
          </div>
        </div>
      </template>

      <!-- DANGER ZONE -->
      <template v-if="activeTab === 'danger'">
        <div class="s-card s-danger-card">
          <div class="s-danger-title">Delete workspace</div>
          <div class="s-danger-desc">Permanently delete this workspace and all of its data. This action cannot be undone.</div>
          <div style="margin-top:16px">
            <button class="s-btn-danger">Delete workspace</button>
          </div>
        </div>
        <div class="s-card s-danger-card">
          <div class="s-danger-title">Reset all data</div>
          <div class="s-danger-desc">Clear all projects, tasks, and activity. Your team accounts will remain but all content will be removed.</div>
          <div style="margin-top:16px">
            <button class="s-btn-danger">Reset data</button>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>
```

## Key notes
- `.s-layout` uses `margin: -20px -24px` to break out of the default layout padding and fill full width/height
- Active nav item uses oklch purple background (not blue)
- Toggle switches use oklch purple when checked
- Appearance and Billing tabs are intentionally removed
