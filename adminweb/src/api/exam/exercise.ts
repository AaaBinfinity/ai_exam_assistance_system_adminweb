import request from '@/utils/request'
import type { AxiosResponse } from 'axios'

// 定义接口结构
interface Exercise {
    id: string
    content: string
    answer: string[]
    options: Option[]
    type: string
    subject: string
    knowledgePoint?: string[] | null
    order?: boolean | null
    checkType?: number | null
    attachments?: string[] | null
    urls?: string[] | null
    difficulty?: number | null
    createAt?: string | null
    updateAt?: string | null
}

interface Option {
    id: string
    content: string
}

interface PaginatedExerciseList {
    content: Exercise[]
    pageable: {
        sort: string[]
        pageNumber: number
        pageSize: number
        offset: number
        paged: boolean
        unpaged: boolean
    }
    totalPages: number
    totalElements: number
    last: boolean
    numberOfElements: number
    first: boolean
    size: number
    number: number
    sort: string[]
    empty: boolean
}

interface ExerciseTypeConfig {
    type: string
    count: number
}

interface RandomExerciseRequest {
    subject: string
    types: ExerciseTypeConfig[]
    random: boolean
}

/**
 * 获取分页习题列表
 * @param subject - 学科筛选（可选）
 * @param type - 题型筛选（可选）
 * @param page - 页码（默认：0）
 * @param size - 每页数量（默认：10）
 * @returns 返回包含分页信息的习题列表 Promise
 */
export function getExerciseList(
    subject?: string,
    type?: string,
    page: number = 0,
    size: number = 10
): Promise<AxiosResponse<PaginatedExerciseList>> {
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
 * 根据条件随机获取题目
 * @param subject - 要筛选的学科
 * @param types - 题型配置数组，指定每种类型的数量
 * @returns 返回习题数组的 Promise
 */
export function getRandomExercises(
    subject: string,
    types: ExerciseTypeConfig[]
): Promise<AxiosResponse<Exercise[]>> {
    const requestData: RandomExerciseRequest = {
        subject,
        types,
        random: true
    }

    return request({
        url: '/exam/exam-exercise/list',
        method: 'post',
        data: requestData
    })
}

/**
 * 获取所有可用学科列表
 * @returns 返回学科名称数组的 Promise
 */
export function getSubjectList(): Promise<AxiosResponse<string[]>> {
    return request({
        url: '/exam/exam-exercise/subject',
        method: 'get'
    })
}

/**
 * 获取某一学科下的题型列表
 * @param subject - 指定学科
 * @returns 返回题型名称数组的 Promise
 */
export function getExerciseTypes(subject: string): Promise<AxiosResponse<string[]>> {
    return request({
        url: '/exam/exam-exercise/type',
        method: 'get',
        params: { subject }
    })
}
