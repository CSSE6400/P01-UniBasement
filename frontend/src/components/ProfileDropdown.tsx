'use client'
import { IconSettings, IconLogout2, IconUser } from '@tabler/icons-react'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function ProfileCard() {
  const [open, setOpen] = useState(false)
  const { user, error, isLoading } = useUser()
  const name = user?.name ? user.name : 'Login or Register'
  const router = useRouter()

  function handleOpen(openState: boolean) {
    if (name === 'Login or Register') {
      router.push('/api/auth/login')
    } else {
      setOpen(openState)
    }
  }
  return (
    <div className="-mb-3 flex text-zinc-600 dark:text-zinc-400">
      <div className="flex items-start justify-end">
        <div
          onClick={() => handleOpen(!open)}
          className={`ab border-b-4 border-transparent py-3 ${
            open ? 'transform border-indigo-700 transition duration-300' : ''
          }`}
        >
          <div className="flex h-full cursor-pointer items-center justify-center space-x-3">
            <div className="text-sm hover:text-zinc-900 dark:hover:text-white">
              <div className="cursor-pointer">{name}</div>
            </div>
            <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-gray-900 dark:border-white">
              <Image
                src={user?.picture ? user.picture : ''}
                alt=""
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          {open && (
            <div className="absolute right-0 mt-5 w-40 rounded-lg border bg-white px-5 py-3 text-zinc-600 shadow dark:border-transparent dark:bg-zinc-900 dark:text-zinc-400">
              <ul className="space-y-3">
                <li className="font-medium">
                  <Link
                    href="/account"
                    className="flex transform items-center border-r-4 border-transparent transition-colors duration-200 hover:border-purple-800"
                  >
                    <div className="mr-3">
                      <IconUser />
                    </div>
                    Account
                  </Link>
                </li>
                <li className="font-medium">
                  <Link
                    href="/settings"
                    className="flex transform items-center border-r-4 border-transparent transition-colors duration-200 hover:border-purple-800"
                  >
                    <div className="mr-3">
                      <IconSettings />
                    </div>
                    Settings
                  </Link>
                </li>
                <li>
                  <ThemeToggle />
                </li>
                <hr className="dark:border-purple-900" />
                <li className="font-medium">
                  <a
                    href="/api/auth/logout"
                    className="flex transform items-center border-r-4 border-transparent transition-colors duration-200 hover:border-red-600"
                  >
                    <div className="mr-3 text-red-600">
                      <IconLogout2 />
                    </div>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
