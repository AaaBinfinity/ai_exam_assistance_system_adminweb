<template>
  <div class="exam-question-list">
    <ExamHeader
        :subject="subject"
        :time-left="timeLeft"
        @submit="handleManualSubmit"
    />

    <QuestionCard
        v-if="currentQuestion"
        :question="currentQuestion"
        :current-index="currentIndex"
        :total-questions="questions.length"
        @prev="prevQuestion"
        @next="nextQuestion"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getExamQuestions } from '@/api/exam/exam'
import { checkAnswers, batchSubmitAnswers } from '@/api/exam/submit'
import ExamHeader from '@/components/Exam/ExamHeader.vue'
import QuestionCard from '@/components/Exam/QuestionCard.vue'

// 接口定义
interface Option {
  content: string
  id: string
}

interface Question {
  id?: string
  type: string
  content: string
  options: Option[]
  userAnswer?: string | string[]
  answerTime?: number
}

interface TypeOption {
  type: string
  count: number
}

// 路由 & 数据
const route = useRoute()
const router = useRouter()
const subject = ref('')
const selectedTypes = ref<TypeOption[]>([])
const questions = ref<Question[]>([])
const examDuration = ref(30)
const timeLeft = ref(0)
const timer = ref<NodeJS.Timeout>()
const currentIndex = ref(0)
const perQuestionStartTime = ref<number>(Date.now())
const studentId = ref('123')
const examId = ref('E1')

const currentQuestion = computed(() => questions.value[currentIndex.value] || null)

// 初始化
onMounted(() => {
  subject.value = route.query.subject as string || ''
  selectedTypes.value = JSON.parse(route.query.types as string || '[]')
  examDuration.value = parseInt(route.query.duration as string) || 30
  timeLeft.value = examDuration.value * 60

  loadQuestions()
  startTimer()
})

function recordCurrentQuestionTime() {
  const now = Date.now()
  const duration = Math.floor((now - perQuestionStartTime.value) / 1000)
  const current = questions.value[currentIndex.value]
  if (current) {
    current.answerTime = (current.answerTime || 0) + duration
  }
  perQuestionStartTime.value = now
}

function prevQuestion() {
  if (currentIndex.value > 0) {
    recordCurrentQuestionTime()
    currentIndex.value--
  }
}

function nextQuestion() {
  recordCurrentQuestionTime()
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  } else {
    handleManualSubmit()
  }
}

async function loadQuestions() {
  if (!subject.value) {
    ElMessage.warning('缺少学科参数')
    return
  }
  try {
    const res = await getExamQuestions(subject.value, selectedTypes.value)
    questions.value = res.data.map((q: Question) => {
      if (q.type === '填空题') {
        const blankCount = (q.content.match(/\{\{ANSWER\}\}/g) || []).length
        q.userAnswer = Array(blankCount).fill('')
        q.content = q.content.replace(/\{\{ANSWER\}\}/g, '')
      }
      return q
    })
  } catch (err) {
    ElMessage.error('题目加载失败')
  }
}

function startTimer() {
  stopTimer()

  timer.value = setInterval(() => {
    timeLeft.value--

    if (timeLeft.value === 5 * 60) {
      ElMessage.warning('距离考试结束还有5分钟！')
    }

    if (timeLeft.value <= 0) {
      stopTimer()
      autoSubmit()
    }
  }, 1000)
}

function stopTimer() {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = undefined
  }
}

function autoSubmit() {
  ElMessageBox.confirm('考试时间已结束，系统将自动提交试卷', '提示', {
    confirmButtonText: '确定',
    showCancelButton: false,
    closeOnClickModal: false,
    closeOnPressEscape: false
  }).then(() => {
    submitExam(true)
  })
}

function handleManualSubmit() {
  submitExam(false)
}

async function submitExam(isAuto = false) {
  recordCurrentQuestionTime()
  stopTimer()

  try {
    const timestamp = Date.now()
    const submissionData = questions.value.map(q => ({
      studentId: studentId.value,
      questionId: q.id,
      examId: examId.value,
      timestamp,
      answerType: 'FuzzyAnswer',
      duration: q.answerTime || 0,
      rightAnswer: '',
      answer: Array.isArray(q.userAnswer)
          ? q.userAnswer.join(',')
          : q.userAnswer || ''
    }))

    await batchSubmitAnswers(submissionData)

    const questionIds = questions.value.map(q => q.id || '')
    const checkResponse = await checkAnswers(questionIds)

    const correctAnswers = checkResponse.data.map((answerArray: any[]) => {
      if (answerArray.length === 1) return answerArray[0]
      return answerArray
    })

    let correctCount = 0
    const examResults = {
      subject: subject.value,
      totalQuestions: questions.value.length,
      timeUsed: examDuration.value * 60 - timeLeft.value,
      questions: questions.value.map((q, index) => {
        const isCorrect = compareAnswers(q.userAnswer, correctAnswers[index])
        if (isCorrect) correctCount++

        return {
          ...q,
          correctAnswer: correctAnswers[index],
          isCorrect
        }
      }),
      score: Math.round((correctCount / questions.value.length) * 100)
    }

    localStorage.setItem('examResults', JSON.stringify(examResults))

    ElMessage.success(isAuto ? '系统已自动提交试卷' : '提交成功')
    router.push({ name: 'ExamResult' })
  } catch (err) {
    ElMessage.error('提交试卷失败，请稍后重试')
    console.error('提交失败:', err)
    if (timeLeft.value > 0) startTimer()
  }
}

function compareAnswers(userAnswer: any, correctAnswer: any): boolean {
  const question = questions.value[currentIndex.value]
  console.log('User Answers:', userAnswer)
  console.log('Correct Answers:', correctAnswer)
  if (userAnswer === undefined || userAnswer === null ||
      (Array.isArray(userAnswer) && userAnswer.length === 0)) {
    return false
  }

  if (question.type === '判断题') {
    const userChoice = userAnswer === 'A' ? '正确' :
        userAnswer === 'B' ? '错误' :
            userAnswer

    const correct = Array.isArray(correctAnswer) ?
        correctAnswer[0] :
        correctAnswer

    return userChoice === correct
  }

  if (question.type === '多选题') {
    let userAnswers: string[] = []
    if (Array.isArray(userAnswer)) {
      userAnswers = userAnswer.map(a => String(a).trim().toUpperCase())
    } else if (typeof userAnswer === 'string') {
      userAnswers = userAnswer.split(/[,，\s]+/)
          .map(a => a.trim().toUpperCase())
          .filter(a => /^[A-Z]$/.test(a))
    }

    let correctAnswers: string[] = []
    if (Array.isArray(correctAnswer)) {
      correctAnswers = correctAnswer.map(a =>
          typeof a === 'string' ? a.trim().toUpperCase() : String(a).trim().toUpperCase()
      )
    } else if (typeof correctAnswer === 'string') {
      correctAnswers = correctAnswer.split(/[,，\s]+/)
          .map(a => a.trim().toUpperCase())
          .filter(a => /^[A-Z]$/.test(a))
    }

    if (userAnswers.length !== correctAnswers.length) {
      return false
    }

    return JSON.stringify(userAnswers.sort()) ===
        JSON.stringify(correctAnswers.sort())
  }

  const user = Array.isArray(userAnswer) ?
      userAnswer[0]?.trim().toUpperCase() :
      String(userAnswer).trim().toUpperCase()
  const correct = Array.isArray(correctAnswer) ?
      correctAnswer[0]?.trim().toUpperCase() :
      String(correctAnswer).trim().toUpperCase()

  return user === correct
}

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.exam-question-list {
  padding: 20px;
}
</style>