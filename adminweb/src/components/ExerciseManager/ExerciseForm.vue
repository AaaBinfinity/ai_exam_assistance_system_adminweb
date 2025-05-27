<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage, type UploadFile } from 'element-plus'
import { addExercise, addExerciseAttachments } from '@/api/exam/manager'

// 常量定义
const QUESTION_TYPE_LABELS = {
  single: '单选题',
  multiple: '多选题',
  judgment: '判断题',
  fill: '填空题',
  short: '简答题',
  code: '编程题'
} as const

// 类型定义
type QuestionType = keyof typeof QUESTION_TYPE_LABELS
type OptionWithFiles = {
  content: string
  files: UploadFile[]
}
type FormData = {
  questionType: QuestionType
  question: string
  questionFiles: UploadFile[]
  options: OptionWithFiles[]
  answer: string | string[]
  subject: string
  knowledge_point: string[]
  analysis: string
  difficulty: number
}

// 组件引用
const emit = defineEmits(['submit'])
const formRef = ref()

// 表单数据
const formData = reactive<FormData>({
  questionType: 'single',
  question: '',
  questionFiles: [],
  options: [
    { content: '', files: [] },
    { content: '', files: [] }
  ],
  answer: '',
  subject: '',
  knowledge_point: [],
  analysis: '',
  difficulty: 3
})

const knowledgeInput = ref('')

// 计算属性
const isChoiceType = computed(() =>
    ['single', 'multiple'].includes(formData.questionType)
)

// 方法
const handleTypeChange = (type: QuestionType) => {
  formData.questionType = type

  if (type === 'single' || type === 'multiple') {
    formData.options = [
      { content: '', files: [] },
      { content: '', files: [] }
    ]
    formData.answer = type === 'multiple' ? [] : ''
  } else if (type === 'judgment') {
    formData.options = []
    formData.answer = '正确'
  } else {
    formData.options = []
    formData.answer = ''
  }
}

const addOption = () => {
  formData.options.push({ content: '', files: [] })
}

const removeOption = (index: number) => {
  formData.options.splice(index, 1)
  const removedLabel = String.fromCharCode(65 + index)

  if (formData.questionType === 'multiple' && Array.isArray(formData.answer)) {
    formData.answer = formData.answer.filter(ans => ans !== removedLabel)
  } else if (formData.questionType === 'single' && formData.answer === removedLabel) {
    formData.answer = ''
  }
}

const beforeUpload = (file: File) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!validTypes.includes(file.type)) {
    ElMessage.error('只能上传图片文件 (JPEG, PNG, GIF)')
    return false
  }
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过10MB')
    return false
  }
  return true
}

const handleQuestionFileChange = (uploadFile: UploadFile, uploadFiles: UploadFile[]) => {
  formData.questionFiles = uploadFiles
}

const handleOptionFileChange = (index: number, uploadFile: UploadFile, uploadFiles: UploadFile[]) => {
  formData.options[index].files = uploadFiles
}

const removeQuestionFile = (file: UploadFile) => {
  formData.questionFiles = formData.questionFiles.filter(item => item.uid !== file.uid)
}

const removeOptionFile = (optionIndex: number, file: UploadFile) => {
  formData.options[optionIndex].files = formData.options[optionIndex].files.filter(
      item => item.uid !== file.uid
  )
}

const formatContentWithImages = (content: string, files: UploadFile[]) => {
  if (!content && files.length === 0) return ''

  let formatted = content
  files.forEach(file => {
    // Only add space before image if there's existing content
    if (formatted) formatted += ' '
    formatted += `<img src='${file.name}'/>`
  })
  return formatted
}

const validateForm = () => {
  if (!formData.question || !formData.subject || !knowledgeInput.value.trim()) {
    ElMessage.error('请填写完整信息')
    return false
  }

  formData.knowledge_point = knowledgeInput.value
      .split(',')
      .map(k => k.trim())
      .filter(Boolean)

  if (formData.knowledge_point.length === 0) {
    ElMessage.error('请至少输入一个知识点')
    return false
  }

  if (isChoiceType.value) {
    if (formData.options.length < 2 || formData.options.some(opt =>
        !opt.content && opt.files.length === 0
    )) {
      ElMessage.error('至少两个选项，且内容或图片不能为空')
      return false
    }
    if (formData.questionType === 'single' && !formData.answer) {
      ElMessage.error('请选择正确答案')
      return false
    }
    if (formData.questionType === 'multiple' && (!formData.answer || formData.answer.length === 0)) {
      ElMessage.error('请选择正确答案')
      return false
    }
  } else if (!formData.answer) {
    ElMessage.error('请输入正确答案')
    return false
  }

  return true
}

const resetForm = () => {
  formData.question = ''
  formData.questionFiles = []
  formData.subject = ''
  knowledgeInput.value = ''
  formData.answer = ''
  formData.options = [
    { content: '', files: [] },
    { content: '', files: [] }
  ]
  formData.knowledge_point = []
  formData.analysis = ''
  formData.difficulty = 3
}

