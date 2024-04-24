'use client'
import useSWR, { Fetcher } from 'swr';
import { Exam } from '@/types';

const ENDPOINT = `${process.env.API_URL}/api/exams/`;

const fetcher: Fetcher<Exam, string> = (...args) => fetch(...args).then(res => res.json())

export default function useExam(examId: number) {
    const { data, error, isLoading } = useSWR(ENDPOINT + examId, fetcher)

    return {
        exam: data,
        isLoading,
        isError: error
    }
}