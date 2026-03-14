'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from '@/i18n/routing';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import apiClient from '@/lib/api-client';
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
import { useTranslations } from 'next-intl';

interface PageProps {
    params: Promise<{ id: string }>;
}

const PreviewPage = ({ params }: PageProps) => {
    const { id } = use(params);
    const router = useRouter();
    const t = useTranslations('InvitationPreview');
    const [isPaused, setIsPaused] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);

    const { data: myEvent, isLoading } = useSWR(`/event/${id}`, fetcher);

    const { data: watermarkData } = useSWR(
        myEvent?.invitation?.invitation_img_path ? `/invitation-watermark/${myEvent.invitation.invitation_img_path}` : null,
        async (url) => {
            const res = await apiClient.get(url);
            return res.data;
        }
    );

    const isEventPast = myEvent?.date ? new Date(myEvent.date) < new Date(new Date().setHours(0, 0, 0, 0)) : true;

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
        const routeUrl = myEvent?.order?.status === 0
            ? `/app/events/${id}/success`
            : `/app/events/${id}`;
        router.push(routeUrl as any);
    };

    if (isLoading || !myEvent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Spinner />
            </div>
        );
    }

    const eventDetails = myEvent;

    return (
        <div className="bg-[#FAF9F6] min-h-screen relative selection:bg-amber-100 italic-fonts">
            {/* Background Decorations (Fixed) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-100/10 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/10 blur-[120px] rounded-full animate-pulse-slow-reverse"></div>
            </div>

            <div className="max-w-[850px] mx-auto bg-white shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden font-baltica min-h-screen border-x border-stone-100">
                {/* Subtle Textures & Overlays */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

                {/* Preview Navigation Header */}
                <div className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-stone-200/50 px-4 py-4 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </div>
                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">{t('preview_mode')}</span>
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                        <Link
                            href={`/app/events/${id}/update`}
                            className="inline-flex items-center px-4 py-2 bg-white border border-stone-200 text-stone-600 text-[10px] font-black uppercase tracking-widest rounded-full transition-all hover:bg-stone-50 hover:border-stone-300 active:scale-95 gap-2 cursor-pointer"
                        >
                            <PencilSquareIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('edit_button')}</span>
                        </Link>
                        <button
                            onClick={finishBtn}
                            className="inline-flex items-center px-6 py-2 bg-emerald-800 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-800/20 transition-all hover:bg-emerald-900 active:scale-95 gap-2 cursor-pointer"
                        >
                            <CheckCircleIcon className="w-4 h-4" />
                            <span>{t('finish_button')}</span>
                        </button>
                    </div>
                </div>

                {/* Invitation Hero Area */}
                <div
                    className="bg-no-repeat bg-cover bg-center w-full relative z-10 group"
                    style={{ backgroundImage: `url(${eventDetails.invitation?.bg_img || '/images/bg/1.jpg'})` }}
                >
                    <div className="absolute inset-0 bg-stone-900/10 pointer-events-none"></div>
                    <div className="max-w-[550px] mx-auto h-[500px] md:h-[600px] relative flex items-center justify-center p-8">
                        {eventDetails.invitation?.template?.envelope_img && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[450px] aspect-square transition-transform duration-700 group-hover:scale-105">
                                <img
                                    className="w-full h-full opacity-40 blur-[2px] -rotate-6 sm:block"
                                    src={eventDetails.invitation.template.envelope_img}
                                    alt="Background Theme"
                                />
                            </div>
                        )}
                        <div className="relative z-20 transition-all duration-1000 transform scale-95 group-hover:scale-100 group-hover:-translate-y-2">
                            {watermarkData ? (
                                <img
                                    className="w-[320px] md:w-[380px] mx-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.3)] animate-invitation-float"
                                    src={watermarkData}
                                    alt="Invitation Card"
                                />
                            ) : (
                                <div className="w-[320px] aspect-[1/1.4] bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/30">
                                    <Spinner />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-6 md:px-12 text-center mt-12 space-y-16 relative z-20">
                    {/* Welcome Text Section */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <div className="px-2 md:px-10 text-xl md:text-2xl font-serif leading-[1.7] text-stone-800 break-words rich-text-content ql-editor border-none"
                            dangerouslySetInnerHTML={{ __html: eventDetails.description }}
                        />
                    </div>

                    {/* Gold Divider - Dynamically Animated */}
                    <div className="flex items-center justify-center gap-8 py-6 group/divider">
                        <div className="relative h-[1px] flex-1 max-w-[120px] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-fast"></div>
                        </div>

                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-amber-400 blur-xl opacity-20 animate-pulse-slow"></div>
                            <div className="w-3.5 h-3.5 rounded-sm border-2 border-amber-600 animate-spin-slow relative z-10 shadow-[0_0_15px_rgba(217,119,6,0.6)] bg-white/50 backdrop-blur-[2px]"></div>
                            <div className="absolute w-8 h-8 rounded-full border border-amber-200/30 scale-150 animate-pulse-slow"></div>
                        </div>

                        <div className="relative h-[1px] flex-1 max-w-[120px] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-amber-500 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/40 to-transparent animate-shimmer-fast"></div>
                        </div>
                    </div>

                    {/* Countdown Card */}
                    <div className="relative max-w-[550px] mx-auto">
                        <div className="absolute inset-0 bg-amber-50/50 blur-2xl -z-10 rounded-full scale-110"></div>
                        <div className="bg-white/40 backdrop-blur-sm border border-stone-100 rounded-[2.5rem] p-8 shadow-sm">
                            <span className="inline-block px-8 py-1.5 text-[10px] font-black text-amber-700 uppercase tracking-[0.4em] mb-8 bg-amber-50 rounded-full border border-amber-100/50">
                                {isEventPast
                                    ? (eventDetails.type === 'party' ? t('event_past_party') : t('event_past_wedding'))
                                    : (eventDetails.type === 'party' ? t('left_until_party') : t('left_until_wedding'))}
                            </span>
                            <Countdown deadline={eventDetails.date} />
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-12">
                        {/* Calendar Card */}
                        <div className="bg-white rounded-[2.5rem] p-1 border border-stone-100 shadow-xl shadow-stone-200/20">
                            <div className="p-4 md:p-8">
                                <Calendar date={eventDetails.date} />
                            </div>
                        </div>

                        {/* Event Details Section */}
                        <div className="space-y-6">
                            {/* Address Card */}
                            <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-lg shadow-stone-100/50 transition-all hover:border-amber-200">
                                <div className="flex flex-col items-center">
                                    <div className="bg-stone-50 p-4 rounded-3xl mb-6 text-amber-600 border border-stone-100">
                                        <MapPinIcon className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-sm font-black text-stone-400 uppercase tracking-[0.3em] mb-2">{t('our_address')}</h2>
                                    <p className="text-2xl font-serif italic text-stone-800 text-center mb-8 max-w-sm leading-snug">{eventDetails.place}</p>

                                    {eventDetails.address?.address && (
                                        <div className="w-full text-center">
                                            <a href={eventDetails.address.address.startsWith('http') ? eventDetails.address.address : `https://maps.google.com/?q=${encodeURIComponent(eventDetails.address.address)}`}
                                                target="_blank"
                                                className="group inline-flex items-center px-10 py-4 bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl gap-3"
                                            >
                                                <span>{t('open_map')}</span>
                                                <ArrowTopRightOnSquareIcon className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Photo Link Card */}
                                {eventDetails.photos_link && (
                                    <a href={eventDetails.photos_link} target="_blank" className="group flex items-center justify-between p-6 bg-white border border-stone-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-amber-100 transition-all duration-500">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-amber-50 p-4 rounded-2xl group-hover:bg-amber-100 transition-colors duration-500">
                                                <PhotoIcon className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <div>
                                                <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{t('photo_gallery')}</span>
                                                <span className="block text-md font-bold text-stone-800">{t('view_photos')}</span>
                                            </div>
                                        </div>
                                        <ArrowTopRightOnSquareIcon className="w-5 h-5 text-stone-300 group-hover:text-amber-500 transition-colors" />
                                    </a>
                                )}

                                {/* Video Link Button-style Card */}
                                {eventDetails.video_link && (
                                    <div className="bg-white border border-stone-100 rounded-[2rem] p-6 shadow-sm flex items-center gap-4 text-left group">
                                        <div className="bg-rose-50 p-4 rounded-2xl group-hover:bg-rose-100 transition-colors duration-500">
                                            <VideoCameraIcon className="w-6 h-6 text-rose-600" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{t('video')}</span>
                                            <span className="block text-md font-bold text-stone-800">YouTube</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Video Player Modal/Embed Area */}
                        {eventDetails.video_link && (
                            <div className="relative group p-4 border border-stone-100 bg-white shadow-2xl rounded-[3rem] overflow-hidden">
                                <div className="absolute inset-0 bg-stone-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <div className="rounded-[2rem] overflow-hidden shadow-inner bg-black aspect-video relative z-10 transition-transform duration-700 group-hover:scale-[1.01]">
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
                    </div>

                    {/* Image Gallery */}
                    {eventDetails.images && eventDetails.images.length > 0 && (
                        <div className="pt-8">
                            <div className="flex items-center gap-4 px-2 mb-10 opacity-30">
                                <div className="h-px flex-1 bg-stone-300"></div>
                                <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.4em]">Memory Gallery</span>
                                <div className="h-px flex-1 bg-stone-300"></div>
                            </div>
                            <Gallery images={eventDetails.images} />
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="mt-20 pt-5 pb-12 text-center border-t border-stone-100">
                    <div className="max-w-[120px] mx-auto opacity-30 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
                        <a href="/" className="flex flex-col items-center">
                            <img className="w-full mb-3" src="/logo.png" alt="logo" />
                            <span className="text-[8px] font-black text-stone-400 uppercase tracking-[0.5em]">
                                Toi-Invite
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Audio Toggle */}
            {eventDetails.audio && (
                <>
                    <audio src={eventDetails.audio} ref={audioRef} loop className="hidden" />
                    <div className="fixed bottom-8 right-8 z-[60]">
                        <button
                            onClick={toggleAudio}
                            className={`
                                relative w-14 h-14 rounded-2xl flex justify-center items-center cursor-pointer 
                                transition-all duration-500 shadow-2xl ring-4 ring-white active:scale-95
                                ${isPaused ? 'bg-stone-300' : 'bg-emerald-800'}
                            `}
                        >
                            {!isPaused && (
                                <>
                                    <div className="absolute inset-0 rounded-2xl animate-ping bg-emerald-400 opacity-20"></div>
                                </>
                            )}

                            {isPaused ? (
                                <MusicalNoteIcon className="w-6 h-6 text-stone-600" />
                            ) : (
                                <div className="flex items-end gap-1 h-5">
                                    <div className="w-0.5 bg-white animate-music-bar-1 h-2"></div>
                                    <div className="w-0.5 bg-white animate-music-bar-2 h-4"></div>
                                    <div className="w-0.5 bg-white animate-music-bar-3 h-3"></div>
                                    <div className="w-0.5 bg-white animate-music-bar-1 h-4"></div>
                                </div>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PreviewPage;
