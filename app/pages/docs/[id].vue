<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Doc',
})

const route = useRoute()
const id = computed(() => route.params.id as string)

useHead({
  title: `Docs / ${id.value}`,
})

const docs: Record<string, {
  id: string
  title: string
  type: string
  epicId: string
  epicName: string
  author: { initials: string; name: string }
  createdAt: string
  updatedAt: string
  readTime: string
  content: string
  relatedTasks: { id: string; title: string; status: string; statusLabel: string }[]
  relatedEpic: { id: string; title: string }
}> = {
  'doc-1': {
    id: 'doc-1',
    title: 'Auth Flow Spec',
    type: 'Spec',
    epicId: 'epic-1',
    epicName: 'Auth & Onboarding Redesign',
    author: { initials: 'R', name: 'Rasya' },
    createdAt: 'Jun 10, 2026',
    updatedAt: 'Jun 15, 2026',
    readTime: '3 min read',
    content: `
## Overview

This document outlines the authentication flow for the redesigned product. The goal is to reduce signup friction while maintaining security standards.

## User Flows

1. **Sign Up** — Email + password with optional SSO (Google, GitHub)
2. **Login** — Email + password with "Remember me" option
3. **Password Reset** — Email-based reset with 24h token expiry
4. **Email Verification** — Required before first login, 48h grace period

## Design Decisions

- JWT-based session management with 7-day refresh tokens
- Rate limiting: 5 attempts per IP per minute
- 2FA support planned for Q4

## Open Questions

- Should we support magic link login?
- Passwordless auth timeline?
`,
    relatedTasks: [
      { id: 'task-1', title: 'Login page redesign', status: 'in-review', statusLabel: 'IN REVIEW' },
      { id: 'task-2', title: 'Signup form validation', status: 'in-progress', statusLabel: 'IN PROGRESS' },
      { id: 'task-3', title: 'Email verification flow', status: 'todo', statusLabel: 'TODO' },
    ],
    relatedEpic: { id: 'epic-1', title: 'Auth & Onboarding Redesign' },
  },
  'doc-2': {
    id: 'doc-2',
    title: 'Figma Handoff Notes',
    type: 'Notes',
    epicId: 'epic-1',
    epicName: 'Auth & Onboarding Redesign',
    author: { initials: 'D', name: 'Dito' },
    createdAt: 'Jun 12, 2026',
    updatedAt: 'Jun 14, 2026',
    readTime: '1 min read',
    content: `
## Component Library Updates

Design tokens have been updated to match the new brand palette.

### Changed Components
- **Button** — Updated hover/active states, new size variants
- **Input** — Validation states, icon support, clear button
- **Modal** — New animation curve, backdrop blur

### New Components
- **PasswordStrength** — Real-time strength indicator
- **SSOButton** — Google, GitHub branded buttons

## Breakpoints
- Mobile: 320-767px
- Tablet: 768-1023px
- Desktop: 1024px+
`,
    relatedTasks: [
      { id: 'task-1', title: 'Login page redesign', status: 'in-review', statusLabel: 'IN REVIEW' },
    ],
    relatedEpic: { id: 'epic-1', title: 'Auth & Onboarding Redesign' },
  },
  'doc-3': {
    id: 'doc-3',
    title: 'Dashboard Design Brief',
    type: 'Brief',
    epicId: 'epic-2',
    epicName: 'Core Dashboard v2',
    author: { initials: 'M', name: 'Maya' },
    createdAt: 'Jun 8, 2026',
    updatedAt: 'Jun 8, 2026',
    readTime: '5 min read',
    content: `
## Project Goals

Redesign the core dashboard to improve data density and actionability.

### Key Metrics
1. Reduce time-to-insight by 40%
2. Support 3x more data widgets per view
3. Achieve < 200ms interaction latency

## Widget System

Widgets are the primary building block:
- **Stat Card** — Single metric with trend indicator
- **Chart** — Time-series data visualization
- **List** — Scannable row-based data display
- **Status** — Health/risk indicators

## Technical Approach
- Server-side data aggregation
- Client-side caching with SWR pattern
- Real-time updates via WebSocket
`,
    relatedTasks: [
      { id: 'task-5', title: 'Profile editing UI', status: 'in-progress', statusLabel: 'IN PROGRESS' },
      { id: 'task-12', title: 'KPI chart component', status: 'todo', statusLabel: 'TODO' },
    ],
    relatedEpic: { id: 'epic-2', title: 'Core Dashboard v2' },
  },
  'doc-4': {
    id: 'doc-4',
    title: 'Component Audit',
    type: 'Notes',
    epicId: 'epic-2',
    epicName: 'Core Dashboard v2',
    author: { initials: 'R', name: 'Rara' },
    createdAt: 'Jun 14, 2026',
    updatedAt: 'Jun 16, 2026',
    readTime: '2 min read',
    content: `
## Audit Results — June 2026

### Accessibility
- Color contrast: 94% passing (target: 100%)
- Keyboard nav: 87% passing
- Screen reader: 82% passing

### Performance
- Bundle size: 142KB gzipped (target: <150KB ✓)
- First paint: 1.2s (target: <1.5s ✓)
- Time to interactive: 2.1s (target: <2s — investigate)

### Action Items
1. Fix contrast issues in Settings → Notifications (3 elements)
2. Add aria-labels to all icon buttons
3. Investigate TTI regression from last sprint
`,
    relatedTasks: [
      { id: 'task-11', title: 'Sidebar nav refinement', status: 'done', statusLabel: 'DONE' },
    ],
    relatedEpic: { id: 'epic-2', title: 'Core Dashboard v2' },
  },
}

