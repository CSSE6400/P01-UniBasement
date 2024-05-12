'use client'
import useExam from '@/api/useExam'
import useQuestions from '@/api/useQuestions'
import requireAuth from '@/app/requireAuth'
import Link from 'next/link'

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
      {!isErrorQuestions &&
        !isLoadingQuestions &&
        questions?.map((question) => (
          <>
            <hr />
            <div key={question.questionId}>
              <Link
                href={`/courses/${params.courseCode}/exams/${params.examId}/${question.questionId}`}
              >
                <h2>{question.questionType}</h2>
              </Link>
              <p>{question.questionText}</p>
            </div>
          </>
        ))}
    </main>
  )
}

export default requireAuth(Exam)
