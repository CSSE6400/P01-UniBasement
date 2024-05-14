import { useMemo } from 'react';
import { Course } from '@/types';
import requireAuth from '@/app/requireAuth';

function Notes({ params }: { params: { courseCode: string } }) {
    const course: Course = useMemo(() => {
        // query backend here
        return {
            courseCode: params.courseCode.toUpperCase(),
            courseName: 'Course Name',
            courseDescription: 'Some sort of description',
        };
    }, [params.courseCode]);

    return (
        <main>
            <h1>Study material for {course.courseCode}</h1>
            There will be some cards here
        </main>
    );
}

export default requireAuth(Notes);
