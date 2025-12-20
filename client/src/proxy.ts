import { getSessionCookie } from 'better-auth/cookies';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const publicRoutes = new Set([
    '/sign-in',
    '/forget-password',
    '/reset-password',
]);

const skipRoutes = ['/_next', '/api', '/favicon.ico', '/robots.txt', '/assets'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (skipRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    const sessionCookie = getSessionCookie(request);
    const isPublicRoute =
        publicRoutes.has(pathname) || pathname.startsWith('/sign-up');

    if (!sessionCookie) {
        if (isPublicRoute) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (isPublicRoute || pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
