// src/api/analysis/recommend.ts

import request from '@/utils/request'

/**
 * 推荐系统API
 */
export const RecommendApi = {
    /**
     * 获取推荐习题
     * @returns 推荐习题数据
     */
    getRecommendations() {
        return request.get<{
            studentId: string
            recommendations: Array<{
                questionId: string
                predictedScore: number
            }>
        }>('/analysis/analysis-recommend')
    },

    /**
     * 获取top习题
     * @param groupBy 分组方式 (subject|type|both|any)
     * @param limit 限制数量
     * @returns top习题数据
     */
    getPopularQuestions(groupBy: 'subject' | 'type' | 'both' | 'any', limit?: number) {
        return request.get<
            Array<
                Array<{
                    questionId: string
                    subject: string
                    type: string
                    totalAnswered: number
                    rank: number
                }>
            >
        >('/analysis/analysis-recommend/popular', {
            params: { groupBy, limit }
        })
    },

    /**
     * 获取习题top（过滤）
     * @param filter 过滤条件
     * @param groupBy 分组方式 (subject|type|both)
     * @param limit 限制数量
     * @returns 过滤后的top习题数据
     */
    getPopularQuestionsFilter(
        filter: string,
        groupBy: 'subject' | 'type' | 'both',
        limit?: number
    ) {
        return request.get<
            Array<{
                questionId: string
                subject: string
                type: string
                totalAnswered: number
                rank: number
            }>
        >('/analysis/analysis-recommend/popularFilter', {
            params: { filter, groupBy, limit }
        })
    },

    /**
     * 获取相似习题
     * @param questionId 习题ID
     * @returns 相似习题数据
     */
    getSimilarQuestions(questionId: string) {
        return request.get<
            Array<{
                answer: string[]
                content: string
                id: string
                knowledgePoint: string | null
                options: Array<{
                    content: string
                    id: string
                }>
                subject: string
                type: string
                order: number | null
                checkType: number
                attachments: any[] | null
                difficulty: number | null
                urls: string[] | null
            }>
        >('/analysis/analysis-recommend/questionId', {
            params: { questionId }
        })
    }
}