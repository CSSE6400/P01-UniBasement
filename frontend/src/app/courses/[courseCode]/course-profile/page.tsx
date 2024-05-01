'use client'
import useCourse from '@/api/useCourse';
import Link from 'next/link';

export default function CourseProfile({ params }: { params: { courseCode: string }}) {
    const { course, isError, isLoading } = useCourse(params.courseCode)

    return (
        <main>
            {isLoading && <p>Loading...</p>}
            {!isError && !isLoading && (
                <div key={course!.courseCode}>
                    <Link href={`/courses/${course!.courseCode}/course-profile`}>
                        <h2>{course!.courseCode} | {course!.courseName}</h2>
                    </Link>
                    <p>{course!.courseDescription}</p>
                </div>
            )}
        </main>
    );
}