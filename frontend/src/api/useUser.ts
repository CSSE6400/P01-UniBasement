'use client';
import useSWR, { Fetcher } from 'swr';
import { UserRole } from '@/types';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const ENDPOINT = `${process.env.API_URL}/api/users/`;

const fetcher: Fetcher<UserRole, string> = async (...args) => {
    const res = await fetch(...args);

    if (!res.ok) {
        throw new Error(await res.json());
    }

    return res.json();
};

export default function useUserRole(userId: string) {
    const { data, error, isLoading } = useSWR(ENDPOINT + userId +'/role', fetcher);

    useEffect(() => {
        if (error) {
            toast.error('Error loading user role', { id: 'userRoleError' });
        }
    }, [error]);

    return {
        userRole: data,
        isLoading,
        isError: error,
    };
}