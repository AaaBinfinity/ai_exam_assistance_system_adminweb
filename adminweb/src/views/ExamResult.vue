<template>
  <div class="practice-container">
    <!-- 顶部信息栏 -->
    <div class="practice-header">
      <h2>{{ subject }} 练习</h2>
      <div class="progress-info">
        <span>进度: {{ currentIndex + 1 }}/{{ exercises.length }}</span>
        <el-progress
            :percentage="Math.round((currentIndex / exercises.length) * 100)"
            :stroke-width="12"
            :show-text="false"
        />
      </div>
      <el-button
          type="text"
          class="back-button"
          @click="backToSelection"
      >
        <i class="el-icon-back"></i> 返回选择
      </el-button>
    </div>

    <!-- 题目区域 -->
    <div class="exercise-area">
      <ExerciseCard
          v-if="currentExercise"
          :exercise="currentExercise"
          :index="currentIndex"
          :show-result="showResult"
          @answer-submit="handleAnswerSubmit"
      />
    </div>

    <!-- 底部导航按钮 -->
    <div class="navigation-buttons">
      <el-button
          type="primary"
          :disabled="currentIndex === 0"
          @click="prevExercise"
      >
        上一题
      </el-button>
      <el-button
          type="primary"
          :disabled="currentIndex === exercises.length - 1"
          @click="nextExercise"
      >
        下一题
      </el-button>
    </div>

    <!-- 实时统计 -->
    <div class="real-time-stats">
      <div class="stat-item correct">
        <span class="stat-value">{{ correctCount }}</span>
        <span class="stat-label">正确</span>
      </div>
      <div class="stat-item incorrect">
        <span class="stat-value">{{ incorrectCount }}</span>
        <span class="stat-label">错误</span>
      </div>
      <div class="stat-item accuracy">
        <span class="stat-value">{{ accuracy }}%</span>
        <span class="stat-label">正确率</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRandomExercises } from '@/api/exam/exercise'
import ExerciseCard from '@/components/ExercisePractice/ExerciseCard.vue'

const route = useRoute()
const router = useRouter()

const subject = ref('')
const exercises = ref<any[]>([])
const currentIndex = ref(0)
const userAnswers = ref<Record<string, any>>({})
const showResult = ref(false)

// 获取当前题目
const currentExercise = computed(() => {
  return exercises.value[currentIndex.value]
})

// 统计信息
const correctCount = computed(() => {
  return Object.values(userAnswers.value).filter(a => a.isCorrect).length
})

const incorrectCount = computed(() => {
  return Object.values(userAnswers.value).filter(a => !a.isCorrect).length
})

const accuracy = computed(() => {
  const total = correctCount.value + incorrectCount.value
  return total > 0 ? Math.round((correctCount.value / total) * 100) : 0
})

// 初始化加载题目
onMounted(async () => {
  subject.value = route.query.subject as string
  const types = JSON.parse(route.query.types as string)

  try {
    const response = await getRandomExercises(subject.value, types)
    exercises.value = response.data
  } catch (error) {
    console.error('加载题目失败:', error)
  }
})

// 处理答案提交
const handleAnswerSubmit = (data: { answer: string | string[], timeUsed: number }) => {
  const currentEx = currentExercise.value
  const isCorrect = checkAnswer(currentEx.answer, data.answer)

  // 保存用户答案
  userAnswers.value[currentEx.id] = {
    answer: data.answer,
    isCorrect,
    timeUsed: data.timeUsed
  }

  // 显示结果
  showResult.value = true

  // 自动跳转到下一题（如果不是最后一题）
  if (currentIndex.value < exercises.value.length - 1) {
    setTimeout(() => {
      nextExercise()
    }, 1500)
  }
}

// 检查答案是否正确
const checkAnswer = (correctAnswer: string[], userAnswer: string | string[]) => {
  const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer]
  const correctAnswers = correctAnswer

  if (userAnswers.length !== correctAnswers.length) return false

  return userAnswers.every(answer => correctAnswers.includes(answer))
}

// 上一题
const prevExercise = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    showResult.value = false
  }
}

// 下一题
const nextExercise = () => {
  if (currentIndex.value < exercises.value.length - 1) {
    currentIndex.value++
    showResult.value = false
  }
}

// 返回选择界面
const backToSelection = () => {
  router.push({ name: 'ExerciseSelection' })
}
</script>

<style scoped>
.practice-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.practice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  position: relative;
}

.practice-header h2 {
  margin: 0;
  color: #333;
  flex: 1;
  text-align: center;
}

.back-button {
  position: absolute;
  left: 0;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 15px;
  position: absolute;
  right: 0;
}

.progress-info span {
  font-size: 14px;
  color: #666;
}

.exercise-area {
  min-height: 300px;
  margin-bottom: 30px;
}

.navigation-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.real-time-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.correct .stat-value {
  color: #67c23a;
}

.incorrect .stat-value {
  color: #f56c6c;
}

.accuracy .stat-value {
  color: #409eff;
}
</style>