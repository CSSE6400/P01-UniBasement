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
    isDeleted: boolean
    upvotes: number
    downvotes: number
    upvoted: boolean
    downvoted: boolean
    createdAt: string
    updatedAt: string
    userId: string
    picture: string | null
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

export type RecentChange = {
    courseCode: Course['courseCode']
    exams: Array<Exam & { changes: number }>
}

export enum UserRole {
    USER = 0,
    ADMIN = 1,
}

export type AddCourseFormFields = {
    courseCode: string
    courseName: string
    courseDescription: string
    university: string
}


export type AddExamFormFields = {
    examYear: number
    examSemester: number
    examType: string
}
