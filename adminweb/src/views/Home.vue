<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getUserInfo, removeToken, removeUserInfo } from '@/utils/auth';
import { logout } from '@/api/user/auth';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';

const router = useRouter();
const username = ref('未登录');

// 初始化时获取用户信息
onMounted(() => {
  const userInfo = getUserInfo();
  if (userInfo && userInfo.username) {
    username.value = userInfo.username;
  }
});

/**
 * 处理用户登出
 */
const handleLogout = async () => {
  try {
    // 确认弹窗
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    try {
      // 调用登出接口
      const result = await logout();

      // 根据接口文档，成功返回 "logout success"
      if (result.data === "logout success") {
        handleSuccessfulLogout();
      } else {
        handleFailedLogout(result.data || '未知错误');
      }
    } catch (apiError) {
      console.error('登出API调用失败:', apiError);
      handleFailedLogout('API调用失败');
    }
  } catch (error) {
    // 用户点击了取消
    if (error === 'cancel') {
      return;
    }

    console.error('登出过程中发生错误:', error);
    handleFailedLogout('发生未知错误');
  }
};

/**
 * 处理成功登出逻辑
 */
const handleSuccessfulLogout = () => {
  clearUserData();
  ElMessage.success('退出登录成功');
  redirectToLogin();
};

/**
 * 处理失败登出逻辑
 */
const handleFailedLogout = (errorMsg: string) => {
  ElMessage.error(`登出失败: ${errorMsg}`);
  clearUserData();
  redirectToLogin();
};

/**
 * 清除用户数据
 */
const clearUserData = () => {
  removeToken();
  removeUserInfo();
};

/**
 * 重定向到登录页
 */
const redirectToLogin = () => {
  // 使用 window.location.href 确保页面刷新并跳转到登录页面
  window.location.href = '/login';
};
</script>

<template>
  <div class="logout-container">
    <h1 class="welcome-text">欢迎，{{ username }}！</h1>
    <el-button
        type="danger"
        @click="handleLogout"
        class="logout-button"
    >
      退出登录
    </el-button>
  </div>
</template>

<style scoped lang="scss">
.logout-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  text-align: center;
}

.welcome-text {
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: normal;
}

.logout-button {
  width: 120px;
  font-weight: bold;

  &:hover {
    opacity: 0.9;
  }
}
</style>
