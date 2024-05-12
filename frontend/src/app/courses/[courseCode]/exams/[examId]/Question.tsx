'use client';
import Accordion from '@/components/Accordion';
import Card from '@/components/Card';
import { Question as IQuestion } from '@/types';
import useComments from '@/api/useComments';
import { useMemo, useState } from 'react';
import Comment from '@/components/Comment';
import useUpdateComments from '@/api/useUpdateComments';
import usePostComment from '@/api/usePostComment';
import EditableComment from '@/components/EditableComment';
import { useUser } from '@auth0/nextjs-auth0/client';
import * as net from 'net';

function Question({question}: { question: IQuestion }) {
    const { user } = useUser();

    const { comments, isLoading, isError } = useComments(question.questionId);

    const {
        updateCommentContent,
        updateCommentUpvote,
        updateCommentDownvote,
    } = useUpdateComments(question.questionId);

    const { postComment } = usePostComment(question.questionId);

    const [editing, setEditing] = useState(false);

    const commentContent = useMemo(() => (
        comments?.map((c) => (
            <Comment
                updateCommentContent={updateCommentContent}
                updateCommentDownvote={updateCommentDownvote}
                updateCommentUpvote={updateCommentUpvote}
                key={c.commentId}
                comment={c}
                postComment={(parentCommentId, newText, newPng) => {
                    postComment(user?.sub || '', newText || '', newPng, parentCommentId);
                }}
            />
        ))
    ), [comments, editing]);

    return (
        <Card>
            <p>{question.questionText}</p>
            <Accordion key={question.questionId} preview="Answers" content={(
                <div className="flex flex-col gap-3">
                    {editing ? (
                        <EditableComment onCancel={() => setEditing(false)} onSubmit={(newText, newPng) => {
                            postComment(user?.sub || '', newText || '', newPng, null);
                            setEditing(false);
                        }}/>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            type="button"
                            className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                        >
                            Add Answer
                        </button>
                    )}
                    { commentContent }
                </div>
            )}/>
        </Card>
    );
}

export default Question;