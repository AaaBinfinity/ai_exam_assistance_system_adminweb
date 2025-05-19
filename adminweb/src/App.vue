<!-- src/App.vue -->
<script setup lang="ts">
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import UserInfo from '@/components/UserInfo.vue';

const route = useRoute();  // 获取当前路由信息
</script>

<template>
  <div class="app-container">
    <!-- 仅在当前路由的 meta 没有 hideNavbar 时显示导航栏 -->
    <Navbar v-if="!route.meta.hideNavbar">
      <UserInfo /> <!-- 插槽插入右侧用户信息 -->
    </Navbar>

    <!-- 页面内容区域 -->
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
}
</style>
