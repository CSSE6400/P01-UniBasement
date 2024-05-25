'use client';
import useSWR, { Fetcher } from 'swr';
import { RecentChange } from '@/types';
import { usePinned } from '@/api/usePins';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

const ENDPOINT = `${process.env.API_URL}/api/recent_changes`;



export default function useRecentChanges() {
    const lastVisited: string | null = localStorage.getItem('lastVisited');
    const { pinned } = usePinned();

    const fetcher: Fetcher<RecentChange[], string> = useCallback(async (...args) => {
        if (!pinned.length) {
            return [];
        }

        const res = await fetch(...args);

        if (!res.ok) {
            throw new Error(await res.json());
        }

        return res.json();
    }, [pinned]);


    let url = ENDPOINT + `?lastVisited=${lastVisited}`;
    pinned.forEach((p) => {
        url += `&courseCodes=${p.code}`;
    });

    const {
        data,
        error,
        isLoading,
    } = useSWR(url, fetcher);

    useEffect(() => {
        if (error) {
            toast.error('Error loading recent changes', { id: 'recentChangesError' });
        }
    }, [error]);

    return {
        recentChanges: data,
        isLoading,
        isError: error,
    };
}