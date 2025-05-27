<template>
  <el-dialog
      :model-value="visible"
      @update:model-value="emit('update:visible', $event)"
      title="📢 系统提示"
      width="40%"
      align-center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      custom-class="centered-dialog"
  >
    <div class="message-content">
      {{ message }}
    </div>
    <template #footer>
      <el-button type="primary" @click="emit('update:visible', false)">我知道了</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{
  message: string
  visible: boolean
}>()

const emit = defineEmits(['update:visible'])
</script>

<style scoped>
.centered-dialog {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 16px;
  background: #fffdfa;
  animation: fadeIn 0.3s ease-in-out;
}

.message-content {
  font-size: 18px;
  color: #444;
  text-align: center;
  line-height: 1.8;
  padding: 20px 10px;
  font-weight: 500;
}

.el-dialog__footer {
  text-align: center;
}

.el-button {
  min-width: 120px;
  height: 38px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
