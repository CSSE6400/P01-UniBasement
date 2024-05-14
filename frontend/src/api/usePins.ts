import { DisplayCourse } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export function usePinned() {
    const [pinned, setPinned] = useState<DisplayCourse[]>(() => {
        const storedVal: string | null = localStorage.getItem('pinned');
        try {
            return !!storedVal ? (JSON.parse(storedVal) || []) : [];
        } catch (error) {
            console.error('Failed to parse pinned courses:', error);
        }
        return [];
    });

    useEffect(() => {
        // handle pins being changed in other components or tabs
        function handleChangeStorage() {
            const storedVal: string | null = localStorage.getItem('pinned');
            try {
                setPinned(!!storedVal ? (JSON.parse(storedVal) || []) : []);
            } catch (error) {
                console.error('Failed to parse pinned courses:', error);
            }
        }

        window.addEventListener('storage', handleChangeStorage);
        return () => window.removeEventListener('storage', handleChangeStorage);
    }, []);

    const updatePinned = useCallback((course: DisplayCourse) => {
        if (course.pinned && !pinned?.find((p) => p.code === course.code)) {
            const newPinned = [...pinned, course];
            setPinned(newPinned);
            localStorage.setItem('pinned', JSON.stringify(newPinned));
            // notify other components of change since 'storage' is only auto fired in other tabs
            window.dispatchEvent(new Event('storage'));
        } else if (!course.pinned && pinned?.find((p) => p.code === course.code)) {
            const newPinned = pinned.filter((p) => p.code !== course.code);
            setPinned(newPinned);
            localStorage.setItem('pinned', JSON.stringify(newPinned));
            // notify other components of change since 'storage' is only auto fired in other tabs
            window.dispatchEvent(new Event('storage'));
        }
    }, [pinned]);

    return { pinned, updatePinned };
}
