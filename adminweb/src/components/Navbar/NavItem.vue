
<script setup lang="ts">
defineProps<{
  to: string;
  label: string;
  exact?: boolean;
}>();
</script>

<template>
  <RouterLink
      :to="to"
      class="nav-item"
      :exact-active-class="'active'"
      :class="{ active: !exact && $route.path.startsWith(to) }"
  >
    {{ label }}
  </RouterLink>
</template>

<style scoped>
.nav-item {
  position: relative;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }

  &.active {
    background-color: #e0e0e0;
  }
}
</style>
