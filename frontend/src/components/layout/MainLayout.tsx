'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './Header';
import Footer from './Footer';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const pathname = usePathname();
    const isInvitationPage = pathname?.startsWith('/toi/');

    return (
        <GoogleOAuthProvider clientId="292704683290-uqm9jjau6r4vcbi5kn7upc7go9k8mebf.apps.googleusercontent.com">
            {!isInvitationPage && <Header />}
            {children}
            {!isInvitationPage && <Footer />}
        </GoogleOAuthProvider>
    );
};

export default MainLayout;
