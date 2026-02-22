'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface CountdownProps {
    deadline: string;
    speed?: number;
}

const Countdown: React.FC<CountdownProps> = ({ deadline, speed = 1000 }) => {
    const calculateTimeLeft = useCallback(() => {
        const difference = Date.parse(deadline) - Date.parse(new Date().toString());
        return difference > 0 ? difference : null;
    }, [deadline]);

    const [currentTime, setCurrentTime] = useState<number | null>(null);

    useEffect(() => {
        setCurrentTime(calculateTimeLeft());
        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setCurrentTime(remaining);
            if (remaining === null) {
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [calculateTimeLeft, speed]);

    const formatTime = (value: number) => (value < 10 ? `0${value}` : value);

    if (currentTime === null) return null;

    const seconds = formatTime(Math.floor((currentTime / 1000) % 60));
    const minutes = formatTime(Math.floor((currentTime / 1000 / 60) % 60));
    const hours = formatTime(Math.floor((currentTime / (1000 * 60 * 60)) % 24));
    const days = formatTime(Math.floor(currentTime / (1000 * 60 * 60 * 24)));

    return (
        <div className="countdown-container py-4">
            <div className="flex justify-center items-center gap-3 sm:gap-6">
                {/* Days */}
                {parseInt(days.toString()) > 0 && (
                    <div className="flex flex-col items-center transition-transform duration-300 group">
                        <div className="relative flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 bg-white border border-yellow-200 rounded-2xl shadow-lg mb-2 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-yellow-400 font-bold text-xl sm:text-2xl text-gray-800">
                            <span className="z-10">{days}</span>
                            <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        </div>
                        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-semibold">күн</span>
                    </div>
                )}

                {/* Hours */}
                {(parseInt(hours.toString()) > 0 || parseInt(days.toString()) > 0) && (
                    <div className="flex flex-col items-center transition-transform duration-300 group">
                        <div className="relative flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 bg-white border border-yellow-200 rounded-2xl shadow-lg mb-2 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-yellow-400 font-bold text-xl sm:text-2xl text-gray-800">
                            <span className="z-10">{hours}</span>
                            <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        </div>
                        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-semibold">сағат</span>
                    </div>
                )}

                {/* Minutes */}
                <div className="flex flex-col items-center transition-transform duration-300 group">
                    <div className="relative flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 bg-white border border-yellow-200 rounded-2xl shadow-lg mb-2 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-yellow-400 font-bold text-xl sm:text-2xl text-gray-800">
                        <span className="z-10">{minutes}</span>
                        <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-semibold">минут</span>
                </div>

                {/* Seconds */}
                <div className="flex flex-col items-center transition-transform duration-300 group">
                    <div className="relative flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 bg-white border border-yellow-200 rounded-2xl shadow-lg mb-2 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-yellow-400 font-bold text-xl sm:text-2xl text-gray-800">
                        <span className="z-10 text-yellow-600">{seconds}</span>
                        <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-semibold">секунд</span>
                </div>
            </div>
        </div>
    );
};

export default Countdown;
