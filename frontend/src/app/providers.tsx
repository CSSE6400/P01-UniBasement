'use client';

import { useEffect } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';

function ThemeWatcher() {
    let { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        let media = window.matchMedia('(prefers-color-scheme: dark)');

        function onMediaChange() {
            let systemTheme = media.matches ? 'dark' : 'light';
            if (resolvedTheme === systemTheme) {
                setTheme('system');
            }
        }

        onMediaChange();
        media.addEventListener('change', onMediaChange);

        return () => {
            media.removeEventListener('change', onMediaChange);
        };
    }, [resolvedTheme, setTheme]);

    return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const saveTimeToLocalStorage = () => {
            const savedTime = localStorage.getItem('lastVisited') || '0';
            const time = new Date().getTime();
            if (time - parseInt(savedTime) > 10 * 1000 * 60) {
                localStorage.setItem('lastVisited', time.toString());
            }
        };

        // add page unload event listener
        window.addEventListener('beforeunload', saveTimeToLocalStorage);
        return () => {
            // remove page unload event listener
            window.removeEventListener('beforeunload', saveTimeToLocalStorage);
        };
    }, []);

    return (
        <ThemeProvider
            attribute="class"
            disableTransitionOnChange
        >
            <ThemeWatcher/>
            {children}
        </ThemeProvider>
    );
}
