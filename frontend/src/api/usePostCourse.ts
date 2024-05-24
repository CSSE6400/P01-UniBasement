'use client';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';
import { AddCourseFormFields } from '@/types';

const ENDPOINT = `${process.env.API_URL}/api`;

export default function usePostCourse(onSuccess?: () => void) {
    // use the global mutate
    const { mutate } = useSWRConfig();

    const postCourse = async (userId: string, course: AddCourseFormFields) => {
        // send the course data
        const res = await fetch(`${ENDPOINT}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                courseCode: course.courseCode,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                university: course.university,
            }),
        });

        if (res.ok) {
            toast.success('Added course', { id: 'coursePost' });
            // course successfully created, invalidate the courses cache so it refetches updated data
            await mutate(ENDPOINT + '/courses');
            onSuccess?.();
        } else {
            toast.error('Error adding course', { id: 'coursePostError' });
        }
    };

    return {
        postCourse,
    };
}