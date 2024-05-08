'use client'
import { Search } from '@/components/Search'
import Image from 'next/image'
import {
  IconZoomCheck,
  IconNotebook,
  IconPencilHeart,
  IconPin,
  IconPinnFilled,
} from '@tabler/icons-react'
import { Button } from '@/components/Button'
import { useUser } from '@auth0/nextjs-auth0/client'

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

export default function Home() {
  const { user, error, isLoading } = useUser()

  const courses = [
    { code: 'CSSE1001', last_viewed: 2, pinned: true },
    { code: 'ENGG1300', last_viewed: 3, pinned: true },
  ]

  console.log(courses)
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
          <div className="mt-4 flex flex-col sm:flex-row">
            {courses.map((value) => {
              return (
                <div className="drop-shadow-xl" key={value.code}>
                  <button onClick={() => (value.pinned = !value.pinned)}>
                    {value.pinned ? <IconPinnFilled /> : <IconPin />}
                  </button>
                  <div className="">asdasdasdasdas</div>
                </div>
              )
            })}
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
      <div className="flex min-h-40 items-center justify-center py-6">
        <div className="mx-auto w-full max-w-4xl text-2xl font-bold">
          So jump straight in and start learning the EVAN way!
        </div>
      </div>
      <div className="flex min-h-80 items-center justify-center py-6">
        <div className="mx-auto w-full max-w-4xl text-2xl font-light">
          <div>
            EVAN is a collaborative tool to empower university students to work
            together to improve their exam grades. EVAN allows you to find exam
            solutions, find great study materials, and ensure that your study is
            less stressful!
          </div>
          <div className="mt-5">
            EVAN is completely open source and crowd funded.{' '}
          </div>
          <div className="mt-5">
            By contributing to EVAN, you're not just supporting a platform;
            you're investing in the future of education and collaboration among
            students. Your support helps us maintain, improve, and expand our
            services to reach more students in need.
          </div>
          <Button className="mt-5 rounded" variant="outline">
            Contribute and Support
          </Button>
        </div>
      </div>
    </main>
  )
}
