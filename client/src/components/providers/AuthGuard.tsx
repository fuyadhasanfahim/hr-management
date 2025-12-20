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
        // Redirect unauthenticated users to sign-in
        if (!isPending && !session && !isPublicRoute) {
            router.replace('/sign-in');
            return;
        }

        // Redirect authenticated users away from public routes
        if (!isPending && session && (isPublicRoute || pathname === '/')) {
            router.replace('/dashboard');
            return;
        }

        // Role based access - only check for authenticated users on protected routes
        if (!isPending && session && !isPublicRoute) {
            const role = session.user?.role as Role | undefined;
            if (role && !canAccess(role, pathname)) {
                router.replace('/dashboard');
            }
        }
    }, [session, isPending, pathname, router, isPublicRoute]);

    // Loading state
    if (isPending) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    // Block rendering for unauthenticated users on protected routes
    if (!session && !isPublicRoute) {
        return null;
    }

    // Block rendering for authenticated users on public routes (prevents flash)
    if (session && isPublicRoute) {
        return null;
    }

    return <>{children}</>;
}
