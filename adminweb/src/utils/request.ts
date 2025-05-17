import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 创建 axios 实例
const service = axios.create({
    baseURL: '/api',
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

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        const res = response.data;

        // 处理二进制数据（如文件下载）
        if (
            response.config.responseType === 'blob' ||
            response.config.responseType === 'arraybuffer'
        ) {
            return res;
        }

        // 判断响应状态码并处理异常情况
        if (res.code !== 200) {
            if (res.message) {
                console.error('请求错误:', res.message);
                alert(res.message); // 弹出错误消息
            }

            if (res.code === 401) {
                handleUnauthorized(); // 处理未授权
            }

            return Promise.reject(new Error(res.message || '请求失败'));
        }

        return res;
    },
    (error) => {
        // 响应错误处理
        const { response } = error;
        let errorMessage = '请求错误';

        if (response) {
            // 根据 HTTP 状态码处理不同的错误信息
            switch (response.status) {
                case 400:
                    errorMessage = '请求错误';
                    break;
                case 401:
                    return handleUnauthorized(); // 处理未授权
                case 403:
                    errorMessage = '拒绝访问';
                    break;
                case 404:
                    errorMessage = `请求地址出错: ${response.config.url}`;
                    break;
                case 500:
                    errorMessage = '服务器内部错误';
                    break;
                default:
                    errorMessage = `连接错误 ${response.status}`;
            }
        } else {
            // 处理网络连接错误
            if (!window.navigator.onLine) {
                errorMessage = '网络连接已断开，请检查网络设置';
            } else {
                errorMessage = '连接到服务器失败';
            }
        }

        console.error(errorMessage);
        alert(errorMessage);
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
