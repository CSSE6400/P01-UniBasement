'use client';
import { useSWRConfig } from 'swr';

const ENDPOINT = `${process.env.API_URL}/api`;

export default function useUpdateCourse(courseCode: string) {
    // use the global mutate
    const { mutate } = useSWRConfig();

    const updateCourseRating = async (userId: string, starRating: number) => {
        // send the rating
        const res = await fetch(`${ENDPOINT}/courses/${courseCode}/star`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, starRating }),
        });

        if (res.ok) {
            // rating successful, invalidate the course cache so it refetches updated data
            await mutate(ENDPOINT + '/courses/' + courseCode);
        }
    };

    return {
        updateCourseRating
    };
}