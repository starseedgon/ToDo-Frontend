<script setup lang="ts">
defineProps<{ message: string }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="error-message" role="alert">
    <span>{{ message }}</span>
    <button class="button button--small button--danger" type="button" @click="$emit('retry')">다시 시도</button>
  </div>
</template>
