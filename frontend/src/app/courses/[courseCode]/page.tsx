'use client';
import useCourse from '@/api/useCourse';
import useExams from '@/api/useExams';
import { Course, Exam } from '@/types';
import requireAuth from '@/app/requireAuth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IconStarFilled } from '@tabler/icons-react';
import Card from '@/components/Card';
import { useUser } from '@auth0/nextjs-auth0/client';
import useUpdateCourse from '@/api/useUpdateCourse';
import Link from 'next/link';
import Title from '@/components/Title';

function CourseDescription({ course }: { course: Course }) {

    return (
        <div>
            <p>{course!.courseDescription}</p>
        </div>

    );
}

function mapExamsBySemester(exams: Exam[]) {
    let examsByYear: { [k: number]: { [k: number]: Exam[] } } = {};
    exams.forEach(exam => {
        if (examsByYear[exam.examYear]) {
            if (examsByYear[exam.examYear][exam.examSemester]) {
                examsByYear[exam.examYear][exam.examSemester].push(exam);
            } else {
                examsByYear[exam.examYear][exam.examSemester] = [exam];
            }
        } else {
            examsByYear[exam.examYear] = { [exam.examSemester]: [exam] };
        }
    });
    return examsByYear;
}

function CourseExams({ course }: { course: Course }) {
    const { exams, isError, isLoading } = useExams(course!.courseCode);

    const groupedExams = useMemo(() => exams ? mapExamsBySemester(exams) : {}, [exams]);

    return (
        <div>
            {isLoading && (
                <div role="status" className="absolute left-[50%] top-[50%]">
                    <svg aria-hidden="true"
                         className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-emerald-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            )}
            {!isError && !isLoading && (
                !!exams?.length ? (
                    <div className="grid grid-cols-1 gap-3">
                        {Object.entries(groupedExams).map(([year, semesters]) => (
                            <div
                                key={year}
                                className="pb-5"
                            >
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {year}
                                </h5>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.entries(semesters).map(([sem, semExams]) => (
                                        <div key={sem}>
                                            <h5 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                                Semester {sem}
                                            </h5>
                                            <div className="grid grid-cols-1 gap-3">
                                                {semExams.map(exam => (
                                                    <Link
                                                        href={`/courses/${course.courseCode}/exams/${exam.examId}`}
                                                    key={exam.examId}
                                                >
                                                    <Card>
                                                        <h5 className="text-lg tracking-tight text-gray-900 dark:text-white">
                                                            {exam!.examType}
                                                        </h5>
                                                    </Card>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                ) : (
                    <p className="text-xl text-zinc-900 dark:text-white">No exams available</p>
                )
            )}
        </div>

    );
}


function CourseRating({course}: { course: Course }) {
    const [rating, setRating] = useState(Number(localStorage.getItem('rating')) || 0);
    const [tempRating, setTempRating] = useState(rating);

    const { user, error, isLoading } = useUser();
    const { updateCourseRating } = useUpdateCourse(course.courseCode);

    const handleSaveRating = useCallback(async (starId: number) => {
        setRating(starId);
        localStorage.setItem('rating', starId.toString());
        await updateCourseRating(user?.sub || '', starId);
    }, [user, updateCourseRating]);

    useEffect(() => {
        setTempRating(rating);
    }, [rating]);

    const ratingStars = useMemo(() => (
        [...Array(5)].map((_, i) => {
            const starId = i + 1;
            return (
                <span
                    key={starId}
                    className={`cursor-pointer text-2xl mx-1 ${starId <= tempRating ? 'text-yellow-400' : 'text-gray-300'}`}
                    onMouseOver={() => setTempRating(starId)}
                    onMouseOut={() => setTempRating(rating)}
                    onClick={async () => await handleSaveRating(starId)}
                >
                    <IconStarFilled/>
                </span>
            );
        })
    ), [rating, tempRating, handleSaveRating]);

    return (
        <div>
            {isLoading && (
                <div role="status" className="absolute left-[50%] top-[50%]">
                    <svg aria-hidden="true"
                         className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-emerald-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            )}
            {!user && (
                <div>
                    Please login to leave your rating
                </div>
            )}
            {!error && !isLoading && user && (
                <Card>
                    <div>
                        <h2 className="mb-4 text-3xl font-semibold text-gray-900 dark:text-white md:text-3xl lg:text-3xl flex flex-row items-stretch">
                            Leave your rating:
                        </h2>
                        <div className="flex flex-row pt-2 place-items-end">
                            {ratingStars}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}

function CourseProfileTabs({course}: { course: Course }) {
    const tabs = [
        {name: 'Description', content: <CourseDescription course={course}/>},
        {name: 'Past Exams', content: <CourseExams course={course}/>},
        {name: 'Calendar', content: 'Not ready yet...'},
        {name: 'Rate The Course', content: <CourseRating course={course}/>},
    ];
    const [currentTab, setCurrentTab] = useState(tabs[0].name);

    return (
        <div>
            <div className="mx-auto my-5 w-full border-gray-200 sm:border-b-2">
                <nav
                    className="-mb-0.5 hidden sm:block"
                    aria-label="Tabs"
                >
                    <ul className="flex space-x-10">
                        {tabs.map((tab) => (
                            <li
                                id={tab.name}
                                key={tab.name}
                                className={`border-b-2 text-base ${
                                    tab.name === currentTab
                                        ? 'border-emerald-200 text-emerald-200'
                                        : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-500'
                                }`}
                            >
                                <button
                                    type="button"
                                    className="px-4 pb-1 font-semibold"
                                    onClick={() => setCurrentTab(tab.name)}
                                >
                                    {tab.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="p-4">
                {tabs.find((tab) => tab.name === currentTab)?.content}
            </div>
        </div>
    );
}

function CourseHeader({ course }: { course: Course }) {

    let stars = Number(course!.stars);
    let votes = Number(course!.votes);

    let val = stars / votes;

    if (votes == 0) {
        val = 0;
    }
    return (
        <div>
            <Title title={`${course!.courseCode}: ${course!.courseName}`}/>
            <h2 className="mb-4 text-3xl text-gray-900 dark:text-white md:text-3xl lg:text-3xl flex flex-row items-center">
                {val} <IconStarFilled/> <span className="ml-3 text-lg ">{votes} rating{votes > 1 && 's'}</span>
            </h2>
        </div>
    );
}

function CourseProfile({ params }: { params: { courseCode: string } }) {
    const { course, isError, isLoading } = useCourse(params.courseCode);

    return (
        <main className="mx-auto  w-full max-w-4xl">
            {isLoading && (
                <div role="status" className="absolute left-[50%] top-[50%]">
                    <svg aria-hidden="true"
                         className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-emerald-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            )}
            {!isError && !isLoading && course && (
                <div key={course!.courseCode}>
                    <CourseHeader course={course}></CourseHeader>
                    <CourseProfileTabs course={course}></CourseProfileTabs>
                </div>
            )}
        </main>
    );
}

export default requireAuth(CourseProfile);
