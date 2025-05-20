//src/api/exam/exercise.ts

import request from '@/utils/request'

/**
 * 获取习题列表（分页）
 * @param subject 学科名称
 * @param type 习题类型
 * @param page 页码，默认为0
 * @param size 每页数量，默认为10
 * @returns 习题分页列表
 */
export function getExerciseList(
    subject?: string,
    type?: string,
    page: number = 0,
    size: number = 10
) {
    return request.get('/exam/exam-exercise/list', {
        params: {
            subject,
            type,
            page,
            size
        }
    })
}

/**
 * 获取随机题目
 * @param subject 学科名称
 * @param types 题目类型配置数组
 * @returns 随机题目列表
 */
export function getRandomExercises(subject: string, types: Array<{ type: string; count: number }>) {
    return request({
        url: '/exam/exam-exercise/list',
        method: 'post',
        data: { subject, types, random: true }
    })
}

/**
 * 获取学科列表
 * @returns 学科名称数组
 */
export function getSubjectList() {
    return request({
        url: '/exam/exam-exercise/subject',
        method: 'get'
    })
}

/**
 * 获取指定学科的习题类型
 * @param subject 学科名称
 * @returns 习题类型数组
 */
export function getExerciseTypes(subject: string) {
    return request({
        url: '/exam/exam-exercise/type',
        method: 'get',
        params: { subject }
    })
}