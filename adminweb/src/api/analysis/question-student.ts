import request from '@/utils/request';

export function getQuestionStudentRelations(page?: number, size?: number) {
    return request({
        url: '/analysis/analysis-question-student/page',
        method: 'GET',
        params: { page, size }
    });
}

export function getFilteredQuestionStudentRelations(
    questionId?: string,
    studentId?: string,
    page?: number,
    size?: number
) {
    return request({
        url: '/analysis/analysis-question-student/filter',
        method: 'GET',
        params: { questionId, studentId, page, size }
    });
}