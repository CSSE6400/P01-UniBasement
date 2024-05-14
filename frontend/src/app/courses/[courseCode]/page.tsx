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

function CourseDescription({ course} : { course: Course }) {

    return (
        <div>
            <p>{course!.courseDescription}</p>
        </div>
        
    )
}

function mapExamsBySemester(exams: Exam[]) {
    let examsByYear: {[k: number]: {[k: number]: Exam[]}} = {}
    exams.forEach(exam => {
        if (examsByYear[exam.examYear]) {
            if (examsByYear[exam.examYear][exam.examSemester]) {
                examsByYear[exam.examYear][exam.examSemester].push(exam)
            } else {
                examsByYear[exam.examYear][exam.examSemester] = [exam]
            }
        } else {
            examsByYear[exam.examYear] = {[exam.examSemester]: [exam]}
        }
    })
    return examsByYear
}

function CourseExams({ course} : { course: Course }) {
    const { exams, isError, isLoading } = useExams(course!.courseCode)

    const groupedExams = useMemo(() => exams ? mapExamsBySemester(exams) : {}, [exams])

    return (
        <div>
            {isError && <div> Shit has failed </div>}
            {isLoading && <p>Loading...</p>}
            {!isError && !isLoading && exams && (
                <div className="grid grid-cols-1 gap-3">
                    {Object.entries(groupedExams).map(([year, semesters]) => (
                        <div key={year} className="pb-5">
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
                                                <Link href={`/courses/${course.courseCode}/exams/${exam.examId}`}
                                                      key={exam.examId}>
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
            )}
        </div>

    )
}


function CourseRating({ course }: { course: Course }) {
    const [rating, setRating] = useState(Number(localStorage.getItem('rating')) || 0);
    const [tempRating, setTempRating] = useState(rating);

    const { user, error, isLoading } = useUser()
    const { updateCourseRating } = useUpdateCourse(course.courseCode)

    const handleSaveRating = useCallback(async (starId: number) => {
        setRating(starId);
        localStorage.setItem('rating', starId.toString());
        await updateCourseRating(user?.sub || '', starId)
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
                    <IconStarFilled />
                </span>
            );
        })
    ), [rating, tempRating, handleSaveRating])

    return (
        <div>
            {error && <div> Shit has failed </div>}
            {isLoading && <p>Loading...</p>}
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
                        <div className='flex flex-row pt-2 place-items-end'>
                            {ratingStars}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}

function CourseProfileTabs({ course } : { course: Course }) {
    const tabs = [
        { name: "Description", content: <CourseDescription course={course} /> },
        { name: "Past Exams", content: <CourseExams course={course} />},
        { name: "Calendar", content: "Not ready yet..." },
        { name: "Rate The Course", content: <CourseRating course={course} />}
      ];
      const [currentTab, setCurrentTab] = useState(tabs[0].name);

  return (
    <div>
      <div className="mx-auto my-5 w-full border-gray-200 sm:border-b-2">
        <nav className="-mb-0.5 hidden sm:block" aria-label="Tabs">
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
  )
}

function CourseHeader({ course }: { course: Course }) {

    let stars = Number(course!.stars)
    let votes = Number(course!.votes)

    let val =  stars / votes

    if (votes == 0) {
        val = 0
    }
    return (
        <div>
            <Title title={`${course!.courseCode}: ${course!.courseName}`} />
            <h2 className="mb-4 text-3xl text-gray-900 dark:text-white md:text-3xl lg:text-3xl flex flex-row items-center">
                 {val} <IconStarFilled /> <span className="ml-3 text-lg ">{votes} rating{votes > 1 && 's'}</span>
            </h2>
        </div>
    );
}

function CourseProfile({ params }: { params: { courseCode: string } }) {
  const { course, isError, isLoading } = useCourse(params.courseCode)

  return (
    <main className='mx-auto  w-full max-w-4xl'>
      {isError && <div> Shit has failed </div>}
      {isLoading && <p>Loading...</p>}
      {!isError && !isLoading && course && (
        <div key={course!.courseCode}>
          <CourseHeader course={course}></CourseHeader>
          <CourseProfileTabs course={course}></CourseProfileTabs>
        </div>
      )}
    </main>
  )
}

export default requireAuth(CourseProfile)
