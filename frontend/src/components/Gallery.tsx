'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';

interface GalleryProps {
    images: any[];
    title?: string;
}

const Gallery: React.FC<GalleryProps> = ({ images = [], title = 'Фотогалерея' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const getImageUrl = (image: any) => {
        if (typeof image === 'string') return image;
        return image.path ? `/storage/${image.path}` : image.url;
    };

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = useCallback(() => {
        setIsOpen(false);
        document.body.style.overflow = '';
    }, []);

    const nextImage = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
            document.body.style.overflow = '';
        };
    }, [isOpen, closeLightbox, nextImage, prevImage]);

    if (!images || images.length === 0) return null;

    return (
        <div className="my-8">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 font-baltica">{title}</h2>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4 sm:px-0">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md aspect-square"
                        onClick={() => openLightbox(index)}
                    >
                        <Image
                            src={image.path}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            alt="Gallery Image"
                            width={300}
                            height={300}
                            unoptimized={image.path?.includes('localhost:8000')}
                        />
                        <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 transform scale-50 group-hover:scale-100 transition-transform duration-300 border border-white/30 text-white">
                                <MagnifyingGlassPlusIcon className="h-8 w-8" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm transition-opacity duration-300"
                    onClick={(e) => e.target === e.currentTarget && closeLightbox()}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none z-50 p-2"
                    >
                        <XMarkIcon className="h-8 w-8" />
                    </button>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 text-white hover:text-gray-300 focus:outline-none z-50 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors"
                            >
                                <ChevronLeftIcon className="h-8 w-8" />
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 text-white hover:text-gray-300 focus:outline-none z-50 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors"
                            >
                                <ChevronRightIcon className="h-8 w-8" />
                            </button>
                        </>
                    )}

                    {/* Main Image */}
                    <div className="relative max-w-full max-h-screen p-4 flex items-center justify-center">
                        <Image
                            src={images[currentIndex].path}
                            className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl rounded-sm select-none animate-in fade-in zoom-in duration-300"
                            alt="Gallery Image Full"
                            width={1200}
                            height={1200}
                        />
                    </div>

                    {/* Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded-full">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
