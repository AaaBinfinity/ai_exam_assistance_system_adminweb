<script lang="ts" setup>
import { ref } from 'vue'
import ExerciseForm from './ExerciseForm.vue'
import { addExercise } from '@/api/exam/manager'
import { ElMessage } from 'element-plus'

const visible = defineModel<boolean>()

const props = defineProps({
  data: Object
})

const emit = defineEmits(['submit'])

const formRef = ref()

const handleSubmit = async (formData: any, files?: File[]) => {
  try {
    const res = await addExercise(formData, files)
    ElMessage.success('添加成功')
    visible.value = false
    emit('submit', res.data) // 通知父组件已成功添加
  } catch (err) {
    ElMessage.error('添加失败')
  }
}
</script>

<template>
  <el-dialog v-model="visible" title="添加习题" width="50%">
    <ExerciseForm ref="formRef" :initial-data="data" @submit="handleSubmit" />
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="formRef?.submit()">确认</el-button>
    </template>
  </el-dialog>
</template>
