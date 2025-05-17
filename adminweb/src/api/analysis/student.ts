import request from '@/utils/request';

export function getStudentAnalysis(page?: number, size?: number) {
    return request({
        url: '/analysis/analysis-student/page',
        method: 'GET',
        params: { page, size }
    });
}