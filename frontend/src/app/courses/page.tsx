'use client'
import useCourses from '@/api/useCourses'
import Card from '@/components/Card'
import { IconCirclePlus } from '@tabler/icons-react'
import CourseCard from '@/components/CourseCard'
import { backendCourseToFrontend } from '@/lib/courseUtils'
import requireAuth from '../requireAuth'

function Courses() {
  const { courses, isError, isLoading } = useCourses()

  // TODO: get pinned courses and move pinned ones to top

  return (
    <main>
      {isLoading && <p>Loading...</p>}
      <div className="m-5 grid grid-cols-4 gap-4">
        {!isError &&
          !isLoading &&
          courses?.map((course) => (
            <CourseCard
              course={backendCourseToFrontend(course)}
              key={course.courseCode}
            />
          ))}
        <Card>
          {/* TODO: Make this do something */}
          <h3 className="text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
            Add Course <IconCirclePlus />
          </h3>
        </Card>
      </div>
    </main>
  )
}

export default requireAuth(Courses)
