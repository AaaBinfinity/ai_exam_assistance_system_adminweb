//src/api/exam/manager.ts


import request from '@/utils/request'
import type { AxiosProgressEvent } from 'axios'

// 可选：定义习题类型
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
}

/**
 * 添加习题（可上传附件）
 */
export function addExercise(
    question: Exercise,
    files?: File[],
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) {
    const formData = new FormData()
    formData.append('question', JSON.stringify(question))

    if (files?.length) {
        files.forEach(file => formData.append('attachments', file))
    }

    return request({
        url: '/exam/exam-manager',
        method: 'post',
        data: formData,
        onUploadProgress
    })
}

/**
 * 修改习题信息
 */
export function updateExercise(exercise: Exercise) {
    return request({
        url: '/exam/exam-manager',
        method: 'put',
        data: exercise
    })
}

/**
 * 删除习题
 */
export function deleteExercise(questionId: string) {
    return request({
        url: '/exam/exam-manager',
        method: 'delete',
        params: { questionId }
    })
}

/**
 * 批量添加习题
 */
export function batchAddExercises(exercises: Exercise[]) {
    return request({
        url: '/exam/exam-manager/adds',
        method: 'post',
        data: exercises
    })
}

/**
 * 为习题添加附件
 */
export function addExerciseAttachments(
    questionId: string,
    files: File[],
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) {
    const formData = new FormData()
    formData.append('questionId', questionId)
    files.forEach(file => formData.append('attachments', file))

    return request({
        url: '/exam/exam-manager/attachments',
        method: 'post',
        data: formData,
        onUploadProgress
    })
}
