<template>
  <div class="login-container">
    <!-- 左侧背景区域 -->
    <div class="login-background">
      <div class="background-wrapper">

        <!-- 动画背景 -->
        <div class="animated-background">
          <div class="logo-container">
            <img src="@/assets/images/AI考学宝.png" alt="AI考学宝 Logo" />
          </div>
          <div class="gradient-circle"></div>
          <div class="geometric-shapes">
            <div class="shape" v-for="n in 5" :key="n"></div>
          </div>
        </div>

      </div>
    </div>

    <!-- 右侧登录表单区域 -->
    <div class="login-form">
      <div class="form-wrapper">
        <h2 class="welcome-text">欢迎回来</h2>
        <p class="login-tip">请使用您的账号密码登录系统</p>

        <!-- 登录表单内容 -->
        <transition name="fade-transform" mode="out-in">
          <el-form
              v-if="loginType === 'account'"
              ref="loginFormRef"
              :model="loginForm"
              :rules="rules"
              @keyup.enter="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                  v-model="loginForm.username"
                  placeholder="请输入用户名"
                  prefix-icon="User"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  prefix-icon="Lock"
                  show-password
              />
            </el-form-item>

            <!-- 验证码输入框 -->
            <el-form-item prop="captchaCode">
              <captcha
                  v-model="loginForm.captchaCode"
                  :captcha-id="loginForm.captchaId"
                  @update:captchaId="handleCaptchaIdChange"
              />
            </el-form-item>

            <div class="login-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <router-link to="/register" class="forget-password">没有账号？去注册</router-link>

            </div>

            <el-button
                :loading="loading"
                type="primary"
                class="login-button"
                @click="handleLogin"
            >
              {{ loading ? "登录中..." : "登录" }}
            </el-button>
          </el-form>
        </transition>
      </div>

      <!-- 页脚版权信息 -->
      <footer class="footer">
        <p>Copyright © 2025 </p>
        <p>AI考学宝——融合大数据的智能考试系统</p>
        <a href="https://beian.miit.gov.cn/" target="_blank">辽ICP备2025054503号-1</a>
      </footer>
    </div>
  </div>
</template>




<style scoped lang="scss">
.login-container {
  display: flex;
  min-height: 90vh; // 使用min-height替代height
  overflow: hidden;

  .login-background,
  .login-form {
    overflow: auto;
  }
}
.login-background {
  flex: 1;
  background: linear-gradient(135deg, #a0c4ff, #f0f8ff); /* 渐变浅蓝色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.background-wrapper {
  text-align: center;
}

.animated-background {
  position: relative;
  z-index: 1;
}

.gradient-circle {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(0, 123, 255, 0.2);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: animate-circle 10s infinite;
}

@keyframes animate-circle {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}

.geometric-shapes {
  position: relative;
  z-index: 2;
}

.shape {
  width: 20px;
  height: 20px;
  background-color: rgba(0, 123, 255, 0.3);
  margin: 5px;
  display: inline-block;
  border-radius: 50%;
  animation: shape-animation 5s infinite;
}

@keyframes shape-animation {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.3);
  }
}

.brand-content {
  position: absolute;
  bottom: 20px;
  color: #333;
}

.logo-wrapper {
  margin-bottom: 20px;
}

.brand-description {
  font-size: 14px;
}

.brand-description a {
  color: #1976d2;
  text-decoration: none;
}

.login-form {
  background-color: white;
  width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 10px;
  margin: auto;
}

.theme-switch {
  position: absolute;
  top: 20px;
  right: 20px;
}

.welcome-text {
  font-size: 24px;
  font-weight: bold;
  color: #1976d2; /* 浅蓝色 */
  text-align: center;
}

.login-tip {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.forget-password {
  color: #1976d2;
  text-decoration: none;
}

.el-form-item {
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
  background-color: #1976d2; /* 浅蓝色按钮 */
  color: white;
  border-radius: 5px;
  font-weight: bold;
}

.login-button:hover {
  background-color: #1565c0; /* 深一点的蓝色 */
}

.footer {
  text-align: center;
  color: #888;
  padding: 10px;
  background-color: #f7f7f7;
  margin-top: 30px;
}

.footer a {
  color: #1976d2;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

</style>



<script setup lang="ts">
import router from "@/router";
import { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { login } from "@/api/user/auth";
import Captcha from "@/components/common/Captcha.vue";
import { setToken, setUserInfo } from '@/utils/auth';  // 引入封装好的工具


// 数据与响应式状态
const loginFormRef = ref<FormInstance>();
const loading = ref(false);
const rememberMe = ref(false);
const loginType = ref("account");

const loginForm = reactive({
username: "",
password: "",
rememberMe: false,
captchaCode: "",
captchaId: "",  // 添加 captchaId
});

const rules = {
username: [
{ required: true, message: "请输入用户名", trigger: "blur" },
{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
],
password: [
{ required: true, message: "请输入密码", trigger: "blur" },
{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
]
};

// 处理 captchaId 更新
const handleCaptchaIdChange = (newCaptchaId: string) => {
loginForm.captchaId = newCaptchaId; // 更新 captchaId
};


const loginRequest = async () => {
  loading.value = true;
  try {
    const loginData = {
      username: loginForm.username,
      password: loginForm.password,
      captchaCode: loginForm.captchaCode,
      captchaId: loginForm.captchaId,
    };

    const response = await login(loginData);

    if (response.data && response.data.token) {
      const roles = response.data.roles || [];

      // 这里判断是否包含 ADMIN 权限
      if (!roles.includes("ADMIN")) {
        ElMessage.error("无权限访问：需要 ADMIN 权限");
        return;
      }

      // 通过校验后再设置 token 和用户信息
      setToken(response.data.token);
      setUserInfo(response.data);

      ElMessage.success("登录成功");

      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } else {
      ElMessage.error("登录失败，用户异常");
    }
  } catch (error) {
    ElMessage.error("登录失败，请检查用户名和密码！");
  } finally {
    loading.value = false;
  }
};



// 处理登录逻辑
const handleLogin = async () => {
loginFormRef.value?.validate(async (flag) => {
if (flag) {
loginRequest(); // 验证通过后，直接进行登录
}
});
};

// 在组件挂载时初始化
onMounted(() => {
loginType.value = 'account'; // 确保设置为 'account'
});
</script>
