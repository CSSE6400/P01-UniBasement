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
                    <div key={course.coursecode}>
                        <Link href={`/courses/${course.coursecode}/course-profile`}>
                            <h2>{course.coursecode} | {course.coursename}</h2>
                        </Link>
                        <p>{course.coursedescription}</p>
                    </div>
                </>
                ))
            }
        </main>
    )
}