export type Course = {
    coursecode: string
    coursename: string
    coursedescription: string
}

export type Exam = {
    examId: number
    examyear: number
    examsemester: number
    examtype: string
}

export type Question = {
    questionid: number
    questiontext: string
    questiontype: string
    questionpng: string
}