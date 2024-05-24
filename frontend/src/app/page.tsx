'use client';
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
import Card from '@/components/Card';

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
                <div className="flex min-h-60 items-center justify-center mt-8">
                    <div className="w-full max-w-4xl">
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
                <div className="min-h-60 items-center justify-center mt-8">
                    <div className="w-full max-w-4xl">
                        <div className="text-xl text-zinc-900 dark:text-white">
                            Recent Activity
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row w-full">
                            <ul
                                role="list"
                                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full"
                            >{
                                recentChanges?.map((c) => (
                                    <Card key={c.courseCode}>
                                        <h3 className="text-md font-semibold leading-7 text-zinc-900 dark:text-white mb-2">{c.courseCode}</h3>
                                        {c.exams.map((e) => (
                                            <p key={e.examId}><a
                                                className="text-emerald-300 hover:underline"
                                                href={`/courses/${c.courseCode}/exams/${e.examId}`}
                                            >{e.examYear} {e.examSemester} {e.examType}</a> had {e.changes} new answers
                                            </p>
                                        ))}
                                    </Card>
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
