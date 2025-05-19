<script setup lang="ts">
import NavItem from './Navbar/NavItem.vue';
</script>

<template>
  <div class="navbar">
    <div class="navbar-left">
      <div class="logo">
        AI 考学宝
      </div>
      <nav class="nav-links">
        <NavItem to="/dashboard" label="数据面板"/>
        <NavItem to="/users" label="用户管理" exact/>
      </nav>
    </div>

    <div class="navbar-right">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background-color: #fff;

  .navbar-left {
    display: flex;
    align-items: center;

    .logo {
      font-weight: bold;
      font-size: 18px;
      margin-right: 24px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 20px;

      .nav-item-wrapper {
        position: relative;

        .sub-menu {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 10;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          min-width: 120px;

          list-style: none; // 移除小圆点
          margin: 0;
          padding: 6px 0;

          display: block;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.2s ease;

          li {
            padding: 4px 16px;

            a {
              color: #333;
              font-size: 13px;
              display: block;

              &:hover {
                color: #409EFF;
                background-color: #f5f5f5;
              }

              &.active {
                color: #409EFF;
                font-weight: bold;
              }
            }
          }
        }


        &:hover .sub-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
      }
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    padding: 10px;

    .navbar-left {
      flex-direction: column;
      align-items: flex-start;

      .nav-links {
        flex-direction: column;
        gap: 10px;
      }
    }

    .navbar-right {
      margin-top: 10px;
    }
  }
}
</style>
