import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChanged: (page: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChanged,
    className = '',
}) => {
    if (totalPages <= 1) return null;

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onPageChanged(page);
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Always show last page
            if (!pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <nav aria-label="Page navigation" className={`flex justify-center items-center gap-1 sm:gap-2 ${className}`}>
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all border ${currentPage === 1
                    ? 'text-gray-300 border-gray-100 cursor-not-allowed'
                    : 'text-theme-primary border-theme-primary hover:bg-theme-primary hover:text-white cursor-pointer'
                    }`}
                aria-label="Previous page"
            >
                <ChevronLeftIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {typeof page === 'number' ? (
                            <button
                                onClick={() => goToPage(page)}
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm sm:text-base font-bold transition-all ${currentPage === page
                                    ? 'bg-theme-primary text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100 cursor-pointer border border-transparent hover:border-gray-200'
                                    }`}
                            >
                                {page}
                            </button>
                        ) : (
                            <span className="px-1 text-gray-400 font-bold">{page}</span>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all border ${currentPage === totalPages
                    ? 'text-gray-300 border-gray-100 cursor-not-allowed'
                    : 'text-theme-primary border-theme-primary hover:bg-theme-primary hover:text-white cursor-pointer'
                    }`}
                aria-label="Next page"
            >
                <ChevronRightIcon className="w-5 h-5" />
            </button>
        </nav>
    );
};

export default Pagination;


