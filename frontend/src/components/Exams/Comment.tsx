import { Comment as IComment } from '@/types';
import { useState } from 'react';
import EditableComment from '@/components/Exams/EditableComment';
import { useUser } from '@auth0/nextjs-auth0/client';
import CommentForm from '@/components/Exams/CommentForm';
import { Downvote, Upvote } from '@/components/Exams/CommentVotes';

type CommentProps = {
    comment: IComment
    updateCommentContent: (userId: string, commentId: number, commentText: string, commentPNG: any) => Promise<void>
    updateCommentUpvote: (userId: string, commentId: number) => Promise<void>
    updateCommentDownvote: (userId: string, commentId: number) => Promise<void>
    postComment: (parentCommentId: number | null, newText?: string, newPng?: any) => Promise<void>
}
export default function Comment({
    comment,
    updateCommentContent,
    updateCommentUpvote,
    updateCommentDownvote,
    postComment,
}: CommentProps) {
    const { user } = useUser();
    const [replying, setReplying] = useState(false);
    const [editing, setEditing] = useState(false);

    return (
        <div>
            <div className="flex items-stretch space-x-4">
                <div className="flex-shrink-0 flex flex-col gap-1">
                    <img
                        className="inline-block h-10 w-10 rounded-full mb-2"
                        src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                    />
                    <Upvote
                        count={comment.upvotes}
                        selected={comment.upvoted}
                        onClick={user ? async () => await updateCommentUpvote(user.sub || '', comment.commentId) : () => {
                        }}
                    />
                    <Downvote
                        count={comment.downvotes}
                        selected={comment.downvoted}
                        onClick={user ? async () => await updateCommentDownvote(user.sub || '', comment.commentId) : () => {
                        }}
                    />
                </div>
                <div className="min-w-0 flex-1 flex flex-col gap-3">
                    {editing ? (
                        <CommentForm
                            comment={comment}
                            onCancel={() => setEditing(false)}
                            onSubmit={async (newText?: string, newPng?: any) => {
                                await updateCommentContent(user?.sub || '', comment.commentId, newText || '', newPng);
                                setEditing(false);
                            }}
                        />
                    ) : (
                        <div
                            className="min-h-[120px] p-4 flex flex-col justify-between rounded-lg shadow-sm ring-1 ring-inset ring-gray-700 focus-within:ring-2 focus-within:ring-emerald-500"
                        >
                            {comment.commentText}
                            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400 font-medium">{comment.commentPNG}</p>
                            <div className="flex flex-row gap-3">
                                <button
                                    onClick={() => setReplying(true)}
                                    type="button"
                                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                                >
                                    Reply
                                </button>
                                {(comment.userId === user?.sub) && (
                                    <button
                                        onClick={() => setEditing(true)}
                                        type="button"
                                        className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    {replying && (
                        <EditableComment
                            onCancel={() => setReplying(false)}
                            onSubmit={async (newText, newPng) => {
                                await postComment(comment.commentId, newText || '', newPng);
                                setReplying(false);
                            }}
                        />
                    )}
                    {comment.children?.map(
                        (ch) => <Comment
                            postComment={postComment}
                            comment={ch}
                            key={ch.commentId}
                            updateCommentContent={updateCommentContent}
                            updateCommentDownvote={updateCommentDownvote}
                            updateCommentUpvote={updateCommentUpvote}
                        />,
                    )}
                </div>
            </div>
        </div>
    );
}