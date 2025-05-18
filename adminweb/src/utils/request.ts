import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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
        // 正确获取本地 Token
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
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
        console.error('请求错误:', error);
        return Promise.reject(error);
    }
);


// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        // 直接返回响应数据
        return response;
    },
    (error) => {
        // 处理 HTTP 错误状态码
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    return handleUnauthorized();
                case 403:
                    console.error('无权访问:', error);
                    break;
                case 404:
                    console.error('资源不存在:', error);
                    break;
                case 500:
                    console.error('服务器错误:', error);
                    break;
                default:
                    console.error('未知错误:', error);
            }
        }
        return Promise.reject(error);
    }
);

// 处理未授权情况
function handleUnauthorized() {
    // 使用更友好的提示方式
    if (window.confirm('登录状态已过期，请重新登录')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(new Error('用户未授权'));
}

export default service;