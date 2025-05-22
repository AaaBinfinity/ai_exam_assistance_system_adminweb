<template>
  <div class="exercise-manager">
    <!-- 操作栏 -->
    <OperationBar
        :selectedExercises="selectedExercises"
        :questionTypeMap="questionTypeMap"
        @add="addDialogVisible = true"
        @batch-add="batchAddDialogVisible = true"
        @delete="handleDeleteSuccess"
        @filter="handleFilter"
        @refresh="handleRefresh"
    />

    <!-- 习题列表 -->
    <div class="exercise-container">
      <ExerciseList
          ref="exerciseListRef"
          :subject="filterSubject"
          :type="filterType"
          :questionTypeMap="questionTypeMap"
          @select="selectedExercises = $event"
      />
    </div>

    <!-- 添加 & 批量导入对话框 -->
    <AddDialog
        v-model="addDialogVisible"
        :data="newExercise"
    />
    <BatchAddDialog
        v-model="batchAddDialogVisible"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
  ExerciseList,
  OperationBar,
  AddDialog,
  BatchAddDialog
} from '@/components/ExerciseManager'

export default defineComponent({
  name: 'ExerciseManager',
  components: {
    ExerciseList,
    OperationBar,
    AddDialog,
    BatchAddDialog
  },
  setup() {
    const exerciseListRef = ref()

    const selectedExercises = ref([])
    const addDialogVisible = ref(false)
    const batchAddDialogVisible = ref(false)
    const newExercise = ref({})

    const questionTypeMap = ref({
      单选题: '单选题',
      多选题: '多选题',
      判断题: '判断题',
      填空题: '填空题',
      简答题: '简答题',
      编程题: '编程题'
    })

    const filterSubject = ref<string | null>(null)
    const filterType = ref<string | null>(null)

    const handleDeleteSuccess = () => {
      exerciseListRef.value?.fetchExerciseList()
      selectedExercises.value = []
    }

    const handleFilter = (result: any[]) => {
      // 不使用 result，改为更新筛选条件，子组件会自动 watch 到变化
      filterSubject.value = result.subject || null
      filterType.value = result.type || null
    }


    const handleRefresh = () => {
      exerciseListRef.value?.fetchExerciseList()
    }

    return {
      exerciseListRef,
      selectedExercises,
      addDialogVisible,
      batchAddDialogVisible,
      newExercise,
      questionTypeMap,
      filterSubject,
      filterType,
      handleDeleteSuccess,
      handleFilter,
      handleRefresh
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
