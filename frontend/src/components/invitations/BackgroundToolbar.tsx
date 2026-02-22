'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BackgroundToolbarProps {
    backgroundImages: { original: string; thumbnail: string }[];
    currentBg: string | null;
    onChangeBackground: (image: string) => void;
}

const BackgroundToolbar: React.FC<BackgroundToolbarProps> = ({
    backgroundImages,
    currentBg,
    onChangeBackground,
}) => {
    return (
        <div className="flex justify-center space-x-2 overflow-x-auto py-2 bg-gray-100 border-b border-gray-300 w-full">
            <div className="slider-container overflow-x-auto whitespace-nowrap p-[10px] bg-[#f9f9f9] border-b border-[#ddd]">
                <div className="slider flex gap-[10px]">
                    {backgroundImages.map((image, index) => (
                        <div
                            key={index}
                            className={cn(
                                'slider-item flex-[0_0_auto] w-[60px] h-[60px] border-2 border-transparent cursor-pointer transition-[border-color] duration-300',
                                currentBg === image.original && 'border-[#007bff]'
                            )}
                            onClick={() => onChangeBackground(image.original)}
                        >
                            <Image
                                src={image.thumbnail}
                                alt={`Background ${index}`}
                                width={60}
                                height={60}
                                className="slider-image w-full h-full object-cover rounded-[4px]"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BackgroundToolbar;
