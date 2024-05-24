import { forwardRef, InputHTMLAttributes } from 'react';


const Input = forwardRef<HTMLInputElement, { label: string } & InputHTMLAttributes<HTMLInputElement>>(({
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
            <input
                {...inputProps}
                className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                ref={ref}
            />
        </div>
    );
});

Input.displayName = 'Input';

export default Input;