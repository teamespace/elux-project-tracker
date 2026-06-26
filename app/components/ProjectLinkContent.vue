<script setup lang="ts">
import { projects, type Project } from '~/shared/projects'

const props = defineProps<{
  linkedIds?: string[]
}>()

const emit = defineEmits<{
  link: [project: Project]
  close: []
}>()

const search = ref('')

const availableProjects = computed(() => {
  const linked = new Set(props.linkedIds ?? [])
  return projects
    .filter(p => !linked.has(p.id))
    .filter(p => {
      const q = search.value.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.key.toLowerCase().includes(q)
    })
})

function linkProject(project: Project) {
  emit('link', project)
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <div class="flex-1 overflow-y-auto px-6 py-5">
      <div class="mb-1 text-lg font-semibold text-gray-900">Add project</div>
      <div class="mb-4 text-sm text-gray-500">Link an existing project to this goal.</div>

      <div class="mb-4">
        <input v-model="search" class="pl-input" placeholder="Search projects…">
      </div>

      <div v-if="availableProjects.length === 0" class="pl-empty">
        No projects available to link.
      </div>
      <div v-else class="space-y-2">
        <button
          v-for="p in availableProjects"
          :key="p.id"
          class="pl-row"
          @click="linkProject(p)"
        >
          <div class="pl-key">{{ p.key }}</div>
          <div class="pl-info">
            <div class="pl-name">{{ p.name }}</div>
            <div class="pl-meta">{{ p.statusLabel }} · {{ p.progress }}% · {{ p.openTasks }} tasks</div>
          </div>
          <div class="pl-add">Add</div>
        </button>
      </div>
    </div>

    <div class="flex shrink-0 items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
      <button class="pl-btn-ghost" @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.pl-input {
  width: 100%; border: 1px solid #E5E7EB; border-radius: 8px;
  padding: 8px 12px; font-size: 13px; color: #111827; outline: none; font-family: inherit;
}
.pl-input:focus { border-color: oklch(60.6% 0.25 292.717); }
.pl-input::placeholder { color: #D1D5DB; }
.pl-empty { border: 1px dashed #E5E7EB; border-radius: 8px; padding: 24px; text-align: center; color: #9CA3AF; font-size: 13px; }
.pl-row {
  display: flex; align-items: center; gap: 12px; width: 100%;
  padding: 10px 12px; border-radius: 8px; border: 1px solid #E5E7EB;
  background: #fff; cursor: pointer; text-align: left; font-family: inherit; transition: all .1s;
}
.pl-row:hover { background: #F9FAFB; border-color: #D1D5DB; }
.pl-key { font-family: ui-monospace, monospace; font-size: 10px; font-weight: 600; background: #F3F4F6; color: #6B7280; padding: 2px 6px; border-radius: 4px; flex-shrink: 0; }
.pl-info { flex: 1; min-width: 0; }
.pl-name { font-size: 13px; font-weight: 500; color: #111827; }
.pl-meta { font-size: 11px; color: #9CA3AF; margin-top: 1px; }
.pl-add { font-size: 12px; font-weight: 600; color: oklch(60.6% 0.25 292.717); opacity: 0; transition: opacity .1s; }
.pl-row:hover .pl-add { opacity: 1; }
.pl-btn-ghost {
  height: 34px; padding: 0 14px; border-radius: 8px;
  border: 1px solid #E5E7EB; background: #fff; color: #4B5563;
  font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit;
}
.pl-btn-ghost:hover { background: #F9FAFB; }
</style>
