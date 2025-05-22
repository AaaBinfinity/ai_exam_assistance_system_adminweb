import request from '@/utils/request'
import type { AxiosProgressEvent } from 'axios'

// 根据接口规范定义 Exercise 接口
interface Exercise {
    id?: string
    content: string
    answer: string[]
    options: { id: string; content: string }[]
    type: string
    subject: string
    knowledge_point: string[]
    order?: boolean
    check_type?: number
    attachments?: string[]
    difficulty?: number
    urls?: string[] | null
    createAt?: string
    updateAt?: string
}

interface Option {
    id: string
    content: string
}

/**
 * 添加习题（支持可选的文件上传）
 * @param question 题目数据（JSON 格式）
 * @param files 可选的文件数组
 * @param onUploadProgress 上传进度回调（可选）
 */
export function addExercise(
    question: Exercise,
    files?: File[],
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) {
    const formData = new FormData()
    formData.append('question', JSON.stringify(question))

    if (files && files.length > 0) {
        files.forEach(file => formData.append('files', file))
    }

    return request({
        url: '/exam/exam-manager',
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress
    })
}

/**
 * 更新习题信息
 * @param exercise 包含 id 的部分习题数据
 * @note 若未传入 ID，则会新建题目
 */
export function updateExercise(exercise: Partial<Exercise> & { id: string }) {
    return request({
        url: '/exam/exam-manager',
        method: 'PUT',
        data: exercise,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 根据 ID 删除习题
 * @param questionId 要删除的习题 ID
 */
export function deleteExercise(questionId: string) {
    return request({
        url: '/exam/exam-manager',
        method: 'DELETE',
        params: { questionId }
    })
}

/**
 * 批量添加习题
 * @param exercises 要添加的习题数组
 */
export function batchAddExercises(exercises: Exercise[]) {
    return request({
        url: '/exam/exam-manager/adds',
        method: 'POST',
        data: exercises,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 向已有习题添加附件
 * @param questionId 题目 ID
 * @param files 要上传的文件数组
 * @param onUploadProgress 上传进度回调（可选）
 */
export function addExerciseAttachments(
    questionId: string,
    files: File[],
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) {
    const formData = new FormData()
    formData.append('questionId', questionId)
    files.forEach(file => formData.append('files', file))

    return request({
        url: '/exam/exam-manager/attachments',
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress
    })
}

/**
 * 批量删除习题
 * @param questionIds 要删除的习题 ID 数组
 */
export function batchDeleteExercises(questionIds: string[]) {
    return request({
        url: '/exam/exam-manager/list',
        method: 'DELETE',
        data: questionIds,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
