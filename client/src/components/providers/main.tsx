'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/components/ui/sonner';
import ReduxProvider from './ReduxProvider';
import { useSession } from '@/lib/auth-client';
import { ToasterProps } from 'sonner';
import AuthGuard from './AuthGuard';

export default function Main({ children }: { children: ReactNode }) {
    const { data } = useSession();

    const theme = (data?.user?.theme as ToasterProps['theme']) || 'system';

    return (
        <AuthGuard>
            <ReduxProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme={theme}
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster theme={theme} />
                </ThemeProvider>
            </ReduxProvider>
        </AuthGuard>
    );
}
