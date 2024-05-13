import { Comment as IComment } from '@/types';
import CommentForm from '@/components/Exams/CommentForm';
import { Downvote, Upvote } from '@/components/Exams/CommentVotes';

export function EditableComment({ comment, onCancel, onSubmit }: { comment?: IComment, onCancel:() => void, onSubmit:(newText?: string, newPng?: any) => void }) {
    return (
        <>
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 flex flex-col gap-1">
                    <img
                        className="inline-block h-10 w-10 rounded-full mb-2"
                        src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                    />
                    {!!comment && (
                        <>
                            <Upvote count={10} selected onClick={() => {}}/>
                            <Downvote count={20} selected={false} onClick={() => {}}/>
                        </>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <CommentForm comment={comment} onSubmit={onSubmit} onCancel={onCancel} />
                </div>
            </div>
        </>
    );
}

export default EditableComment;