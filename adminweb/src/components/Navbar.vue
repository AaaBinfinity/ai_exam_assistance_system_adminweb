<!-- src/components/Navbar.vue -->
<script setup lang="ts">
import { defineProps } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div class="navbar">
    <div class="navbar-left">
      <div class="logo">🧠 AI 考试系统</div>
      <nav class="nav-links">
        <RouterLink to="/" class="nav-item" :class="{ active: route.path === '/' }">首页</RouterLink>
        <RouterLink to="/users" class="nav-item" :class="{ active: route.path === '/users' }">用户管理</RouterLink>
    </nav>
    </div>
    <div class="navbar-right">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background-color: #fff;

  .navbar-left {
    display: flex;
    align-items: center;

    .logo {
      font-weight: bold;
      font-size: 18px;
      margin-right: 24px;
    }

    .nav-links {
      display: flex;
      gap: 16px;

      .nav-item {
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
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
  }
}
</style>
