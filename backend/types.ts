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


export type CommentBodyParams = Partial<Omit<Comment, 'children' | 'commentId'>> & {
    questionId?: number
}

export type CommentRouteParams = {
    commentId: number
}

export type QuestionBodyParams = Partial<Omit<Question, 'questionId'>> & {
    examId?: number
}

export type QuestionRouteParams = {
    questionId: number
}

export type ExamBodyParams = Partial<Omit<Exam, 'examId'>> & {
    courseCode?: string
}

export type ExamRouteParams = {
    examId: number
}

export type CourseBodyParams = Course

export type CourseRouteParams = {
    courseCode: string
}

export type CourseQueryParams = {
    offset?: number
    limit?: number
}