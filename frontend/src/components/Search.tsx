/**
 * This file was taken from a Tailwind UI Template but modified by us.
 */

'use client';

import { Fragment, Suspense, useEffect, useId, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import useCourses from '@/api/useCourses';
import { IconSearch } from '@tabler/icons-react';

type CourseResult = {
    courseCode: string
    url: string
    title: string
}

function NoResultsIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.01 12a4.237 4.237 0 0 0 1.24-3c0-.62-.132-1.207-.37-1.738M12.01 12A4.237 4.237 0 0 1 9 13.25c-.635 0-1.237-.14-1.777-.388M12.01 12l3.24 3.25m-3.715-9.661a4.25 4.25 0 0 0-5.975 5.908M4.5 15.5l11-11"
            />
        </svg>
    );
}

function HighlightQuery({ text, query }: { text: string; query: string }) {
    return (
        <Highlighter
            highlightClassName="underline bg-transparent text-emerald-500"
            searchWords={[query]}
            autoEscape={true}
            textToHighlight={text}
        />
    );
}

function SearchResult({
    result,
    resultIndex,
    query,
    onClick,
}: {
    result: CourseResult
    resultIndex: number
    query: string
    onClick?: (result: CourseResult) => void
}) {
    const id = useId();

    return (
        <li
            className={clsx(
                'group block cursor-default px-4 py-3 aria-selected:bg-zinc-50 dark:aria-selected:bg-zinc-800/50',
                resultIndex > 0 && 'border-t border-zinc-100 dark:border-zinc-800',
            )}
            aria-labelledby={`${id}-hierarchy ${id}-title`}
            onClick={() => onClick?.(result)}
        >
            <div
                id={`${id}-title`}
                aria-hidden="true"
                className="text-sm font-medium text-zinc-900 group-aria-selected:text-emerald-500 dark:text-white cursor-pointer"
            >
                <HighlightQuery
                    text={result.title}
                    query={query}
                />
            </div>
        </li>
    );
}

function SearchResults({
    query,
    courseResults,
    onResultClick,
}: {
    query: string
    courseResults: CourseResult[]
    onResultClick?: (result: CourseResult) => void
}) {
    if (courseResults.length === 0) {
        return (
            <div className="p-6 text-center">
                <NoResultsIcon className="mx-auto h-5 w-5 stroke-zinc-900 dark:stroke-zinc-600"/>
                <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-400">
                    Nothing found for{' '}
                    <strong className="break-words font-semibold text-zinc-900 dark:text-white">
                        &lsquo;{query}&rsquo;
                    </strong>
                    . Please try again.
                </p>
            </div>
        );
    }

    return (
        <ul>
            {courseResults.map((result, resultIndex) => (
                <SearchResult
                    key={result.url}
                    result={result}
                    resultIndex={resultIndex}
                    query={query}
                    onClick={onResultClick}
                />
            ))}
        </ul>
    );
}

function SearchInput({ query, setQuery, onKeyDown }: {
    query?: string
    setQuery: (query: string) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}) {
    return (
        <div className="group relative flex h-12">
            <IconSearch className="pointer-events-none absolute left-3 top-0 h-full w-5 stroke-zinc-500"/>
            <input
                className={clsx(
                    'flex-auto appearance-none bg-transparent pl-10 text-zinc-900 outline-none placeholder:text-zinc-500 focus:w-full focus:flex-none sm:text-sm dark:text-white [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden',
                    'pr-4',
                    'focus:ring-emerald-400 focus:border-emerald-400',
                )}
                onKeyDown={onKeyDown}
                onChange={(event) => {
                    setQuery(event.target.value);
                }}
                placeholder="Find courses..."
                value={query}
            />
        </div>
    );
}

