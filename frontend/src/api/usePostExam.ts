'use client';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';
import { AddExamFormFields } from '@/types';

const ENDPOINT = `${process.env.API_URL}/api`;

export default function usePostExam(courseCode: string, onSuccess?: () => void) {
    // use the global mutate
    const { mutate } = useSWRConfig();

    const postExam = async (userId: string, exam: AddExamFormFields) => {
        // send the exam data
        const res = await fetch(`${ENDPOINT}/exams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                courseCode,
                ...exam,
            }),
        });

        if (res.ok) {
            toast.success('Added exam', { id: 'examPost' });
            // exam successfully created, invalidate the course's exam cache so it refetches updated data
            await mutate(ENDPOINT + '/courses/' + courseCode + '/exams');
            onSuccess?.();
        } else {
            toast.error('Error adding exam', { id: 'examPostError' });
        }
    };

    return {
        postExam,
    };
}