'use client';
import useComments from '@/api/useComments';
import Comment from '@/components/Comment';

export default function Question({ params }: { params: { courseCode: string, examId: number, questionId: number }}) {
    const { comments, isLoading, isError } = useComments(params.questionId);

    return (
        <main>
            {isLoading && <p>Loading...</p>}
            {!isError && !isLoading && comments?.map(comment => (
                <>
                    <hr />
                    <Comment comment={comment} />
                </>
                ))
            }
        </main>
    );
}