import request from '@/utils/request'

/**
 * 发送消息
 * @param receiverId 接收者ID
 * @param content 消息内容
 * @returns 发送的消息信息
 */
export function sendMessage(receiverId: string, content: string) {
    return request({
        url: '/user/user-messages/send',
        method: 'post',
        params: { receiverId, content }
    })
}

/**
 * 获取收件箱消息
 * @param page 页码
 * @param size 每页数量
 * @returns 消息分页列表
 */
export function getInboxMessages(page?: number, size?: number) {
    return request({
        url: '/user/user-messages/inbox',
        method: 'get',
        params: { page, size }
    })
}

/**
 * 获取已发送消息
 * @param page 页码
 * @param size 每页数量
 * @returns 消息分页列表
 */
export function getSentMessages(page?: number, size?: number) {
    return request({
        url: '/user/user-messages/sent',
        method: 'get',
        params: { page, size }
    })
}

/**
 * 将消息标记为已读
 * @param id 消息ID
 * @returns 操作结果
 */
export function markAsRead(id: string) {
    return request({
        url: `/user/user-messages/read/${id}`,
        method: 'post'
    })
}