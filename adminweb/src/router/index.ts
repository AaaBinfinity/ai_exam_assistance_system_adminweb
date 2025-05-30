import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { getToken } from '@/utils/auth';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue'),  // 懒加载组件
        meta: { requiresAuth: true },
    },
    {
        path: '/login',
        name: 'Login',
        meta: { hideNavbar: true },
        component: () => import('@/views/Login.vue'),  // 懒加载组件
    },
    {
        path: '/register',
        name: 'Register',
        meta: { hideNavbar: true },
        component: () => import('@/views/Register.vue'),  // 懒加载组件
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
    },
    {
        path: '/users_manager',
        name: 'UsersManager',
        component: () => import('@/views/UserManager.vue'),
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
    },
    {
        path: '/exam/setup',
        name: 'ExamSetup',
        component: () => import('@/views/ExamSetup.vue')
    },
    {
        path: '/exam/start',
        name: 'ExamPage',
        component: () => import('@/views/ExamPage.vue'),
        meta: {
            hideNavbar: true  // ✅ 不显示导航栏
        }
    }


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由守卫：检查是否有 token
router.beforeEach((to, from, next) => {
    const token = getToken();  // 获取 token
    if (to.meta.requiresAuth && !token) {
        // 如果目标路由需要身份验证，并且没有 token，则跳转到登录页
        next({ name: 'Login' });
    } else {
        // 否则，正常访问
        next();
    }
});

export default router;
