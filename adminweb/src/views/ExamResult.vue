<template>
  <div class="exam-result">
    <el-card>
      <h2>考试结果 - {{ result.subject }}</h2>
      <div class="summary">
        <p>用时: {{ formatTime(result.timeUsed) }}</p>
        <p>正确率: {{ calculateCorrectRate() }}%</p>
      </div>

      <div v-for="(q, index) in result.questions" :key="index" class="question-result">
        <h3>题目 {{ index + 1 }} ({{ q.type }})</h3>

        <div v-html="renderQuestionContent(q)"></div>
        <p>你的答案: {{ formatUserAnswer(q.userAnswer) }}</p>
        <p>正确答案: {{ q.correctAnswer }}</p>
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
  const correct = result.value.questions.filter(q => {
    if (Array.isArray(q.userAnswer)) {
      return q.userAnswer.join('|') === q.correctAnswer
    }
    return q.userAnswer === q.correctAnswer
  }).length

  return Math.round((correct / result.value.questions.length) * 100)
}

function formatUserAnswer(answer: string | string[]) {
  return Array.isArray(answer) ? answer.join(', ') : answer
}

function renderQuestionContent(question: any) {
  // Similar to your existing render function
}
</script>