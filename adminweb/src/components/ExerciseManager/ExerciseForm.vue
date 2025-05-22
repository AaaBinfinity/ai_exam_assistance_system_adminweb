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
            v-for="(label, value) in questionTypeLabels"
            :key="value"
            :label="label"
            :value="value"
        />
      </el-select>
    </el-form-item>

    <!-- 题目内容 -->
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

    <!-- 附件上传 -->
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

const emit = defineEmits(['submit'])
const formRef = ref()
const knowledgeInput = ref('')
const files = ref<UploadFile[]>([])

const questionTypeLabels: Record<string, string> = {
  single: '单选题',
  multiple: '多选题',
  judgment: '判断题',
  fill: '填空题',
  short: '简答题',
  code: '编程题'
}

const formData = reactive({
  questionType: 'single',
  question: '',
  options: ['', ''],
  answer: '',
  subject: '',
  knowledge_point: [] as string[],
  analysis: '',
  difficulty: 3
})

const handleTypeChange = (type: string) => {
  if (type === 'single' || type === 'multiple') {
    formData.options = ['', '']
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
  formData.options.push('')
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
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过10MB')
    return false
  }
  return true
}

const handleRemove = (file: UploadFile) => {
  files.value = files.value.filter(item => item.uid !== file.uid)
}

const handleSubmit = async () => {
  if (!formData.question || !formData.subject || !knowledgeInput.value.trim()) {
    ElMessage.error('请填写完整信息')
    return
  }

  formData.knowledge_point = knowledgeInput.value
      .split(',')
      .map(k => k.trim())
      .filter(k => k)

  if (formData.knowledge_point.length === 0) {
    ElMessage.error('请至少输入一个知识点')
    return
  }

  if (['single', 'multiple'].includes(formData.questionType)) {
    if (formData.options.length < 2 || formData.options.some(opt => !opt)) {
      ElMessage.error('至少两个选项，且内容不能为空')
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

  const payload = {
    content: formData.question,
    answer: Array.isArray(formData.answer) ? formData.answer : [formData.answer],
    options: formData.options.map((content, index) => ({
      id: String.fromCharCode(65 + index),
      content
    })),
    type: questionTypeLabels[formData.questionType],
    subject: formData.subject,
    knowledge_point: formData.knowledge_point,
    order: true,
    check_type: 1,
    attachments: files.value.map(file => file.name),
    difficulty: formData.difficulty
  }

  const fileList = files.value.map(file => file.raw as File)

  try {
    await addExercise(payload, fileList, (progressEvent) => {
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
