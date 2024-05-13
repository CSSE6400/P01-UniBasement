'use client';
import { useSWRConfig } from 'swr';

const ENDPOINT = `${process.env.API_URL}/api/`;

export default function usePostComment(questionId: number) {
    const { mutate } = useSWRConfig();

    const postComment = async (userId: string, commentText: string, commentPng: any, parentCommentId: number | null) => {
        const res = await fetch(`${ENDPOINT}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, questionId, commentText, commentPng, parentCommentId }),
        });

        if (res.ok) {
            await mutate(ENDPOINT + 'questions/' + questionId + '/comments');
        }
    };

    return {
        postComment
    };
}