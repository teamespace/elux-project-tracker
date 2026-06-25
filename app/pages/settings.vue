<script setup lang="ts">
definePageMeta({ layout: 'default', title: 'Settings', middleware: 'auth' })

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
          <div class="s-divider"/>
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
          <div class="s-divider"/>
          <table class="s-members-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Role</th>
                <th/>
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
          <div class="s-divider"/>
          <div v-for="n in notifSettings" :key="n.key" class="s-toggle-row">
            <div>
              <div class="s-toggle-label">{{ n.label }}</div>
              <div class="s-toggle-sub">{{ n.sub }}</div>
            </div>
            <label class="s-toggle">
              <input v-model="n.enabled" type="checkbox">
              <span class="s-toggle-slider"/>
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
          <div class="s-divider"/>
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
