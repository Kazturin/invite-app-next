'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const pathname = usePathname();
    const isInvitationPage = pathname?.startsWith('/toi/');

    return (
        <>
            {!isInvitationPage && <Header />}
            {children}
            {!isInvitationPage && <Footer />}
        </>
    );
};

export default MainLayout;
