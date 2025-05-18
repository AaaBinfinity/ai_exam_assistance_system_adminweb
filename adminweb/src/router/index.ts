import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue'),  // 懒加载组件
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),  // 懒加载组件
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/Register.vue'),  // 懒加载组件
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,  // 确保这里传递的是一个数组
});

export default router;
