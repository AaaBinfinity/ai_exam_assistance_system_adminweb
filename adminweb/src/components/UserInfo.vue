<script setup lang="ts">
import { getUserInfo, removeToken, removeUserInfo } from '@/utils/auth';
import { logout } from '@/api/user/auth';
import { ElMessageBox, ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import avatar from '@/assets/images/avatar.jpg';
import { getInboxMessages, markAsRead } from '@/api/user/messages';
import { UserAvatar, MessageIcon, MessageDialog } from './UserInfo';

const avatarUrl = avatar;
const username = ref('未登录');
const messageDialogVisible = ref(false);
const unreadCount = ref(0);
const messages = ref<any[]>([]);
const loading = ref(false);

const router = useRouter();

// 初始化时获取用户信息
onMounted(() => {
  const userInfo = getUserInfo();
  if (userInfo && userInfo.username) {
    username.value = userInfo.username;
    fetchUnreadMessages();
  }
});

/**
 * 获取未读消息数量
 */
const fetchUnreadMessages = async () => {
  try {
    const response = await getInboxMessages(0, 5);
    if (response.data && response.data.content) {
      messages.value = response.data.content;
      unreadCount.value = messages.value.filter(msg => !msg.isRead).length;
    }
  } catch (error) {
    console.error('获取消息失败:', error);
  }
};

/**
 * 打开消息对话框
 */
const openMessageDialog = async () => {
  messageDialogVisible.value = true;
  loading.value = true;
  try {
    const response = await getInboxMessages(0, 10);
    if (response.data && response.data.content) {
      messages.value = response.data.content;
      unreadCount.value = 0;
    }
  } catch (error) {
    console.error('获取消息失败:', error);
    ElMessage.error('获取消息失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 标记消息为已读
 */
const handleMarkAsRead = async (messageId: string) => {
  try {
    await markAsRead(messageId);
    const message = messages.value.find(msg => msg.id === messageId);
    if (message && !message.isRead) {
      message.isRead = true;
      if (unreadCount.value > 0) {
        unreadCount.value -= 1;
      }
    }
  } catch (error) {
    console.error('标记已读失败:', error);
  }
};

/**
 * 处理用户登出
 */
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    try {
      const result = await logout();
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
    if (error !== 'cancel') {
      console.error('登出过程中发生错误:', error);
      handleFailedLogout('发生未知错误');
    }
  }
};

const handleSuccessfulLogout = () => {
  clearUserData();
  ElMessage.success('退出登录成功');
  setTimeout(() => router.push('/login'), 1000);
};

const handleFailedLogout = (errorMsg: string) => {
  ElMessage.error(`登出失败: ${errorMsg}`);
  clearUserData();
  setTimeout(() => router.push('/login'), 1000);
};

const clearUserData = () => {
  removeToken();
  removeUserInfo();
};
</script>

<template>
  <div class="user-info-container">
    <MessageIcon
        :unread-count="unreadCount"
        @click="openMessageDialog"
    />

    <UserAvatar
        :username="username"
        :avatar-url="avatarUrl"
        @logout="handleLogout"
    />

    <MessageDialog
        v-model="messageDialogVisible"
        :messages="messages"
        :loading="loading"
        @mark-as-read="handleMarkAsRead"
    />
  </div>
</template>

<style scoped lang="scss">
.user-info-container {
  display: flex;
  align-items: center;
  height: 100%;
  margin-right: 20px;
}
</style>