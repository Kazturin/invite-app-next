'use client';

import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface TextToolbarProps {
    selectedObject: any;
    fonts: { key: string; name: string }[];
    onAddText: () => void;
    onChangeFontStyle: () => void;
    onChangeFontWeight: () => void;
    onChangeFontSize: (delta: number) => void;
    onSetFontSize: (size: string) => void;
    onChangeTextColor: (color: string) => void;
    onCenterText: () => void;
    onChangeFont: (font: string) => void;
    onDeleteSelected: () => void;
    onChangeTextCase: (type: 'uppercase' | 'lowercase') => void;
}

const TextToolbar: React.FC<TextToolbarProps> = ({
    selectedObject,
    fonts,
    onAddText,
    onChangeFontStyle,
    onChangeFontWeight,
    onChangeFontSize,
    onSetFontSize,
    onChangeTextColor,
    onCenterText,
    onChangeFont,
    onDeleteSelected,
    onChangeTextCase,
}) => {
    const isTextSelected = selectedObject && (selectedObject.type === 'i-text' || selectedObject.type === 'IText');

    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            <button onClick={onAddText} title="Добавить текст">
                <Image src="/icons/add_text.svg" alt="Добавить текст" width={40} height={40} className="w-7 h-7 md:w-10 md:h-10" />
            </button>

            {isTextSelected ? (
                <>
                    <button
                        onClick={onChangeFontStyle}
                        className={cn(
                            'border-2 border-gray-400 text-gray-400 w-7 h-7 md:w-10 md:h-10 p-1 italic text-xs md:text-base flex items-center justify-center hover:bg-gray-100',
                            selectedObject.fontStyle === 'italic' && 'bg-gray-200'
                        )}
                    >
                        I
                    </button>
                    <button
                        onClick={onChangeFontWeight}
                        className={cn(
                            'border-2 border-gray-400 text-gray-400 w-7 h-7 md:w-10 md:h-10 p-1 font-bold text-xs md:text-base flex items-center justify-center hover:bg-gray-100',
                            selectedObject.fontWeight === 'bold' && 'bg-gray-200'
                        )}
                    >
                        B
                    </button>
                    <button
                        onClick={() => onChangeTextCase('uppercase')}
                        className="border-2 border-gray-400 text-gray-400 w-7 h-7 md:w-10 md:h-10 p-1 font-bold text-xs md:text-sm flex items-center justify-center hover:bg-gray-100"
                        title="Uppercase"
                    >
                        AA
                    </button>
                    <button
                        onClick={() => onChangeTextCase('lowercase')}
                        className="border-2 border-gray-400 text-gray-400 w-7 h-7 md:w-10 md:h-10 p-1 font-bold text-xs md:text-sm flex items-center justify-center hover:bg-gray-100"
                        title="Lowercase"
                    >
                        aa
                    </button>

                    <div className="text-center flex items-center space-x-4 border-gray-600 pr-3 border-r">
                        <div className="flex items-center border-2 border-gray-500 rounded-xl overflow-hidden">
                            <div
                                onClick={() => onChangeFontSize(2)}
                                className="select-none cursor-pointer p-1 text-xl font-semibold w-7 h-7 md:w-10 md:h-10 text-gray-500 text-center"
                            >
                                +
                            </div>
                            <div className="flex items-center text-gray-500 border-l border-r border-gray-500">
                                <input
                                    type="number"
                                    value={Math.round(selectedObject.fontSize)}
                                    onChange={(e) => onSetFontSize(e.target.value)}
                                    min="20"
                                    max="176"
                                    className="border-none p-0 text-xs md:text-sm w-7 h-7 md:w-10 md:h-10 font-semibold text-center outline-none"
                                />
                            </div>
                            <div
                                onClick={() => onChangeFontSize(-2)}
                                className="select-none cursor-pointer p-1 text-xl font-semibold w-7 h-7 md:w-10 md:h-10 text-gray-500 text-center"
                            >
                                -
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 border-r border-gray-600 pr-3 md:pr-6">
                        <input
                            type="color"
                            className="w-7 h-7 md:w-10 md:h-10 rounded-md cursor-pointer border-none"
                            value={selectedObject.fill}
                            onChange={(e) => onChangeTextColor(e.target.value)}
                        />
                    </div>

                    <button
                        className="text-gray-500 border-r border-gray-600 pr-3 md:pr-6"
                        onClick={onCenterText}
                        title="Центрировать текст"
                    >
                        <svg className="mx-auto w-7 h-7 md:w-10 md:h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="m6 17.75c0-.414.336-.75.75-.75h10.5c.414 0 .75.336.75.75s-.336.75-.75.75h-10.5c-.414 0-.75-.336-.75-.75zm-4-4c0-.414.336-.75.75-.75h18.5c.414 0 .75.336.75.75s-.336.75-.75.75h-18.5c-.414 0-.75-.336-.75-.75zm0-4c0-.414.336-.75.75-.75h18.5c.414 0 .75.336.75.75s-.336.75-.75.75h-18.5c-.414 0-.75-.336-.75-.75zm4-4c0-.414.336-.75.75-.75h10.5c.414 0 .75.336.75.75s-.336.75-.75.75h-10.5c-.414 0-.75-.336-.75-.75z"
                                fillRule="nonzero"
                            />
                        </svg>
                    </button>

                    <div className="text-left">
                        <select
                            value={selectedObject.fontFamily}
                            onChange={(e) => onChangeFont(e.target.value)}
                            className="rounded-md p-1 md:p-2 border border-gray-300 outline-none"
                        >
                            {fonts.map((font) => (
                                <option key={font.key} value={font.key} className="text-base md:text-lg">
                                    {font.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <TrashIcon onClick={onDeleteSelected} className="text-red-500 w-7 h-7 md:w-10 md:h-10 cursor-pointer" />
                </>
            ) : (
                <p className="text-2xl md:text-3xl font-baltica">Текст таңдаңыз</p>
            )}
        </div>
    );
};

export default TextToolbar;
