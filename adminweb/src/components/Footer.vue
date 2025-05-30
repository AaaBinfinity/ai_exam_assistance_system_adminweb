<template>
  <footer class="footer">
    <div class="footer-content">
      <small>© 2025 {{ siteName }} · 保留所有权利</small>
      <span class="divider">|</span>
      <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
      >
        {{ icpNo }}
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
const siteName = import.meta.env.VITE_SITE_NAME || '???';
const icpNo = import.meta.env.VITE_ICP_NO || '未备案';
</script>

<style scoped lang="scss">
.footer {
  padding: 12px 20px;
  font-size: 13px;
  color: #888;
  background-color: #fff;
  border-top: 1px solid #eee;

  .footer-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    text-align: center;

    .divider {
      color: #ccc;
    }

    a {
      color: #888;
      text-decoration: none;

      &:hover {
        color: #409eff;
        text-decoration: underline;
      }
    }

    small {
      font-size: 13px;
    }
  }
}
</style>
