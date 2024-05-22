'use client';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';

const ENDPOINT = `${process.env.API_URL}/api`;

export default function usePostQuestion(examId: number) {
    // use the global mutate
    const { mutate } = useSWRConfig();

    const postQuestion = async (userId: string, questionText: string | null, questionPNG: File | null) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('examId', examId.toString());
        if (questionPNG) {
            formData.append('questionPNG', questionPNG);
        }
        if (questionText) {
            formData.append('questionText', questionText);
        }
        // TODO: update this to take questionType as input
        formData.append('questionType', 'Short Answer');

        // send the question
        const res = await fetch(`${ENDPOINT}/questions`, {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            toast.success('Posted comment', { id: 'coursePost' });
            // question successfully created, invalidate the comments cache so it refetches updated data
            await mutate(ENDPOINT + '/exams/' + examId + '/questions');
        } else {
            toast.error('Error posting comment', { id: 'commentPostError' });
        }
    };

    return {
        postQuestion,
    };
}