const handleSubmit = async () => {
  if (!validateForm()) return

  // Format question with images
  const formattedQuestion = formatContentWithImages(
      formData.question,
      formData.questionFiles
  )

  // Format options with IDs (A, B, C, etc.)
  const formattedOptions = formData.options.map((option, index) => {
    const optionId = String.fromCharCode(65 + index) // A, B, C, etc.
    return {
      content: formatContentWithImages(option.content, option.files),
      _id: optionId // 确保包含 _id 字段
    }
  })

  // Collect all files to upload
  const allFiles: File[] = []
  formData.questionFiles.forEach(file => {
    if (file.raw) allFiles.push(file.raw)
  })
  formData.options.forEach(option => {
    option.files.forEach(file => {
      if (file.raw) allFiles.push(file.raw)
    })
  })

  const payload = {
    content: formattedQuestion,
    answer: Array.isArray(formData.answer) ? formData.answer : [formData.answer],
    options: formattedOptions, // 这里应该已经包含了 _id 字段
    type: QUESTION_TYPE_LABELS[formData.questionType],
    subject: formData.subject,
    knowledge_point: formData.knowledge_point,
    order: true,
    check_type: 1,
    attachments: allFiles.map(file => file.name),
    difficulty: formData.difficulty
  }

  try {
    // 1. 提交题目（含文件名）
    const response = await addExercise(payload)

    // 2. 提交文件内容（如果有）
    if (allFiles.length > 0) {
      await addExerciseAttachments(response.data.id, allFiles)
    }

    ElMessage.success('题目添加成功')
    emit('submit')
    resetForm()
  } catch (error) {
    console.error(error)
    ElMessage.error('题目添加失败')
  }
}

defineExpose({
  submit: handleSubmit,
  resetForm
})
</script>

<template>
  <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      @submit.prevent="handleSubmit"
  >
    <!-- 题目类型 -->
    <el-form-item label="题目类型" prop="questionType">
      <el-select v-model="formData.questionType" @change="handleTypeChange">
        <el-option
            v-for="(label, value) in QUESTION_TYPE_LABELS"
            :key="value"
            :label="label"
            :value="value"
        />
      </el-select>
    </el-form-item>

    <!-- 题目内容 -->
    <el-form-item label="题目内容" prop="question" required>
      <el-input v-model="formData.question" type="textarea" :rows="3" />
      <div class="upload-container">
        <el-upload
            :file-list="formData.questionFiles"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-remove="removeQuestionFile"
            :on-change="handleQuestionFileChange"
            :http-request="() => {}"
            multiple
            accept="image/*"
        >
          <el-button type="primary">添加题目图片</el-button>
          <template #tip>
            <div class="el-upload__tip">可上传多个图片 (JPEG, PNG, GIF)，每个不超过10MB</div>
          </template>
        </el-upload>
      </div>
    </el-form-item>

    <!-- 选择题选项 -->
    <el-form-item v-if="isChoiceType" label="选项" required>
      <div v-for="(option, index) in formData.options" :key="index" class="option-item">
        <div class="option-content">
          <el-input v-model="option.content" style="width: 80%" :placeholder="`选项 ${String.fromCharCode(65 + index)}`" />
          <el-button
              type="danger"
              circle
              :icon="Delete"
              @click="removeOption(index)"
          />
        </div>
        <div class="option-upload">
          <el-upload
              :file-list="option.files"
              :auto-upload="false"
              :before-upload="beforeUpload"
              :on-remove="(file) => removeOptionFile(index, file)"
              :on-change="(file, files) => handleOptionFileChange(index, file, files)"
              :http-request="() => {}"
              multiple
              accept="image/*"
          >
            <el-button size="small" type="primary">添加选项图片</el-button>
          </el-upload>
        </div>
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

    <!-- 所属学科 -->
    <el-form-item label="所属学科" required>
      <el-input v-model="formData.subject" />
    </el-form-item>

    <!-- 知识点 -->
    <el-form-item label="知识点" required>
      <el-input
          v-model="knowledgeInput"
          placeholder="请输入多个知识点，使用逗号分隔"
      />
    </el-form-item>

    <!-- 解析 -->
    <el-form-item label="解析">
      <el-input v-model="formData.analysis" type="textarea" :rows="3" />
    </el-form-item>

    <!-- 难度 -->
    <el-form-item label="难度">
      <el-rate v-model="formData.difficulty" :max="5" />
    </el-form-item>
  </el-form>
</template>

<style scoped>
.option-item {
  margin-bottom: 15px;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 4px;
}

.option-content {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.option-content .el-button {
  margin-left: 10px;
}

.option-upload {
  margin-left: 20px;
}

.upload-container {
  margin-top: 10px;
}
</style>