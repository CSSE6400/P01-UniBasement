'use client'
import useExams from '@/api/useExams';
import Link from 'next/link';

export default function Exams({ params }: { params: { courseCode: string }}) {
    const { exams, isLoading, isError } = useExams(params.courseCode);

    return (
        <main>
            <h1>Exams for {params.courseCode}</h1>
            There will be some cards here
            {isLoading && <p>Loading...</p>}
            {!isError && !isLoading && exams?.map(exam => (
                <>
                    <hr />
                    <div key={exam.examid}>
                        <Link href={`/courses/${params.courseCode}/exams/${exam.examid}`}>
                            <h2>{exam.examyear} | S{exam.examsemester}</h2>
                        </Link>
                        <p>{exam.examtype}</p>
                    </div>
                </>
                ))
            }
        </main>
    );
}