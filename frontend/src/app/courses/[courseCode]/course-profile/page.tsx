'use client'
import useCourse from '@/api/useCourse';
import Link from 'next/link';

export default function CourseProfile({ params }: { params: { courseCode: string }}) {
    const { course, isError, isLoading } = useCourse(params.courseCode)

    return (
        <main>
            {isLoading && <p>Loading...</p>}
            {!isError && !isLoading && (
                <div key={course!.coursecode}>
                    <Link href={`/courses/${course!.coursecode}/course-profile`}>
                        <h2>{course!.coursecode} | {course!.coursename}</h2>
                    </Link>
                    <p>{course!.coursedescription}</p>
                </div>
            )}
        </main>
    );
}