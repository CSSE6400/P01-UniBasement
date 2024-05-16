'use client';
import { useSWRConfig } from 'swr';

const ENDPOINT = `${process.env.API_URL}/api`;

export default function usePostQuestion(examId: number) {
    // use the global mutate
    const { mutate } = useSWRConfig();

    const postQuestion = async (userId: string, questionText: string, questionPNG: File) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('examId', examId.toString());
        formData.append('questionPNG', questionPNG);
        formData.append('questionText', questionText);

        // send the question
        const res = await fetch(`${ENDPOINT}/comments`, {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            // question successfully created, invalidate the comments cache so it refetches updated data
            await mutate(ENDPOINT + '/exams/' + examId + '/questions');
        }
    };

    return {
        postQuestion,
    };
}