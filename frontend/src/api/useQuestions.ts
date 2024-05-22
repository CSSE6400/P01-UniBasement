'use client';
import useSWR, { Fetcher } from 'swr';
import { Question } from '@/types';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const ENDPOINT = `${process.env.API_URL}/api/exams/`;

const fetcher: Fetcher<Question[], string> = async (...args) => {
    const res = await fetch(...args);

    if (!res.ok) {
        throw new Error(await res.json());
    }

    return res.json();
};

export default function useQuestions(examId: number) {
    const { data, error, isLoading } = useSWR(ENDPOINT + examId + '/questions', fetcher);

    useEffect(() => {
        if (error) {
            toast.error('Error loading questions', { id: 'questionsError' });
        }
    }, [error]);

    return {
        questions: data,
        isLoading,
        isError: error,
    };
}