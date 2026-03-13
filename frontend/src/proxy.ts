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

    if (pathname.startsWith('/api')) {
        const backendUrl = process.env.INTERNAL_API_URL || 'http://backend:8000';
        const url = new URL(pathname + request.nextUrl.search, backendUrl);
        return NextResponse.rewrite(url);
    }
    return intlMiddleware(request);
}

export const config = {
    matcher: [
        '/',
        '/(kk|ru)/:path*',
        '/api/:path*',
        '/((?!_next|_vercel|.*\\..*).*)'
    ]
};
