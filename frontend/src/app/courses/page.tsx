'use client'
import useCourses from '@/api/useCourses';
import Link from 'next/link';

export default function Courses() {
    const { courses, isError, isLoading } = useCourses()
    return (
        <main>
            {isLoading && <p>Loading...</p>}
            {!isError && !isLoading && courses?.map(course => (
                <>
                    <hr />
                    <div key={course.courseCode}>
                        <Link href={`/courses/${course.courseCode}/course-profile`}>
                            <h2>{course.courseCode} | {course.courseName}</h2>
                        </Link>
                        <p>{course.courseDescription}</p>
                    </div>
                </>
                ))
            }
        </main>
    )
}