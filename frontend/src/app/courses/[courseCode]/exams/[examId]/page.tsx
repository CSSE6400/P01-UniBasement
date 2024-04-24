import { useMemo } from 'react';

export default function Exam({ params }: { params: { courseCode: string, examId: number }}) {
    const exam = useMemo(() => {
        // query backend here
        return {
            examid: params.examId,
            examyear: 2023,
            examsemester: 1,
            examtype: 'Final'
        }
    }, [params.examId])

    return (
        <main>
            <h1>{`${params.courseCode} ${exam.examtype}`}</h1>
            <h2>{`${exam.examyear} Semester ${exam.examsemester}`}</h2>
            There will be some questions here
        </main>
    );
}