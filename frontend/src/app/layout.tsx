import { Providers } from '@/app/providers';
import { Layout } from '@/components/Layout';

import '@/styles/tailwind.css';
import { type Metadata } from 'next';

import { UserProvider } from '@auth0/nextjs-auth0/client';

export const metadata: Metadata = {
    title: {
        template: '%s - UniBasement',
        default: 'Home - UniBasement',
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <html
            lang="en"
            className="h-full"
            suppressHydrationWarning
        >
        <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
        <Providers>
            <UserProvider>
                <div className="w-full">
                    <Layout>{children}</Layout>
                </div>
            </UserProvider>
        </Providers>
        </body>
        </html>
    );
}
