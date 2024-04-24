import { useMemo } from 'react';
import { Course } from '@/types';

export default function CourseProfile({ params }: { params: { courseCode: string }}) {
    const course: Course = useMemo(() => {
        // query backend here
        return {
            coursecode: params.courseCode.toUpperCase(),
            coursename: 'Course Name',
            coursedescription: 'Some sort of description'
        }
    }, [params.courseCode])

    return (
        <main>
            <h1>{course.coursename}</h1>
            <h2>{course.coursecode}</h2>
            <h2>{course.coursedescription}</h2>
        </main>
    );
}