'use client';
import useSWR, { Fetcher } from 'swr';
import { Comment as IComment } from '@/types';
import { usePinned } from '@/api/usePins';

const ENDPOINT = `${process.env.API_URL}/api/recent_changes`;

const fetcher: Fetcher<IComment[], string> = async (...args) => {
    const res = await fetch(...args);

    if (!res.ok) {
        throw new Error(await res.json());
    }

    return res.json();
};

export default function useRecentChanges() {
    const lastVisited: string | null = localStorage.getItem('lastVisited');
    const { pinned } = usePinned();

    let url = ENDPOINT + `?lastVisited=${lastVisited}`;
    pinned.forEach((p) => {
        url += `&courseCodes=${p.code}`;
    });

    const {
        data,
        error,
        isLoading,
    } = useSWR(url, fetcher);

    return {
        recentChanges: data,
        isLoading,
        isError: error,
    };
}