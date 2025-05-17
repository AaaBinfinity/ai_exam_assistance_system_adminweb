<template>
  <div class="captcha-container">
    <el-image
        :src="captchaSrc"
        fit="contain"
        class="captcha-image"
        @click="reloadCaptcha"
    />
    <el-input
        v-model="captchaCode"
        :placeholder="placeholderText"
        clearable
        @change="handleInputChange"
        @clear="handleInputClear"
        class="captcha-input"
    />
    <el-button
        v-if="showRefreshButton"
        type="text"
        @click="reloadCaptcha"
        class="refresh-button"
    >
      <el-icon><Refresh /></el-icon>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { getCaptcha } from '@/api/user/auth'
import { Refresh } from '@element-plus/icons-vue'

// 组件props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入验证码'
  },
  showRefreshButton: {
    type: Boolean,
    default: true
  }
})

// 组件emits
const emit = defineEmits(['update:modelValue', 'change', 'update:captchaData'])

// 响应式数据
const captchaSrc = ref('')
const captchaCode = ref(props.modelValue)
const captchaId = ref('')
const isLoading = ref(false)

// 计算属性
const placeholderText = computed(() => {
  return isLoading.value ? '正在加载验证码...' : props.placeholder
})

// 加载验证码
const loadCaptcha = async () => {
  isLoading.value = true;
  try {
    const response = await getCaptcha();
    if (response.data?.imageBase64Data) {
      captchaSrc.value = response.data.imageBase64Data;
      captchaId.value = response.data.captchaId || '';
      // 加载成功后立即通知父组件captchaId
      emit('update:captchaId', captchaId.value);
    }
  } catch (error) {
    console.error('获取验证码失败:', error);
    captchaSrc.value = '';
  } finally {
    isLoading.value = false;
  }
};

// 重新加载验证码
const reloadCaptcha = () => {
  if (isLoading.value) return
  console.log('重新加载验证码...')  // 调试：开始重新加载验证码
  captchaCode.value = '' // 清空输入框
  emit('update:modelValue', '') // 通知父组件值已清空
  loadCaptcha()
}

// 输入变化处理
const handleInputChange = (value: string) => {
  emit('update:modelValue', value);
  emit('change', value);
  // 单独emit captchaId更新事件
  emit('update:captchaId', captchaId.value);
};

// 清空输入处理
const handleInputClear = () => {
  emit('update:modelValue', '');
  emit('change', '');
  // 单独emit captchaId更新事件
  emit('update:captchaId', captchaId.value);
};

// 监听props变化
watch(() => props.modelValue, (newVal) => {
  if (newVal !== captchaCode.value) {
    console.log('父组件传入的新值与当前值不一致，更新 captchaCode');  // 调试：检测 props 变化
    captchaCode.value = newVal
  }
})

// 初始化加载验证码
onMounted(() => {
  console.log('组件挂载完成，开始加载验证码');  // 调试：组件挂载后开始加载验证码
  loadCaptcha()
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

.captcha-input {
  flex: 1;
  min-width: 150px;
}

.refresh-button {
  margin-left: 8px;
  color: var(--el-color-primary);
}
</style>