// src/api/analysis/student.ts

import request from '@/utils/request'

/**
 * 学生分析API
 */
export const StudentAnalysisApi = {
    /**
     * 分页获取学生数据
     * @param page 页码
     * @param size 每页数量
     * @returns 学生分析分页数据
     */
    getStudentAnalysisPage(page?: number, size?: number) {
        return request.get<{
            content: Array<{
                studentId: string
                totalAnswered: number
                totalCorrect: number
                accuracy: number
                avgScoreRate: number
            }>
            totalElements: number
            totalPages: number
        }>('/analysis/analysis-student/page', {
            params: { page, size }
        })
    }
}