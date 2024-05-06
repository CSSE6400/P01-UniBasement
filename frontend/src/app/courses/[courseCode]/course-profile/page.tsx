'use client'
import useCourse from '@/api/useCourse';
import { Course } from '@/types';
import Link from 'next/link';
import { useState } from 'react';

function CourseDescription({ course} : { course: Course }) {

    return (
        <div>
            <h3 className='text-2xl text-bold mt-2'>Course Description</h3>
            <p>{course!.courseDescription}</p>
        </div>
        
    )
}

function CourseAssessment({ course} : { course: Course }) {

    return (
        <div className='pl-0'>
            <h4 className='text-2xl text-bold mt-2'>Cloud Infrastructure Assignment</h4>
            <span className='flex'><p>Type: </p> <p>Computer Exercise</p></span>
            <p>Task Description:</p>
            <p>
            You will implement a software system to meet specified functional and non-functional requirements. The implementation will be deployed on a cloud infrastructure and stress tested. You are required to design the system and select the appropriate compute platforms to deliver specified requirements.

This assessment is to be delivered in three stages. Each stage is worth 10% of your final grade.
            </p>
            <p>{course!.courseDescription}</p>
        </div>
        
    )
}

function CourseProfileTabs({ course } : { course: Course }) {
    const tabs = [
        { name: "Assessment", content: <CourseAssessment course={course} /> },
        { name: "Calendar", content: "Content for Tab 2" },
        { name: "Past Exams", content: "Past Exams Links Go Here"}
      ];
      const [currentTab, setCurrentTab] = useState(tabs[0].name);

  return (
    <div>
        <div className="mx-auto my-5 w-full sm:border-b-2 border-gray-200">
            <nav className="-mb-0.5 hidden sm:block" aria-label="Tabs">
            <ul className="flex space-x-10">
                {tabs.map(tab => (
                <li key={tab.name} className={`border-b-2 text-base ${tab.name === currentTab ? "border-blue-300 text-blue-300" : 
                        "border-transparent text-gray-400 hover:text-gray-500 hover:border-gray-300"}`}>
                    <button type="button" className="px-4 pb-5 font-semibold" onClick={() => setCurrentTab(tab.name)}>
                    {tab.name}
                    </button>
                </li>
                ))}
            </ul>
            </nav>
        </div>
        <div className="p-4">
                {tabs.find(tab => tab.name === currentTab)?.content}
        </div>
    </div>
    );
}

function CourseHeader({ course }: {course: Course}) {

    return (
        <div>
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                    {course!.courseName}
                </span>
            </h1>
            <h2 className='flex items-center text-5xl font-extrabold dark:text-white'>
                <span className='bg-blue-100 text-blue-800 text-2xl font-semibold ml-0 me-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800'>
                    UQ
                </span>
                <span className='bg-blue-100 text-blue-800 text-2xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-2'>
                    {course!.courseCode}
                </span>
                <span className='bg-blue-100 text-blue-800 text-2xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-2'>
                    SEM 1
                </span>
            </h2>
            <CourseDescription course={course}></CourseDescription>
        </div>

    );
}


export default function CourseProfile({ params }: { params: { courseCode: string }}) {
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
    );
}

