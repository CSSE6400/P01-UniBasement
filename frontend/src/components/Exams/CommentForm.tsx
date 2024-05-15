import { Comment as IComment } from '@/types';
import { IconPaperclip, IconX } from '@tabler/icons-react';
import { useRef, useState } from 'react';

export function CommentForm({ comment, onCancel, onSubmit }: {
    comment?: IComment,
    onCancel: () => void,
    onSubmit: (newText?: string, newPng?: File) => void
}) {
    const [text, setText] = useState(comment?.commentText);
    const [imgText, setImgText] = useState(comment?.commentPNG);
    const [img, setImg] = useState<File>();
    const imgRef = useRef<HTMLInputElement>(null);

    return (
        <form className="relative">
            <div
                className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-700 focus-within:ring-2 focus-within:ring-emerald-500"
            >
                <label
                    htmlFor="comment"
                    className="sr-only"
                >
                    Add an answer...
                </label>
                <textarea
                    autoFocus
                    rows={3}
                    name="comment"
                    id="comment"
                    className="block w-full resize-none border-0 bg-transparent p-4 text-zinc-900 dark:text-white placeholder:text-gray-400 focus:ring-0 sm:leading-6"
                    placeholder="Add an answer..."
                    defaultValue={''}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                {/* Spacer element to match the height of the toolbar */}
                <div
                    className="py-2"
                    aria-hidden="true"
                >
                    {/* Matches height of button in toolbar (1px border + 36px content height) */}
                    <div className="py-px">
                        <div className="h-9"/>
                    </div>
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex justify-between p-4">
                <div className="flex items-center space-x-5">
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                            onClick={() => imgRef?.current?.click()}
                        >
                            <IconPaperclip/>
                            <span className="hidden">Attach a file</span>
                            <input
                                onChange={(e) => {
                                    setImg(e.target.files?.[0]);
                                    setImgText(e.target.files?.[0]?.name);
                                }}
                                multiple={false}
                                ref={imgRef}
                                type="file"
                                hidden
                            />
                        </button>
                        {imgText && (
                            <p className="ml-3 flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">{imgText}</p>
                        )}
                        {!!img && (
                            <button
                                type="button"
                                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                                onClick={() => {
                                    setImg(undefined);
                                    setImgText(null);
                                }}
                            >
                                <IconX/>
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex-shrink-0 flex gap-3 ">
                    <button
                        onClick={onCancel}
                        type="button"
                        className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit(text, img)}
                        type="button"
                        className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                    >
                        Post
                    </button>
                </div>
            </div>
        </form>
    );
}

export default CommentForm;