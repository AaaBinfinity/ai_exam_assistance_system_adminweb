<template>
  <div class="profile-container">
    <h1 class="title">个人信息</h1>

    <div class="info-box" v-if="user">
      <p><strong>用户 ID：</strong>{{ user.id }}</p>
      <p><strong>用户名：</strong>{{ user.username }}</p>
      <p><strong>手机号：</strong>{{ user.telephone }}</p>
      <p><strong>邮箱：</strong>{{ user.email }}</p>
    </div>
    <div v-else>
      <p>未获取到用户信息，请登录。</p>
    </div>

    <div class="button-group">
      <button class="btn back" @click="goBack">返回上一级</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserInfo } from '@/utils/auth'
import { useRouter } from 'vue-router'

// 类型声明：根据你提供的 JSON 数据结构
interface UserInfo {
  id: string
  username: string
  password: string | null
  telephone: string
  email: string
  token: string
}

const router = useRouter()
const user = ref<UserInfo | null>(null)

onMounted(() => {
  const info = getUserInfo()
  if (info) {
    user.value = info as UserInfo
  }
})

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 24px;
  margin-bottom: 1.5rem;
}

.info-box {
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.button-group {
  text-align: right;
}

.btn {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.btn.back {
  background-color: #3b82f6;
  color: white;
}

.btn.back:hover {
  background-color: #2563eb;
}
</style>
