'use client';

import { useSession } from '@/lib/auth-client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { canAccess } from '@/utils/canAccess';
import { Role } from '@/consonants/role';

const publicRoutes = new Set([
    '/sign-in',
    '/forget-password',
    '/reset-password',
]);

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    const isPublicRoute =
        publicRoutes.has(pathname) || pathname.startsWith('/sign-up');

    useEffect(() => {
        if (isPending || !session) return;

        // 🔐 Role based access - only check for authenticated users on protected routes
        if (!isPublicRoute) {
            const role = session.user?.role as Role | undefined;
            if (role && !canAccess(role, pathname)) {
                router.replace('/dashboard');
            }
        }
    }, [session, isPending, pathname, router, isPublicRoute]);

    // ⏳ Loading state
    if (isPending) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    // 🚫 Block rendering for unauthenticated users on protected routes
    // (Middleware handles the redirect, this just prevents flash of content)
    if (!session && !isPublicRoute) {
        return null;
    }

    return <>{children}</>;
}
