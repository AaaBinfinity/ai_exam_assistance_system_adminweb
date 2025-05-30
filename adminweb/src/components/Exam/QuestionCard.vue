<template>
  <el-card class="mb-4">
    <div class="question-header">
      <b>题目 {{ currentIndex + 1 }} / {{ totalQuestions }}（{{ question.type }}）</b>
      该题作答时间：{{ question.answerTime || 0 }} 秒
    </div>

    <div class="question-content mb-2">
      <span v-html="renderQuestionContent(question)"></span>
    </div>

    <!-- 单选题 -->
    <el-radio-group
        v-if="question.type === '单选题'"
        v-model="question.userAnswer"
        class="options-container"
    >
      <div v-for="(opt, idx) in question.options" :key="idx" class="option-item">
        <el-radio :label="String.fromCharCode(65 + idx)">
          <span class="option-letter">{{ String.fromCharCode(65 + idx) }}.</span>
          <span class="option-content">{{ opt.content }}</span>
        </el-radio>
      </div>
    </el-radio-group>

    <!-- 判断题 -->
    <el-radio-group
        v-else-if="question.type === '判断题'"
        v-model="question.userAnswer"
        class="options-container"
    >
      <div class="option-item">
        <el-radio label="正确">
          <span class="option-content">正确</span>
        </el-radio>
      </div>
      <div class="option-item">
        <el-radio label="错误">
          <span class="option-content">错误</span>
        </el-radio>
      </div>
    </el-radio-group>

    <!-- 多选题 -->
    <el-checkbox-group
        v-else-if="question.type === '多选题'"
        v-model="question.userAnswer"
        class="options-container"
    >
      <div v-for="(opt, idx) in question.options" :key="idx" class="option-item">
        <el-checkbox :label="String.fromCharCode(65 + idx)">
          <span class="option-letter">{{ String.fromCharCode(65 + idx) }}.</span>
          <span class="option-content">{{ opt.content }}</span>
        </el-checkbox>
      </div>
    </el-checkbox-group>

    <!-- 填空题 -->
    <div v-else-if="question.type === '填空题'" class="fill-blank-container">
      <template v-if="Array.isArray(question.userAnswer)">
        <div v-for="(answer, idx) in question.userAnswer" :key="idx" class="blank-input-item">
          <span class="blank-label">填空 {{ idx + 1 }}：</span>
          <el-input
              v-model="question.userAnswer[idx]"
              placeholder="请输入答案"
              clearable
          />
        </div>
      </template>
      <el-input
          v-else
          v-model="question.userAnswer"
          placeholder="请输入答案"
          clearable
      />
    </div>

    <!-- 其他类型题目 -->
    <div v-else class="other-question-input">
      <el-input
          v-model="question.userAnswer"
          type="textarea"
          :rows="3"
          placeholder="请输入您的答案"
      />
    </div>

    <div class="question-navigation mt-4 text-right">
      <el-button @click="$emit('prev')" :disabled="isFirst">上一题</el-button>
      <el-button
          type="primary"
          @click="handleNext"
      >
        {{ isLast ? '提交试卷' : '下一题' }}
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
    default: () => ({
      type: '',
      content: '',
      options: [],
      userAnswer: null,
      answerTime: 0
    })
  },
  currentIndex: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['prev', 'next', 'update:question'])

const isFirst = computed(() => props.currentIndex === 0)
const isLast = computed(() => props.currentIndex === props.totalQuestions - 1)

if (props.question.type === '多选题' && !Array.isArray(props.question.userAnswer)) {
  emit('update:question', {
    ...props.question,
    userAnswer: []
  })
}

function renderQuestionContent(question: any): string {
  const content = question.content

  if (question.type === '判断题') {
    return content.replace(/\{\{ANSWER\}\}/g, '').replace(/\(\)/g, '')
  } else {
    if (content.includes('{{ANSWER}}') && content.includes('()')) {
      return content.replace(/\{\{ANSWER\}\}/g, '').replace(/\(\)/g, '( &emsp; )')
    } else {
      return content.replace(/\{\{ANSWER\}\}/g, '____')
    }
  }
}

function handleNext() {
  // 确保多选题的 userAnswer 是数组
  if (props.question.type === '多选题' && !Array.isArray(props.question.userAnswer)) {
    emit('update:question', {
      ...props.question,
      userAnswer: []
    })
  }
  emit('next')
}
</script>

<style scoped>
.question-header {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: bold;
}
.question-content {
  margin-bottom: 12px;
}
.mb-4 {
  margin-bottom: 20px;
}

/* 选项样式 */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 15px;
}
.option-item {
  display: flex;
  align-items: flex-start;
}
.option-letter {
  font-weight: bold;
  margin-right: 6px;
  min-width: 20px;
}
.option-content {
  display: inline-block;
}
.el-radio-group{
  display:inline-flex;
  flex-wrap:wrap;
  font-size:0;
  padding-bottom: 15px;
}
.fill-blank-container {
  margin-top: 16px;
}
.blank-input-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  padding-bottom: 15px;
}
.blank-label {
  margin-right: 8px;
  min-width: 80px;
  padding-bottom: 15px;
}

/* 其他题型样式 */
.other-question-input {
  margin-top: 16px;
  padding-bottom: 15px;
}
</style>