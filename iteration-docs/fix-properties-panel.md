# Fix: Project Detail — Properties Panel (Floating + Editable)

**File:** `app/pages/projects/[id].vue`

The right-side properties panel needs two fixes:
1. **Floating appearance** — panel should look like an elevated card (shadow, border-radius, border), separated visually from the body background.
2. **Editable fields** — every property row should be clickable and show an inline editor (dropdown, date input, or text input) when clicked.

---

## 1. Panel Layout & Style

Replace `.pd-side` CSS with this:

```css
.pd-side {
  padding: 16px;
  overflow-y: auto;
  background: #F9FAFB;  /* matches body bg */
}

/* Each section is now a floating card */
.pd-panel-sec {
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
```

---

## 2. Editable State Logic

Add this reactive state to the `<script setup>`:

```typescript
// Which field is currently being edited
const editingField = ref<string | null>(null)

// Editable local copy of current project props
const editState = reactive({
  status: proj.value.statusLabel,
  statusClass: proj.value.statusClass,
  priority: proj.value.priority,
  priorityColor: proj.value.priorityColor,
  owner: proj.value.owner,
  startDate: proj.value.startDate,
  endDate: proj.value.endDate,
  category: proj.value.category,
  labels: [...proj.value.labels],
})

function toggleEdit(field: string) {
  editingField.value = editingField.value === field ? null : field
}

function closeEdit() {
  editingField.value = null
}

// Status options
const statusOptions = [
  { label: 'On Track',    cls: 'cs-track',   color: '#059669' },
  { label: 'At Risk',     cls: 'cs-risk',    color: '#DC2626' },
  { label: 'Delayed',     cls: 'cs-delayed', color: '#991B1B' },
  { label: 'Not Started', cls: 'cs-new',     color: '#6B7280' },
]

// Priority options
const priorityOptions = [
  { label: 'High',   color: '#D97706' },
  { label: 'Medium', color: 'oklch(60.6% 0.25 292.717)' },
  { label: 'Low',    color: '#16A34A' },
]

// Users (owners/assignees)
const userOptions = [
  { name: 'Rasya', seed: 'Rasya', bg: 'b6e3f4' },
  { name: 'Maya',  seed: 'Maya',  bg: 'ffd5dc' },
  { name: 'Dito',  seed: 'Dito',  bg: 'c0aede' },
  { name: 'Rara',  seed: 'Rara',  bg: 'f9a8d4' },
]

function setStatus(opt: typeof statusOptions[0]) {
  editState.status = opt.label
  editState.statusClass = opt.cls
  closeEdit()
}

function setPriority(opt: typeof priorityOptions[0]) {
  editState.priority = opt.label
  editState.priorityColor = opt.color
  closeEdit()
}

function setOwner(u: typeof userOptions[0]) {
  editState.owner = u.name
  closeEdit()
}
```

Also update `avatarUrl` to handle the editState owner lookup:

```typescript
function ownerAvatar() {
  const u = userOptions.find(x => x.name === editState.owner)
  return u ? avatarUrl(u.seed, u.bg) : avatarUrl('Rasya', 'b6e3f4')
}
```

---

## 3. Replace the Properties Template Section

Replace the entire `<div class="pd-panel-sec">` block that contains Properties with this:

