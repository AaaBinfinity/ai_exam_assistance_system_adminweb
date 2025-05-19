<script setup lang="ts">
</script>

<template>
  <div class="layout-container">
    <main class="layout-main">
      <div class="welcome-card">
        <h1>🎉 欢迎使用 AI 考学宝</h1>
        <p>这是一个基于人工智能的智能考试辅助平台。</p>
        <ul>
          <li>📊 在仪表盘查看系统概览与数据统计</li>
          <li>👤 管理用户、教师与学生信息</li>
          <li>🧠 使用智能分析提升考试体验</li>
        </ul>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.layout-container {
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

.layout-main {
  max-width: 800px;
  width: 100%;
}

.welcome-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  text-align: center;

  h1 {
    font-size: 28px;
    margin-bottom: 16px;
    color: #333;
  }

  p {
    font-size: 16px;
    color: #666;
    margin-bottom: 24px;
  }

  ul {
    text-align: left;
    padding-left: 0;
    list-style: none;

    li {
      padding: 8px 0;
      font-size: 15px;
      color: #444;

      &::before {
        content: "✔️";
        margin-right: 8px;
        color: #67c23a;
      }
    }
  }
}
</style>
