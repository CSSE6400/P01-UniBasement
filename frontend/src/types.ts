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
    questionText: string | null
    questionType: string
    questionPNG: string | null
}

export type Comment = {
    commentId: number
    parentCommentId: number | null
    commentText: string | null
    commentPNG: string | null
    isCorrect: boolean
    isEndorsed: boolean
    upvotes: number
    downvotes: number
    upvoted: boolean
    downvoted: boolean
    createdAt: string
    updatedAt: string
    userId: string
    children?: Comment[]
}

export type DisplayCourse = {
    href: string
    pinned?: boolean
    name: string
    code: string
    lastViewedName?: string
    lastViewed?: number
}