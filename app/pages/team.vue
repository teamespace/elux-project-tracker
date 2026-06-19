<script setup lang="ts">
interface Member {
  initials: string
  name: string
  avatar?: string
  capacity: number
  assigned: number
  todoCount: number
  inProgressCount: number
  doneCount: number
  status: 'available' | 'at-capacity' | 'overloaded' | 'needs-assignment'
  statusLabel: string
}

definePageMeta({
  layout: 'default',
  title: 'Team Workload',
})

const members: Member[] = [
  {
    initials: 'R',
    name: 'Rasya Ardiansyah',
    avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rasya',
    capacity: 12,
    assigned: 8,
    todoCount: 3,
    inProgressCount: 5,
    doneCount: 4,
    status: 'at-capacity',
    statusLabel: 'AT CAPACITY',
  },
  {
    initials: 'M',
    name: 'Maya Putri',
    avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya',
    capacity: 12,
    assigned: 4,
    todoCount: 2,
    inProgressCount: 2,
    doneCount: 6,
    status: 'available',
    statusLabel: 'AVAILABLE',
  },
  {
    initials: 'D',
    name: 'Dito Santoso',
    avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Dito',
    capacity: 12,
    assigned: 12,
    todoCount: 4,
    inProgressCount: 8,
    doneCount: 2,
    status: 'overloaded',
    statusLabel: 'OVERLOADED',
  },
  {
    initials: 'R',
    name: 'Rara Wijaya',
    avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rara',
    capacity: 12,
    assigned: 3,
    todoCount: 1,
    inProgressCount: 2,
    doneCount: 8,
    status: 'available',
    statusLabel: 'AVAILABLE',
  },
  {
    initials: '?',
    name: 'Unassigned',
    capacity: 0,
    assigned: 6,
    todoCount: 6,
    inProgressCount: 0,
    doneCount: 0,
    status: 'needs-assignment',
    statusLabel: 'NEEDS ASSIGNMENT',
  },
]

const kpiCards = computed(() => [
  {
    label: 'Available',
    count: members.filter(m => m.status === 'available').length,
    colorClass: 'text-green-700',
    borderClass: 'border-green-200',
  },
  {
    label: 'Balanced',
    count: members.filter(m => m.status === 'at-capacity').length,
    colorClass: 'text-amber-700',
    borderClass: 'border-amber-200',
  },
  {
    label: 'Overloaded',
    count: members.filter(m => m.status === 'overloaded').length,
    colorClass: 'text-red-700',
    borderClass: 'border-red-200',
  },
])

function workloadPercent(assigned: number, capacity: number) {
  if (capacity === 0) return 0
  return Math.min(Math.round((assigned / capacity) * 100), 120)
}

function workloadBarColor(percent: number) {
  if (percent > 100) return 'bg-red-600'
  if (percent >= 81) return 'bg-amber-600'
  if (percent >= 51) return 'bg-amber-600'
  return 'bg-green-600'
}

function workloadLabelColor(status: Member['status']) {
  const map: Record<Member['status'], string> = {
    'available': 'text-green-600',
    'at-capacity': 'text-amber-600',
    'overloaded': 'text-red-600',
    'needs-assignment': 'text-gray-500',
  }
  return map[status]
}

function workloadLabelBg(status: Member['status']) {
  const map: Record<Member['status'], string> = {
    'available': 'bg-green-50',
    'at-capacity': 'bg-amber-50',
    'overloaded': 'bg-red-50',
    'needs-assignment': 'bg-gray-100',
  }
  return map[status]
}
</script>

<template>
  <div class="space-y-4">
    <!-- KPI Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div
        v-for="card in kpiCards"
        :key="card.label"
        class="flex flex-col items-center justify-center rounded-xl border bg-white p-5 transition-shadow hover:shadow-sm"
        :class="card.borderClass"
      >
        <p class="text-[28px] font-bold tracking-tight" :class="card.colorClass">
          {{ card.count }}
        </p>
        <p class="mt-1 text-[13px] font-medium text-gray-500">
          {{ card.label }}
        </p>
      </div>
    </div>

    <!-- Info Box -->
    <div class="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-[13px] text-indigo-900">
      <span class="font-semibold">Workload</span> = number of tasks assigned to each team member.
      <span class="ml-1 font-medium text-green-700">Available: &lt;3 tasks</span>
      <span class="mx-1 text-indigo-400">·</span>
      <span class="font-medium text-amber-700">Balanced: 3–5 tasks</span>
      <span class="mx-1 text-indigo-400">·</span>
      <span class="font-medium text-red-700">Overloaded: &gt;5 tasks</span>
    </div>

    <!-- Team Table -->
    <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table class="min-w-full text-left text-[13px]">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            <th class="px-4 py-3 font-semibold">
              Member
            </th>
            <th class="px-4 py-3 font-semibold">
              Workload (by task count)
            </th>
            <th class="w-20 px-4 py-3 text-center font-semibold tabular-nums">
              TODO
            </th>
            <th class="w-24 px-4 py-3 text-center font-semibold tabular-nums">
              IN PROG
            </th>
            <th class="w-20 px-4 py-3 text-center font-semibold tabular-nums">
              DONE
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="member in members"
            :key="member.name"
            class="transition-colors hover:bg-gray-50"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <UAvatar
                  :src="member.avatar"
                  :text="member.initials"
                  size="sm"
                  :class="member.initials === '?' ? 'bg-gray-500' : ''"
                />
                <span class="font-medium text-gray-900">{{ member.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex min-w-[240px] items-center gap-3">
                <div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    v-if="member.capacity > 0"
                    class="h-full rounded-full transition-all"
                    :class="workloadBarColor(workloadPercent(member.assigned, member.capacity))"
                    :style="{ width: `${Math.min(workloadPercent(member.assigned, member.capacity), 100)}%` }"
                  />
                </div>
                <span v-if="member.capacity > 0" class="w-14 text-right text-[11px] tabular-nums text-gray-500">
                  {{ member.assigned }}/{{ member.capacity }}
                </span>
                <span v-else class="w-14 text-right text-[11px] tabular-nums text-gray-500">
                  — {{ member.assigned }}
                </span>
                <span
                  class="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                  :class="[workloadLabelBg(member.status), workloadLabelColor(member.status)]"
                >
                  {{ member.statusLabel }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-center tabular-nums text-gray-700">
              {{ member.todoCount }}
            </td>
            <td class="px-4 py-3 text-center tabular-nums text-blue-600">
              {{ member.inProgressCount }}
            </td>
            <td class="px-4 py-3 text-center tabular-nums text-gray-700">
              {{ member.doneCount }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
