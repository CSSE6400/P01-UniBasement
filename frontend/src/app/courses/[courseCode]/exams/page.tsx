'use client'
import useExams from '@/api/useExams'
import requireAuth from '@/app/requireAuth'
import Link from 'next/link'

function Exams({ params }: { params: { courseCode: string } }) {
  const { exams, isLoading, isError } = useExams(params.courseCode)

  return (
    <main>
      <h1>Exams for {params.courseCode}</h1>
      There will be some cards here
      {isLoading && <p>Loading...</p>}
      {!isError &&
        !isLoading &&
        exams?.map((exam) => (
          <>
            <hr />
            <div key={exam.examId}>
              <Link href={`/courses/${params.courseCode}/exams/${exam.examId}`}>
                <h2>
                  {exam.examYear} | S{exam.examSemester}
                </h2>
              </Link>
              <p>{exam.examType}</p>
            </div>
          </>
        ))}
    </main>
  )
}

export default requireAuth(Exams)
