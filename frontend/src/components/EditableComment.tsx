import { Comment as IComment } from '@/types';
import { IconArrowDown, IconArrowUp, IconPaperclip } from '@tabler/icons-react';
import { useState } from 'react';

function Upvote({count, selected, onClick}: { count: number, selected: boolean, onClick: () => void }) {
    return (
        <div className="flex">
            <button onClick={onClick}>
                <IconArrowUp color={selected ? 'orange' : 'white'}/>
            </button>
            <p>{count}</p>
        </div>
    );
}

function Downvote({count, selected, onClick}: { count: number, selected: boolean, onClick: () => void }) {
    return (
        <div className="flex">
            <button onClick={onClick}>
                <IconArrowDown color={selected ? 'red' : 'white'}/>
            </button>
            <p>{count}</p>
        </div>
    );
}

export function EditableComment({ comment, onCancel, onSubmit }: { comment?: IComment, onCancel:() => void, onSubmit:() => void }) {
    const [text, setText] = useState(comment?.commentText);
    const [img, setImg] = useState(comment?.commentPNG);

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
                    <form action="#" className="relative">
                        <div
                            className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                            <label htmlFor="comment" className="sr-only">
                                Add an answer...
                            </label>
                            <textarea
                                rows={3}
                                name="comment"
                                id="comment"
                                className="block w-full resize-none border-0 bg-transparent py-1.5 text-zinc-900 dark:text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="Add an answer..."
                                defaultValue={''}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />

                            {/* Spacer element to match the height of the toolbar */}
                            <div className="py-2" aria-hidden="true">
                                {/* Matches height of button in toolbar (1px border + 36px content height) */}
                                <div className="py-px">
                                    <div className="h-9"/>
                                </div>
                            </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                            <div className="flex items-center space-x-5">
                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                                    >
                                        <IconPaperclip/>
                                        <span className="hidden">Attach a file</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={onCancel}
                                    type="button"
                                    className="mr-3 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditableComment;