import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * Next.js 16 Proxy
 * Handles API rewriting and i18n routing
 */
export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Backend Proxy for /api calls
    // This avoids CORS issues and simplifies frontend calls
    if (pathname.startsWith('/api')) {
        // Use internal URL for server-side or a configured backend host
        const backendUrl = process.env.INTERNAL_API_URL || 'http://backend:8000';

        // We rewrite /api/... to internal backend URL
        // Make sure to preserve the full path and search params
        const url = new URL(pathname + request.nextUrl.search, backendUrl);
        return NextResponse.rewrite(url);
    }

    // 2. Internationalization Proxy (handled by next-intl)
    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames + api + generic routes
    // But exclude internal Next.js paths and static files
    matcher: [
        '/',
        '/(kk|ru)/:path*',
        '/api/:path*',
        '/((?!_next|_vercel|.*\\..*).*)'
    ]
};
