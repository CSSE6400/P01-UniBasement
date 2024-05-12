import { Comment as IComment } from '@/types';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import { useState } from 'react';
import EditableComment from '@/components/EditableComment';

function Upvote({count, selected, onClick}: {count: number, selected: boolean, onClick: () => void}) {
    return (
        <div className="flex">
            <button onClick={onClick}>
                <IconArrowUp color={selected ? 'orange' : 'white'} />
            </button>
            <p>{count}</p>
        </div>
    )
}
function Downvote({count, selected, onClick}: {count: number, selected: boolean, onClick: () => void}) {
    return (
        <div className="flex">
            <button onClick={onClick}>
                <IconArrowDown color={selected ? 'red' : 'white'} />
            </button>
            <p>{count}</p>
        </div>
    )
}

export default function Comment({ comment }: { comment: IComment }) {
    const [replying, setReplying] = useState(false)
    return (
        <div>
            <div className="flex items-stretch space-x-4">
                <div className="flex-shrink-0 flex flex-col gap-1">
                    <img
                        className="inline-block h-10 w-10 rounded-full mb-2"
                        src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                    />
                    <Upvote count={10} selected onClick={() => {
                    }}/>
                    <Downvote count={20} selected={false} onClick={() => {
                    }}/>
                </div>
                <div className="min-w-0 flex-1 flex flex-col gap-3">
                    <div className="min-h-[120px] p-4 flex flex-col justify-between rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                        {comment.commentText}
                        <button onClick={() => setReplying(true)} type="button" className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">Reply</button>
                    </div>
                    {replying && (<EditableComment onCancel={() => setReplying(false)} onSubmit={() => {}} />)}
                    {comment.children?.map((ch) => <Comment comment={ch} key={ch.commentId} />)}
                </div>
            </div>
        </div>
    );
}