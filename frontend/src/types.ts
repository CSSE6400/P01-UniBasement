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
    commentText: string
    commentPNG: string | null
    isCorrect: boolean
    isEndorsed: boolean
    upvotes: number
    downvotes: number
    created_at: string
    updated_at: string
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