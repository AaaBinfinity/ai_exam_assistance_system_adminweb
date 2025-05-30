<template>
  <div class="exam-question-list">
    <el-card class="exam-header" shadow="hover">
      <div class="header-content">
        <div class="exam-info">
          <div><b>考试科目：</b>{{ subject }}</div>
          <div class="mt-2"><b>剩余时间：</b>{{ formattedTime }}</div>
        </div>
        <div class="exam-actions">
          <el-button type="primary" @click="handleManualSubmit">提交试卷</el-button>
        </div>
      </div>
    </el-card>

    <el-card v-if="currentQuestion" class="mb-4">
      <div class="question-header">
        <b>题目 {{ currentIndex + 1 }} / {{ questions.length }}（{{ currentQuestion.type }}）</b>
        该题作答时间：{{ currentQuestion.answerTime || 0 }} 秒
      </div>

      <div class="question-content mb-2">
        <span v-html="renderQuestionContent(currentQuestion, currentIndex)"></span>
      </div>



      <!-- 单选题 / 判断题 -->
      <el-radio-group
          v-if="currentQuestion.type === '单选题' || currentQuestion.type === '判断题'"
          v-model="currentQuestion.userAnswer"
      >
        <el-radio
            v-for="(opt, idx) in currentQuestion.options"
            :key="idx"
            :label="opt.content"
        >
          {{ opt.content }}
        </el-radio>
      </el-radio-group>

      <!-- 多选题 -->
      <el-checkbox-group
          v-else-if="currentQuestion.type === '多选题'"
          v-model="currentQuestion.userAnswer"
      >
        <el-checkbox
            v-for="(opt, idx) in currentQuestion.options"
            :key="idx"
            :label="opt.content"
        >
          {{ opt.content }}
        </el-checkbox>
      </el-checkbox-group>

      <!-- 可扩展：填空题输入框 -->

      <div class="question-navigation mt-4 text-right">
        <el-button @click="prevQuestion" :disabled="currentIndex === 0">上一题</el-button>
        <el-button
            type="primary"
            @click="nextQuestion"
        >
          {{ currentIndex === questions.length - 1 ? '提交试卷' : '下一题' }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getExamQuestions } from '@/api/exam/exam'

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
  answerTime?: number // 单位：秒
}

interface TypeOption {
  type: string
  count: number
}
interface ExamTimer {
  hours: number
  minutes: number
  seconds: number
}
// 路由 & 数据
const route = useRoute()
const subject = ref('')
const selectedTypes = ref<TypeOption[]>([])
const questions = ref<Question[]>([])
const examDuration = ref(30) // 默认30分钟
const timeLeft = ref(0) // 剩余秒数
const timer = ref<NodeJS.Timeout>()
const currentIndex = ref(0)
const currentQuestion = computed(() => questions.value[currentIndex.value] || null)
const perQuestionStartTime = ref<number>(Date.now())


// 初始化：获取参数并加载题目
onMounted(() => {
  subject.value = route.query.subject as string || ''
  selectedTypes.value = JSON.parse(route.query.types as string || '[]')
  loadQuestions()
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

// 上一题
function prevQuestion() {
  if (currentIndex.value > 0) {
    recordCurrentQuestionTime()
    currentIndex.value--
  }
}

// 下一题或提交
function nextQuestion() {
  recordCurrentQuestionTime()
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  } else {
    handleManualSubmit()
  }
}



// 加载题目
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
        q.content = q.content.replace(/\{\{ANSWER\}\}/g, '') // 替换为纯空白
      }
      return q
    })
  } catch (err) {
    ElMessage.error('题目加载失败')
  }
}

function renderQuestionContent(question: Question, index?: number): string {
  const content = question.content

  if (question.type === '判断题') {
    return content.replace(/\{\{ANSWER\}\}/g, '').replace(/\(\)/g, '')
  } else {
    if (content.includes('{{ANSWER}}') && content.includes('()')) {
      return content.replace(/\{\{ANSWER\}\}/g, '').replace(/\(\)/g, '( &emsp; )')
    } else {
      return content.replace(/\{\{ANSWER\}\}/g, '____')
    }
  }
}




// 响应 input-answer 事件（填空题绑定）
document.addEventListener('input-answer', (e: any) => {
  const { index, subIndex, value } = e.detail
  const q = questions.value[index]
  if (q && Array.isArray(q.userAnswer)) {
    q.userAnswer[subIndex] = value
  }
})
// 计算格式化时间
const formattedTime = computed(() => {
  const hours = Math.floor(timeLeft.value / 3600)
  const minutes = Math.floor((timeLeft.value % 3600) / 60)
  const seconds = timeLeft.value % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 初始化：获取参数并加载题目
onMounted(() => {
  subject.value = route.query.subject as string || ''
  selectedTypes.value = JSON.parse(route.query.types as string || '[]')
  examDuration.value = parseInt(route.query.duration as string) || 30
  timeLeft.value = examDuration.value * 60 // 转换为秒

  loadQuestions()
  startTimer()
})

// 开始计时器
function startTimer() {
  stopTimer() // 先停止已有计时器

  timer.value = setInterval(() => {
    timeLeft.value--

    // 最后5分钟提醒
    if (timeLeft.value === 5 * 60) {
      ElMessage.warning('距离考试结束还有5分钟！')
    }

    // 时间到自动提交
    if (timeLeft.value <= 0) {
      stopTimer()
      autoSubmit()
    }
  }, 1000)
}

// 停止计时器
function stopTimer() {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = undefined
  }
}

// 自动提交
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

// 手动提交按钮事件
function handleManualSubmit() {
  submitExam(false)
}

// 提交试卷
function submitExam(isAuto = false) {
  recordCurrentQuestionTime()
  stopTimer()
  console.log('答卷结果：', questions.value)
  ElMessage.success(isAuto ? '系统已自动提交试卷' : '提交成功')
  // router.push({ name: 'ExamResult' })
}

// 组件卸载时停止计时器
onUnmounted(() => {
  stopTimer()
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
.exam-question-list {
  padding: 20px;
}
.question-header {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: bold;
}
.question-content {
  margin-bottom: 12px;
}
.mb-4 {
  margin-bottom: 20px;
}
.el-radio,
.el-checkbox {
  margin-bottom: 8px;
  display: block;
}
.answer-input {
  display: inline-block;
  width: 120px;
  border: none;
  border-bottom: 1px solid #333;
  outline: none;
  margin: 0 4px;
  font-size: 14px;
  text-align: center;
}
.mt-2 {
  margin-top: 12px;
}
</style>
