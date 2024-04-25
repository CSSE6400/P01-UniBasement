'use client'
import useSWR, { Fetcher } from 'swr';
import { Course } from '@/types';

const ENDPOINT = `${process.env.API_URL}/api/courses`;

const fetcher: Fetcher<Course[], string> = (...args) => fetch(...args).then(res => res.json())

export default function useCourses() {
    const { data, error, isLoading } = useSWR(ENDPOINT, fetcher)

    return {
        courses: data,
        isLoading,
        isError: error
    }
}