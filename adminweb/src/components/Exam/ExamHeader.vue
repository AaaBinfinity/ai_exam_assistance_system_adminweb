<template>
  <el-card class="exam-header" shadow="hover">
    <div class="header-content">
      <div class="exam-info">
        <div><b>考试科目：</b>{{ subject }}</div>
        <div class="mt-2"><b>剩余时间：</b>{{ formattedTime }}</div>
      </div>
      <div class="exam-actions">
        <el-button type="primary" @click="$emit('submit')">提交试卷</el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  subject: {
    type: String,
    required: true
  },
  timeLeft: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['submit'])

const formattedTime = computed(() => {
  const hours = Math.floor(props.timeLeft / 3600)
  const minutes = Math.floor((props.timeLeft % 3600) / 60)
  const seconds = props.timeLeft % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})
</script>

<style scoped>
.exam-header {
  margin-bottom: 20px;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.exam-info {
  font-size: 16px;
}
.exam-info div {
  margin-bottom: 8px;
}
.mt-2 {
  margin-top: 12px;
}
</style>