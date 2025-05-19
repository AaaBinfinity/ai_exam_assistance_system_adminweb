<template>
  <el-form :model="form" :rules="rules" ref="captchaForm" label-width="100px">
    <div class="captcha-container">
      <!-- 验证码图片 -->
      <el-image
          :src="captchaSrc"
          fit="contain"
          class="captcha-image"
          @click="reloadCaptcha"
      />

      <div class="input-wrapper">
        <!-- 验证码输入框 -->
        <el-form-item prop="captchaCode">
          <el-input
              v-model="form.captchaCode"
              :placeholder="placeholderText"
              clearable
              @change="handleInputChange"
              @clear="handleInputClear"
              class="captcha-input"
          />
        </el-form-item>
      </div>

      <!-- 刷新按钮 -->
      <el-button
          v-if="showRefreshButton"
          type="text"
          @click="reloadCaptcha"
          class="refresh-button"
      >
        <el-icon><Refresh /></el-icon>
      </el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineProps, defineEmits, watch } from 'vue'
import { getCaptcha } from '@/api/user/auth'
import { Refresh } from '@element-plus/icons-vue'

// Props 定义
const props = defineProps({
  modelValue: { type: String, default: '' },
  captchaId: { type: String, default: '' },
  placeholder: { type: String, default: '请输入验证码' },
  showRefreshButton: { type: Boolean, default: true }
})

// Emits 定义
const emit = defineEmits(['update:modelValue', 'change', 'update:captchaId'])

// 响应式数据
const captchaSrc = ref('')
const captchaId = ref(props.captchaId)
const isLoading = ref(false)
const captchaForm = ref()

// 表单数据
const form = ref({
  captchaCode: props.modelValue
})

// 验证规则 - 与登录表单保持一致
const rules = {
  captchaCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 2, max: 2, message: '验证码必须为 2 个字符', trigger: 'blur' }
  ]
}

// 计算 placeholder 文本
const placeholderText = computed(() => {
  return isLoading.value ? '正在加载验证码...' : props.placeholder
})

// 帮助函数：更新父组件的值
const updateParent = (modelValue: string, captchaIdValue: string) => {
  emit('update:modelValue', modelValue)
  emit('change', modelValue)
  emit('update:captchaId', captchaIdValue)
}

// 加载验证码
const loadCaptcha = async () => {
  isLoading.value = true
  try {
    const response = await getCaptcha()
    if (response.data?.imageBase64Data) {
      captchaSrc.value = response.data.imageBase64Data
      captchaId.value = response.data.captchaId || ''
      updateParent('', captchaId.value) // 重置模型值
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
    captchaSrc.value = '' // 如果获取失败，清空验证码
  } finally {
    isLoading.value = false
  }
}

// 重新加载验证码
const reloadCaptcha = () => {
  if (isLoading.value) return
  console.log('重新加载验证码...')
  form.value.captchaCode = '' // 重置输入框
  updateParent('', '') // 重置模型值
  loadCaptcha()
}

// 输入框内容变化处理
const handleInputChange = (value: string) => {
  updateParent(value, captchaId.value)
}

// 输入框清空处理
const handleInputClear = () => {
  updateParent('', captchaId.value)
}

// 验证表单
const validate = () => {
  return captchaForm.value.validate()
}

// 监听输入框变化，自动更新父组件的值
watch(() => form.value.captchaCode, (newVal) => {
  updateParent(newVal, captchaId.value)
})

// 组件挂载时加载验证码
onMounted(() => {
  console.log('组件挂载完成，开始加载验证码')
  loadCaptcha()
})

// 暴露 validate 方法
defineExpose({
  validate
})
</script>

<style scoped>
.captcha-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.captcha-image {
  width: 120px;
  height: 40px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-right: 10px;
}

.input-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.captcha-input {
  flex: 1;
  width: 299px;
}

.refresh-button {
  margin-left: 8px;
  color: var(--el-color-primary);
}


</style>