'use client';

import React from 'react';

interface CalendarProps {
    date: string;
    locale?: string;
}

const Calendar: React.FC<CalendarProps> = ({ date, locale = 'kk' }) => {
    const days = {
        kk: ['дс', 'сс', 'ср', 'бс', 'жм', 'сб', 'жб'],
        ru: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
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

    const daysNumber: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 0: 7 };

    const currentMonthInName = () => {
        // @ts-ignore
        return months[locale][currentMonthInNumber];
    };

    const daysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const startDay = () => {
        return new Date(currentYear, currentMonthInNumber, 1).getDay();
    };

    return (
        <div className="bg-white rounded-md shadow-lg overflow-hidden">
            <section className="py-2 px-4 text-white bg-gradient-to-r from-[#dbaf97] to-[#b77856]">
                <h1 className="text-center text-md font-semibold">
                    {currentMonthInName()} {currentYear}
                </h1>
            </section>
            <section>
                <div className="text-center grid grid-cols-7">
                    {/* @ts-ignore */}
                    {days[locale].map((day, index) => (
                        <p className="p-2 text-xs md:text-sm" key={index}>
                            {day}
                        </p>
                    ))}
                </div>
            </section>
            <section>
                <div className="p-2 grid grid-cols-7 w-full text-center">
                    {[...Array(daysNumber[startDay()] - 1)].map((_, i) => (
                        <p className="py-2 text-gray-200" key={`empty-${i}`}>
                            {' '}
                            ·{' '}
                        </p>
                    ))}
                    {[...Array(daysInMonth(currentYear, currentMonthInNumber))].map((_, i) => {
                        const dateNum = i + 1;
                        const isEventDay = dateNum === currentDay;
                        return (
                            <div key={dateNum} className="relative py-1 flex justify-center items-center">
                                <p
                                    className={cn(
                                        'w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full transition-all duration-300 text-sm md:text-base',
                                        isEventDay
                                            ? 'bg-theme-secondary text-white shadow-lg scale-110 z-10'
                                            : 'text-gray-500 hover:bg-gray-50'
                                    )}
                                >
                                    {dateNum}
                                </p>
                                {isEventDay && (
                                    <div className="absolute -top-1 -right-1 text-red-500 animate-bounce">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

export default Calendar;