```html
<!-- Properties Card -->
<div class="pd-panel-sec">
  <div class="pd-panel-hdr">
    <span class="pd-panel-title">Properties</span>
    <button class="pd-panel-btn">
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </button>
  </div>

  <!-- STATUS -->
  <div class="pd-prop-row" @click="toggleEdit('status')">
    <div class="pd-prop-lbl">Status</div>
    <div class="pd-prop-val">
      <span class="pdh-chip" :class="editState.statusClass">
        <span class="pdh-dot" :class="editState.statusClass + '-dot'"/>
        {{ editState.status }}
      </span>
    </div>
  </div>
  <div v-if="editingField === 'status'" class="pd-dropdown">
    <div
      v-for="opt in statusOptions" :key="opt.label"
      class="pd-dd-item"
      @click.stop="setStatus(opt)"
    >
      <span class="pdh-chip" :class="opt.cls">
        <span class="pdh-dot" :class="opt.cls + '-dot'"/>
        {{ opt.label }}
      </span>
    </div>
  </div>

  <!-- PRIORITY -->
  <div class="pd-prop-row" @click="toggleEdit('priority')">
    <div class="pd-prop-lbl">Priority</div>
    <div class="pd-prop-val" style="display:flex;align-items:center;gap:5px">
      <svg width="12" height="12" viewBox="0 0 16 16" :fill="editState.priorityColor">
        <path d="M2 14V3l6 3 6-3v11l-6-3-6 3z"/>
      </svg>
      <span style="font-size:12.5px;color:#111827">{{ editState.priority }}</span>
    </div>
  </div>
  <div v-if="editingField === 'priority'" class="pd-dropdown">
    <div
      v-for="opt in priorityOptions" :key="opt.label"
      class="pd-dd-item"
      @click.stop="setPriority(opt)"
    >
      <svg width="12" height="12" viewBox="0 0 16 16" :fill="opt.color"><path d="M2 14V3l6 3 6-3v11l-6-3-6 3z"/></svg>
      <span style="font-size:12.5px">{{ opt.label }}</span>
    </div>
  </div>

  <!-- OWNER -->
  <div class="pd-prop-row" @click="toggleEdit('owner')">
    <div class="pd-prop-lbl">Owner</div>
    <div class="pd-prop-val" style="display:flex;align-items:center;gap:7px">
      <img :src="ownerAvatar()" :alt="editState.owner" style="width:20px;height:20px;border-radius:50%;object-fit:cover">
      <span style="font-size:12.5px;color:#111827">{{ editState.owner }}</span>
    </div>
  </div>
  <div v-if="editingField === 'owner'" class="pd-dropdown">
    <div
      v-for="u in userOptions" :key="u.name"
      class="pd-dd-item"
      @click.stop="setOwner(u)"
    >
      <img :src="avatarUrl(u.seed, u.bg)" :alt="u.name" style="width:20px;height:20px;border-radius:50%;object-fit:cover">
      <span style="font-size:12.5px">{{ u.name }}</span>
    </div>
  </div>

  <!-- START DATE -->
  <div class="pd-prop-row" @click="toggleEdit('startDate')">
    <div class="pd-prop-lbl">Start</div>
    <div class="pd-prop-val" style="font-size:12.5px;color:#111827">
      {{ editState.startDate }}
    </div>
  </div>
  <div v-if="editingField === 'startDate'" class="pd-dropdown pd-dropdown--input">
    <input
      v-model="editState.startDate"
      type="text"
      placeholder="e.g. Jan 6, 2026"
      class="pd-dd-input"
      @keydown.enter="closeEdit"
      @keydown.escape="closeEdit"
      @click.stop
    >
    <button class="pd-dd-save" @click.stop="closeEdit">Save</button>
  </div>

  <!-- DUE DATE -->
  <div class="pd-prop-row" @click="toggleEdit('endDate')">
    <div class="pd-prop-lbl">Due</div>
    <div class="pd-prop-val" style="font-size:12.5px" :style="{ color: proj.endDateRed ? '#EF4444' : '#111827' }">
      {{ editState.endDate }}
    </div>
  </div>
  <div v-if="editingField === 'endDate'" class="pd-dropdown pd-dropdown--input">
    <input
      v-model="editState.endDate"
      type="text"
      placeholder="e.g. Aug 30, 2025"
      class="pd-dd-input"
      @keydown.enter="closeEdit"
      @keydown.escape="closeEdit"
      @click.stop
    >
    <button class="pd-dd-save" @click.stop="closeEdit">Save</button>
  </div>

  <!-- CATEGORY -->
  <div class="pd-prop-row" @click="toggleEdit('category')">
    <div class="pd-prop-lbl">Category</div>
    <div class="pd-prop-val" style="font-size:12.5px;color:#111827">{{ editState.category }}</div>
  </div>
  <div v-if="editingField === 'category'" class="pd-dropdown pd-dropdown--input">
    <input
      v-model="editState.category"
      type="text"
      placeholder="e.g. Core product"
      class="pd-dd-input"
      @keydown.enter="closeEdit"
      @keydown.escape="closeEdit"
      @click.stop
    >
    <button class="pd-dd-save" @click.stop="closeEdit">Save</button>
  </div>

  <!-- LABELS -->
  <div v-if="editState.labels.length" class="pd-prop-row" style="align-items:flex-start;padding-top:4px">
    <div class="pd-prop-lbl" style="padding-top:4px">Labels</div>
    <div class="pd-prop-val" style="display:flex;gap:4px;flex-wrap:wrap">
      <span v-for="lb in editState.labels" :key="lb" class="pd-label">{{ lb }}</span>
    </div>
  </div>
</div>
```

---

## 4. Dropdown CSS

Add these styles to `<style scoped>`:

```css
/* dropdown panel */
.pd-dropdown {
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  padding: 4px;
  margin: 0 4px 8px;
  z-index: 10;
  position: relative;
}

.pd-dd-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12.5px;
  color: #111827;
}

.pd-dd-item:hover {
  background: #F9FAFB;
}

/* text input variant */
.pd-dropdown--input {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px;
}

.pd-dd-input {
  flex: 1;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 12.5px;
  color: #111827;
  outline: none;
  font-family: inherit;
}

.pd-dd-input:focus {
  border-color: oklch(60.6% 0.25 292.717);
  box-shadow: 0 0 0 2px oklch(96% 0.04 292.717);
}

.pd-dd-save {
  padding: 5px 10px;
  background: oklch(60.6% 0.25 292.717);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
}

.pd-dd-save:hover {
  background: oklch(52% 0.27 292.717);
}
```

---

## 5. Click-outside to close

Add this to `onMounted` / `onUnmounted` (alongside the existing closeDd logic):

```typescript
function handleOutsideClick() {
  editingField.value = null
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
```

Make sure each `pd-prop-row` and its dropdown do `.stop` propagation so clicking inside doesn't trigger the outside handler.

---

## Summary

After applying these changes:
- `.pd-side` background becomes `#F9FAFB` (same as body)
- Each `.pd-panel-sec` becomes a white rounded card with shadow — looks "floating"
- Clicking Status / Priority / Owner shows an inline dropdown with options to select
- Clicking Start / Due / Category shows an inline text input with a Save button
- Clicking anywhere outside closes the open editor
- Progress, Assignees, Quick Links sections are unaffected (no editing needed yet)
