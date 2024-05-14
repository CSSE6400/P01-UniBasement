'use client';
import useCourse from '@/api/useCourse';
import useExams from '@/api/useExams';
import { Course } from '@/types';
import requireAuth from '@/app/requireAuth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IconStarFilled } from '@tabler/icons-react';
import Card from '@/components/Card';
import { useUser } from '@auth0/nextjs-auth0/client';
import useUpdateCourse from '@/api/useUpdateCourse';

function CourseDescription({ course} : { course: Course }) {

    return (
        <div>
            <h3 className='text-2xl text-bold mt-2'>Course Description</h3>
            <p>{course!.courseDescription}</p>
        </div>
        
    )
}

function CourseExams({ course} : { course: Course }) {
    const { exams, isError, isLoading } = useExams(course!.courseCode)

    return (
        <div>
            {isError && <div> Shit has failed </div>}
            {isLoading && <p>Loading...</p>}
            {!isError && !isLoading && exams && (
                <div className='flex flex-wrap space-x-4'>
                    {exams.map(exam => (
                        <Card key={exam.examId}>
                            <a href="#">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Semester {exam!.examSemester} - {exam!.examYear}</h5>
                            </a>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"> {exam!.examType}</p>
                            <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-emerald-400 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">
                                View
                                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                </svg>
                            </a>
                        </Card>
                    ))}
                </div>
            )}
        </div>

    )
}


function CourseRating ({ course } : { course: Course }) {
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
        { name: "Assessment", content: <CourseDescription course={course} /> },
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
                key={tab.name}
                className={`border-b-2 text-base ${
                  tab.name === currentTab
                    ? 'border-blue-300 text-blue-300'
                    : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-500'
                }`}
              >
                <button
                  type="button"
                  className="px-4 pb-5 font-semibold"
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
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl flex flex-row">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 pb-4">
                    {course!.courseCode}: {course!.courseName}
                </span>
            </h1>
            <h2 className="mb-4 text-3xl  text-gray-900 dark:text-white md:text-3xl lg:text-3xl flex flex-row items-center">
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
