import request from '@/utils/request'

/**
 * 获取用户个性化设置
 * @returns 个性化设置信息
 */
export function getUserCustomSettings() {
    return request({
        url: '/user/user-custom',
        method: 'get'
    })
}

/**
 * 更新用户个性化设置
 * @param settings 设置信息
 * @returns 更新结果
 */
export function updateUserCustomSettings(settings: {
    userId: string
    emailNotificationEnabled: boolean
}) {
    return request({
        url: '/user/user-custom',
        method: 'post',
        data: settings
    })
}