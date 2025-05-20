<template>
  <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      @submit.prevent="handleSubmit"
  >
    <el-form-item label="题目类型" prop="questionType">
      <el-select v-model="formData.questionType" @change="handleTypeChange">
        <el-option
            v-for="(label, value) in questionTypeMap"
            :key="value"
            :label="label"
            :value="value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="题目内容" prop="question" required>
      <el-input v-model="formData.question" type="textarea" :rows="3" />
    </el-form-item>

    <!-- 选择题选项 -->
    <el-form-item
        v-if="['single', 'multiple'].includes(formData.questionType)"
        label="选项"
        required
    >
      <div v-for="(option, index) in formData.options" :key="index" class="option-item">
        <el-input v-model="formData.options[index]" style="width: 80%" />
        <el-button
            type="danger"
            circle
            :icon="Delete"
            @click="removeOption(index)"
        />
      </div>
      <el-button type="primary" @click="addOption">添加选项</el-button>
    </el-form-item>

    <!-- 正确答案 -->
    <el-form-item label="正确答案" prop="answer" required>
      <template v-if="formData.questionType === 'single'">
        <el-radio-group v-model="formData.answer">
          <el-radio
              v-for="(option, index) in formData.options"
              :key="index"
              :label="String.fromCharCode(65 + index)"
          />
        </el-radio-group>
      </template>
      <template v-else-if="formData.questionType === 'multiple'">
        <el-checkbox-group v-model="formData.answer">
          <el-checkbox
              v-for="(option, index) in formData.options"
              :key="index"
              :label="String.fromCharCode(65 + index)"
          />
        </el-checkbox-group>
      </template>
      <template v-else-if="formData.questionType === 'judgment'">
        <el-radio-group v-model="formData.answer">
          <el-radio label="正确" />
          <el-radio label="错误" />
        </el-radio-group>
      </template>
      <template v-else>
        <el-input v-model="formData.answer" type="textarea" :rows="3" />
      </template>
    </el-form-item>

    <el-form-item label="解析">
      <el-input v-model="formData.analysis" type="textarea" :rows="3" />
    </el-form-item>

    <el-form-item label="难度">
      <el-rate v-model="formData.difficulty" :max="5" />
    </el-form-item>

    <el-form-item label="附件">
      <el-upload
          v-model:file-list="files"
          multiple
          :before-upload="beforeUpload"
          :on-remove="handleRemove"
      >
        <el-button type="primary">选择文件</el-button>
        <template #tip>
          <div class="el-upload__tip">可上传多个附件，每个不超过10MB</div>
        </template>
      </el-upload>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage, UploadFile } from 'element-plus'
import { addExercise } from '@/api/exam/manager'


const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit'])

const questionTypeMap = {
  single: '单选题',
  multiple: '多选题',
  judgment: '判断题',
  fill: '填空题',
  answer: '问答题'
}

const formData = reactive({
  questionType: 'single',
  question: '',
  options: ['', ''],
  answer: '',
  analysis: '',
  difficulty: 3,
  ...props.initialData
})

const files = ref<UploadFile[]>([])

// 监听题目类型变化
const handleTypeChange = (type: string) => {
  if (type === 'single') {
    formData.answer = ''
    if (!formData.options || formData.options.length < 2) {
      formData.options = ['', '']
    }
  } else if (type === 'multiple') {
    formData.answer = []
    if (!formData.options || formData.options.length < 2) {
      formData.options = ['', '']
    }
  } else if (type === 'judgment') {
    formData.options = []
    formData.answer = '正确'
  } else {
    formData.options = []
    formData.answer = ''
  }
}

// 添加选项
const addOption = () => {
  formData.options.push('')
}

// 删除选项
const removeOption = (index: number) => {
  formData.options.splice(index, 1)

  const removedLabel = String.fromCharCode(65 + index)

  if (formData.questionType === 'multiple' && Array.isArray(formData.answer)) {
    formData.answer = formData.answer.filter(ans => ans !== removedLabel)
  } else if (formData.questionType === 'single' && formData.answer === removedLabel) {
    formData.answer = ''
  }
}

// 上传前检查
const beforeUpload = (file: File) => {
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过10MB')
    return false
  }
  return true
}

// 移除文件
const handleRemove = (file: UploadFile) => {
  files.value = files.value.filter(item => item.uid !== file.uid)
}

// 表单提交
// 表单提交
const handleSubmit = async () => {
  if (!formData.question) {
    ElMessage.error('请输入题目内容')
    return
  }

  if (formData.questionType === 'single' || formData.questionType === 'multiple') {
    if (formData.options.length < 2) {
      ElMessage.error('至少需要两个选项')
      return
    }

    if (formData.options.some(opt => !opt)) {
      ElMessage.error('选项内容不能为空')
      return
    }

    if (formData.questionType === 'single' && !formData.answer) {
      ElMessage.error('请选择正确答案')
      return
    }

    if (formData.questionType === 'multiple' && (!formData.answer || formData.answer.length === 0)) {
      ElMessage.error('请选择正确答案')
      return
    }
  } else if (!formData.answer) {
    ElMessage.error('请输入正确答案')
    return
  }

  const fileList = files.value.map(file => file.raw as File)

  try {
    await addExercise({ ...formData }, fileList, (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
      console.log(`上传进度: ${percent}%`)
    })

    ElMessage.success('题目添加成功')
    emit('submit')
  } catch (error) {
    console.error(error)
    ElMessage.error('题目添加失败')
  }
}


// 暴露 submit 方法
defineExpose({
  submit: handleSubmit
})
</script>

<style scoped>
.option-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.option-item .el-button {
  margin-left: 10px;
}
</style>
