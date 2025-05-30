<script setup lang="ts">
import { ElBadge } from 'element-plus';
import { Message } from '@element-plus/icons-vue';

const props = defineProps({
  unreadCount: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['click']);
</script>


<template>
  <div class="message-icon" @click="emit('click')">
    <el-badge :value="unreadCount" :max="99" class="badge">
      <el-icon :size="20"><Message /></el-icon>
    </el-badge>
  </div>
</template>

<style scoped lang="scss">
.message-icon {
  margin-right: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

:deep(.el-badge__content.is-fixed) {
  top: 5px;
  right: 5px;
}
</style>