function SearchDialog({
    open,
    setOpen,
    className,
    courses,
}: {
    open: boolean
    setOpen: (open: boolean) => void
    className?: string
    courses?: CourseResult[]
}) {
    let pathname = usePathname();
    let searchParams = useSearchParams();

    const router = useRouter();

    const [query, setQuery] = useState<string>('');
    const result = useMemo(() => {
        if (!query) {
            return courses;
        }

        return courses?.filter((value) => value.courseCode.toLowerCase().includes(query.toLowerCase()));
    }, [courses, query]);

    useEffect(() => {
        setOpen(false);
    }, [pathname, searchParams, setOpen]);

    useEffect(() => {
        if (open) {
            return;
        }

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpen(true);
            }
        }

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [open, setOpen]);

    const onClose = () => {
        setQuery('');
        setOpen(false);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            onClose();
        }

        if (event.key === 'Enter') {
            const firstResult = result?.[0];
            if (firstResult) {
                window.location.href = firstResult.url;
            }
        }
    };

    const onResultClick = ({ url }: CourseResult) => {
        if (!url) {
            return;
        }

        router.push(url);

        if (
            url ===
            window.location.pathname + window.location.search + window.location.hash
        ) {
            onClose();
        }
    };

    return (
        <Transition.Root
            show={open}
            as={Fragment}
            afterLeave={() => setQuery('')}
        >
            <Dialog
                onClose={onClose}
                className={clsx('fixed inset-0 z-50', className)}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-zinc-400/25 backdrop-blur-sm dark:bg-black/40"/>
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="mx-auto transform-gpu overflow-hidden rounded-lg bg-zinc-50 shadow-xl ring-1 ring-zinc-900/7.5 sm:max-w-xl dark:bg-zinc-900 dark:ring-zinc-800">
                            <div>
                                <SearchInput
                                    query={query}
                                    setQuery={setQuery}
                                    onKeyDown={onKeyDown}
                                />
                                <div
                                    className="border-t border-zinc-200 bg-white empty:hidden dark:border-zinc-100/5 dark:bg-white/2.5"
                                >
                                    {open && (
                                        <SearchResults
                                            query={query}
                                            courseResults={result || []}
                                            onResultClick={onResultClick}
                                        />
                                    )}
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export function Search() {
    const [modifierKey, setModifierKey] = useState<string>();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setModifierKey(
            /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl ',
        );
    }, []);

    const { courses } = useCourses();
    const courseItems = useMemo(() => courses?.map((value) => ({
        courseCode: value.courseCode,
        url: `/courses/${value.courseCode}`,
        title: value.courseCode,
    })), [courses]);

    return (
        <div className="hidden lg:block lg:max-w-md lg:flex-auto">
            <button
                type="button"
                className="hidden h-8 w-full items-center gap-2 rounded-full bg-white pl-2 pr-3 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 ui-not-focus-visible:outline-none lg:flex dark:bg-white/5 dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20"
                onClick={() => setOpen(true)}
            >
                <IconSearch className="h-5 w-5 stroke-current"/>
                Find courses...
                <kbd className="ml-auto text-2xs text-zinc-400 dark:text-zinc-500">
                    <kbd className="font-sans">{modifierKey}</kbd>
                    <kbd className="font-sans">K</kbd>
                </kbd>
            </button>
            <Suspense fallback={null}>
                <SearchDialog
                    className="hidden lg:block"
                    courses={courseItems}
                    open={open}
                    setOpen={setOpen}
                />
            </Suspense>
        </div>
    );
}

export function MobileSearch() {
    const [open, setOpen] = useState(false);

    const { courses } = useCourses();
    const courseItems = useMemo(() => courses?.map((value) => ({
        courseCode: value.courseCode,
        url: `/courses/${value.courseCode}`,
        title: value.courseCode,
    })), [courses]);

    return (
        <div className="contents lg:hidden">
            <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 ui-not-focus-visible:outline-none lg:hidden dark:hover:bg-white/5"
                aria-label="Find courses..."
                onClick={() => setOpen(true)}
            >
                <IconSearch className="h-5 w-5 stroke-zinc-900 dark:stroke-white"/>
            </button>
            <Suspense fallback={null}>
                <SearchDialog
                    className="lg:hidden"
                    courses={courseItems}
                    open={open}
                    setOpen={setOpen}
                />
            </Suspense>
        </div>
    );
}
