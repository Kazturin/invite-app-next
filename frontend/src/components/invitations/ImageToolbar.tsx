'use client';

import React, { useRef } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

interface ImageToolbarProps {
    selectedObject: any;
    onAddImage: (file: File) => void;
    onDeleteSelected: () => void;
}

const ImageToolbar: React.FC<ImageToolbarProps> = ({
    selectedObject,
    onAddImage,
    onDeleteSelected,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const onImageChoose = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        onAddImage(file);
        event.target.value = '';
    };

    const isUserImageSelected = selectedObject && selectedObject.isUserImage;

    return (
        <div className="flex justify-center items-center gap-4 py-4">
            <button
                onClick={triggerFileInput}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg text-2xl hover:bg-blue-600 transition-colors"
            >
                Суретті өзгерту
            </button>

            {isUserImageSelected && (
                <TrashIcon
                    onClick={onDeleteSelected}
                    className="text-red-500 w-7 h-7 md:w-10 md:h-10 cursor-pointer hover:text-red-600 transition-colors"
                />
            )}

            <input
                ref={fileInputRef}
                type="file"
                onChange={onImageChoose}
                className="hidden"
                accept="image/*"
            />
        </div>
    );
};

export default ImageToolbar;
