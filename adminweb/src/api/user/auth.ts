import request from '@/utils/request';

/**
 * 用户登出
 * @returns 登出结果
 */
export function logout() {
    return request({
        url: '/user/user-auth/logout',
        method: 'get'
    });
}
/**
 * 用户登录（使用 multipart/form-data）
 * @param loginData 登录字段
 * @returns 登录成功的用户信息
 */
export function login(loginData: { username: string, password: string, captchaCode?: string, captchaId?: string }) {
    const formData = new FormData();
    formData.append('username', loginData.username);
    formData.append('password', loginData.password);
    if (loginData.captchaCode) {
        formData.append('code', loginData.captchaCode);
    }
    if (loginData.captchaId) {
        formData.append('captchaId', loginData.captchaId);
    }

    return request({
        url: '/user/user-auth/login',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data', // 可省略，浏览器会自动加
        },
    });
}


/**
 * 用户注册
 * @param userInfo 用户注册信息
 * @param code 验证码(可选)
 * @param captchaId 验证码ID(可选)
 * @returns 注册成功的用户信息
 */
export function register(userInfo: {
    username: string;
    password: string;
    telephone: string;
    email: string;
}, code?: string, captchaId?: string) {
    return request({
        url: '/user/user-auth/register',
        method: 'post',
        data: userInfo,   // 请求体参数
        params: { code, captchaId }  // 查询参数
    });
}

/**
 * 获取验证码
 * @returns 验证码信息 (包括验证码的图片、过期时间等)
 */
export function getCaptcha() {
    return request({
        url: '/user/user-auth/captcha',
        method: 'get',
    });
}
