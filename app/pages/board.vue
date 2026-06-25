<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Board',
  middleware: 'auth',
})
</script>

<template>
  <div>
    <BoardShell />
    <TaskSlideOver />
  </div>
</template>
