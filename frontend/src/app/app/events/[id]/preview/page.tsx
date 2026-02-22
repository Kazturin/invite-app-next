'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import {
    MusicalNoteIcon,
    PhotoIcon,
    MapPinIcon,
    ArrowTopRightOnSquareIcon,
    PencilSquareIcon,
    CheckCircleIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';
import Spinner from '@/components/Spinner';
import Countdown from '@/components/Countdown';
import Calendar from '@/components/Calendar';
import Gallery from '@/components/Gallery';

interface PageProps {
    params: Promise<{ id: string }>;
}

const PreviewPage = ({ params }: PageProps) => {
    const { id } = use(params);
    const router = useRouter();
    const { getEvent, getWatermarkInvitation, event } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [watermarkInvitation, setWatermarkInvitation] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const eventData = await getEvent(id);
                if (eventData.invitation?.invitation_img_path) {
                    const watermarkData = await getWatermarkInvitation(eventData.invitation.invitation_img_path);
                    setWatermarkInvitation(watermarkData);
                }
            } catch (err) {
                console.error('Failed to fetch event data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, getEvent, getWatermarkInvitation]);

    const initializeAudio = () => {
        if (audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPaused(false))
                    .catch(err => console.warn('Audio autoplay failed:', err));
            }
        }
    };

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPaused) {
                audioRef.current.play();
                setIsPaused(false);
            } else {
                audioRef.current.pause();
                setIsPaused(true);
            }
        }
    };

    useEffect(() => {
        const handleInteraction = () => {
            initializeAudio();
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };

        document.addEventListener('click', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);

        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };
    }, []);

    const getVideoId = (url: string) => {
        const regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|u\/\w\/|watch\?v=|&v=|shorts\/))([a-zA-Z0-9_-]{11})(?:[^\s]*)$/;
        const match = url.match(regExp);
        return (match && match[1].length === 11) ? match[1] : null;
    };

    const finishBtn = () => {
        const routeUrl = event.data?.order?.status === 0
            ? `/app/events/${id}/success`
            : `/app/events/${id}`;
        router.push(routeUrl);
    };

    if (loading || !event.data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Spinner />
            </div>
        );
    }

    const eventDetails = event.data;

    return (
        <div className="bg-[#fcf8f5] min-h-screen mt-4">
            <div className="container mx-auto bg-white pb-10 shadow-2xl relative overflow-hidden ring-1 ring-gray-100">
                {/* Subtle Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

                {/* Sticky Header */}
                <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-4 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest">Preview Mode</span>
                    </div>
                    <div className="flex gap-2 sm:gap-4">
                        <Link
                            href={`/app/events/${id}/update`}
                            className="group relative inline-flex items-center px-4 sm:px-6 py-2 border-2 border-gray-100 text-gray-600 text-sm font-bold rounded-lg transition-all duration-300 hover:border-theme-secondary/20 hover:text-theme-secondary active:scale-95 gap-2 cursor-pointer"
                        >
                            <PencilSquareIcon className="w-4 h-4 transition-transform group-hover:rotate-12" />
                            <span className="hidden sm:inline">Өңдеу</span>
                        </Link>
                        <button
                            onClick={finishBtn}
                            className="group relative inline-flex items-center px-6 sm:px-8 py-2 bg-theme-secondary text-white text-sm font-bold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-theme-secondary/20 active:scale-95 gap-2 cursor-pointer"
                        >
                            <CheckCircleIcon className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">Аяқтау</span>
                        </button>
                    </div>
                </div>

                {/* Hero Section with Invitation Preview */}
                <div
                    style={{ backgroundImage: `url(${eventDetails.invitation?.bg_img})` }}
                    className="bg-no-repeat bg-cover bg-center w-full aspect-[4/3] sm:aspect-auto sm:h-[600px] flex items-center justify-center relative overflow-hidden"
                >
                    {/* Glass Overlay for depth */}
                    <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]"></div>

                    <div className="relative w-full max-w-[650px] h-full flex items-center justify-center p-4">
                        {eventDetails.invitation?.template?.envelope_img && (
                            <img
                                className="w-[80%] max-w-[384px] absolute top-[10%] left-[5%] -rotate-12 opacity-90 transition-all duration-1000 animate-in fade-in slide-in-from-left-8"
                                src={eventDetails.invitation.template.envelope_img}
                                alt="Envelope"
                            />
                        )}
                        <div className="relative w-[70%] max-w-[320px] z-10 drop-shadow-2xl animate-invitation-float">
                            {watermarkInvitation ? (
                                <img
                                    className="w-full h-auto rounded-sm shadow-2xl ring-1 ring-white/20"
                                    src={watermarkInvitation}
                                    alt="Invitation"
                                />
                            ) : (
                                <div className="aspect-[3/4] bg-white/20 backdrop-blur-md rounded-sm flex items-center justify-center border border-white/30">
                                    <Spinner />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-4 py-12 max-w-4xl mx-auto space-y-16">
                    {/* Description Section */}
                    <div className="text-center space-y-8">
                        <div
                            className="text-lg sm:text-2xl font-medium leading-relaxed text-gray-800 break-words"
                            dangerouslySetInnerHTML={{ __html: eventDetails.description }}
                        />

                        {/* Decorative Divider & Countdown */}
                        <div className="relative space-y-8 pt-8">
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-200"></div>
                                <div className="text-yellow-500">
                                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                                        <path d="M12,2L14.5,9H22L15.5,13.5L18,21L12,16.5L6,21L8.5,13.5L2,9H9.5L12,2Z" />
                                    </svg>
                                </div>
                                <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-200"></div>
                            </div>

                            <div className="space-y-4">
                                <span className="text-xs font-bold text-amber-800 uppercase tracking-[0.3em]">
                                    Тойға дейін қалды
                                </span>
                                <Countdown deadline={eventDetails.date} />
                            </div>
                        </div>
                    </div>

                    {/* Calendar Section */}
                    <div className="max-w-md mx-auto transform hover:scale-[1.02] transition-transform duration-500">
                        <Calendar date={eventDetails.date} />
                    </div>

                    {/* Photo Gallery Link Section */}
                    {eventDetails.photos_link && (
                        <div className="max-w-md mx-auto">
                            <a
                                href={eventDetails.photos_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-amber-50 p-3 rounded-xl group-hover:bg-amber-100 transition-colors">
                                        <PhotoIcon className="w-7 h-7 text-amber-600" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ФОТО ГАЛЕРЕЯ</span>
                                        <span className="block text-lg font-bold text-gray-800">Фотоларды көру</span>
                                    </div>
                                </div>
                                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-amber-600 group-hover:text-white transition-all">
                                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                                </div>
                            </a>
                        </div>
                    )}

                    {/* Video Link Section */}
                    {eventDetails.video_link && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 px-2">
                                <div className="bg-red-50 p-2 rounded-lg">
                                    <VideoCameraIcon className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Бейнеролик</h3>
                            </div>
                            <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-200">
                                <iframe
                                    src={`https://www.youtube.com/embed/${getVideoId(eventDetails.video_link)}`}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}

                    {/* Address & Map Section */}
                    <div className="bg-white p-8 sm:p-12 border border-gray-50 shadow-2xl rounded-[2.5rem] text-gray-800 space-y-8 text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <MapPinIcon className="w-32 h-32 text-indigo-600" />
                        </div>

                        <div className="relative space-y-4">
                            <div className="bg-indigo-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                                <MapPinIcon className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Мекен-жайымыз</h2>
                            <p className="text-xl text-gray-500 font-medium">
                                {eventDetails.place}
                            </p>
                        </div>

                        {eventDetails.address?.address && (
                            <div className="relative pt-8 border-t border-gray-50 space-y-6">
                                {eventDetails.address.address.startsWith('http') ? (
                                    <div className="space-y-6">
                                        <p className="text-gray-400 text-sm font-medium">
                                            Картаны ашу үшін төмендегі батырманы басыңыз
                                        </p>
                                        <a
                                            href={eventDetails.address.address}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-95 gap-3 group"
                                        >
                                            <span>Картаны ашу</span>
                                            <ArrowTopRightOnSquareIcon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-lg text-gray-700 bg-gray-50 px-8 py-4 rounded-2xl border border-gray-100 italic">
                                        {eventDetails.address.address}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Gallery Section */}
                    {eventDetails.images && eventDetails.images.length > 0 && (
                        <div className="pt-8">
                            <Gallery images={eventDetails.images} />
                        </div>
                    )}
                </div>

                {/* Floating Music Toggle */}
                {eventDetails.audio && (
                    <>
                        <audio src={eventDetails.audio} ref={audioRef} loop className="hidden" />
                        <div className="fixed bottom-8 right-8 z-40">
                            <button
                                onClick={toggleAudio}
                                className={`
                                    relative w-16 h-16 rounded-2xl flex justify-center items-center cursor-pointer 
                                    transition-all duration-500 shadow-2xl ring-4 ring-white active:scale-95
                                    ${isPaused ? 'bg-gray-400' : 'bg-gradient-to-br from-indigo-500 to-indigo-700'}
                                `}
                            >
                                {/* Pulse waves when playing */}
                                {!isPaused && (
                                    <>
                                        <div className="absolute inset-0 rounded-2xl animate-ping bg-indigo-400 opacity-20"></div>
                                        <div className="absolute inset-0 rounded-2xl animate-ping bg-indigo-400 opacity-10 [animation-delay:0.5s]"></div>
                                    </>
                                )}

                                {isPaused ? (
                                    <MusicalNoteIcon className="w-8 h-8 text-white" />
                                ) : (
                                    <div className="flex items-end gap-1 h-6">
                                        <div className="w-1 bg-white animate-[music-bar_0.8s_ease-in-out_infinite] h-3"></div>
                                        <div className="w-1 bg-white animate-[music-bar_0.6s_ease-in-out_infinite_0.1s] h-5"></div>
                                        <div className="w-1 bg-white animate-[music-bar_1s_ease-in-out_infinite_0.2s] h-4"></div>
                                        <div className="w-1 bg-white animate-[music-bar_0.8s_ease-in-out_infinite] h-6"></div>
                                    </div>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Global Music Bar Animations */}
            <style jsx global>{`
                @keyframes music-bar {
                    0%, 100% { height: 8px; }
                    50% { height: 20px; }
                }
                
                @keyframes invitation-float {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(-10px) rotate(1deg); }
                }
                
                .animate-invitation-float {
                    animation: invitation-float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default PreviewPage;
