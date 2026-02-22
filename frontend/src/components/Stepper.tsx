'use client';

import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

export interface StepTab {
    title_kk: string;
    title_ru: string;
    isValid: boolean;
}

interface StepperProps {
    step: number;
    tabs?: StepTab[];
    onNext?: () => void;
    onBack?: () => void;
    onComplete?: () => void;
    nextText?: string;
    backText?: string;
    doneText?: string;
    loading?: boolean;
    children: React.ReactNode;
}

const defaultTabs: StepTab[] = [
    {
        title_kk: 'Шаблонды таңдаңыз',
        title_ru: 'Выберите шаблон',
        isValid: true,
    },
    {
        title_kk: 'Шаблонға тексттер енгізу',
        title_ru: 'Вставка текстов в шаблон',
        isValid: true,
    },
    {
        title_kk: 'Форманы толтыру',
        title_ru: 'Заполнение формы',
        isValid: true,
    },
];

const Stepper: React.FC<StepperProps> = ({
    step,
    tabs = defaultTabs,
    onNext,
    onBack,
    onComplete,
    nextText = 'Келесі қадам',
    backText = 'Артқа',
    doneText = 'Соңы',
    loading = false,
    children,
}) => {
    const progress = ((step - 1) / (tabs.length - 1)) * 100;

    return (
        <div className="w-full mx-auto px-4 py-8">
            {/* Stepper Header */}
            <div className="relative mb-20">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
                <div
                    className="absolute top-1/2 left-0 h-0.5 bg-theme-secondary -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                />

                <div className="relative z-10 flex justify-between">
                    {tabs.map((tab, index) => {
                        const stepNumber = index + 1;
                        const isCurrent = step === stepNumber;
                        const isCompleted = step > stepNumber;

                        return (
                            <div key={index} className="flex flex-col items-center group">
                                <div
                                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCurrent
                                        ? 'bg-theme-secondary border-theme-secondary text-white'
                                        : isCompleted
                                            ? 'bg-white border-theme-secondary text-theme-secondary'
                                            : 'bg-white border-gray-200 text-gray-400'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <CheckIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                                    ) : (
                                        <span className="text-xl sm:text-2xl font-bold">{stepNumber}</span>
                                    )}
                                </div>
                                <span
                                    className={`absolute -bottom-10 text-center text-xs sm:text-sm font-medium w-32 transition-colors duration-500 ${isCurrent ? 'text-gray-900' : isCompleted ? 'text-theme-secondary' : 'text-gray-400'
                                        }`}
                                >
                                    {tab.title_kk}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mb-4">
                {step > 1 && (
                    <button
                        onClick={onBack}
                        className="px-6 py-3 text-sm bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-full hover:bg-gray-50 transition-all cursor-pointer"
                    >
                        {backText}
                    </button>
                )}
                <div className="ml-auto">
                    {step < tabs.length ? (
                        <button
                            onClick={onNext}
                            disabled={!tabs[step - 1].isValid || loading}
                            className="px-6 py-3 bg-theme-secondary text-sm text-white font-bold rounded-full hover:shadow-lg disabled:opacity-50 flex items-center transition-all cursor-pointer"
                        >
                            {loading && (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {nextText}
                        </button>
                    ) : (
                        <button
                            onClick={onComplete}
                            disabled={!tabs[step - 1].isValid || loading}
                            className="px-6 py-3 bg-green-600 text-sm text-white font-bold rounded-full hover:shadow-lg disabled:opacity-50 flex items-center transition-all cursor-pointer"
                        >
                            {loading && (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {doneText}
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 sm:p-10 mb-8 min-h-[400px]">
                {children}
            </div>


        </div>
    );
};

export default Stepper;
