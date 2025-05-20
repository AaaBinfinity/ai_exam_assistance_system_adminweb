<script setup lang="ts">
import { ref } from 'vue';
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElAvatar } from 'element-plus';
import { User, SwitchButton } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { defineEmits } from 'vue'

const props = defineProps({
  username: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['logout']);

const dropdownVisible = ref(false);
const router = useRouter();
</script>

<template>
  <el-dropdown
      v-model="dropdownVisible"
      trigger="click"
      placement="bottom-end"
      @visible-change="(val) => dropdownVisible = val"
  >
    <div class="user-avatar">
      <span class="username">{{ username }}</span>
      <el-avatar :size="32" :src="avatarUrl" />
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="router.push('/profile')">
          <el-icon><User /></el-icon>
          个人中心
        </el-dropdown-item>
        <el-dropdown-item divided @click="emit('logout')">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>

  </el-dropdown>
</template>

<style scoped lang="scss">
.user-avatar {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 8px;
  height: 64px;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.025);
  }

  .username {
    margin-right: 8px;
    font-size: 14px;
    color: #606266;
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;

  .el-icon {
    margin-right: 8px;
  }
}
</style>