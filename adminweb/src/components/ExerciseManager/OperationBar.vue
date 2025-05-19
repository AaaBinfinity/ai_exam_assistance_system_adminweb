<template>
  <div class="operation-bar">
    <el-button type="primary" @click="$emit('add')">添加习题</el-button>
    <el-button @click="$emit('batch-add')">批量添加</el-button>
    <el-upload
        action=""
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="uploadAttachment"
        v-if="selectedExercise"
    >
      <el-button :disabled="!selectedExercise">添加附件</el-button>
    </el-upload>
    <el-button type="danger" @click="$emit('delete')" :disabled="!selectedExercise">删除</el-button>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

defineProps({
  selectedExercise: Object as PropType<Exercise | null>,
  beforeUpload: Function,
  uploadAttachment: Function
})

defineEmits(['add', 'batch-add', 'delete'])
</script>
