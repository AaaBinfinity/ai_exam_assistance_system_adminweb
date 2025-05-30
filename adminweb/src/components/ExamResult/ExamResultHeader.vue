<template>
  <div class="header-section">
    <h2 class="exam-title">考试结果 - {{ subject }}</h2>
    <div class="summary-card">
      <div class="summary-item time-used">
        <i class="el-icon-time summary-icon"></i>
        <span class="summary-label">用时</span>
        <span class="summary-value">{{ formatTime(timeUsed) }}</span>
      </div>
      <div class="summary-item accuracy">
        <i class="el-icon-success summary-icon"></i>
        <span class="summary-label">正确率</span>
        <span class="summary-value">{{ correctRate }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  subject: {
    type: String,
    required: true
  },
  timeUsed: {
    type: Number,
    required: true
  },
  correctRate: {
    type: Number,
    required: true
  }
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}
</script>

<style scoped>
/* 保持原有样式 */
.header-section {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  margin-bottom: 20px;
  border-radius: 8px 8px 0 0;
}

.exam-title {
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

.summary-card {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 25px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}

.summary-item.time-used {
  border-top: 3px solid #409eff;
}

.summary-item.accuracy {
  border-top: 3px solid #67c23a;
}

.summary-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.time-used .summary-icon {
  color: #409eff;
}

.accuracy .summary-icon {
  color: #67c23a;
}

.summary-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.summary-value {
  font-size: 18px;
  font-weight: bold;
}

.time-used .summary-value {
  color: #409eff;
}

.accuracy .summary-value {
  color: #67c23a;
}
</style>