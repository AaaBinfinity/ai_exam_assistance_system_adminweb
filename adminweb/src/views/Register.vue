<script setup lang="ts">
import router from "@/router";
import { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import Captcha from "@/components/common/Captcha.vue";
import {register} from "@/api/user/auth";
import {setToken, setUserInfo} from "@/utils/auth"; // 引入验证码组件

// 数据与响应式状态
const registerFormRef = ref<FormInstance>();
const loading = ref(false);
const registerType = ref("account");

const registerForm = reactive({
  username: "",
  password: "",
  email: "",
  telephone: "",   // 添加手机号字段
  captchaCode: "",
  captchaId: "",   // 添加 captchaId
  agreeTerms: false, // 统一在这里管理条款同意状态
  isStudent: false,  // 是否为本校学生
  studentId: "",     // 学号
});

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
  telephone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号", trigger: "blur" }, // 手机号验证
  ],
  studentId: [
    { required: function() { return registerForm.isStudent; }, message: "请输入学号", trigger: "blur" },
  ],
};

// 处理 captchaId 更新
const handleCaptchaIdChange = (newCaptchaId: string) => {
  registerForm.captchaId = newCaptchaId; // 更新 captchaId
};

// 注册请求
const registerRequest = async () => {
  loading.value = true;
  try {
    // 调用封装好的注册接口
    const response = await register(
        {
          username: registerForm.username,
          password: registerForm.password,
          email: registerForm.email,
          telephone: registerForm.telephone,
        },
        registerForm.captchaCode,
        registerForm.captchaId
    );

    if (response.data && response.data.token) {
      // 存储 token
      setToken(response.data.token);

      // 存储用户信息（根据实际接口返回调整）
      setUserInfo({
        username: registerForm.username,
        email: registerForm.email,
        telephone: registerForm.telephone,
        // 其他可能返回的用户信息
        ...(response.data.userInfo || {})
      });

      // 注册成功后跳转到首页
      await router.push("/");
      ElMessage.success("注册成功");

      // 可选：刷新页面以确保应用状态更新
      window.location.reload();
    } else {
      ElMessage.error("注册失败，用户信息异常");
    }
  } catch (error) {
    console.error("注册错误:", error);

    // 更详细的错误处理
    if (error.response) {
      if (error.response.status === 400) {
        ElMessage.error("注册失败: " + (error.response.data.message || "请求参数错误"));
      } else if (error.response.status === 409) {
        ElMessage.error("用户名或邮箱已被注册");
      } else {
        ElMessage.error("注册失败: " + (error.response.data.message || "服务器错误"));
      }
    } else {
      ElMessage.error("注册失败，请检查网络连接并重试！");
    }
  } finally {
    loading.value = false;
  }
};

// 处理注册逻辑
const handleRegister = async () => {
  registerFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (!registerForm.agreeTerms) {
        ElMessage.error("请同意服务条款");
        return;
      }
      await registerRequest(); // 验证通过后，进行注册
    }
  });
};

// 在组件挂载时初始化
onMounted(() => {
  registerType.value = 'account'; // 确保设置为 'account'
});

</script>

<template>
  <div class="register-page">
    <!-- 左侧背景区域 -->
    <div class="background-section">
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

    <!-- 右侧注册表单区域 -->
    <div class="form-section">
      <div class="form-wrapper">
        <h2 class="heading-text">创建新账号</h2>
        <p class="form-tip">请输入您的注册信息</p>

        <!-- 注册表单内容 -->
        <transition name="fade-transform" mode="out-in">
          <el-form
              v-if="registerType === 'account'"
              ref="registerFormRef"
              :model="registerForm"
              :rules="rules"
              @keyup.enter="handleRegister"
          >
            <el-form-item prop="username">
              <el-input
                  v-model="registerForm.username"
                  placeholder="请输入用户名"
                  prefix-icon="User"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="请输入密码"
                  prefix-icon="Lock"
                  show-password
              />
            </el-form-item>

            <el-form-item prop="email">
              <el-input
                  v-model="registerForm.email"
                  placeholder="请输入邮箱"
                  prefix-icon="Mail"
              />
            </el-form-item>

            <el-form-item prop="telephone">
              <el-input
                  v-model="registerForm.telephone"
                  placeholder="请输入手机号"
                  prefix-icon="Phone"
              />
            </el-form-item>

            <!-- 验证码输入框 -->
            <el-form-item prop="captchaCode">
              <captcha
                  v-model="registerForm.captchaCode"
                  :captcha-id="registerForm.captchaId"
                  @update:captchaId="handleCaptchaIdChange"
              />
            </el-form-item>

            <!-- 新增：我是本校学生复选框 -->
            <el-form-item>
              <el-checkbox v-model="registerForm.isStudent">我是本校员工</el-checkbox>
            </el-form-item>

            <!-- 新增：学号输入框，当选择学生时显示 -->
            <el-form-item v-if="registerForm.isStudent" prop="studentId">
              <el-input
                  v-model="registerForm.studentId"
                  placeholder="请输入工号"
                  prefix-icon="School"
              />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="registerForm.agreeTerms">同意服务条款</el-checkbox>
              <router-link to="/login" class="login-link">有账号？去登录</router-link>
            </div>

            <el-button
                :loading="loading"
                type="primary"
                class="submit-button"
                @click="handleRegister"
            >
              {{ loading ? "注册中..." : "注册" }}
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
.register-page {
  display: flex;
  height: 100vh;
  background-color: #f0f8ff; /* 浅蓝色背景 */
  font-family: 'Arial', sans-serif;
  color: #333;
}

.background-section {
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

.brand-section {
  position: absolute;
  bottom: 20px;
  color: #333;
}

.brand-description {
  font-size: 14px;
}

.brand-description a {
  color: #1976d2;
  text-decoration: none;
}

.form-section {
  background-color: white;
  width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 10px;
  margin: auto;
}

.heading-text {
  font-size: 24px;
  font-weight: bold;
  color: #1976d2; /* 浅蓝色 */
  text-align: center;
}

.form-tip {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.login-link {
  color: #1976d2;
  text-decoration: none;
}

.el-form-item {
  margin-bottom: 20px;
}

.submit-button {
  width: 100%;
  background-color: #1976d2; /* 浅蓝色按钮 */
  color: white;
  border-radius: 5px;
  font-weight: bold;
}

.submit-button:hover {
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
