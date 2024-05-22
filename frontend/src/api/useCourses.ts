'use client';
import useSWR, { Fetcher } from 'swr';
import { Course } from '@/types';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const ENDPOINT = `${process.env.API_URL}/api/courses`;

const fetcher: Fetcher<Course[], string> = async (...args) => {
    const res = await fetch(...args);

    if (!res.ok) {
        throw new Error(await res.json());
    }

    return res.json();
};

export default function useCourses() {
    const { data, error, isLoading } = useSWR(ENDPOINT, fetcher);

    useEffect(() => {
        if (error) {
            toast.error('Error loading courses', { id: 'coursesError' });
        }
    }, [error]);

    return {
        courses: data,
        isLoading,
        isError: error,
    };
}