const doc = computed(() => docs[id.value])

function statusClasses(status: string) {
  const map: Record<string, string> = {
    'in-progress': 'bg-blue-50 text-blue-600 border-blue-200',
    'in-review': 'bg-amber-50 text-amber-600 border-amber-200',
    'todo': 'bg-gray-50 text-gray-500 border-gray-200',
    'done': 'bg-blue-50 text-blue-600 border-blue-200',
  }
  return map[status] || map['todo']
}
</script>

<template>
  <div>
    <div v-if="!doc" class="mt-4 rounded-lg border border-gray-200 bg-white p-12 text-center">
      <UIcon name="ph:files" class="mx-auto size-10 text-gray-400" />
      <p class="mt-3 text-base text-gray-500">Doc not found</p>
      <NuxtLink to="/docs" class="mt-2 inline-block text-sm text-blue-600 hover:underline">Back to Docs Hub</NuxtLink>
    </div>

    <template v-else>
      <div class="mt-4 flex items-center gap-2 text-[15px] font-semibold">
        <NuxtLink to="/docs" class="text-gray-500 transition-colors hover:text-gray-700">
          Docs
        </NuxtLink>
        <UIcon name="ph:caret-right" class="size-3.5 text-gray-400" />
        <span class="truncate text-gray-900">{{ doc.title }}</span>
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-gray-500">
        <span class="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-[11px] font-medium text-gray-500">
          {{ doc.type }}
        </span>
        <span class="inline-flex items-center gap-1">
          <span class="flex size-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-semibold text-white">{{ doc.author.initials }}</span>
          {{ doc.author.name }}
        </span>
        <span>Created {{ doc.createdAt }}</span>
        <span>Updated {{ doc.updatedAt }}</span>
        <span>{{ doc.readTime }}</span>
        <span>
          Project:
          <NuxtLink :to="`/projects/${doc.epicId}`" class="text-blue-600 hover:underline">
            {{ doc.epicName }}
          </NuxtLink>
        </span>
      </div>

      <!-- Content -->
      <div class="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <div class="prose prose-sm max-w-none text-gray-700" v-text="doc.content" />
      </div>

      <!-- Related Tasks -->
      <div class="mt-6">
        <h3 class="text-[15px] font-semibold text-gray-900">Related Tasks</h3>
        <div class="mt-2 flex flex-col gap-1">
          <NuxtLink
            v-for="task in doc.relatedTasks"
            :key="task.id"
            :to="`/tasks/${task.id}`"
            class="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-gray-100"
          >
            <UIcon name="ph:check-square" class="size-4 text-gray-500" />
            <span class="flex-1 text-[14px] text-gray-900">{{ task.title }}</span>
            <span
              class="inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium"
              :class="statusClasses(task.status)"
            >
              {{ task.statusLabel }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>
