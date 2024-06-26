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
    picture?: string | null
    commentText: string
    commentPNG: string | null
    isCorrect: boolean
    isDeleted: boolean
    upvotes: number
    downvotes: number
    createdAt: Date
    updatedAt: Date
    children?: Comment[]
    questionId?: number
}


export type CommentBodyParams = Partial<Omit<Comment, 'children' | 'commentId' | 'commentPNG'>> & {
    questionId?: number
}

export type CommentRouteParams = {
    commentId: number
}

export type QuestionBodyParams = Partial<Omit<Question, 'questionId' | 'commentPNG'>> & {
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
    userId?: string
}

export type ExamRouteParams = {
    examId: number
}

export type CourseBodyParams = Course & {
    userId?: string
}

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

export enum UserRole {
    USER = 0,
    ADMIN = 1,
}