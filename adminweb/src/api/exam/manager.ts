import request from '@/utils/request'
import type { AxiosProgressEvent } from 'axios'

/**
 * 添加习题（可上传附件）
 * @param question 习题JSON数据
 * @param files 附件文件数组
 * @param onUploadProgress 上传进度回调
 * @returns 添加的习题信息
 */
export function addExercise(
    question: any,
    files?: File[],
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) {
    const formData = new FormData()
    formData.append('question', JSON.stringify(question))

    if (files && files.length > 0) {
        files.forEach(file => {
            formData.append('files', file)
        })
    }

    return request({
        url: '/exam/exam-manager',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress
    })
}

/**
 * 修改习题信息
 * @param exercise 习题数据（必须包含id）
 * @returns 修改后的习题信息
 */
export function updateExercise(exercise: any) {
    return request({
        url: '/exam/exam-manager',
        method: 'put',
        data: exercise
    })
}

/**
 * 删除习题
 * @param questionId 习题ID
 * @returns 删除结果
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
 * @param exercises 习题数组
 * @returns 添加结果
 */
export function batchAddExercises(exercises: any[]) {
    return request({
        url: '/exam/exam-manager/adds',
        method: 'post',
        data: exercises
    })
}

/**
 * 为习题添加附件
 * @param questionId 习题ID
 * @param files 附件文件数组
 * @param onUploadProgress 上传进度回调
 * @returns 添加结果
 */
export function addExerciseAttachments(
    questionId: string,
    files: File[],
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) {
    const formData = new FormData()
    formData.append('questionId', questionId)

    files.forEach(file => {
        formData.append('files', file)
    })

    return request({
        url: '/exam/exam-manager/attachments',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress
    })
}