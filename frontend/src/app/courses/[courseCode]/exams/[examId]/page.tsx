'use client'
import useExam from '@/api/useExam';
import useQuestions from '@/api/useQuestions';
import requireAuth from '@/app/requireAuth';
import Accordion from '@/components/Accordion';
import Card from '@/components/Card';
import Question from '@/components/Exams/Question';

function Exam({ params }: { params: { courseCode: string; examId: number } }) {
  const { exam, isLoading, isError } = useExam(params.examId)
  const {
    questions,
    isLoading: isLoadingQuestions,
    isError: isErrorQuestions,
  } = useQuestions(params.examId)

    return (
        <main>
            <h1>{`${params.courseCode} ${exam?.examType}`}</h1>
            <h2>{`${exam?.examYear} Semester ${exam?.examSemester}`}</h2>
            {isLoadingQuestions && <p>Loading...</p>}
            {!isErrorQuestions && !isLoadingQuestions && questions?.map(question => (
                    <Question key={question.questionId} question={question} />
                ))
            }
        </main>
    );
}

export default requireAuth(Exam)
