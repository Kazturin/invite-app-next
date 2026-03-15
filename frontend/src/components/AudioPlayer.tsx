'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MusicalNoteIcon } from '@heroicons/react/24/solid';

interface AudioPlayerProps {
    src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
    const [isPaused, setIsPaused] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hasInteracted = useRef(false);

    const toggleAudio = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!audioRef.current) return;

        // If user manually interacts, we consider the "first interaction" done
        hasInteracted.current = true;

        if (audioRef.current.paused) {
            audioRef.current.play()
                .then(() => setIsPaused(false))
                .catch(console.warn);
        } else {
            audioRef.current.pause();
            setIsPaused(true);
        }
    };

    useEffect(() => {
        const handleFirstInteraction = () => {
            if (hasInteracted.current) {
                // Already handled by manual click or previous first interaction
                cleanup();
                return;
            }

            if (audioRef.current) {
                audioRef.current.play()
                    .then(() => {
                        setIsPaused(false);
                        hasInteracted.current = true;
                        cleanup();
                    })
                    .catch((err) => {
                        // If it fails (e.g. still blocked), we don't consider it "interacted" 
                        // so it can try again on next click.
                        console.log("Autoplay blocked, waiting for next interaction", err);
                    });
            }
        };

        const cleanup = () => {
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);

        return () => {
            cleanup();
        };
    }, []);

    if (!src) return null;

    return (
        <>
            <audio ref={audioRef} src={src} loop className="hidden" />
            <div className="fixed bottom-8 right-8 z-40">
                <div
                    onClick={toggleAudio}
                    className={`relative w-16 h-16 rounded-full flex justify-center items-center cursor-pointer transition-all duration-500 shadow-xl border-4 border-white active:scale-95 ${isPaused ? 'bg-gray-400' : 'bg-gradient-to-br from-amber-400 to-amber-600'
                        }`}
                >
                    {/* Pulse waves when playing */}
                    {!isPaused && (
                        <>
                            <div className="absolute inset-0 rounded-full animate-ping bg-amber-400 opacity-20"></div>
                            <div className="absolute inset-0 rounded-full animate-ping bg-amber-400 opacity-10 [animation-delay:0.5s]"></div>
                        </>
                    )}

                    {isPaused ? (
                        <MusicalNoteIcon className="w-8 h-8 text-white transition-all" />
                    ) : (
                        <div className="relative flex items-end gap-0.5 h-6">
                            <div className="w-1 bg-white animate-music-bar-1 h-3"></div>
                            <div className="w-1 bg-white animate-music-bar-2 h-5"></div>
                            <div className="w-1 bg-white animate-music-bar-3 h-4"></div>
                            <div className="w-1 bg-white animate-music-bar-1 h-6"></div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AudioPlayer;
