import React from 'react';
import Spinner from '@/components/Spinner';

export default function Loading() {
    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <Spinner />
                <p className="mt-4 text-gray-500 font-medium tracking-wide animate-pulse">
                    Санатты жүктеу...
                </p>
            </div>
        </main>
    );
}
