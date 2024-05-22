'use client';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import CourseCard from '@/components/CourseCard';
import { usePinned } from '@/api/usePins';
import { DisplayCourse } from '@/types';
import Image from 'next/image';
import uq from '@/images/logos/uq.svg';
import uqWhite from '@/images/logos/uq-white.svg';
import unibasement from '@/images/logos/unibasement.svg';
import unibasementWhite from '@/images/logos/unibasement-white.svg';
import useRecentChanges from '@/api/useRecentChanges';

function SearchIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"
            />
        </svg>
    );
}

function CourseSearch() {
    return (
        <div className="group relative flex h-12">
            <SearchIcon className="pointer-events-none absolute left-3 top-0 h-full w-5 stroke-zinc-500"/>
            <input
                className="max-w-full flex-grow appearance-none bg-transparent pl-10 text-zinc-900 outline-none placeholder:text-zinc-500 focus:w-full focus:flex-none sm:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        // In Safari, closing the dialog with the escape key can sometimes cause the scroll position to jump to the
                        // bottom of the page. This is a workaround for that until we can figure out a proper fix in Headless UI.
                        if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                        }
                    }
                }}
                placeholder="Find a course or exam"
            />
            <div className=""></div>
        </div>
    );
}

function LoginHome() {
    const { user, error, isLoading } = useUser();
    const { pinned } = usePinned();
    const { recentChanges } = useRecentChanges();
    const greeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 5) {
            return 'Wtf why you up at this hour';
        } else if (currentHour < 12) {
            return 'Good morning';
        } else if (currentHour < 18) {
            return 'Good afternoon';
        } else {
            return 'Good evening';
        }
    };
    return (
        <>
            <div className="mx-auto max-w-4xl text-zinc-900 dark:text-white">
                <div className="mt-8 items-center justify-center lg:flex">
                    <div className="">
                        <div className="mt-8 text-3xl font-bold">
                            {greeting()}, {user?.nickname}
                        </div>
                    </div>
                </div>
                <div className="flex min-h-60 items-center justify-center">
                    <div className="w-full max-w-4xl space-y-10">
                        <div className="text-xl text-zinc-900 dark:text-white">
                            Pinned Courses
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row">
                            <ul
                                role="list"
                                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                            >
                                {pinned
                                    .filter((value: DisplayCourse) => value.pinned === true)
                                    .map((value) => (
                                        <CourseCard
                                            key={value.code}
                                            course={value}
                                        />
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="min-h-60 items-center justify-center">
                    <div className="w-full max-w-4xl space-y-10">
                        <div className="text-xl text-zinc-900 dark:text-white">
                            Recent Activity
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row">
                            <ul
                                role="list"
                                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                            >{
                                recentChanges?.map((c) => (
                                    <div key={c.commentId}>
                                        {c.commentText}
                                    </div>
                                ))
                            }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function SignupHome() {
    return (
        <>
            <div className="mx-auto max-w-4xl text-zinc-900 dark:text-white flex flex-col justify-between gap-10">
                <div className="mt-8 flex flex-col items-center justify-center lg:flex">
                    <div>
                        <Image
                            src={unibasementWhite.src}
                            alt="Logo"
                            width={666}
                            height={666}
                            className="mx-auto dark:hidden"
                        />
                        <Image
                            src={unibasement.src}
                            alt="Logo"
                            width={666}
                            height={666}
                            className="mx-auto hidden dark:block"
                        />
                    </div>
                    <div className="max-w-96 text-center text-3xl font-bold sm:mx-auto">
                        <div className="sm:my-8">
                            Enhance your exam revision and level up with the community!
                        </div>
                        <div className="flex flex-col">
                            <a
                                href="/api/auth/login"
                                className="rounded bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300 dark:hover:ring-emerald-300 inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition mx-auto mt-2 max-w-xs"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-16 flex flex-col items-center justify-between border-t border-zinc-900/5 pt-8 sm:flex-row dark:border-white/5"></div>
                <div className="w-full">
                    <div className="text-center mb-2 font-light text-xl">
                        Working with the following to give you all the exam prepartion you
                        need
                    </div>
                    <div className="mx-auto flex items-center justify-center rounded-full">
                        <IconChevronLeft className="mr-8"/>
                        <div className="my-4 ml-1 flex">
                            <Image
                                src={uq.src}
                                alt="University of Queensland Logo"
                                width={300}
                                height={300}
                                className="dark:hidden"
                            ></Image>
                            <Image
                                src={uqWhite.src}
                                alt="University of Queensland Logo"
                                width={300}
                                height={300}
                                className="hidden dark:block"
                            ></Image>
                        </div>
                        <IconChevronRight className="ml-8"/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function Home() {
    const { user } = useUser();
    return <main className="h-full">{user ? <LoginHome/> : <SignupHome/>}</main>;
}
