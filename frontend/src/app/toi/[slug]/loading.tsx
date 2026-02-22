import React from 'react';

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-[#fdfbf7] flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                <p className="text-amber-800 font-medium animate-pulse">Жүктелуде...</p>
            </div>
        </div>
    );
}
