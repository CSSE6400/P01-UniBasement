'use client'
import useCourse from '@/api/useCourse'
import requireAuth from '@/app/requireAuth'
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

function CourseAssessment({ course }: { course: Course }) {
  return (
    <div className="pl-0">
      <h4 className="text-bold mt-2 text-2xl">
        Cloud Infrastructure Assignment
      </h4>
      <span className="flex">
        <p>Type: </p> <p>Computer Exercise</p>
      </span>
      <p>Task Description:</p>
      <p>
        You will implement a software system to meet specified functional and
        non-functional requirements. The implementation will be deployed on a
        cloud infrastructure and stress tested. You are required to design the
        system and select the appropriate compute platforms to deliver specified
        requirements. This assessment is to be delivered in three stages. Each
        stage is worth 10% of your final grade.
      </p>
      <p>{course!.courseDescription}</p>
    </div>
  )
}

function CourseProfileTabs({ course }: { course: Course }) {
  const tabs = [
    { name: 'Assessment', content: <CourseAssessment course={course} /> },
    { name: 'Calendar', content: 'Content for Tab 2' },
    { name: 'Past Exams', content: 'Past Exams Links Go Here' },
  ]
  const [currentTab, setCurrentTab] = useState(tabs[0].name)

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
  return (
    <div>
      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        <span className="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-transparent">
          {course!.courseName}
        </span>
      </h1>
      <h2 className="flex items-center text-5xl font-extrabold dark:text-white">
        <span className="me-2 ml-0 rounded bg-blue-100 px-2.5 py-0.5 text-2xl font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
          UQ
        </span>
        <span className="me-2 ms-2 rounded bg-blue-100 px-2.5 py-0.5 text-2xl font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
          {course!.courseCode}
        </span>
        <span className="me-2 ms-2 rounded bg-blue-100 px-2.5 py-0.5 text-2xl font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
          SEM 1
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
