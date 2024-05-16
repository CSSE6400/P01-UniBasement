import Accordion from '@/components/Accordion';
import Card from '@/components/Card';
import { Question as IQuestion } from '@/types';
import useComments from '@/api/useComments';
import { useMemo, useState } from 'react';
import Comment, { sortCommentsByUpvotes } from '@/components/Exams/Comment';
import useUpdateComments from '@/api/useUpdateComments';
import usePostComment from '@/api/usePostComment';
import EditableComment from '@/components/Exams/EditableComment';
import { useUser } from '@auth0/nextjs-auth0/client';
import ContentForm from '@/components/Exams/ContentForm';

function Question({ question, updateQuestionContent }: {
    question: IQuestion,
    updateQuestionContent: (userId: string, questionId: number, questionText: string | null, questionPNG: File | null) => Promise<void>
}) {
    const { user } = useUser();

    const { comments, isLoading, isError } = useComments(question.questionId, user?.sub);

    const {
        updateCommentContent,
        updateCommentUpvote,
        updateCommentDownvote,
    } = useUpdateComments(question.questionId);

    const { postComment } = usePostComment(question.questionId);


    const [addingComment, setAddingComment] = useState(false);
    const [editing, setEditing] = useState(false);

    const commentContent = useMemo(() => (
        comments?.sort(sortCommentsByUpvotes)?.map((c) => (
            <Comment
                updateCommentContent={updateCommentContent}
                updateCommentDownvote={updateCommentDownvote}
                updateCommentUpvote={updateCommentUpvote}
                key={c.commentId}
                comment={c}
                postComment={async (parentCommentId, newText, newPng) => {
                    await postComment(user?.sub || '', newText, newPng, parentCommentId);
                }}
            />
        ))
    ), [comments, postComment, updateCommentContent, updateCommentDownvote, updateCommentUpvote, user?.sub]);

    return (
        <Card>
            {editing ? (
                <ContentForm
                    initialText={question.questionText}
                    initialPNG={question.questionPNG}
                    onCancel={() => setEditing(false)}
                    onSubmit={async (newText, newPng) => {
                        await updateQuestionContent(user?.sub || '', question.questionId, newText, newPng);
                        setEditing(false);
                    }}
                />
            ) : (
                <>
                    <p>{question.questionText}</p>
                    {!!question.questionPNG && (
                        <img
                            src={question.questionPNG}
                            alt="Question"
                            className="w-full my-3"
                        />
                    )
                    }
                    <button
                        onClick={() => setEditing(true)}
                        type="button"
                        className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                    >
                        Edit
                    </button>
                </>
            )}
            <Accordion
                key={question.questionId}
                preview="Answers"
                content={(
                    <div className="flex flex-col gap-3">
                        {addingComment ? (
                            <EditableComment
                                onCancel={() => setAddingComment(false)}
                                onSubmit={async (newText, newPng) => {
                                    await postComment(user?.sub || '', newText, newPng, null);
                                    setAddingComment(false);
                                }}
                            />
                        ) : (
                            <button
                                onClick={() => setAddingComment(true)}
                                type="button"
                                className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                            >
                                Add Answer
                            </button>
                        )}
                        {commentContent}
                    </div>
                )}
            />
        </Card>
    );
}

export default Question;