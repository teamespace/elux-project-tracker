<template>
  <div class="h-screen w-screen flex items-center justify-center bg-[var(--color-bg-base)]">
    <p class="text-[var(--color-text-muted)]">Redirecting...</p>
  </div>
</template>

<script setup lang="ts">
await navigateTo('/dashboard', { replace: true })
</script>
