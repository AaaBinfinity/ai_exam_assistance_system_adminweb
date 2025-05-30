<template>
  <div
      class="question-card"
      :class="{'correct-card': question.isCorrect, 'incorrect-card': !question.isCorrect}"
      @click="emit('show-detail', question)"
  >
    <div class="question-header">
      <div class="question-meta">
        <span class="question-number">题目 {{ index + 1 }}</span>
        <el-tag
            :type="question.isCorrect ? 'success' : 'danger'"
            size="medium"
            effect="dark"
            class="status-tag"
        >
          {{ question.isCorrect ? '正确' : '错误' }}
        </el-tag>
        <span class="question-type">{{ question.type }}</span>
      </div>
    </div>

    <div class="question-content" v-html="renderQuestionContent(question)"></div>

    <div class="answer-section">
      <div class="answer-row">
        <span class="answer-label">你的答案:</span>
        <span :class="{
          'user-answer': true,
          'correct-answer': question.isCorrect,
          'wrong-answer': !question.isCorrect
        }">
          {{ formatUserAnswer(question.userAnswer) }}
        </span>
      </div>
      <div class="answer-row">
        <span class="answer-label">正确答案:</span>
        <span class="correct-answer-value">
          {{ formatUserAnswer(question.correctAnswer) }}
        </span>
      </div>
      <div class="time-used">
        <i class="el-icon-timer"></i>
        <span>用时: {{ question.answerTime }}秒</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['show-detail'])

const formatUserAnswer = (answer: string | string[]) => {
  return Array.isArray(answer) ? answer.join(', ') : answer
}

const renderQuestionContent = (question: any) => {
  return question.content.length > 100
      ? question.content.substring(0, 100) + '...'
      : question.content
}
</script>

<style scoped>
.question-card {
  cursor: pointer;
  margin-bottom: 25px;
  padding: 20px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.question-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.correct-card {
  border-left: 5px solid #67c23a;
  background-color: rgba(103, 194, 58, 0.05);
}

.incorrect-card {
  border-left: 5px solid #f56c6c;
  background-color: rgba(245, 108, 108, 0.05);
}

.question-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #eaeaea;
}

.question-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.question-number {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.status-tag {
  font-weight: bold;
  letter-spacing: 1px;
}

.question-type {
  font-size: 14px;
  color: #666;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
}

.question-content {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #333;
}

.answer-section {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
}

.answer-row {
  display: flex;
  margin-bottom: 10px;
  align-items: baseline;
}

.answer-label {
  font-weight: 500;
  color: #555;
  min-width: 80px;
}

.user-answer {
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 3px;
}

.correct-answer {
  color: #67c23a;
  background-color: rgba(103, 194, 58, 0.1);
}

.wrong-answer {
  color: #f56c6c;
  background-color: rgba(245, 108, 108, 0.1);
  text-decoration: line-through;
}

.correct-answer-value {
  color: #67c23a;
  font-weight: 600;
  padding: 2px 6px;
  background-color: rgba(103, 194, 58, 0.1);
  border-radius: 3px;
}

.time-used {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #888;
  margin-top: 10px;
}

.time-used i {
  font-size: 14px;
}
</style>