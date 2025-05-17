import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

console.log('请求URL:', apiBaseUrl);

// 创建 axios 实例
const service = axios.create({
    baseURL: apiBaseUrl,
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
});

// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 从 localStorage 获取 token 并添加到请求头
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = token;
        }

        // 如果是 GET 请求，添加时间戳防止缓存
        if (config.method?.toLowerCase() === 'get') {
            config.params = {
                ...config.params,
                _t: Date.now(),
            };
        }

        return config;
    },
    (error) => {
        // 请求错误处理
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
);




// 处理未授权情况
function handleUnauthorized() {
    // 弹出确认框提示用户重新登录
    if (confirm('登录状态已过期，请重新登录')) {
        localStorage.removeItem('token'); // 清除 token
        window.location.href = '/login'; // 跳转到登录页
    }

    return Promise.reject(new Error('用户未授权'));
}

export default service;
