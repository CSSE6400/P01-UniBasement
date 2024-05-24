import { forwardRef, SelectHTMLAttributes } from 'react';

const Select = forwardRef<HTMLSelectElement, {
    label: string,
    options: { label: string, value: any }[]
} & SelectHTMLAttributes<HTMLSelectElement>>(({
    label,
    options,
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
            <select
                {...inputProps}
                ref={ref}
                className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
            >
                {options.map((opt) => (
                    <option
                        key={opt.value}
                        value={opt.value}
                        className="bg-white dark:bg-gray-800 dark:text-white"
                    >
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
});

Select.displayName = 'Select';

export default Select;