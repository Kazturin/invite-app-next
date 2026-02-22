import React from 'react';

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

    return (
        <nav aria-label="Page navigation" className={className}>
            <ul className="flex justify-center space-x-4">
                <li>
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-6 py-2 rounded font-semibold transition-all shadow-md ${currentPage === 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-theme-primary text-white hover:bg-white hover:text-theme-primary border-2 border-transparent hover:border-theme-primary'
                            }`}
                    >
                        Артқа
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-6 py-2 rounded font-semibold transition-all shadow-md ${currentPage === totalPages
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-theme-primary text-white hover:bg-white hover:text-theme-primary border-2 border-transparent hover:border-theme-primary'
                            }`}
                    >
                        Келесі
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
