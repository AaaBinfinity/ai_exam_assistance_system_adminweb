<template>
  <div class="exercise-manager">
    <!-- 操作栏 -->
    <OperationBar
        :selectedExercise="selectedExercise"
        :subjectOptions="subjectOptions"
        :questionTypeMap="questionTypeMap"
        @add="showAddDialog"
        @batch-add="showBatchAddDialog"
        @delete="handleDelete"
        @filter="handleFilter"
        @refresh="fetchExercises"
    />

    <!-- 习题列表 -->
    <div class="exercise-container">
      <ExerciseList
          ref="exerciseListRef"
          :subject="filter.subject"
          :type="filter.type"
          :questionTypeMap="questionTypeMap"
          @select="handleExerciseSelect"
          @edit="handleEdit"
      />
    </div>

    <!-- 添加 & 批量导入对话框 -->
    <AddDialog v-model="addDialogVisible" :data="newExercise" @submit="handleAddExercise" />
    <BatchAddDialog
        v-model="batchAddDialogVisible"
        :beforeUpload="beforeBatchUpload"
        :upload="handleBatchUpload"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted
} from 'vue'
import {
  ExerciseList,
  OperationBar,
  AddDialog,
  BatchAddDialog
} from '@/components/ExerciseManager'
import { getSubjectList } from '@/api/exam/exercise'
import { deleteExercise } from '@/api/exam/manager'

interface Exercise {
  id: string;
  content: string;
  subject: string;
  type: string;
  difficulty: number;
  options?: string[];
  attachments?: Array<{ id: string }>;
}

export default defineComponent({
  name: 'ExerciseManager',
  components: {
    ExerciseList,
    OperationBar,
    AddDialog,
    BatchAddDialog
  },
  setup() {
    const exerciseListRef = ref<InstanceType<typeof ExerciseList> | null>(null)
    const selectedExercise = ref<Exercise | null>(null)
    const addDialogVisible = ref(false)
    const batchAddDialogVisible = ref(false)
    const newExercise = ref<Partial<Exercise>>({})

    const questionTypeMap = ref({
      单选题: '单选题',
      多选题: '多选题',
      判断题: '判断题'
    })

    const subjectOptions = ref<string[]>([])
    const filter = ref({
      subject: null as string | null,
      type: null as string | null
    })

    // 获取学科列表
    onMounted(async () => {
      try {
        const res = await getSubjectList()
        subjectOptions.value = res.data || []
      } catch (error) {
        console.error('获取学科列表失败', error)
      }
    })

    // 处理筛选
    const handleFilter = (newFilter: { subject: string | null; type: string | null }) => {
      filter.value = newFilter
    }

    // 处理习题选择
    const handleExerciseSelect = (exercise: Exercise | null) => {
      selectedExercise.value = exercise
    }

    // 处理编辑
    const handleEdit = (exercise: Exercise) => {
      console.log('编辑习题:', exercise)
      // 这里应该调用更新API
    }

    // 刷新习题列表
    const fetchExercises = () => {
      if (exerciseListRef.value) {
        exerciseListRef.value.fetchExerciseList()
      }
    }

    // 删除习题
    const handleDelete = async () => {
      if (!selectedExercise.value) return

      try {
        await deleteExercise(selectedExercise.value.id)
        fetchExercises()
        selectedExercise.value = null
      } catch (error) {
        console.error('删除习题失败:', error)
      }
    }

    const showAddDialog = () => {
      addDialogVisible.value = true
    }

    const showBatchAddDialog = () => {
      batchAddDialogVisible.value = true
    }

    const handleAddExercise = (exercise: Exercise) => {
      console.log('添加习题:', exercise)
      // 这里应该调用添加API
      addDialogVisible.value = false
      fetchExercises()
    }

    const beforeBatchUpload = () => {
      console.log('准备批量上传')
      return true
    }

    const handleBatchUpload = () => {
      console.log('处理批量上传')
      batchAddDialogVisible.value = false
      fetchExercises()
    }

    return {
      exerciseListRef,
      selectedExercise,
      addDialogVisible,
      batchAddDialogVisible,
      newExercise,
      questionTypeMap,
      subjectOptions,
      filter,
      showAddDialog,
      showBatchAddDialog,
      handleDelete,
      handleExerciseSelect,
      handleFilter,
      handleEdit,
      fetchExercises,
      handleAddExercise,
      beforeBatchUpload,
      handleBatchUpload
    }
  }
})
</script>

<style scoped>
.exercise-manager {
  padding: 16px;
}
.exercise-container {
  margin-top: 16px;
}
</style>