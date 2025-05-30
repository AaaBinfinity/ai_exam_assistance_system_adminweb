<template>
  <el-dialog
      :title="`题目详情 (${question?.type})`"
      v-model="visible"
      width="70%"
      top="5vh"
      custom-class="question-detail-dialog"
  >
    <div v-if="question" class="detail-content">
      <div class="detail-question" v-html="renderQuestionContent(question, true)"></div>

      <div class="detail-answers">
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
        <div class="answer-row">
          <span class="answer-label">解析:</span>
          <span class="analysis" v-if="question.analysis">
            {{ question.analysis }}
          </span>
          <span class="analysis" v-else>
            暂无解析
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    default: null
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(false)

watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const formatUserAnswer = (answer: string | string[]) => {
  return Array.isArray(answer) ? answer.join(', ') : answer
}

const renderQuestionContent = (question: any, fullContent = false) => {
  return question.content
}
</script>

<style scoped>
.detail-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 0 15px;
}

.detail-question {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
}

.detail-answers .answer-row {
  display: flex;
  margin-bottom: 15px;
  align-items: baseline;
}

.detail-answers .answer-label {
  font-weight: 500;
  min-width: 80px;
  color: #666;
}

.detail-answers .analysis {
  flex: 1;
  line-height: 1.6;
  color: #666;
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
</style>

<style>
.question-detail-dialog {
  border-radius: 12px;
}
</style>