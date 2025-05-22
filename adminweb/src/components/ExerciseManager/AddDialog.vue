<script lang="ts" setup>
import { ref } from 'vue'
import ExerciseForm from './ExerciseForm.vue'

const props = defineProps<{
  data?: Record<string, any>
}>()

const emit = defineEmits(['submit'])
const visible = defineModel<boolean>('visible', { required: true })
const formRef = ref<InstanceType<typeof ExerciseForm>>()
</script>

<template>
  <el-dialog
      v-model="visible"
      title="添加习题"
      width="50%"
      @close="formRef?.resetForm?.()"
  >
    <ExerciseForm
        ref="formRef"
        :initial-data="data"
        @submit="emit('submit')"
    />

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="formRef?.submit()">确认</el-button>
    </template>
  </el-dialog>
</template>