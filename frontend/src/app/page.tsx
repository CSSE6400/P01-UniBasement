'use client'
import { Search } from '@/components/Search'
import Image from 'next/image'
import {
  IconZoomCheck,
  IconNotebook,
  IconPencilHeart,
  IconPin,
  IconPinFilled,
  IconPhone,
} from '@tabler/icons-react'
import { Button } from '@/components/Button'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Resource } from '@/components/Resources'
import Link from 'next/link'
import { useState } from 'react'

function SearchIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"
      />
    </svg>
  )
}

function CourseSearch() {
  return (
    <div className="group relative flex h-12">
      <SearchIcon className="pointer-events-none absolute left-3 top-0 h-full w-5 stroke-zinc-500" />
      <input
        className="max-w-full flex-grow appearance-none bg-transparent pl-10 text-zinc-900 outline-none placeholder:text-zinc-500 focus:w-full focus:flex-none sm:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            // In Safari, closing the dialog with the escape key can sometimes cause the scroll position to jump to the
            // bottom of the page. This is a workaround for that until we can figure out a proper fix in Headless UI.
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur()
            }
          }
        }}
        placeholder="Find a course or exam"
      />
      <div className=""></div>
    </div>
  )
}

function Course({
  course,
}: {
  course: {
    href: string
    pinned: boolean
    name: string
    code: string
    last_viewed_name: string
    last_viewed: number
  }
}) {
  const [pinned, setPinned] = useState(course.pinned)
  console.log(pinned)
  return (
    <div
      key={course.href}
      className="group relative flex rounded-2xl bg-zinc-50 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5"
    >
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/7.5 group-hover:ring-zinc-900/10 dark:ring-white/10 dark:group-hover:ring-white/20" />
      <div className="relative rounded-2xl px-4 pb-4 pt-8">
        <h3 className="text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
          <div className="flex justify-between">
            <div>{course.code}</div>
            <Button onClick={() => setPinned(!pinned)} variant="icon">
              {pinned ? (
                <IconPinFilled className="h-5 w-5 fill-zinc-700/10 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-white/10 dark:stroke-zinc-400 dark:group-hover:fill-emerald-300/10 dark:group-hover:stroke-emerald-400" />
              ) : (
                <IconPin className="h-5 w-5 fill-zinc-700/10 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-white/10 dark:stroke-zinc-400 dark:group-hover:fill-emerald-300/10 dark:group-hover:stroke-emerald-400" />
              )}
            </Button>
          </div>

          <div>{course.name}</div>
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="absolute inset-0 rounded-2xl" />
          {course.last_viewed_name}
        </p>
      </div>
    </div>
  )
}

export default function Home() {
  const { user, error, isLoading } = useUser()

  const courses = [
    {
      code: 'CSSE1001',
      name: 'Introduction to Software Engineering',
      last_viewed: 2,
      last_viewed_name: '2023 Sem 1 Final',
      pinned: true,
      href: '/course/2',
    },
    {
      code: 'ENGG1300',
      name: 'shit course',
      last_viewed: 3,
      last_viewed_name: '2023 Sem 1 Final',
      pinned: true,
      href: '/course/2',
    },
  ]
  return (
    <main>
      <div className="px-0">
        <div className="min-h-80 bg-indigo-300">
          <div className="flex items-center justify-center pt-12 text-5xl font-bold text-zinc-900">
            Exam Study Made Simple
          </div>
          <div className="flex items-center justify-center pt-12 text-2xl text-zinc-900">
            Empowering a collaborative approach to study
          </div>
          <div className="mt-8 flex items-center justify-center">
            <div className="container min-h-16 max-w-prose rounded-lg bg-slate-100">
              <CourseSearch />
            </div>
          </div>
        </div>
      </div>
      <div className="flex min-h-60 items-center justify-center">
        <div className="w-full max-w-4xl space-y-10">
          <div className="text-xl">Pinned Courses</div>

          <div className="mt-4 flex flex-col sm:flex-row">
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {courses.map((value) => (
                <Course key={value.code} course={value} />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex min-h-60 items-center justify-center">
        <div className="w-full max-w-4xl space-y-10">
          <div className="mt-4 flex flex-col sm:flex-row">
            <div className="">
              <div className="flex items-center justify-center text-xl">
                <IconZoomCheck size="48" />
                <div className="ml-2">Answers verified by the community</div>
              </div>
            </div>
            <div className="">
              <div className="flex items-center justify-center text-xl">
                <IconNotebook size="36" />
                <div className="ml-2">Notes provided by the Community</div>
              </div>
            </div>
            <div className="">
              <div className="flex items-center justify-center text-xl">
                <IconPencilHeart size="48" />
                <div className="ml-2">Prepare for an exam in the EVAN way!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex min-h-10 items-center justify-center py-6">
        <div className="mx-auto w-full max-w-4xl text-2xl font-bold">
          So jump straight in and start learning the EVAN way!
        </div>
      </div>
    </main>
  )
}
