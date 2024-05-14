'use client';
import useSWR, { Fetcher } from 'swr';
import { Exam } from '@/types';

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

    return {
        exams: data,
        isLoading,
        isError: error,
    };
}