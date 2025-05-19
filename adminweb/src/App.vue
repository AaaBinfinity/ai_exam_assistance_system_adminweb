<script setup lang="ts">
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import UserInfo from '@/components/UserInfo.vue';
import Footer from '@/components/Footer.vue'; // 引入 Footer

const route = useRoute();
</script>

<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <Navbar v-if="!route.meta.hideNavbar">
      <UserInfo />
    </Navbar>

    <!-- 页面主体 -->
    <main class="app-main">
      <RouterView />
    </main>

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
}
</style>
