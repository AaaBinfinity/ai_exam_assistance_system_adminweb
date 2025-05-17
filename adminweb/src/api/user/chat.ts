import request from '@/utils/request'

/**
 * 与AI聊天
 * @param content 聊天内容
 * @returns AI回复内容
 */
export function chatWithAI(content: string) {
    return request({
        url: '/user/user-chat/chat',
        method: 'get',
        params: { content }
    })
}
