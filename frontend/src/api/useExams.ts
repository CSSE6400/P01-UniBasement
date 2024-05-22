'use client';
import useSWR, { Fetcher } from 'swr';
import { Exam } from '@/types';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const ENDPOINT = `${process.env.API_URL}/api/courses/`;

const fetcher: Fetcher<Exam[], string> = async (...args) => {
    const res = await fetch(...args);

    if (!res.ok) {
        throw new Error(await res.json());
    }

    return res.json();
};

export default function useExams(courseCode: string) {
    const { data, error, isLoading } = useSWR(ENDPOINT + courseCode + '/exams', fetcher);

    useEffect(() => {
        if (error) {
            toast.error('Error loading exams', { id: 'examsError' });
        }
    }, [error]);

    return {
        exams: data,
        isLoading,
        isError: error,
    };
}