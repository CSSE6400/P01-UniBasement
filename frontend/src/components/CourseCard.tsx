import { Button } from '@/components/Button';
import { IconPin, IconPinFilled } from '@tabler/icons-react';
import Card from '@/components/Card';
import Link from 'next/link';
import { DisplayCourse } from '@/types';
import { usePinned } from '@/api/usePins';

function CourseCard({ course }: { course: DisplayCourse }) {
  const { updatePinned } = usePinned()

  return (
    <Link href={course.href}>
      <Card>
          <div className="min-h-[100px]">
            <h3 className="text-md font-semibold leading-7 text-zinc-900 dark:text-white">
                <div className="flex justify-between mb-2">
                  <div>{course.code}</div>

                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      updatePinned({ ...course, pinned: !course.pinned })
                    }}
                    variant="icon"
                    className="absolute right-2"
                  >
                    {course.pinned ? (
                      <IconPin className="h-5 w-5 fill-zinc-700/10 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-emerald-300/10 dark:stroke-emerald-400 dark:group-hover:fill-emerald-100/10 dark:group-hover:stroke-emerald-200" />
                    ) : (
                      <IconPinFilled className="h-5 w-5 fill-zinc-700/10 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-white/10 dark:stroke-zinc-400 dark:group-hover:fill-emerald-300/10 dark:group-hover:stroke-emerald-400" />
                    )}
                  </Button>
                </div>
            </h3>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">{course.name}</p>
            {course.lastViewedName && (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Last Viewed: {course.lastViewedName}
              </p>
            )}
          </div>
      </Card>
    </Link>
  )
}

export default CourseCard
