<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Help Center',
  middleware: 'auth',
})

const searchQuery = ref('')

const faqs = [
  {
    id: 'faq-1',
    question: 'How do I create a new project?',
    answer: 'Open the Dashboard and click the "New" button in the Projects section, or navigate to Projects and create from there.',
  },
  {
    id: 'faq-2',
    question: 'Can I assign tasks to multiple people?',
    answer: 'Each task has a single assignee. You can use comments and subtasks to coordinate work across teammates.',
  },
  {
    id: 'faq-3',
    question: 'What do the risk labels mean?',
    answer: 'High risk indicates critical blockers, medium risk signals items to watch, and low risk means the work is on a safe path.',
  },
  {
    id: 'faq-4',
    question: 'How is progress calculated for goals?',
    answer: 'Goal progress is averaged across linked KPIs and projects, giving a quick snapshot of overall health.',
  },
]

const filteredFaqs = computed(() => {
  if (!searchQuery.value.trim()) return faqs
  const q = searchQuery.value.toLowerCase()
  return faqs.filter(f =>
    f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div>
    <!-- Search -->
    <div class="mt-2 relative">
      <UIcon name="ph:magnifying-glass" class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search help articles..."
        class="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-[13px] text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-100"
      >
    </div>

    <!-- FAQ -->
    <div class="mt-6 flex flex-col gap-3">
      <div
        v-for="faq in filteredFaqs"
        :key="faq.id"
        class="rounded-lg border border-gray-200 bg-white p-4"
      >
        <h3 class="flex items-center gap-2 text-[14px] font-semibold text-gray-900">
          <UIcon name="ph:question" class="size-4 text-blue-600" />
          {{ faq.question }}
        </h3>
        <p class="mt-1 text-[13px] leading-relaxed text-gray-600">{{ faq.answer }}</p>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="filteredFaqs.length === 0 && searchQuery" class="mt-8 rounded-lg border border-gray-200 bg-white p-12 text-center">
      <UIcon name="ph:magnifying-glass" class="mx-auto size-10 text-gray-400" />
      <p class="mt-3 text-base text-gray-500">No results for "{{ searchQuery }}"</p>
    </div>

    <!-- Contact -->
    <div class="mt-6 rounded-lg border border-gray-200 bg-white p-5">
      <h3 class="text-[15px] font-semibold text-gray-900">Still need help?</h3>
      <p class="mt-1 text-[13px] text-gray-500">Reach out to the support team and we will get back to you.</p>
      <button
        type="button"
        class="mt-4 rounded-md bg-blue-600 px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-blue-700"
      >
        Contact support
      </button>
    </div>
  </div>
</template>
