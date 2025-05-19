<template>
  <footer class="footer">
    <div class="footer-content">
      <span>© 2025 AI考学宝 · 保留所有权利</span>
      <span class="divider">|</span>
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
        辽ICP备20250101号-1
      </a>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  width: 100%;
  padding: 8px 20px;
  font-size: 12px;
  color: #888;
  background-color: #fff;
  border-top: 1px solid #eee;

  .footer-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    .divider {
      color: #ccc;
    }

    a {
      color: #888;
      text-decoration: none;

      &:hover {
        color: #409EFF;
        text-decoration: underline;
      }
    }
  }
}
</style>
