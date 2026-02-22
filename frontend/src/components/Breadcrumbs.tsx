'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

interface BreadcrumbLink {
    name: string;
    href?: string;
}

interface BreadcrumbsProps {
    links: BreadcrumbLink[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ links }) => {
    return (
        <nav className="flex mb-4 text-theme-secondary border border-theme-secondary py-3 px-5 rounded-lg my-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
                <li>
                    <div>
                        <Link href="/" className="text-gray-400 hover:text-gray-500 text-theme-secondary">
                            <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </div>
                </li>
                {links.map((link, index) => (
                    <li key={index}>
                        <div className="flex items-center text-theme-secondary">
                            <ChevronRightIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                            {link.href ? (
                                <Link
                                    href={link.href}
                                    className="ml-2 text-sm font-medium"
                                >
                                    {link.name}
                                </Link>
                            ) : (
                                <span className="ml-2 text-sm font-medium">
                                    {link.name}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
