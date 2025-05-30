<script setup lang="ts">
// App.vue <script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import UserInfo from '@/components/UserInfo.vue'
import Footer from '@/components/Footer.vue'
import { useWebSocket } from '@/composables/useWebSocket'
import MessagePopup from '@/components/MessagePopup.vue'

const route = useRoute()
const message = ref('')
const popupVisible = ref(false)

useWebSocket((msg: string) => {
  message.value = msg
  popupVisible.value = true
})

const closePopup = () => {
  popupVisible.value = false
}

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
    <Navbar v-if="!route.meta.hideNavbar">
      <Footer />
    </Navbar>

  </div>


  <MessagePopup
      :message="message"
      :visible="popupVisible"
      @update:visible="popupVisible = $event"
  />
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
