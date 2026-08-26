<template>
  <div>
    <slot />
    <AppToastContainer />
  </div>
</template>

<script setup lang="ts">
import AppToastContainer from '~/components/ui/AppToastContainer.vue'
</script>
