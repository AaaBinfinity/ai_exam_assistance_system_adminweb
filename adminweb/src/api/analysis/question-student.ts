// src/api/analysis/question-student.ts

import request from '@/utils/request'

/**
 * 习题学生关联分析API
 */
export const QuestionStudentAnalysisApi = {
    /**
     * 分页获取关联数据
     * @param page 页码
     * @param size 每页数量
     * @returns 习题学生关联分析分页数据
     */
    getQuestionStudentAnalysisPage(page?: number, size?: number) {
        return request.get<{
            content: Array<{
                questionId: string
                studentId: string
                answerCount: number
                correctCount: number
                accuracy: number
                avgScoreRate: number
                createdAt: string
            }>
            totalElements: number
            totalPages: number
        }>('/analysis/analysis-question-student/page', {
            params: { page, size }
        })
    },

    /**
     * 分页过滤获取关联数据
     * @param questionId 习题ID
     * @param studentId 学生ID
     * @param page 页码
     * @param size 每页数量
     * @returns 过滤后的习题学生关联分析分页数据
     */
    getQuestionStudentAnalysisFilter(
        questionId?: string,
        studentId?: string,
        page?: number,
        size?: number
    ) {
        return request.get<{
            content: Array<{
                questionId: string
                studentId: string
                answerCount: number
                correctCount: number
                accuracy: number
                avgScoreRate: number
                createdAt: string
            }>
            totalElements: number
            totalPages: number
        }>('/analysis/analysis-question-student/filter', {
            params: { questionId, studentId, page, size }
        })
    }
}