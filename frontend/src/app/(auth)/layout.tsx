'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <Link href="/">
                        <img
                            className="mx-auto h-auto w-48 cursor-pointer"
                            src="/logo.png"
                            alt="Toi Invite Logo"
                        />
                    </Link>
                    {children}
                </div>
            </div>
        </div>
    );
}
