import request from '@/utils/request'

/**
 * 提交作答信息
 * @param data 作答数据
 * @returns 提交结果
 */
export function submitAnswer(data: {
    studentId: string
    questionId: string
    examId: string
    time: string
    answerType: string
    duration: number
    rightAnswer: string
    answer: string
}) {
    return request({
        url: '/exam/exam-submit/submit',
        method: 'post',
        data
    })
}

/**
 * 批量提交作答信息
 * @param answers 作答数据数组
 * @returns 提交结果
 */
export function batchSubmitAnswers(answers: any[]) {
    return request({
        url: '/exam/exam-submit/submits',
        method: 'post',
        data: answers
    })
}

/**
 * 获取成绩
 * @param studentId 学生ID
 * @param questionId 问题ID（可选）
 * @param examId 考试ID（可选）
 * @returns 成绩信息
 */
export function getScore(studentId: string, questionId?: string, examId?: string) {
    return request({
        url: '/exam/exam-submit/score',
        method: 'get',
        params: { studentId, questionId, examId }
    })
}