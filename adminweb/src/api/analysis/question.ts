import request from '@/utils/request';

export function getQuestionAnalysis(page?: number, size?: number) {
    return request({
        url: '/analysis/analysis-question/page',
        method: 'GET',
        params: { page, size }
    });
}

export function getFilteredQuestionAnalysis(
    subject?: string,
    type?: string,
    page?: number,
    size?: number
) {
    return request({
        url: '/analysis/analysis-question/filter',
        method: 'GET',
        params: { subject, type, page, size }
    });
}

export function getQuestionAccuracy(
    subject?: string,
    type?: string,
    page?: number,
    size?: number,
    desc = true
) {
    return request({
        url: '/analysis/analysis-question/accuracy',
        method: 'GET',
        params: { subject, type, page, size, desc }
    });
}

export function getQuestionAvgScore(
    subject?: string,
    type?: string,
    page?: number,
    size?: number,
    desc = true
) {
    return request({
        url: '/analysis/analysis-question/avg-score',
        method: 'GET',
        params: { subject, type, page, size, desc }
    });
}

export function getQuestionAvgDuration(
    subject?: string,
    type?: string,
    page?: number,
    size?: number,
    desc = true
) {
    return request({
        url: '/analysis/analysis-question/avg-duration',
        method: 'GET',
        params: { subject, type, page, size, desc }
    });
}

export function getQuestionEfficiency(
    subject?: string,
    type?: string,
    page?: number,
    size?: number,
    desc = true
) {
    return request({
        url: '/analysis/analysis-question/efficiency',
        method: 'GET',
        params: { subject, type, page, size, desc }
    });
}

export function getQuestionDifficultyLevel(
    subject?: string,
    type?: string,
    page?: number,
    size?: number,
    desc = true
) {
    return request({
        url: '/analysis/analysis-question/difficulty-level',
        method: 'GET',
        params: { subject, type, page, size, desc }
    });
}