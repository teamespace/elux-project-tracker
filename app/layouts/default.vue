// styled: agent-2
<script setup lang="ts">
const route = useRoute()
const showAI = ref(false)
const aiMode = ref<'fast' | 'auto'>('auto')
const aiInput = ref('')

interface AiMessage { role: 'user' | 'ai'; text: string }
const aiMessages = ref<AiMessage[]>([])

const suggestions = [
  { title: 'Summarize my overdue tasks', sub: 'Get a quick overview of what\'s late' },
  { title: 'What\'s at risk this week?', sub: 'Highlight blockers across all projects' },
  { title: 'Draft a status update', sub: 'For Alpha Project team' },
]

function sendMessage(text?: string) {
  const msg = text ?? aiInput.value.trim()
  if (!msg) return
  aiMessages.value.push({ role: 'user', text: msg })
  aiInput.value = ''
  setTimeout(() => {
    aiMessages.value.push({ role: 'ai', text: 'I\'m analysing your workspace data…' })
  }, 600)
}
</script>

<template>
  <div>
    <div class="flex h-screen overflow-hidden bg-[#fafafa]">
      <AppSidebar />
      <div class="flex flex-1 flex-col overflow-hidden m-2 ml-0 rounded-xl border border-black/[0.09] bg-white">
        <slot name="header">
          <AppHeader>{{ route.meta.title ?? '' }}</AppHeader>
        </slot>
        <main class="flex-1 overflow-y-auto px-6 py-5">
          <slot />
        </main>
      </div>
    </div>
    <SearchModal />
    <TaskSlideOver />
    <ProjectSlideOver />
    <GoalSlideOver />
    <CriticalIssuesSlideOver />
    <ActivitySlideOver />
    <!-- AI Overlay -->
    <div class="ai-panel-overlay" :class="{ open: showAI }" @click="showAI = false" />

    <!-- AI FAB -->
    <button class="ai-fab" @click="showAI = !showAI">
      <div class="ai-fab-icon">✦</div>
      Ask AI
    </button>

    <!-- AI Panel -->
    <div class="ai-panel" :class="{ open: showAI }">
      <!-- Header -->
      <div class="ai-panel-header">
        <button class="ai-panel-menu">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div class="ai-panel-title">AI Assistant</div>
        <button class="ai-panel-close" @click="showAI = false">×</button>
      </div>

      <!-- Body -->
      <div class="ai-panel-body">
        <!-- Context chips -->
        <div class="ai-context-row">
          <span class="ai-context-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            This week
          </span>
          <span class="ai-context-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            Rasya's tasks
          </span>
          <span class="ai-context-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            5 projects
          </span>
        </div>

        <!-- Welcome (only when no messages) -->
        <div v-if="aiMessages.length === 0" class="ai-welcome">
          <div class="ai-welcome-icon">✦</div>
          <div class="ai-welcome-title">What can I help with?</div>
          <div class="ai-welcome-sub">Ask anything about your projects,<br>tasks, or team workload.</div>
        </div>

        <!-- Suggestions (only when no messages) -->
        <div v-if="aiMessages.length === 0" class="ai-suggestions">
          <button v-for="s in suggestions" :key="s.title" class="ai-suggestion-btn" @click="sendMessage(s.title)">
            <div class="ai-suggestion-title">{{ s.title }}</div>
            <div class="ai-suggestion-sub">{{ s.sub }}</div>
          </button>
        </div>

        <!-- Chat messages -->
        <template v-for="(msg, i) in aiMessages" :key="i">
          <div class="ai-msg-row" :class="{ user: msg.role === 'user' }">
            <div v-if="msg.role === 'ai'" class="ai-msg-avatar">✦</div>
            <div class="ai-msg-bubble">{{ msg.text }}</div>
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div class="ai-panel-footer">
        <div class="ai-input-row">
          <input
            v-model="aiInput"
            class="ai-input"
            placeholder="Ask anything…"
            @keydown.enter.prevent="sendMessage()"
          >
          <button class="ai-send-btn" @click="sendMessage()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        <div class="ai-footer-meta">
          <div class="ai-mode-toggle">
            <button class="ai-mode-btn" :class="{ active: aiMode === 'fast' }" @click="aiMode = 'fast'">Fast</button>
            <button class="ai-mode-btn" :class="{ active: aiMode === 'auto' }" @click="aiMode = 'auto'">Auto</button>
          </div>
          <span class="ai-footer-hint">↵ to send</span>
        </div>
      </div>
    </div>
  </div>
</template>
