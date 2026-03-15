'use client';

import React from 'react';
import { useLocale } from 'next-intl';

interface CalendarProps {
    date: string;
    locale?: string;
}

const Calendar: React.FC<CalendarProps> = ({ date, locale: providedLocale }) => {
    const currentLocale = useLocale();
    const locale = providedLocale || currentLocale;

    const days = {
        kk: ['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб', 'Жб'],
        ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    };

    const months = {
        kk: [
            'Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым',
            'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан',
        ],
        ru: [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
        ],
    };

    const eventDate = new Date(date);
    const currentYear = eventDate.getFullYear();
    const currentMonthInNumber = eventDate.getMonth();
    const currentDay = eventDate.getDate();

    // Adjusted to start from Monday (1) to Sunday (7)
    const getStartDay = () => {
        let day = new Date(currentYear, currentMonthInNumber, 1).getDay();
        return day === 0 ? 7 : day;
    };

    const currentMonthInName = () => {
        // @ts-ignore
        return months[locale]?.[currentMonthInNumber] || months['ru'][currentMonthInNumber];
    };

    const daysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const startDay = getStartDay();

    return (
        <div className="w-full select-none">
            {/* Calendar Header */}
            <header className="mb-8 flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-amber-600 mb-1">
                    {currentYear}
                </span>
                <h2 className="text-3xl font-serif italic text-stone-800">
                    {currentMonthInName()}
                </h2>
                <div className="w-12 h-px bg-amber-200 mt-4"></div>
            </header>

            {/* Days of Week */}
            <div className="grid grid-cols-7 mb-4">
                {/* @ts-ignore */}
                {(days[locale] || days['ru']).map((day, index) => (
                    <div key={index} className="py-2 text-center text-[10px] font-black text-stone-400 uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 text-center">
                {/* Empty slots for the first week */}
                {[...Array(startDay - 1)].map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square flex justify-center items-center">
                        <span className="w-1 h-1 rounded-full bg-stone-100"></span>
                    </div>
                ))}

                {/* Actual days of the month */}
                {[...Array(daysInMonth(currentYear, currentMonthInNumber))].map((_, i) => {
                    const dateNum = i + 1;
                    const isEventDay = dateNum === currentDay;

                    return (
                        <div key={dateNum} className="aspect-square relative flex justify-center items-center">
                            {isEventDay ? (
                                <div className="relative group cursor-default">
                                    {/* Animated pulse background for event day */}
                                    <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping scale-125"></div>
                                    <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-pulse"></div>
                                    
                                    <div className="relative w-10 h-10 md:w-12 md:h-12 flex flex-col justify-center items-center bg-amber-600 text-white rounded-full shadow-lg shadow-amber-600/30 font-bold z-10">
                                        <span className="text-sm md:text-base leading-none">{dateNum}</span>
                                        <div className="mt-0.5">
                                            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white animate-pulse">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <span className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-stone-600 text-sm md:text-base font-medium rounded-full hover:bg-stone-50 transition-colors">
                                    {dateNum}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
