import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const publicRoutes = new Set([
    '/sign-in',
    '/forget-password',
    '/reset-password',
]);

const skipRoutes = ['/_next', '/api', '/favicon.ico', '/robots.txt', '/assets'];

// Default better-auth session cookie name
const SESSION_COOKIE_NAME = 'better-auth.session_token';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip static files and API routes
    if (skipRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Check for session cookie
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    const isPublicRoute =
        publicRoutes.has(pathname) || pathname.startsWith('/sign-up');

    // No session - redirect to sign-in if trying to access protected route
    if (!sessionCookie?.value) {
        if (isPublicRoute) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Has session - redirect away from public routes to dashboard
    if (isPublicRoute || pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
