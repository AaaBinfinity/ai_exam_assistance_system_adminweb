import request from '@/utils/request';

export function getRecommendations() {
    return request({
        url: '/analysis/analysis-recommend',
        method: 'GET'
    });
}

export function getPopularQuestions(groupBy: string, limit?: number) {
    return request({
        url: '/analysis/analysis-recommend/popular',
        method: 'GET',
        params: { groupBy, limit }
    });
}

export function getFilteredPopularQuestions(
    filter: string,
    groupBy: string,
    limit?: number
) {
    return request({
        url: '/analysis/analysis-recommend/popularFilter',
        method: 'GET',
        params: { filter, groupBy, limit }
    });
}

export function getSimilarQuestions(questionId: string) {
    return request({
        url: '/analysis/analysis-recommend/questionId',
        method: 'GET',
        params: { questionId }
    });
}