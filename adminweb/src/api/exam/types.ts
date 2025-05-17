// 习题选项
export interface ExerciseOption {
    id: string
    content: string
}

// 习题基本信息
export interface Exercise {
    id: string
    content: string
    answer: string[]
    options: ExerciseOption[]
    type: string
    subject: string
    knowledgePoint: string[]
    order: boolean | null
    checkType: number
    attachments: string[] | null
    difficulty: number | null
    urls: string[] | null
}

// 错题信息
export interface WrongQuestion {
    id: string
    userId: string
    remark: string | null
    createdAt: string | null
    question: Exercise
}

// 分页结果
export interface PageResult<T> {
    content: T[]
    pageable: {
        sort: {
            sorted: boolean
            unsorted: boolean
            empty: boolean
        }
        pageNumber: number
        pageSize: number
        offset: number
        paged: boolean
        unpaged: boolean
    }
    totalPages: number
    totalElements: number
    last: boolean
    first: boolean
    numberOfElements: number
    size: number
    number: number
    sort: {
        sorted: boolean
        unsorted: boolean
        empty: boolean
    }
    empty: boolean
}