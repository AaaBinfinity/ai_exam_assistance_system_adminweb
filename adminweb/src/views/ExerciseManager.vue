<template>
  <div class="exercise-manager">
    <OperationBar
        :selectedExercise="selectedExercise"
        :beforeUpload="beforeUploadAttachment"
        :uploadAttachment="handleUploadAttachment"
        @add="showAddDialog"
        @batch-add="showBatchAddDialog"
        @delete="handleDelete"
    />
    <div class="exercise-container">
      <ExerciseList
          :exerciseList="exerciseList"
          :pagination="pagination"
          :questionTypeMap="questionTypeMap"
          @select="handleExerciseSelect"
          @page-change="fetchExercises"
      />
      <ExerciseDetail
          v-if="selectedExercise"
          :exercise="selectedExercise"
          :viewMode="isViewMode"
          :questionTypeMap="questionTypeMap"
          @save="handleSave"
          @cancel="isViewMode = true"
          @toggle-edit="isViewMode = false"
          @add-option="addOption"
          @remove-option="removeOption"
          @remove-attachment="removeAttachment"
      />
    </div>
    <AddDialog v-model="addDialogVisible" :data="newExercise" @submit="handleAddExercise" />
    <BatchAddDialog
        v-model="batchAddDialogVisible"
        :beforeUpload="beforeBatchUpload"
        :upload="handleBatchUpload"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
  ExerciseList,
  ExerciseDetail,
  OperationBar,
  AddDialog,
  BatchAddDialog
} from '@/components/ExerciseManager'

export default defineComponent({
  name: 'ExerciseManager',
  components: {
    ExerciseList,
    ExerciseDetail,
    OperationBar,
    AddDialog,
    BatchAddDialog
  },
  setup() {
    const exerciseList = ref([])
    const selectedExercise = ref(null)
    const addDialogVisible = ref(false)
    const batchAddDialogVisible = ref(false)
    const isViewMode = ref(true)
    const newExercise = ref({})
    const pagination = ref({ page: 1, pageSize: 10, total: 0 })
    const questionTypeMap = ref({})

    // 以下为示例方法
    const showAddDialog = () => {
      addDialogVisible.value = true
    }

    const showBatchAddDialog = () => {
      batchAddDialogVisible.value = true
    }

    const handleDelete = () => {
      console.log('删除操作')
    }

    const handleExerciseSelect = (exercise: any) => {
      selectedExercise.value = exercise
      isViewMode.value = true
    }

    const fetchExercises = () => {
      console.log('分页查询')
    }

    const handleSave = () => {
      console.log('保存修改')
    }

    const addOption = () => {}
    const removeOption = () => {}
    const removeAttachment = () => {}
    const beforeUploadAttachment = () => {}
    const handleUploadAttachment = () => {}
    const beforeBatchUpload = () => {}
    const handleBatchUpload = () => {}
    const handleAddExercise = () => {}

    return {
      exerciseList,
      selectedExercise,
      addDialogVisible,
      batchAddDialogVisible,
      isViewMode,
      newExercise,
      pagination,
      questionTypeMap,
      showAddDialog,
      showBatchAddDialog,
      handleDelete,
      handleExerciseSelect,
      fetchExercises,
      handleSave,
      addOption,
      removeOption,
      removeAttachment,
      beforeUploadAttachment,
      handleUploadAttachment,
      beforeBatchUpload,
      handleBatchUpload,
      handleAddExercise
    }
  }
})
</script>
