'use client';
import useSWR, { Fetcher } from 'swr';
import { Comment as IComment } from '@/types';

const ENDPOINT = `${process.env.API_URL}/api/questions/`;

const fetcher: Fetcher<IComment[], string> = async (...args) => {
    const res = await fetch(...args);

    if (!res.ok) {
        throw new Error(await res.json());
    }

    return res.json();
};

export default function useComments(questionId: number, userId?: string | null) {
    const {
        data,
        error,
        isLoading,
    } = useSWR(`${ENDPOINT}${questionId}/comments${!!userId ? `?userId=${userId}` : ''}`, fetcher, { revalidateIfStale: true });

    return {
        comments: data,
        isLoading,
        isError: error,
    };
}