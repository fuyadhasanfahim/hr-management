import { getSessionCookie } from 'better-auth/cookies';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = new Set(['/sign-in', '/sign-up', '/forget-password']);

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const session = getSessionCookie(request);

    if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/api/') ||
        pathname === '/favicon.ico' ||
        pathname === '/robots.txt' ||
        pathname.startsWith('/assets/')
    ) {
        return NextResponse.next();
    }

    if (!session) {
        if (publicRoutes.has(pathname)) {
            return NextResponse.next();
        }

        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (publicRoutes.has(pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
