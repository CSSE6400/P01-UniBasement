'use client'
import useSWR, { Fetcher } from 'swr';
import { Course, Exam } from '@/types';

const ENDPOINT = `${process.env.API_URL}/api/courses`;

const fetcher: Fetcher<Course[], string> = async (...args) => {
  const res = await fetch(...args)

  if (!res.ok) {
    throw new Error(await res.json())
  }

  return res.json()
}

export default function useCourses() {
    const { data, error, isLoading } = useSWR(ENDPOINT, fetcher)

    return {
        courses: data,
        isLoading,
        isError: error
    }
}