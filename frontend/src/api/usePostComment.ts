'use client';
import { useSWRConfig } from 'swr';

const ENDPOINT = `${process.env.API_URL}/api`;

export default function usePostComment(questionId: number) {
    // use the global mutate
    const { mutate } = useSWRConfig();

    const postComment = async (userId: string, commentText: string, commentPNG: File, parentCommentId: number | null) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('questionId', questionId.toString());
        formData.append('commentPNG', commentPNG);
        formData.append('commentText', commentText);
        if (parentCommentId) {
            formData.append('parentCommentId', parentCommentId.toString());
        }

        // send the comment
        const res = await fetch(`${ENDPOINT}/comments`, {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            // comment successfully created, invalidate the comments cache so it refetches updated data
            await mutate(ENDPOINT + '/questions/' + questionId + '/comments' + `${!!userId ? `?userId=${userId}` : ''}`);
        }
    };

    return {
        postComment,
    };
}