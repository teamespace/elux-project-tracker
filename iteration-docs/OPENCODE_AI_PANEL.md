# OPENCODE PROMPT — AI Panel (Floating FAB + Chat Panel)

## Goal
Replace the current basic AI button in `app/layouts/default.vue` with the full AI panel from `dashboard-mockup-v3.html`. The current version is a simple icon button + minimal `v-if` panel. The target is a floating pill-shaped FAB with gradient background + a full 400px chat panel with suggestion chips, context chips, chat input, and Fast/Auto mode toggle.

## Target file
- `app/layouts/default.vue` — replace the AI FAB + panel section

---

## 1. Add these CSS classes to `app/assets/css/main.css`

```css
/* ─── AI PANEL ─── */
.ai-fab {
  position: fixed; bottom: 24px; right: 24px; z-index: 8000;
  display: flex; align-items: center; gap: 8px;
  padding: 8px 16px 8px 10px;
  background: linear-gradient(135deg, oklch(52% 0.27 292.717), oklch(60.6% 0.25 292.717));
  border-radius: 40px; border: none; cursor: pointer; color: white;
  font-size: 13px; font-weight: 500; font-family: inherit;
  box-shadow: 0 4px 20px rgba(99,102,241,.35);
  transition: transform .15s, box-shadow .15s;
}
.ai-fab:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(99,102,241,.4); }
.ai-fab-icon {
  width: 24px; height: 24px; background: rgba(255,255,255,.2);
  border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px;
}
.ai-panel-overlay { position: fixed; inset: 0; z-index: 8999; display: none; }
.ai-panel-overlay.open { display: block; }
.ai-panel {
  position: fixed; bottom: 80px; right: 24px; z-index: 9000;
  width: 400px; max-height: 580px; background: white;
  border-radius: 16px; border: 1px solid #E5E7EB;
  box-shadow: 0 20px 60px rgba(0,0,0,.15);
  display: none; flex-direction: column; overflow: hidden;
}
.ai-panel.open { display: flex; }
.ai-panel-header {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px; border-bottom: 1px solid #F3F4F6; flex-shrink: 0;
}
.ai-panel-menu {
  width: 28px; height: 28px; border-radius: 8px;
  border: 1px solid #E5E7EB; background: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: #6B7280;
}
.ai-panel-title { flex: 1; font-size: 14px; font-weight: 600; color: #1F2937; text-align: center; }
.ai-panel-close {
  width: 28px; height: 28px; border-radius: 8px; border: none;
  background: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #9CA3AF; font-size: 18px; line-height: 1;
}
.ai-panel-close:hover { background: #F3F4F6; color: #4B5563; }
.ai-panel-body { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 16px; min-height: 0; }
.ai-context-row { display: flex; gap: 6px; flex-wrap: wrap; }
.ai-context-chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 20px;
  border: 1px solid #E5E7EB; background: #F9FAFB;
  font-size: 12px; color: #374151;
}
.ai-welcome { text-align: center; padding: 16px 0 4px; }
.ai-welcome-icon {
  width: 40px; height: 40px; margin: 0 auto 10px;
  background: linear-gradient(135deg, oklch(52% 0.27 292.717), oklch(60.6% 0.25 292.717));
  border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;
}
.ai-welcome-title { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 4px; }
.ai-welcome-sub { font-size: 12.5px; color: #6B7280; line-height: 1.5; }
.ai-suggestions { display: flex; flex-direction: column; gap: 6px; }
.ai-suggestion-btn {
  text-align: left; padding: 10px 12px; border-radius: 10px;
  border: 1px solid #E5E7EB; background: white; cursor: pointer; font-family: inherit;
  transition: border-color .15s, background .15s;
}
.ai-suggestion-btn:hover { border-color: oklch(85% 0.13 292.717); background: oklch(96% 0.04 292.717); }
.ai-suggestion-title { font-size: 13px; font-weight: 500; color: #111827; margin-bottom: 2px; }
.ai-suggestion-sub { font-size: 11.5px; color: #9CA3AF; }
.ai-msg-row { display: flex; gap: 8px; }
.ai-msg-row.user { flex-direction: row-reverse; }
.ai-msg-avatar {
  width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
  background: linear-gradient(135deg, oklch(52% 0.27 292.717), oklch(60.6% 0.25 292.717));
  display: flex; align-items: center; justify-content: center; font-size: 13px; margin-top: 2px;
}
.ai-msg-bubble { max-width: 85%; padding: 9px 12px; border-radius: 12px; font-size: 13px; line-height: 1.5; }
.ai-msg-row.user .ai-msg-bubble { background: oklch(60.6% 0.25 292.717); color: white; border-radius: 12px 12px 2px 12px; }
.ai-msg-row:not(.user) .ai-msg-bubble { background: #F9FAFB; color: #111827; border: 1px solid #F3F4F6; border-radius: 12px 12px 12px 2px; }
.ai-panel-footer { border-top: 1px solid #F3F4F6; padding: 12px 14px; flex-shrink: 0; }
.ai-input-row {
  display: flex; align-items: center; gap: 8px;
  background: #F9FAFB; border: 1px solid #E5E7EB;
  border-radius: 10px; padding: 8px 10px;
}
.ai-input { flex: 1; border: none; background: transparent; outline: none; font-size: 13px; font-family: inherit; color: #111827; resize: none; }
.ai-input::placeholder { color: #9CA3AF; }
.ai-send-btn {
  width: 30px; height: 30px; border-radius: 8px; border: none; flex-shrink: 0;
  background: oklch(60.6% 0.25 292.717); color: white; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.ai-send-btn:hover { background: oklch(52% 0.27 292.717); }
.ai-footer-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
.ai-mode-toggle { display: flex; gap: 4px; background: #F3F4F6; border-radius: 8px; padding: 2px; }
.ai-mode-btn { font-size: 11.5px; font-weight: 500; padding: 3px 10px; border-radius: 6px; border: none; background: transparent; cursor: pointer; color: #6B7280; font-family: inherit; }
.ai-mode-btn.active { background: white; color: #111827; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
.ai-footer-hint { font-size: 11px; color: #D1D5DB; }
```

---

## 2. Replace the AI section in `app/layouts/default.vue`

Find and remove the existing AI button and panel (the `<button class="fixed bottom-6 right-6 ...">` block and the `<div v-if="showAI" ...>` block).

Replace the `<script setup>` section with:

```vue
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
```

Add inside `<template>`, after `<ActivitySlideOver />` and before `</div>`:

```html
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
      />
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
```
