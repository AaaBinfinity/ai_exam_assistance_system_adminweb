<template>
  <div class="exercise-practice-container">
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
    </div>

    <!-- 题目区域 -->
    <div class="exercise-area">
      <ExerciseCard
          v-if="currentExercise"
          :exercise="currentExercise"
          :index="currentIndex"
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
      <el-button
          type="success"
          v-if="currentIndex === exercises.length - 1"
          @click="submitAllAnswers"
      >
        提交答案
      </el-button>
    </div>

    <!-- 结果弹窗 -->
    <ExerciseResultDialog
        v-model="resultDialogVisible"
        :results="results"
        :exercises="exercises"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getRandomExercises } from '@/api/exam/exercise'
import ExerciseCard from '@/components/ExercisePractice/ExerciseCard.vue'

interface UserAnswer {
  exerciseId: string
  answer: string | string[]
  isCorrect: boolean
  timeUsed: number
}

const route = useRoute()
const subject = ref<string>(route.params.subject as string || '')
const exercises = ref<any[]>([])
const currentIndex = ref(0)
const userAnswers = ref<UserAnswer[]>([])
const resultDialogVisible = ref(false)
const results = ref<any[]>([])

// 获取当前题目
const currentExercise = computed(() => {
  return exercises.value[currentIndex.value]
})


onMounted(async () => {
  try {
    const subject = route.query.subject as string
    const types = JSON.parse(route.query.types as string)

    const response = await getRandomExercises(subject, types)
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
  const existingIndex = userAnswers.value.findIndex(a => a.exerciseId === currentEx.id)
  if (existingIndex >= 0) {
    userAnswers.value[existingIndex] = {
      exerciseId: currentEx.id,
      answer: data.answer,
      isCorrect,
      timeUsed: data.timeUsed
    }
  } else {
    userAnswers.value.push({
      exerciseId: currentEx.id,
      answer: data.answer,
      isCorrect,
      timeUsed: data.timeUsed
    })
  }

  // 自动跳转到下一题（如果不是最后一题）
  if (currentIndex.value < exercises.value.length - 1) {
    setTimeout(() => {
      nextExercise()
    }, 500)
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
  }
}

// 下一题
const nextExercise = () => {
  if (currentIndex.value < exercises.value.length - 1) {
    currentIndex.value++
  }
}

// 提交所有答案
const submitAllAnswers = () => {
  // 生成结果数据
  results.value = exercises.value.map(ex => {
    const userAnswer = userAnswers.value.find(a => a.exerciseId === ex.id)
    return {
      ...ex,
      userAnswer: userAnswer?.answer || '',
      isCorrect: userAnswer?.isCorrect || false,
      answerTime: userAnswer?.timeUsed || 0
    }
  })

  resultDialogVisible.value = true
}
</script>

<style scoped>
.exercise-practice-container {
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
}

.practice-header h2 {
  margin: 0;
  color: #333;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 15px;
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
</style>