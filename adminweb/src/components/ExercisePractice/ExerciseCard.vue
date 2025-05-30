<template>
  <div class="exercise-card">
    <div class="exercise-header">
      <span class="exercise-number">题目 {{ index + 1 }}</span>
      <el-tag :type="getTypeTagColor(exercise.type)" size="small">
        {{ exercise.type }}
      </el-tag>
      <el-tag v-if="exercise.difficulty" size="small">
        难度: {{ getDifficultyText(exercise.difficulty) }}
      </el-tag>
    </div>

    <div class="exercise-content" v-html="exercise.content"></div>

    <!-- 单选题 -->
    <div v-if="exercise.type === '单选题'" class="options-container">
      <el-radio-group v-model="selectedOption" :disabled="showResult">
        <el-radio
            v-for="option in exercise.options"
            :key="option.id"
            :label="option.id"
            class="option-item"
            :class="{
            'correct-option': showResult && exercise.answer.includes(option.id),
            'incorrect-option': showResult && selectedOption === option.id && !exercise.answer.includes(option.id)
          }"
        >
          <span class="option-content" v-html="option.content"></span>
        </el-radio>
      </el-radio-group>
    </div>

    <!-- 多选题 -->
    <div v-if="exercise.type === '多选题'" class="options-container">
      <el-checkbox-group v-model="selectedOptions" :disabled="showResult">
        <el-checkbox
            v-for="option in exercise.options"
            :key="option.id"
            :label="option.id"
            class="option-item"
            :class="{
            'correct-option': showResult && exercise.answer.includes(option.id),
            'incorrect-option': showResult && selectedOptions.includes(option.id) && !exercise.answer.includes(option.id)
          }"
        >
          <span class="option-content" v-html="option.content"></span>
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <!-- 判断题 -->
    <div v-if="exercise.type === '判断题'" class="judgment-options">
      <el-radio-group v-model="selectedJudgment" :disabled="showResult">
        <el-radio
            label="true"
            class="judgment-item"
            :class="{
            'correct-option': showResult && exercise.answer.includes('true'),
            'incorrect-option': showResult && selectedJudgment === 'true' && !exercise.answer.includes('true')
          }"
        >
          正确
        </el-radio>
        <el-radio
            label="false"
            class="judgment-item"
            :class="{
            'correct-option': showResult && exercise.answer.includes('false'),
            'incorrect-option': showResult && selectedJudgment === 'false' && !exercise.answer.includes('false')
          }"
        >
          错误
        </el-radio>
      </el-radio-group>
    </div>

    <!-- 答案反馈 -->
    <div v-if="showResult" class="feedback-section">
      <div class="feedback-message" :class="isCorrect ? 'correct' : 'incorrect'">
        <i :class="isCorrect ? 'el-icon-success' : 'el-icon-error'"></i>
        {{ isCorrect ? '回答正确!' : '回答错误!' }}
      </div>
      <div v-if="!isCorrect" class="correct-answer">
        正确答案: {{ formatAnswer(exercise.answer) }}
      </div>
      <div class="time-used">
        <i class="el-icon-timer"></i>
        用时: {{ formattedTime }}
      </div>
    </div>

    <!-- 提交按钮 -->
    <div v-if="!showResult" class="exercise-footer">
      <el-button
          type="primary"
          @click="submitAnswer"
          :disabled="!isAnswerSelected"
      >
        提交答案
      </el-button>
      <span class="timer">
        <i class="el-icon-timer"></i>
        用时: {{ formattedTime }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  exercise: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  showResult: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['answer-submit'])

// 答题状态
const selectedOption = ref('') // 单选题
const selectedOptions = ref<string[]>([]) // 多选题
const selectedJudgment = ref('') // 判断题
const startTime = ref(0)
const elapsedTime = ref(0)
let timer: number | null = null

// 计算属性
const isAnswerSelected = computed(() => {
  if (props.exercise.type === '单选题') return selectedOption.value !== ''
  if (props.exercise.type === '多选题') return selectedOptions.value.length > 0
  if (props.exercise.type === '判断题') return selectedJudgment.value !== ''
  return false
})

const formattedTime = computed(() => {
  const seconds = Math.floor(elapsedTime.value / 1000)
  return `${seconds}秒`
})

const isCorrect = computed(() => {
  if (!props.showResult) return false

  let userAnswer: string | string[] = ''
  if (props.exercise.type === '单选题') {
    userAnswer = selectedOption.value
  } else if (props.exercise.type === '多选题') {
    userAnswer = [...selectedOptions.value]
  } else if (props.exercise.type === '判断题') {
    userAnswer = selectedJudgment.value
  }

  return checkAnswer(props.exercise.answer, userAnswer)
})

// 方法
const getTypeTagColor = (type: string) => {
  switch (type) {
    case '单选题': return 'primary'
    case '多选题': return 'success'
    case '判断题': return 'warning'
    default: return 'info'
  }
}

const getDifficultyText = (level: number) => {
  switch (level) {
    case 1: return '简单'
    case 2: return '中等'
    case 3: return '困难'
    default: return '未知'
  }
}

const formatAnswer = (answer: string | string[]) => {
  if (Array.isArray(answer)) {
    return answer.join(', ')
  }
  return answer
}

const checkAnswer = (correctAnswer: string[], userAnswer: string | string[]) => {
  const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer]
  const correctAnswers = correctAnswer

  if (userAnswers.length !== correctAnswers.length) return false

  return userAnswers.every(answer => correctAnswers.includes(answer))
}

const submitAnswer = () => {
  stopTimer()

  let answer: string | string[] = ''
  if (props.exercise.type === '单选题') {
    answer = selectedOption.value
  } else if (props.exercise.type === '多选题') {
    answer = [...selectedOptions.value]
  } else if (props.exercise.type === '判断题') {
    answer = selectedJudgment.value
  }

  emit('answer-submit', {
    answer,
    timeUsed: Math.floor(elapsedTime.value / 1000)
  })
}

// 计时器
const startTimer = () => {
  startTime.value = Date.now()
  timer = window.setInterval(() => {
    elapsedTime.value = Date.now() - startTime.value
  }, 1000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 生命周期
onMounted(() => {
  selectedOption.value = ''
  selectedOptions.value = []
  selectedJudgment.value = ''
  elapsedTime.value = 0
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.exercise-card {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.exercise-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #eee;
}

.exercise-number {
  font-weight: bold;
  font-size: 16px;
}

.exercise-content {
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 15px;
}

.options-container {
  margin: 20px 0;
}

.option-item {
  display: block;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.option-item:hover {
  background-color: #f5f7fa;
}

.option-content {
  margin-left: 5px;
}

.correct-option {
  background-color: rgba(103, 194, 58, 0.1) !important;
  color: #67c23a;
}

.incorrect-option {
  background-color: rgba(245, 108, 108, 0.1) !important;
  color: #f56c6c;
  text-decoration: line-through;
}

.judgment-options {
  margin: 20px 0;
}

.judgment-item {
  margin-right: 20px;
}

.feedback-section {
  margin-top: 20px;
  padding: 15px;
  border-radius: 6px;
  background-color: #f8f9fa;
}

.feedback-message {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  margin-bottom: 10px;
}

.feedback-message.correct {
  color: #67c23a;
}

.feedback-message.incorrect {
  color: #f56c6c;
}

.correct-answer {
  margin-bottom: 10px;
  color: #67c23a;
  font-weight: 500;
}

.time-used {
  color: #666;
  font-size: 14px;
}

.exercise-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.timer {
  color: #666;
  font-size: 14px;
}

.timer i {
  margin-right: 5px;
}
</style>