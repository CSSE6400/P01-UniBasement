'use client';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';

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
            toast.success('Upvoted comment', { id: 'commentUpvote' });
            // upvote successful, invalidate the comments cache so it refetches updated data
            await mutate(ENDPOINT + '/questions/' + questionId + '/comments' + `${!!userId ? `?userId=${userId}` : ''}`);
        } else {
            toast.error('Error upvoting comment', { id: 'commentUpvoteError' });
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
            toast.success('Downvoted comment', { id: 'commentDownvote' });
            // downvote successful, invalidate the comments cache so it refetches updated data
            await mutate(ENDPOINT + '/questions/' + questionId + '/comments' + `${!!userId ? `?userId=${userId}` : ''}`);
        } else {
            toast.error('Error downvoting comment', { id: 'commentDownvoteError' });
        }
    };

    const updateCommentContent = async (userId: string, commentId: number, commentText: string | null, commentPNG: File | null) => {
        const formData = new FormData();
        formData.append('userId', userId);
        if (commentPNG) {
            formData.append('commentPNG', commentPNG);
        }
        if (commentText) {
            formData.append('commentText', commentText);
        }

        // send the updates
        const res = await fetch(`${ENDPOINT}/comments/${commentId}/edit`, {
            method: 'PUT',
            body: formData,
        });

        if (res.ok) {
            toast.success('Posted comment', { id: 'coursePost' });
            // updates successful, invalidate the comments cache so it refetches updated data
            await mutate(ENDPOINT + '/questions/' + questionId + '/comments' + `${!!userId ? `?userId=${userId}` : ''}`);
        } else {
            toast.error('Error posting comment', { id: 'commentPostError' });
        }
    };

    return {
        updateCommentContent,
        updateCommentUpvote,
        updateCommentDownvote,
    };
}