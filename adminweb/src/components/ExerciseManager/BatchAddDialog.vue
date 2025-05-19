<template>
  <el-dialog v-model="visible" title="批量添加习题" width="50%">
    <el-upload
        drag
        action=""
        :before-upload="beforeUpload"
        :http-request="upload"
        :show-file-list="false"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">请上传Excel或JSON格式的习题文件</div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script lang="ts" setup>
const visible = defineModel<boolean>()
defineProps({
  beforeUpload: Function,
  upload: Function
})
</script>
