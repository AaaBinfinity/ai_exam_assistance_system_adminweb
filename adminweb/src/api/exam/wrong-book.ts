import request from '@/utils/request'

/**
 * 添加错题
 * @param userId 用户ID
 * @param questionId 问题ID
 * @param remark 备注（可选）
 * @returns 错题信息
 */
export function addWrongQuestion(userId: string, questionId: string, remark?: string) {
    return request({
        url: '/exam/exam-wrong-book',
        method: 'post',
        data: { userId, questionId, remark }
    })
}

/**
 * 修改错题备注
 * @param id 错题记录ID
 * @param remark 新备注
 * @returns 修改后的错题信息
 */
export function updateWrongQuestionRemark(id: string, remark: string) {
    return request({
        url: '/exam/exam-wrong-book',
        method: 'put',
        params: { id, remark }
    })
}

/**
 * 删除错题
 * @param id 错题记录ID
 * @returns 删除结果
 */
export function deleteWrongQuestion(id: string) {
    return request({
        url: '/exam/exam-wrong-book',
        method: 'delete',
        params: { id }
    })
}

/**
 * 查询错题
 * @param id 错题记录ID
 * @returns 错题信息
 */
export function getWrongQuestion(id: string) {
    return request({
        url: '/exam/exam-wrong-book',
        method: 'get',
        params: { id }
    })
}

/**
 * 查询错题列表
 * @param subject 学科名称（可选）
 * @param type 题目类型（可选）
 * @param userId 用户ID（可选）
 * @param page 页码（可选）
 * @param size 每页数量（可选）
 * @returns 错题分页列表
 */
export function getWrongQuestionList(
    subject?: string,
    type?: string,
    userId?: string,
    page?: number,
    size?: number
) {
    return request({
        url: '/exam/exam-wrong-book/list',
        method: 'get',
        params: { subject, type, userId, page, size }
    })
}

/**
 * 通过参数添加错题
 * @param userId 用户ID
 * @param questionId 问题ID
 * @returns 错题信息
 */
export function addWrongQuestionByParam(userId: string, questionId: string) {
    return request({
        url: '/exam/exam-wrong-book/add',
        method: 'post',
        params: { userId, questionId }
    })
}

/**
 * 更新复习状态
 * @param id 错题记录ID
 * @param mastered 是否掌握
 * @returns 更新结果
 */
export function updateReviewStatus(id: string, mastered: boolean) {
    return request({
        url: '/exam/exam-wrong-book/mark',
        method: 'post',
        params: { id, mastered }
    })
}