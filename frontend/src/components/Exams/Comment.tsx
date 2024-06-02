import { Comment as IComment } from '@/types';
import { useState } from 'react';
import EditableComment from '@/components/Exams/EditableComment';
import { useUser } from '@auth0/nextjs-auth0/client';
import ContentForm from '@/components/Exams/ContentForm';
import { Downvote, Upvote } from '@/components/Exams/CommentVotes';

export function sortCommentsByUpvotes(a: IComment, b: IComment) {
    if (a.upvotes > b.upvotes) {
        return -1;
    } else if (a.upvotes < b.upvotes) {
        return 1;
    } else {
        return 0;
    }
}

type CommentProps = {
    comment: IComment
    updateCommentContent: (userId: string, commentId: number, commentText: string | null, commentPNG: File | null) => Promise<void>
    updateCommentUpvote: (userId: string, commentId: number) => Promise<void>
    updateCommentDownvote: (userId: string, commentId: number) => Promise<void>
    deleteComment: (userId: string, commentId: number) => Promise<void>
    postComment: (parentCommentId: number | null, newText: string | null, newPng: File | null) => Promise<void>
}
export default function Comment({
    comment,
    updateCommentContent,
    updateCommentUpvote,
    updateCommentDownvote,
    deleteComment,
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
                        src={comment.picture || ''}
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
                        <ContentForm
                            initialText={comment.commentText}
                            initialPNG={comment.commentPNG}
                            onCancel={() => setEditing(false)}
                            onSubmit={async (newText, newPng) => {
                                await updateCommentContent(user?.sub || '', comment.commentId, newText, newPng);
                                setEditing(false);
                            }}
                        />
                    ) : (
                        <div
                            className="min-h-[120px] p-4 flex flex-col justify-between rounded-lg shadow-sm ring-1 ring-inset ring-gray-700 focus-within:ring-2 focus-within:ring-emerald-500"
                        >
                            {comment.commentText}
                            {!!comment.commentPNG && (
                                <img
                                    src={comment.commentPNG}
                                    alt="Comment"
                                    className="w-full my-3"
                                />
                            )}
                            {!comment.isDeleted && (
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
                                    <div className="flex-1"/>
                                    {(comment.userId === user?.sub) && (
                                        <button
                                            onClick={async () => await deleteComment(user?.sub || '', comment.commentId)}
                                            type="button"
                                            className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                                        >
                                            Delete
                                        </button>
                                    )}
                            </div>
                            )}
                        </div>
                    )}
                    {replying && (
                        <EditableComment
                            onCancel={() => setReplying(false)}
                            onSubmit={async (newText, newPng) => {
                                await postComment(comment.commentId, newText, newPng);
                                setReplying(false);
                            }}
                            userImg={user?.picture}
                        />
                    )}
                    {comment.children?.sort(sortCommentsByUpvotes)?.map(
                        (ch) => <Comment
                            postComment={postComment}
                            comment={ch}
                            key={ch.commentId}
                            updateCommentContent={updateCommentContent}
                            updateCommentDownvote={updateCommentDownvote}
                            updateCommentUpvote={updateCommentUpvote}
                            deleteComment={deleteComment}
                        />,
                    )}
                </div>
            </div>
        </div>
    );
}