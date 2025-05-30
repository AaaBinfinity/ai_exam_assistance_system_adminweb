<template>
  <div class="exam-result">
    <el-card>
      <h2>考试结果 - {{ result.subject }}</h2>
      <div class="summary">
        <p>用时: {{ formatTime(result.timeUsed) }}</p>
        <p>正确率: {{ calculateCorrectRate() }}%</p>
      </div>

      <div v-for="(q, index) in result.questions" :key="index" class="question-result" :class="{'correct': q.isCorrect, 'incorrect': !q.isCorrect}">
        <div class="question-header">
          <h3>题目 {{ index + 1 }} ({{ q.type }})</h3>
          <el-tag :type="q.isCorrect ? 'success' : 'danger'" size="small">
            {{ q.isCorrect ? '正确' : '错误' }}
          </el-tag>
        </div>

        <div v-html="renderQuestionContent(q)"></div>
        <p>你的答案: <span :class="{'correct-answer': q.isCorrect, 'wrong-answer': !q.isCorrect}">{{ formatUserAnswer(q.userAnswer) }}</span></p>
        <p>正确答案: {{ formatUserAnswer(q.correctAnswer) }}</p>
        <p>用时: {{ q.answerTime }}秒</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface ExamResult {
  subject: string
  questions: any[]
  timeUsed: number
}

const result = ref<ExamResult>({
  subject: '',
  questions: [],
  timeUsed: 0
})

onMounted(() => {
  const savedResults = localStorage.getItem('examResults')
  if (savedResults) {
    result.value = JSON.parse(savedResults)
  }
})

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}

function calculateCorrectRate() {
  const correctCount = result.value.questions.filter(q => q.isCorrect).length;
  return Math.round((correctCount / result.value.questions.length) * 100);
}

function formatUserAnswer(answer: string | string[]) {
  return Array.isArray(answer) ? answer.join(', ') : answer
}

function renderQuestionContent(question: any) {
  // Similar to your existing render function
}
</script>

<style scoped>
.question-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.correct {
  border-left: 4px solid #67c23a;
  padding-left: 10px;
}

.incorrect {
  border-left: 4px solid #f56c6c;
  padding-left: 10px;
}

.correct-answer {
  color: #67c23a;
  font-weight: bold;
}

.wrong-answer {
  color: #f56c6c;
  font-weight: bold;
}

.question-result {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>