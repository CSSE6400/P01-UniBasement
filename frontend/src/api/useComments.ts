'use client'
import useSWR, { Fetcher } from 'swr';
import { Comment as IComment }from '@/types';

const ENDPOINT = `${process.env.API_URL}/api/questions/`;

const fetcher: Fetcher<IComment[], string> = (...args) => fetch(...args).then(res => res.json())

export default function useComments(questionId: number) {
    const { data, error, isLoading } = useSWR(ENDPOINT + questionId +'/comments', fetcher)

    return {
        comments: data,
        isLoading,
        isError: error
    }
}