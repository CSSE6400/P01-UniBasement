'use client'
import useExam from '@/api/useExam';
import useQuestions from '@/api/useQuestions';
import Link from 'next/link';

export default function Exam({ params }: { params: { courseCode: string, examId: number }}) {
    const { exam, isLoading, isError } = useExam(params.examId);
    const { questions, isLoading: isLoadingQuestions, isError: isErrorQuestions } = useQuestions(params.examId);

    return (
        <main>
            <h1>{`${params.courseCode} ${exam?.examtype}`}</h1>
            <h2>{`${exam?.examyear} Semester ${exam?.examsemester}`}</h2>
            {isLoadingQuestions && <p>Loading...</p>}
            {!isErrorQuestions && !isLoadingQuestions && questions?.map(question => (
                <>
                    <hr />
                    <div key={question.questionid}>
                        <Link href={`/courses/${params.courseCode}/exams/${question.questionid}`}>
                            <h2>{question.questiontype}</h2>
                        </Link>
                        <p>{question.questiontext}</p>
                    </div>
                </>
                ))
            }
        </main>
    );
}