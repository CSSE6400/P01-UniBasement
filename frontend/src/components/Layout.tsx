'use client';

import { motion } from 'framer-motion';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

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
        </div>
    );
}
