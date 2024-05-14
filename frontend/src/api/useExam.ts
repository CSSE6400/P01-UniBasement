'use client';
import useSWR, { Fetcher } from 'swr';
import { Exam } from '@/types';

const ENDPOINT = `${process.env.API_URL}/api/exams/`;

const fetcher: Fetcher<Exam, string> = async (...args) => {
    const res = await fetch(...args);

    if (!res.ok) {
        throw new Error(await res.json());
    }

    return res.json();
};

export default function useExam(examId: number) {
    const { data, error, isLoading } = useSWR(ENDPOINT + examId, fetcher);

    return {
        exam: data,
        isLoading,
        isError: error,
    };
}