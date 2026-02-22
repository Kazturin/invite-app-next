import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { useFabric } from '@/hooks/useFabric';
import { FONTS, BACKGROUND_IMAGES } from '@/data/invitation-constants';
import { cn } from '@/lib/utils';
import TextToolbar from './TextToolbar';
import BackgroundToolbar from './BackgroundToolbar';
import ImageToolbar from './ImageToolbar';

interface InvitationTemplateProps {
    template: any;
    content: any;
    edit?: boolean;
    bg_img?: string | null;
    onUpdateContent: (content: any) => void;
    onUpdateBgImg: (bgImg: string) => void;
}

export interface InvitationTemplateRef {
    exportAsImage: () => Promise<string | null>;
}

const InvitationTemplate = forwardRef<InvitationTemplateRef, InvitationTemplateProps>(({
    template,
    content,
    edit,
    bg_img,
    onUpdateContent,
    onUpdateBgImg,
}, ref) => {
    const [editBlock, setEditBlock] = useState<'text' | 'bg' | 'image'>('text');
    const [currentBgImg, setCurrentBgImg] = useState<string | null>(bg_img || null);

    const fabricProps = React.useMemo(() => ({ template, content, bg_img: currentBgImg }), [template, content, currentBgImg]);
    const fabricEmit = React.useMemo(() => ({ onUpdateContent }), [onUpdateContent]);

    const {
        fabricCanvasRef,
        canvasWrapperRef,
        selectedObject,
        addText,
        changeFontSize,
        setFontSize,
        changeTextColor,
        changeFontStyle,
        changeFontWeight,
        centerText,
        changeFont,
        changeTextCase,
        deleteSelected,
        addImage,
        exportAsImage,
    } = useFabric(fabricProps, fabricEmit);

    useImperativeHandle(ref, () => ({
        exportAsImage
    }));

    const handleBackgroundChange = (image: string) => {
        setCurrentBgImg(image);
        onUpdateBgImg(image);
    };

    useEffect(() => {
        if (selectedObject) {
            if (selectedObject.type === 'i-text' || selectedObject.type === 'IText') {
                setEditBlock('text');
            } else if (selectedObject.type === 'image') {
                setEditBlock('image');
            }
        }
    }, [selectedObject]);

    useEffect(() => {
        if (!currentBgImg && BACKGROUND_IMAGES.length > 0) {
            const defaultBg = BACKGROUND_IMAGES[0].original;
            setCurrentBgImg(defaultBg);
            onUpdateBgImg(defaultBg);
        }
    }, []);

    return (
        <div className="relative">
            <div className="flex space-x-4 justify-center items-center py-4">
                <div
                    onClick={() => setEditBlock('text')}
                    className={cn(
                        'cursor-pointer text-center',
                        editBlock === 'text' && 'text-blue-500'
                    )}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-auto" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22 0h-20v6h1.999c0-1.174.397-3 2.001-3h4v16.874c0 1.174-.825 2.126-2 2.126h-1v2h9.999v-2h-.999c-1.174 0-2-.952-2-2.126v-16.874h4c1.649 0 2.02 1.826 2.02 3h1.98v-6z"
                        />
                    </svg>
                    <p>Текст</p>
                </div>
                <div
                    onClick={() => setEditBlock('bg')}
                    className={cn(
                        'cursor-pointer text-center',
                        editBlock === 'bg' && 'text-blue-500'
                    )}
                >
                    <PhotoIcon className="w-7 h-7 mx-auto" />
                    <p>Фон</p>
                </div>
            </div>

            <div className="w-full max-w-lg mx-auto mb-4">
                <div className="bg-white border-gray-600 border my-2">
                    <div className="min-h-[120px] flex flex-wrap items-center justify-center gap-2 px-4 py-2">
                        {editBlock === 'text' && (
                            <TextToolbar
                                selectedObject={selectedObject}
                                fonts={FONTS}
                                onAddText={addText}
                                onChangeFontStyle={changeFontStyle}
                                onChangeFontWeight={changeFontWeight}
                                onChangeFontSize={changeFontSize}
                                onSetFontSize={setFontSize}
                                onChangeTextColor={changeTextColor}
                                onCenterText={centerText}
                                onChangeFont={changeFont}
                                onDeleteSelected={deleteSelected}
                                onChangeTextCase={changeTextCase}
                            />
                        )}

                        {editBlock === 'bg' && (
                            <BackgroundToolbar
                                backgroundImages={BACKGROUND_IMAGES}
                                currentBg={currentBgImg}
                                onChangeBackground={handleBackgroundChange}
                            />
                        )}

                        {editBlock === 'image' && (
                            <ImageToolbar
                                selectedObject={selectedObject}
                                onAddImage={addImage}
                                onDeleteSelected={deleteSelected}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div
                style={{ backgroundImage: currentBgImg ? `url(${currentBgImg})` : 'none' }}
                className="relative block h-[700px] sm:h-[900px] bg-no-repeat bg-cover mb-10 flex justify-center items-center p-4"
            >
                <div ref={canvasWrapperRef} className="relative w-full h-full max-w-lg">
                    <div className="relative z-10">
                        <canvas ref={fabricCanvasRef} className="border-amber-500 border top-0 left-0"></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
});

InvitationTemplate.displayName = 'InvitationTemplate';

export default InvitationTemplate;
