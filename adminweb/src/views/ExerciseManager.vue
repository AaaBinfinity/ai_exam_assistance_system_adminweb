<template>
  <div class="exercise-manager">
    <!-- 操作栏 -->
    <OperationBar
        :selected-exercises="selectedExercises"
        :question-type-map="questionTypeMap"
        :loading="loading"
        @add="addDialogVisible = true"
        @batch-add="batchAddDialogVisible = true"
        @delete="handleDeleteSuccess"
        @filter="handleFilter"
        @refresh="handleRefresh"
    />

    <!-- 习题列表 -->
    <div class="exercise-container" v-loading="loading">
      <ExerciseList
          ref="exerciseListRef"
          :subject="filterSubject"
          :type="filterType"
          :question-type-map="questionTypeMap"
          @select="selectedExercises = $event"
      />
    </div>

    <!-- 添加 & 批量导入对话框 -->
    <AddDialog
        v-model="addDialogVisible"
        :data="newExercise"
        @submit="handleExerciseAdded"
    />
    <BatchAddDialog
        v-model="batchAddDialogVisible"
        @submit="handleBatchAdded"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ExerciseList,
  OperationBar,
  AddDialog,
  BatchAddDialog
} from '@/components/ExerciseManager'

interface Exercise {
  id: string
  question: string
  type: string
  subject: string
  difficulty: number
  // 其他习题属性...
}

interface QuestionTypeMap {
  [key: string]: string
}

// 组件引用
const exerciseListRef = ref<InstanceType<typeof ExerciseList>>()

// 状态管理
const loading = ref(false)
const selectedExercises = ref<Exercise[]>([])
const addDialogVisible = ref(false)
const batchAddDialogVisible = ref(false)
const newExercise = ref<Partial<Exercise>>({})

// 筛选条件
const filterSubject = ref<string | null>(null)
const filterType = ref<string | null>(null)

// 常量
const questionTypeMap = ref<QuestionTypeMap>({
  单选题: '单选题',
  多选题: '多选题',
  判断题: '判断题',
  填空题: '填空题',
  简答题: '简答题',
  编程题: '编程题'
})

// 处理习题添加成功
const handleExerciseAdded = () => {
  addDialogVisible.value = false
  fetchExerciseList()
}

// 处理批量添加成功
const handleBatchAdded = () => {
  batchAddDialogVisible.value = false
  fetchExerciseList()
}

// 获取习题列表
const fetchExerciseList = async () => {
  try {
    loading.value = true
    await exerciseListRef.value?.fetchExerciseList()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 处理删除成功
const handleDeleteSuccess = async () => {
  try {
    loading.value = true
    // 这里假设有批量删除的API调用
    // await batchDeleteExercises(selectedExercises.value.map(e => e.id))
    await fetchExerciseList()
    selectedExercises.value = []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 处理筛选
const handleFilter = (result: { subject?: string; type?: string }) => {
  filterSubject.value = result.subject || null
  filterType.value = result.type || null
  fetchExerciseList()
}

// 处理刷新
const handleRefresh = () => {
  filterSubject.value = null
  filterType.value = null
  fetchExerciseList()
}

// 初始加载
fetchExerciseList()
</script>

<style scoped>
.exercise-manager {
  padding: 8px;
  position: relative;
}

.exercise-container {
  margin-top: 8px;
  min-height: 300px; /* 确保有足够空间显示加载动画 */
}
</style>