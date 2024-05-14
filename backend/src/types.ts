export type Course = {
    courseCode: string
    courseName: string
    courseDescription: string
    university: string
    stars: number
    votes: number
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
    userId: string
    commentText: string
    commentPNG: string | null
    isCorrect: boolean
    isEndorsed: boolean
    upvotes: number
    downvotes: number
    created_at: Date
    updated_at: Date
    children?: Comment[]
    questionId?: number
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

export type QuestionQueryParams = {
    userId?: string
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

export type RateObject = {
    courseCode: string
    stars: number
}
