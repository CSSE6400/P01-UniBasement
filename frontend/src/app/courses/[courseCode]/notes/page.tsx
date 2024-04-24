import { useMemo } from 'react';
import { Course } from '@/types';

export default function Notes({ params }: { params: { courseCode: string }}) {
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
            <h1>Study material for {course.coursecode}</h1>
            There will be some cards here
        </main>
    );
}