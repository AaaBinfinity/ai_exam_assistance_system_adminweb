// src/api/analysis/question.ts

import request from '@/utils/request'
import type {
    QuestionAnalysis,
    QuestionAccuracy,
    QuestionAvgScore,
    QuestionAvgDuration,
    QuestionEfficiency,
    QuestionDifficultyLevel
} from './types'

/**
 * 习题分析API
 */
export const QuestionAnalysisApi = {
    /**
     * 分页获取习题分析
     * @param page 页码
     * @param size 每页数量
     * @returns 习题分析分页数据
     */
    getQuestionAnalysisPage(page?: number, size?: number) {
        return request.get<{
            content: QuestionAnalysis[]
            totalElements: number
            totalPages: number
        }>('/analysis/analysis-question/page', {
            params: { page, size }
        })
    },

    /**
     * 分页过滤获取习题分析
     * @param subject 科目
     * @param type 题型
     * @param page 页码
     * @param size 每页数量
     * @returns 过滤后的习题分析分页数据
     */
    getQuestionAnalysisFilter(
        subject?: string,
        type?: string,
        page?: number,
        size?: number
    ) {
        return request.get<{
            content: QuestionAnalysis[]
            totalElements: number
            totalPages: number
        }>('/analysis/analysis-question/filter', {
            params: { subject, type, page, size }
        })
    },

    /**
     * 分页过滤获取习题准确率
     * @param subject 科目
     * @param type 题型
     * @param page 页码
     * @param size 每页数量
     * @param desc 是否降序
     * @returns 习题准确率分页数据
     */
    getQuestionAccuracy(
        subject?: string,
        type?: string,
        page?: number,
        size?: number,
        desc?: boolean
    ) {
        return request.get<{
            content: QuestionAccuracy[]
            totalElements: number
            totalPages: number
        }>('/analysis/analysis-question/accuracy', {
            params: { subject, type, page, size, desc }
        })
    },

    /**
     * 分页过滤获取习题平均得分
     * @param subject 科目
     * @param type 题型
     * @param page 页码
     * @param size 每页数量
     * @param desc 是否降序
     * @returns 习题平均得分分页数据
     */
    getQuestionAvgScore(
        subject?: string,
        type?: string,
        page?: number,
        size?: number,
        desc?: boolean
    ) {
        return request.get<{
            content: QuestionAvgScore[]
            totalElements: number
            totalPages: number
        }>('/analysis/analysis-question/avg-score', {
            params: { subject, type, page, size, desc }
        })
    },

    /**
     * 分页过滤获取习题平均答题时间
     * @param subject 科目
     * @param type 题型
     * @param page 页码
     * @param size 每页数量
     * @param desc 是否降序
     * @returns 习题平均答题时间分页数据
     */
    getQuestionAvgDuration(
        subject?: string,
        type?: string,
        page?: number,
        size?: number,
        desc?: boolean
    ) {
        return request.get<{
            content: QuestionAvgDuration[]
            totalElements: number
            totalPages: number
        }>('/analysis/analysis-question/avg-duration', {
            params: { subject, type, page, size, desc }
        })
    },

    /**
     * 分页过滤获取习题作答效率
     * @param subject 科目
     * @param type 题型
     * @param page 页码
     * @param size 每页数量
     * @param desc 是否降序
     * @returns 习题作答效率分页数据
     */
    getQuestionEfficiency(
        subject?: string,
        type?: string,
        page?: number,
        size?: number,
        desc?: boolean
    ) {
        return request.get<{
            content: QuestionEfficiency[]
            totalElements: number
            totalPages: number
        }>('/analysis/analysis-question/efficiency', {
            params: { subject, type, page, size, desc }
        })
    },

    /**
     * 分页过滤获取习题难度等级
     * @param subject 科目
     * @param type 题型
     * @param page 页码
     * @param size 每页数量
     * @param desc 是否降序
     * @returns 习题难度等级分页数据
     */
    getQuestionDifficultyLevel(
        subject?: string,
        type?: string,
        page?: number,
        size?: number,
        desc?: boolean
    ) {
        return request.get<{
            content: QuestionDifficultyLevel[]
            totalElements: number
            totalPages: number
        }>('/analysis/analysis-question/difficulty-level', {
            params: { subject, type, page, size, desc }
        })
    }
}