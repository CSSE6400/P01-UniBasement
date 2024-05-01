import { Comment as IComment } from '@/types';

export default function Comment({ comment }: { comment: IComment }) {
    return (
        <div className="ml-5 block max-w-sm p-1 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" >
            <h1 className="p-2">(id: {comment.commentId}) | {comment.commentText}</h1>
            <p className="pl-8 p-2 ">reply</p>
            {comment.children?.map((c) => <Comment key={c.commentId} comment={c} />)}
        </div>
    )
}