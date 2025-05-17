// src/api/analysis/types.ts

/**
 * 习题分析数据类型定义
 */
export interface QuestionAnalysis {
    questionId: string
    questionAccuracy: number
    difficultyLevel: number
    subject: string
    type: string
    avgScore: number
    avgDurationS: number
    efficiency: number
}

export interface QuestionAccuracy {
    questionId: string
    questionAccuracy: number
}

export interface QuestionAvgScore {
    questionId: string
    avgScore: number
}

export interface QuestionAvgDuration {
    questionId: string
    avgDurationS: number
}

export interface QuestionEfficiency {
    questionId: string
    efficiency: number
}

export interface QuestionDifficultyLevel {
    questionId: string
    difficultyLevel: number
}