import request from '@/utils/request'

/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 * @param captchaCode 验证码(可选)
 * @param captchaId 验证码ID(可选)
 * @returns 用户信息和token
 */
// 登录 API
export function login(username: string, password: string, captchaCode?: string, captchaId?: string) {
    return request({
        url: '/user/user-auth/login',
        method: 'post',
        data: { username, password },
        params: { code: captchaCode, captchaId }  // 在 params 中传递 captchaCode 和 captchaId
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
    username: string
    password: string
    telephone: string
    email: string
}, code?: string, captchaId?: string) {
    return request({
        url: '/user/user-auth/register',
        method: 'post',
        data: userInfo,
        params: { code, captchaId }
    })
}

/**
 * 用户登出
 * @returns 登出结果
 */
export function logout() {
    return request({
        url: '/user/user-auth/logout',
        method: 'get'
    })
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
