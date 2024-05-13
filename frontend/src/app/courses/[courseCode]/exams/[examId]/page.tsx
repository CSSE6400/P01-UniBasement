'use client';
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
            <div className="max-w-4xl w-full mx-auto flex flex-col items-center justify-center">
                {isLoadingQuestions && <p>Loading...</p>}
                {!isLoading && !isError && (
                    <>
                        <div className="flex items-center justify-center pt-8 text-5xl font-bold">
                            {`${params.courseCode} ${exam?.examType}`}
                        </div>
                        <div className="flex items-center justify-center pb-8 text-3xl">
                            {`${exam?.examYear} Semester ${exam?.examSemester}`}
                        </div>
                    </>
                )}
                <div className="grid grid-cols-1 gap-4 w-full">
                    {!isErrorQuestions && !isLoadingQuestions && questions?.map(question => (
                        <Question key={question.questionId} question={question}/>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default requireAuth(Exam)
