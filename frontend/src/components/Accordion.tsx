import { ReactNode, useState } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

function Accordion({ preview, content, forceOpen }: { preview: ReactNode, content: ReactNode, forceOpen?: boolean }) {
    const [open, setOpen] = useState(false);

    return (
        <div id="accordion-collapse">
            <h2 id="accordion-collapse-heading">
                <button
                    type="button"
                    className="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 dark:text-gray-400 gap-3"
                    onClick={() => setOpen((prevOpen) => !prevOpen)}
                >
                    {preview}
                    {(open || forceOpen) ? <IconChevronDown/> : <IconChevronUp/>}
                </button>
            </h2>
            <div
                id="accordion-collapse-body"
                className={`${(open || forceOpen) ? '' : 'hidden'}`}
            >
                {content}
            </div>
        </div>

    );
}

export default Accordion;