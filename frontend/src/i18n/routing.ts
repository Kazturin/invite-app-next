import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['kk', 'ru'],

    // Used when no locale matches
    defaultLocale: 'kk',

    // Optional: You can configure locale prefixing based on your preference
    localePrefix: 'as-needed',

    // Disable automatic locale detection to ensure the defaultLocale is always 
    // used for the root path regardless of browser settings or previous visits.
    localeDetection: false
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
