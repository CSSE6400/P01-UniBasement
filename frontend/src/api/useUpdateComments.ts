'use client';
import { useSWRConfig } from 'swr';

const ENDPOINT = `${process.env.API_URL}/api`;

export default function useUpdateComments(questionId: number) {
    // use the global mutate
    const { mutate } = useSWRConfig();

    const updateCommentUpvote = async (userId: string, commentId: number) => {
        // send the upvote
        const res = await fetch(`${ENDPOINT}/comments/${commentId}/upvote`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (res.ok) {
            // upvote successful, invalidate the comments cache so it refetches updated data
            await mutate(ENDPOINT + '/questions/' + questionId + '/comments' + `${!!userId ? `?userId=${userId}` : ''}`);
        }
    };

    const updateCommentDownvote = async (userId: string, commentId: number) => {
        // send the downvote
        const res = await fetch(`${ENDPOINT}/comments/${commentId}/downvote`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (res.ok) {
            // downvote successful, invalidate the comments cache so it refetches updated data
            await mutate(ENDPOINT + '/questions/' + questionId + '/comments' + `${!!userId ? `?userId=${userId}` : ''}`);
        }
    };

    const updateCommentContent = async (userId: string, commentId: number, commentText: string, commentPNG: File) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('commentPNG', commentPNG);
        formData.append('commentText', commentText);

        // send the updates
        const res = await fetch(`${ENDPOINT}/comments/${commentId}/edit`, {
            method: 'PUT',
            body: formData,
        });

        if (res.ok) {
            // updates successful, invalidate the comments cache so it refetches updated data
            await mutate(ENDPOINT + '/questions/' + questionId + '/comments' + `${!!userId ? `?userId=${userId}` : ''}`);
        }
    };

    return {
        updateCommentContent,
        updateCommentUpvote,
        updateCommentDownvote,
    };
}