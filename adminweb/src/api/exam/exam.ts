import request from '@/utils/request'

/**
 * 获取随机题目（不带答案）
 * @param subject 学科名称
 * @param types 题目类型配置数组
 * @returns 随机题目列表（不带答案）
 */
export function getExamQuestions(subject: string, types: Array<{ type: string; count: number }>) {
    return request({
        url: '/exam/exam-exam/list',
        method: 'post',
        data: { subject, types, random: true }
    })
}

/**
 * 核对答案
 * @param questionIds 问题ID数组
 * @returns 正确答案数组
 */
export function checkAnswers(questionIds: string[]) {
    return request({
        url: '/exam/exam-exam/check',
        method: 'post',
        data: questionIds
    })
}