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
    questionPng: string
}