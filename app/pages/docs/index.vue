<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Docs Hub',
  middleware: 'auth',
})

interface Uploader {
  initials: string
  name: string
  avatar?: string
}

interface ProjectFolder {
  id: string
  name: string
  description: string
}

interface DocumentItem {
  id: string
  projectId: string
  kind: 'document'
  name: string
  type: string
  size: string
  uploader: Uploader
  updatedAt: string
}

interface LinkItem {
  id: string
  projectId: string
  kind: 'link'
  title: string
  url: string
  addedBy: Uploader
  addedAt: string
}

type HubItem = DocumentItem | LinkItem

const projects: ProjectFolder[] = [
  { id: 'proj-1', name: 'Alpha Project', description: 'Redesigning core product UX' },
  { id: 'proj-2', name: 'Beta Launch', description: 'Public launch milestone Q3' },
  { id: 'proj-3', name: 'Internal Tools', description: 'Tracker revamp, design system' },
]

const items: HubItem[] = [
  // Alpha Project
  {
    id: 'doc-1', projectId: 'proj-1', kind: 'document',
    name: 'Auth Flow Spec', type: 'PDF', size: '1.2 MB',
    uploader: { initials: 'R', name: 'Rasya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rasya' }, updatedAt: 'Jun 15, 2026',
  },
  {
    id: 'doc-2', projectId: 'proj-1', kind: 'document',
    name: 'Figma Handoff Notes', type: 'FIG', size: '4.5 MB',
    uploader: { initials: 'D', name: 'Dito', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Dito' }, updatedAt: 'Jun 14, 2026',
  },
  {
    id: 'doc-4', projectId: 'proj-1', kind: 'document',
    name: 'Component Audit', type: 'XLSX', size: '845 KB',
    uploader: { initials: 'R', name: 'Rara', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rara' }, updatedAt: 'Jun 16, 2026',
  },
  {
    id: 'link-1', projectId: 'proj-1', kind: 'link',
    title: 'Figma — Auth Flows', url: 'https://figma.com/file/alpha-auth',
    addedBy: { initials: 'D', name: 'Dito', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Dito' }, addedAt: 'Jun 12, 2026',
  },
  {
    id: 'link-2', projectId: 'proj-1', kind: 'link',
    title: 'Notion — Alpha PRD', url: 'https://notion.so/alpha-prd',
    addedBy: { initials: 'R', name: 'Rasya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rasya' }, addedAt: 'Jun 10, 2026',
  },

  // Beta Launch
  {
    id: 'doc-3', projectId: 'proj-2', kind: 'document',
    name: 'Dashboard Design Brief', type: 'DOCX', size: '2.1 MB',
    uploader: { initials: 'M', name: 'Maya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya' }, updatedAt: 'Jun 8, 2026',
  },
  {
    id: 'doc-5', projectId: 'proj-2', kind: 'document',
    name: 'API Rate Limit Spec', type: 'PDF', size: '890 KB',
    uploader: { initials: 'D', name: 'Dito', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Dito' }, updatedAt: 'Jun 17, 2026',
  },
  {
    id: 'link-3', projectId: 'proj-2', kind: 'link',
    title: 'Swagger — API Docs', url: 'https://swagger.io/beta-api',
    addedBy: { initials: 'M', name: 'Maya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya' }, addedAt: 'Jun 11, 2026',
  },
  {
    id: 'link-4', projectId: 'proj-2', kind: 'link',
    title: 'Launch Timeline', url: 'https://docs.google.com/spreadsheets/beta-launch',
    addedBy: { initials: 'D', name: 'Dito', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Dito' }, addedAt: 'Jun 9, 2026',
  },

  // Internal Tools
  {
    id: 'doc-6', projectId: 'proj-3', kind: 'document',
    name: 'Tracker Schema', type: 'PDF', size: '1.5 MB',
    uploader: { initials: 'M', name: 'Maya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya' }, updatedAt: 'Jun 13, 2026',
  },
  {
    id: 'doc-7', projectId: 'proj-3', kind: 'document',
    name: 'Design System Tokens', type: 'JSON', size: '12 KB',
    uploader: { initials: 'R', name: 'Rara', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rara' }, updatedAt: 'Jun 18, 2026',
  },
  {
    id: 'link-5', projectId: 'proj-3', kind: 'link',
    title: 'GitHub — elux-tracker', url: 'https://github.com/elux/elux-tracker',
    addedBy: { initials: 'M', name: 'Maya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya' }, addedAt: 'Jun 14, 2026',
  },
  {
    id: 'link-6', projectId: 'proj-3', kind: 'link',
    title: 'Linear — Internal Tools', url: 'https://linear.app/elux/internal-tools',
    addedBy: { initials: 'R', name: 'Rara', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rara' }, addedAt: 'Jun 16, 2026',
  },
]

const searchQuery = ref('')
const projectFilter = ref<string>('all')
const typeFilter = ref<'all' | 'document' | 'link'>('all')
const openedFolders = ref<Set<string>>(new Set())

const projectOptions = computed(() => [
  { value: 'all', label: 'All projects' },
  ...projects.map(p => ({ value: p.id, label: p.name })),
])

const typeOptions = [
  { value: 'all', label: 'All types' },
  { value: 'document', label: 'Documents' },
  { value: 'link', label: 'Links' },
]

const isFiltering = computed(() =>
  searchQuery.value.trim() !== '' || projectFilter.value !== 'all' || typeFilter.value !== 'all'
)

function toggleFolder(id: string) {
  const next = new Set(openedFolders.value)
  if (next.has(id)) {
    next.delete(id)
  }
  else {
    next.add(id)
  }
  openedFolders.value = next
}

function isFolderOpen(id: string, hasMatches: boolean) {
  if (isFiltering.value && hasMatches) return true
  return openedFolders.value.has(id)
}

function matchesSearch(item: HubItem) {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return true
  const name = item.kind === 'document' ? item.name : item.title
  return name.toLowerCase().includes(q)
}

function matchesType(item: HubItem) {
  if (typeFilter.value === 'all') return true
  return item.kind === typeFilter.value
}

const filteredProjects = computed(() => {
  return projects
    .filter(p => projectFilter.value === 'all' || p.id === projectFilter.value)
    .map((project) => {
      const projectItems = items.filter(
        item => item.projectId === project.id && matchesSearch(item) && matchesType(item)
      )
      return { ...project, items: projectItems, open: isFolderOpen(project.id, projectItems.length > 0) }
    })
    .filter(p => p.items.length > 0)
})

const hasResults = computed(() => filteredProjects.value.length > 0)

function fileIcon(type: string) {
  const t = type.toUpperCase()
  if (t === 'PDF') return 'ph:file-pdf'
  if (t === 'DOCX' || t === 'DOC') return 'ph:file-doc'
  if (t === 'XLSX' || t === 'CSV') return 'ph:file-csv'
  if (t === 'FIG') return 'ph:figma-logo'
  if (t === 'JSON') return 'ph:file-code'
  if (t === 'IMG' || t === 'PNG' || t === 'JPG') return 'ph:file-image'
  return 'ph:file'
}

function linkIcon(url: string) {
  if (url.includes('figma')) return 'ph:figma-logo'
  if (url.includes('github')) return 'ph:github-logo'
  if (url.includes('notion')) return 'ph:notion-logo'
  if (url.includes('google')) return 'ph:google-logo'
  return 'ph:link'
}

function clearFilters() {
  searchQuery.value = ''
  projectFilter.value = 'all'
  typeFilter.value = 'all'
}
</script>

<template>
  <div>
    <!-- Toolbar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <UInput
        v-model="searchQuery"
        icon="ph:magnifying-glass"
        placeholder="Search documents and links..."
        size="sm"
        class="max-w-sm flex-1"
      />

      <div class="flex items-center gap-2">
        <USelect
          v-model="projectFilter"
          :items="projectOptions"
          value-key="value"
          label-key="label"
          icon="ph:folder"
          placeholder="Project"
          size="sm"
          class="w-44"
        />

        <USelect
          v-model="typeFilter"
          :items="typeOptions"
          value-key="value"
          label-key="label"
          icon="ph:files"
          placeholder="Type"
          size="sm"
          class="w-44"
        />

        <UButton
          v-if="isFiltering"
          variant="ghost"
          color="neutral"
          size="sm"
          icon="ph:x"
          @click="clearFilters"
        >
          Clear
        </UButton>
      </div>
    </div>

    <!-- Folder list -->
    <div class="mt-6 flex flex-col gap-3">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="rounded-xl border border-gray-200 bg-white"
      >
        <!-- Folder header -->
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors hover:bg-gray-50"
          @click="toggleFolder(project.id)"
        >
          <div class="flex items-center gap-3">
            <UIcon
              :name="project.open ? 'ph:folder-open' : 'ph:folder'"
              class="size-6 text-amber-500"
            />
            <div>
              <h3 class="text-[15px] font-semibold text-gray-900">
                {{ project.name }}
              </h3>
              <p class="text-[12px] text-gray-500">
                {{ project.description }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[12px] text-gray-500">
              {{ project.items.length }} item{{ project.items.length === 1 ? '' : 's' }}
            </span>
            <UIcon
              :name="project.open ? 'ph:caret-up' : 'ph:caret-down'"
              class="size-4 text-gray-500"
            />
          </div>
        </button>

        <!-- Folder contents -->
        <div v-if="project.open" class="border-t border-gray-100 px-4 pb-4 pt-3">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Document card -->
            <NuxtLink
              v-for="item in project.items.filter((i): i is DocumentItem => i.kind === 'document')"
              :key="item.id"
              :to="`/docs/${item.id}`"
              class="group flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-blue-300 hover:shadow-sm"
            >
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                <UIcon :name="fileIcon(item.type)" class="size-5 text-gray-600" />
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="truncate text-[13px] font-medium text-gray-900 group-hover:text-blue-700">
                  {{ item.name }}
                </h4>
                <p class="mt-0.5 text-[11px] text-gray-500">
                  {{ item.type }} · {{ item.size }}
                </p>
                <div class="mt-2 flex items-center gap-2">
                  <UAvatar
                    :src="item.uploader.avatar"
                    :text="item.uploader.initials"
                    size="xs"
                  />
                  <span class="truncate text-[11px] text-gray-500">{{ item.uploader.name }}</span>
                </div>
              </div>
            </NuxtLink>

            <!-- Link card -->
            <a
              v-for="item in project.items.filter((i): i is LinkItem => i.kind === 'link')"
              :key="item.id"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-blue-300 hover:shadow-sm"
            >
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                <UIcon :name="linkIcon(item.url)" class="size-5 text-gray-600" />
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="truncate text-[13px] font-medium text-gray-900 group-hover:text-blue-700">
                  {{ item.title }}
                </h4>
                <p class="mt-0.5 truncate text-[11px] text-gray-500">
                  {{ item.url }}
                </p>
                <div class="mt-2 flex items-center gap-2">
                  <UAvatar
                    :src="item.addedBy.avatar"
                    :text="item.addedBy.initials"
                    size="xs"
                  />
                  <span class="truncate text-[11px] text-gray-500">{{ item.addedBy.name }}</span>
                  <UIcon name="ph:arrow-square-out" class="ml-auto size-3.5 text-gray-400" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!hasResults" class="mt-12 rounded-xl border border-gray-200 bg-white p-12 text-center">
      <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-gray-50">
        <UIcon name="ph:folder-open" class="size-7 text-gray-400" />
      </div>
      <p class="mt-4 text-[15px] font-medium text-gray-900">No documents found</p>
      <p class="mt-1 text-[13px] text-gray-500">
        Try adjusting your search or filters
      </p>
      <UButton
        v-if="isFiltering"
        color="primary"
        size="sm"
        class="mt-4"
        @click="clearFilters"
      >
        Clear filters
      </UButton>
    </div>
  </div>
</template>
