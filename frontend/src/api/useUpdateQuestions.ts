'use client';
import { useSWRConfig } from 'swr';

const ENDPOINT = `${process.env.API_URL}/api`;

export default function useUpdateQuestions(examId: number) {
    // use the global mutate
    const { mutate } = useSWRConfig();

    const updateQuestionContent = async (userId: string, questionId: number, questionText: string | null, questionPNG: File | null) => {
        const formData = new FormData();
        formData.append('userId', userId);
        if (questionPNG) {
            formData.append('questionPNG', questionPNG);
        }
        if (questionText) {
            formData.append('questionText', questionText);
        }

        // send the updates
        const res = await fetch(`${ENDPOINT}/questions/${questionId}/edit`, {
            method: 'PUT',
            body: formData,
        });

        if (res.ok) {
            // updates successful, invalidate the questions cache so it refetches updated data
            await mutate(ENDPOINT + '/exams/' + examId + '/questions');
        }
    };

    return {
        updateQuestionContent,
    };
}