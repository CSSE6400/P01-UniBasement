'use client'
import useCourse from '@/api/useCourse'
import requireAuth from '@/app/requireAuth'
import useExams from '@/api/useExams'
import { Course } from '@/types'
import Link from 'next/link'
import { useState } from 'react'

function CourseDescription({ course }: { course: Course }) {
  return (
    <div>
      <h3 className="text-bold mt-2 text-2xl">Course Description</h3>
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
                        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <a href="#">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Semester {exam!.examSemester} - {exam!.examYear}</h5>
                            </a>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"> {exam!.examType}</p>
                            <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                View
                                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                </svg>
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>

    )
}

function CourseAssessment({ course} : { course: Course }) {

    return (
        <div className='pl-0'>
            <article className='text-pretty'>
                <h4 className='text-2xl text-bold mt-2'>Cloud Infrastructure Assignment</h4>
                <span className='flex'><p>Type: </p> <p>Computer Exercise</p></span>
                <p>Task Description:</p>
                <p className='text-balance'>
                    You will implement a software system to meet specified functional and non-functional requirements. The implementation will be deployed on a
                    cloud infrastructure and stress tested. You are required to design the system and select the appropriate compute platforms to deliver specified requirements.
                    This assessment is to be delivered in three stages. Each stage is worth 10% of your final grade.
                </p>
            </article>
        </div>
    )
}

function CourseProfileTabs({ course } : { course: Course }) {
    const tabs = [
        { name: "Assessment", content: <CourseAssessment course={course} /> },
        { name: "Past Exams", content: <CourseExams course={course} />},
        { name: "Calendar", content: "Not ready yet..." }
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
      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        <span className="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-transparent">
          {course!.courseName}
        </span>
      </h1>
      <h2 className="flex items-center text-5xl font-extrabold dark:text-white">
        <span className="me-2 ml-0 rounded bg-blue-100 px-2.5 py-0.5 text-2xl font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
          {course!.university}
        </span>
        <span className="me-2 ms-2 rounded bg-blue-100 px-2.5 py-0.5 text-2xl font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
          {course!.courseCode}
        </span>
        <span className="me-2 ms-2 rounded bg-blue-100 px-2.5 py-0.5 text-2xl font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
          STARS: {val}
        </span>
      </h2>
      <CourseDescription course={course}></CourseDescription>
    </div>
  )
}

function CourseProfile({ params }: { params: { courseCode: string } }) {
  const { course, isError, isLoading } = useCourse(params.courseCode)

  return (
    <main>
      {isError && <div> Shit has failed </div>}
      {isLoading && <p>Loading...</p>}
      {!isError && !isLoading && course && (
        <div key={course!.courseCode}>
          <Link href={`/courses/${course!.courseCode}/course-profile`}>
            <CourseHeader course={course}></CourseHeader>
          </Link>
          <CourseProfileTabs course={course}></CourseProfileTabs>
        </div>
      )}
    </main>
  )
}

export default requireAuth(CourseProfile)
