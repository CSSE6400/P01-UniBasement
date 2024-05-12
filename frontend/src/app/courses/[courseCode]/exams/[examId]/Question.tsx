'use client';
import Accordion from '@/components/Accordion';
import Card from '@/components/Card';
import { Question as IQuestion } from '@/types';
import useComments from '@/api/useComments';
import { useMemo } from 'react';

function Question({question}: { question: IQuestion }) {
    const { comments, isLoading, isError } = useComments(question.questionId);

    const commentContent = useMemo(() => (
        !!comments && (
            <div>
                {comments?.map((c) => (
                    <div key={c.commentId}>{c.commentId} {c.commentText}</div>
                ))}
            </div>
        )
    ), [comments]);

    return (
        <Card>
            <p>{question.questionText}</p>
            <Accordion key={question.questionId} preview="Answers" content={commentContent}/>
        </Card>
    );
}

export default Question;