export type Course = {
    courseCode: string
    courseName: string
    courseDescription: string
}

export type Exam = {
    examId: number
    examYear: number
    examSemester: number
    examType: string
}

export type Question = {
    questionId: number
    questionText: string
    questionType: string
    questionPNG: string
}

export type Comment = {
    commentId: number
    parentCommentId: number | null
    commentText: string
    commentPNG: string | null
    isCorrect: boolean
    isEndorsed: boolean
    upvotes: number
    downvotes: number
    created_at: string
    updated_at: string
    children?: Comment[]
}