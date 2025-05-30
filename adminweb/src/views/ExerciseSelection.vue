<template>
  <div class="selection-container">
    <h2 class="title">请选择练习科目和题型</h2>

    <!-- 科目选择 -->
    <div class="selection-section">
      <h3 class="section-title">选择科目</h3>
      <div class="subject-grid">
        <div
            v-for="subject in subjects"
            :key="subject"
            class="subject-card"
            :class="{ 'selected': selectedSubject === subject }"
            @click="selectSubject(subject)"
        >
          {{ subject }}
        </div>
      </div>
    </div>

    <!-- 题型选择 -->
    <div class="selection-section">
      <h3 class="section-title">选择题型</h3>
      <div class="type-grid">
        <div
            v-for="type in exerciseTypes"
            :key="type"
            class="type-card"
            :class="{ 'selected': selectedTypes.includes(type) }"
            @click="toggleType(type)"
        >
          {{ type }}
          <span v-if="typeCounts[type]" class="count-badge">
            {{ typeCounts[type] }}题
          </span>
        </div>
      </div>
    </div>

    <!-- 数量选择 -->
    <div class="selection-section">
      <h3 class="section-title">题目数量</h3>
      <div class="count-selector">
        <el-input-number
            v-model="exerciseCount"
            :min="5"
            :max="50"
            :step="5"
            label="题目数量"
        />
        <span class="count-hint">(5-50题)</span>
      </div>
    </div>

    <!-- 开始练习按钮 -->
    <div class="action-section">
      <el-button
          type="primary"
          size="large"
          @click="startPractice"
          :disabled="!canStart"
      >
        开始练习
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import { useRouter } from 'vue-router'
import { getSubjectList, getExerciseTypes } from '@/api/exam/exercise'

const router = useRouter()

// 数据
const subjects = ref<string[]>([])
const exerciseTypes = ref<string[]>([])
const selectedSubject = ref('')
const selectedTypes = ref<string[]>([])
const exerciseCount = ref(10)
const typeCounts = ref<Record<string, number>>({})

// 计算属性
const canStart = computed(() => {
  return selectedSubject.value && selectedTypes.value.length > 0
})

// 初始化加载科目和题型
onMounted(async () => {
  try {
    const subjectResponse = await getSubjectList()
    subjects.value = subjectResponse.data

    // 默认选择第一个科目
    if (subjects.value.length > 0) {
      selectSubject(subjects.value[0])
    }
  } catch (error) {
    console.error('加载科目列表失败:', error)
  }
})

// 选择科目
const selectSubject = async (subject: string) => {
  selectedSubject.value = subject
  selectedTypes.value = []

  try {
    const typeResponse = await getExerciseTypes(subject)
    exerciseTypes.value = typeResponse.data

    // 初始化题型数量分配
    exerciseTypes.value.forEach(type => {
      typeCounts.value[type] = 0
    })
  } catch (error) {
    console.error('加载题型列表失败:', error)
  }
}

// 切换题型选择
const toggleType = (type: string) => {
  const index = selectedTypes.value.indexOf(type)
  if (index >= 0) {
    selectedTypes.value.splice(index, 1)
    typeCounts.value[type] = 0
  } else {
    selectedTypes.value.push(type)
    typeCounts.value[type] = Math.floor(exerciseCount.value / selectedTypes.value.length)
  }

  // 重新分配题目数量
  if (selectedTypes.value.length > 0) {
    const baseCount = Math.floor(exerciseCount.value / selectedTypes.value.length)
    const remainder = exerciseCount.value % selectedTypes.value.length

    selectedTypes.value.forEach((type, i) => {
      typeCounts.value[type] = baseCount + (i < remainder ? 1 : 0)
    })
  }
}

// 开始练习
const startPractice = () => {
  const typeConfigs = selectedTypes.value.map(type => ({
    type,
    count: typeCounts.value[type] || 0
  })).filter(item => item.count > 0)

  router.push({
    name: 'Practice',
    query: {
      subject: selectedSubject.value,
      types: JSON.stringify(typeConfigs)
    }
  })
}
</script>

<style scoped>
.selection-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.section-title {
  margin-bottom: 15px;
  color: #444;
  font-size: 18px;
}

.selection-section {
  margin-bottom: 30px;
}

.subject-grid, .type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.subject-card, .type-card {
  padding: 20px;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.subject-card:hover, .type-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.subject-card.selected {
  background-color: #409eff;
  color: white;
}

.type-card.selected {
  background-color: #67c23a;
  color: white;
}

.count-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #f56c6c;
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 12px;
}

.type-card.selected .count-badge {
  background-color: #e6a23c;
}

.count-selector {
  display: flex;
  align-items: center;
  gap: 15px;
}

.count-hint {
  color: #666;
  font-size: 14px;
}

.action-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

</style>