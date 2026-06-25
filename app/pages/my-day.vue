<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'My Day',
  middleware: 'auth',
})

useHead({
  meta: [
    { 'http-equiv': 'refresh', content: '0; url=/my-work' },
  ],
})
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white p-12 text-center">
    <UIcon name="ph:check-square" class="mx-auto size-10 text-gray-400" />
    <p class="mt-3 text-base text-gray-500">My Day has moved to My Work.</p>
    <NuxtLink to="/my-work" class="mt-2 inline-block text-sm text-blue-600 hover:underline">
      Go to My Work
    </NuxtLink>
  </div>
</template>
