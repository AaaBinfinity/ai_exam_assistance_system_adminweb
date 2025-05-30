<script setup lang="ts">
import NavItem from './Navbar/NavItem.vue';

const siteName = import.meta.env.VITE_SITE_NAME || 'AI考学宝';
const logoUrl = import.meta.env.VITE_LOGO_URL || '/logo.png';
</script>

<template>
  <div class="navbar">
    <div class="navbar-left">
      <div class="logo">
        <img :src="logoUrl" alt="logo" class="logo-img" />
        <span class="logo-text">{{ siteName }}</span>
      </div>
      <nav class="nav-links">
        <NavItem to="/dashboard" label="数据面板" />
        <NavItem to="/users_manager" label="用户管理" exact />
        <NavItem to="/exercise_manager" label="题库管理" exact />
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
      display: flex;
      align-items: center;
      margin-right: 24px;

      .logo-img {
        height: 32px;
        width: 32px;
        object-fit: contain;
        margin-right: 8px;
      }

      .logo-text {
        font-weight: bold;
        font-size: 18px;
        color: #333;
      }
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

}
</style>
