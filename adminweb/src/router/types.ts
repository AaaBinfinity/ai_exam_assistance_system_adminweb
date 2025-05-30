export interface Option {
    id: string
    content: string
}

export interface Exercise {
    id?: string
    content: string
    answer: string[]
    options: Option[]
    type: string
    subject: string
    knowledge_point: string[]
    order?: boolean
    check_type?: number
    attachments?: string[]
    difficulty?: number
    urls?: string[] | null
    createAt?: string
    updateAt?: string
}
