import { getSessionCookie, getCookieCache } from 'better-auth/cookies';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccess } from '@/utils/canAccess';
import { Role } from '@/consonants/role';

const publicRoutes = new Set([
    '/sign-in',
    '/forget-password',
    '/reset-password',
]);

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/api/') ||
        pathname === '/favicon.ico' ||
        pathname === '/robots.txt' ||
        pathname.startsWith('/assets/')
    ) {
        return NextResponse.next();
    }

    const cachedSession = await getCookieCache(request);

    if (!cachedSession) {
        const sessionToken = getSessionCookie(request);

        if (!sessionToken) {
            if (publicRoutes.has(pathname) || pathname.startsWith('/sign-up')) {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    }

    if (publicRoutes.has(pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (cachedSession?.user?.role) {
        const userRole = cachedSession.user.role as Role;

        if (!canAccess(userRole, pathname)) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', cachedSession.user.id);
        requestHeaders.set('x-user-role', userRole);

        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
