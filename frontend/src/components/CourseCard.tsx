import { useState } from 'react'
import { Button } from '@/components/Button'
import { IconPin, IconPinFilled } from '@tabler/icons-react'
import Card from '@/components/Card'
import Link from 'next/link'
import { DisplayCourse } from '@/types'
import { usePinned } from '@/api/usePins'

function CourseCard({ course }: { course: DisplayCourse }) {
  const [pinned, setPinned] = useState(course.pinned ?? false)
  const curPins = usePinned()

  function updatePins(currentPins: DisplayCourse[]) {
    const thisPin = currentPins.find(
      (value: DisplayCourse) => value.code === course.code,
    )
    if (thisPin) {
      thisPin.pinned = false
      const newPins = curPins.filter(
        (value: DisplayCourse) => value.code !== course.code,
      )
      newPins.push(thisPin)
      localStorage.setItem('pinned', JSON.stringify(newPins))
    }
  }

  return (
    <Link href={course.href}>
      <Card>
        <h3 className="text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
          <div>
            <div className="flex justify-between">
              <div>{course.code}</div>

              <Button
                onClick={(e) => {
                  e.preventDefault()
                  setPinned(!pinned)
                  updatePins(curPins)
                }}
                variant="icon"
                className="absolute right-2"
              >
                {pinned ? (
                  <IconPin className="h-5 w-5 fill-zinc-700/10 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-white/10 dark:stroke-zinc-400 dark:group-hover:fill-emerald-300/10 dark:group-hover:stroke-emerald-400" />
                ) : (
                  <IconPinFilled className="h-5 w-5 fill-zinc-700/10 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-white/10 dark:stroke-zinc-400 dark:group-hover:fill-emerald-300/10 dark:group-hover:stroke-emerald-400" />
                )}
              </Button>
            </div>
          </div>
          <div>{course.name}</div>
        </h3>
        {course.lastViewedName && (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Last Viewed: {course.lastViewedName}
          </p>
        )}
      </Card>
    </Link>
  )
}

export default CourseCard
