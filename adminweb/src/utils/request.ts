import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus'
import { removeToken , removeUserInfo } from '@/utils/auth'


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
                    console.error(error);
                    break;
                case 403:
                    return handleUnauthorized();

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

export function handleUnauthorized() {
    // 提示用户
    ElMessage.error('登录状态已过期，请重新登录')

    // 清除本地存储
    removeToken()
    removeUserInfo()

    // 跳转登录页
    window.location.href = '/login'

    // 返回错误 Promise
    return Promise.reject(new Error('用户未授权'))
}
export default service;