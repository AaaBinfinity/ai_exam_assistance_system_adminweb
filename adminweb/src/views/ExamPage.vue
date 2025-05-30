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
        @update:question="updateCurrentQuestion"
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
import { toRaw } from 'vue'



interface Option {
  id: string
  content: string
}

interface Question {
  id?: string
  type: '单选题' | '多选题' | '判断题' | '填空题' | '简答题'
  content: string
  options: Option[]
  userAnswer?: string | string[]
  answerTime?: number
  correctAnswer?: string | string[]
  isCorrect?: boolean
}

interface TypeOption {
  type: string
  count: number
}

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

onMounted(() => {
  subject.value = route.query.subject as string || ''
  selectedTypes.value = JSON.parse(route.query.types as string || '[]')
  examDuration.value = parseInt(route.query.duration as string) || 30
  timeLeft.value = examDuration.value * 60

  loadQuestions()
  startTimer()
})
function updateCurrentQuestion(newQuestion: Question) {
  console.log('[接收到题目更新]', newQuestion)

  if (Array.isArray(newQuestion.userAnswer)) {
    newQuestion.userAnswer = [...toRaw(newQuestion.userAnswer)]
  }

  console.log('[处理后的 userAnswer]', newQuestion.userAnswer)

  // 更新题目数组
  questions.value[currentIndex.value] = newQuestion
}

function recordCurrentQuestionTime() {
  const now = Date.now()
  const duration = Math.floor((now - perQuestionStartTime.value) / 1000)
  const current = questions.value[currentIndex.value]

  if (current) {
    current.answerTime = (current.answerTime || 0) + duration
    console.log(`[记录答题时间] 第${currentIndex.value + 1}题 (${current.type}) userAnswer:`, current.userAnswer)
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
    // ✅ 日志输出：答题内容
    console.log('[提交考试] 当前所有答题记录：')
    questions.value.forEach((q, idx) => {
      console.log(`第${idx + 1}题（${q.type}）：`, q.userAnswer)
    })

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
        console.log("对不对？"+isCorrect)
        if (isCorrect) correctCount++
        console.log("correctCountcorrectCountcorrectCountcorrectCount="+correctCount)

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

function compareAnswers(userAnswer: any, correctAnswer: string[]): boolean {
  if (!correctAnswer || correctAnswer.length === 0) return false;

  const normalizeAnswer = (ans: any): string[] => {
    if (Array.isArray(ans)) {
      return ans.map(item => String(item).trim().toUpperCase()).filter(Boolean);
    }
    if (typeof ans === 'string') {
      return ans.split(/[,，\s]+/).map(item => item.trim().toUpperCase()).filter(Boolean);
    }
    return [];
  }

  const userAnswers = normalizeAnswer(userAnswer)
  const normalizedCorrect = normalizeAnswer(correctAnswer)

  console.log(`[答案比对] 题型: ${currentQuestion.value?.type}`)
  console.log('用户答案字符串:', JSON.stringify(userAnswers))
  console.log('正确答案字符串:', JSON.stringify(normalizedCorrect))
  if (currentQuestion.value?.type === '判断题') {
    const userChoice = userAnswers[0] === 'A' ? '正确' : userAnswers[0] === 'B' ? '错误' : userAnswers[0]
    return userChoice === normalizedCorrect[0]
  }

  if (currentQuestion.value?.type === '多选题') {
    console.log('确认进入多选题分支');
    console.log('userAnswers 类型:', Object.prototype.toString.call(userAnswers));
    console.log('normalizedCorrect 类型:', Object.prototype.toString.call(normalizedCorrect));
    console.log('userAnswers 内容:', [...userAnswers]);
    console.log('normalizedCorrect 内容:', [...normalizedCorrect]);
    console.log('用户答案 Set:', new Set(userAnswers)); // 检查 Set 内容
    console.log('正确答案 Set:', new Set(normalizedCorrect));
    console.log('A 是否存在:', new Set(normalizedCorrect).has('A')); // 应返回 true

    const userSet = new Set(userAnswers);
    const correctSet = new Set(normalizedCorrect);
    return (
        userAnswers.length === normalizedCorrect.length &&
        userAnswers.every(ans => correctSet.has(ans))
    );
  }

  return userAnswers[0] === normalizedCorrect[0]
}

console.log(compareAnswers)
onUnmounted(() => {
  stopTimer()
})
</script>


<style scoped>
.exam-question-list {
  padding: 20px;
}
</style>