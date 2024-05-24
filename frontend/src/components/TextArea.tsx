import { forwardRef, TextareaHTMLAttributes } from 'react';


const TextArea = forwardRef<HTMLTextAreaElement, { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>>(({
    label,
    ...inputProps
}, ref) => {
    return (
        <div className="mb-5">
            {!!label && (
                <label
                    htmlFor={inputProps.id}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    {label}
                </label>
            )}
            <textarea
                {...inputProps}
                className="block p-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                ref={ref}
            />
        </div>
    );
});

TextArea.displayName = 'TextArea';

export default TextArea;