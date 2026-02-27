'use client';

import '../editor-fonts.css';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import Spinner from '@/components/Spinner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { token, _hasHydrated } = useUserStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Wait until store is hydrated from localStorage
        if (!_hasHydrated) return;

        const isPublicPath = pathname === '/app/select-template';

        if (!token && !isPublicPath) {
            router.push('/login');
        } else {
            setIsLoading(false);
        }
    }, [token, _hasHydrated, pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return <>{children}</>;
}
