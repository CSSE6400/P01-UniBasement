'use client';

import { motion } from 'framer-motion';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Toaster } from 'react-hot-toast';

export function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className="l h-full">
            <motion.header
                layoutScroll
                className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
            >
                <div className="contents lg:pointer-events-auto">
                    <Header/>
                </div>
            </motion.header>
            <div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
                <main className="flex-auto">{children}</main>
                <Footer/>
            </div>
            <Toaster
                toastOptions={{
                    position: 'bottom-left',
                    style: {
                        borderRadius: '10px',
                        background: '#25252a',
                        color: '#fff',
                    },
                }}
            />
        </div>
    );
}
