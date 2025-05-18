import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { getToken } from '@/utils/auth';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue'),  // 懒加载组件
        meta: { requiresAuth: true },  // 设置这个页面需要身份验证
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),  // 懒加载组件
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue'),  // 懒加载组件
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,  // 确保这里传递的是一个数组
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
