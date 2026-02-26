'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import Spinner from '@/components/Spinner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { token } = useUserStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const isPublicPath = pathname === '/app/select-template';

        if (!token && !isPublicPath) {
            router.push('/login');
        } else {
            setIsLoading(false);
        }
    }, [token, pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return <>{children}</>;
}
