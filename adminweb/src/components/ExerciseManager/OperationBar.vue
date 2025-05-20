<template>
  <div class="operation-bar">
    <el-button type="primary" @click="handleAdd">添加习题</el-button>
    <el-button @click="handleBatchAdd">批量添加</el-button>

    <!-- 添加附件上传按钮 -->
    <el-upload
        v-if="selectedExercise"
        action=""
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="uploadAttachment"
    >
    </el-upload>

    <el-button
        type="danger"
        :disabled="!selectedExercise"
        @click="handleDelete"
    >
      删除
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import type { UploadRequestOptions } from 'element-plus'

// 定义 Props
const props = defineProps({
  selectedExercise: {
    type: Object as PropType<Exercise | null>,
    default: null
  },
  beforeUpload: {
    type: Function as PropType<(file: File) => boolean | Promise<boolean>>,
    required: true
  },
  uploadAttachment: {
    type: Function as PropType<(options: UploadRequestOptions) => void>,
    required: true
  }
})

// 定义 Emits
const emit = defineEmits<{
  (e: 'add'): void
  (e: 'batch-add'): void
  (e: 'delete'): void
}>()

// 事件处理封装
const handleAdd = () => emit('add')
const handleBatchAdd = () => emit('batch-add')
const handleDelete = () => emit('delete')
</script>

<style scoped>
.operation-bar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
</style>
