'use client';

import React, { useState, useEffect } from 'react';
import {
    PhotoIcon,
    VideoCameraIcon,
    MapPinIcon,
    ArrowTopRightOnSquareIcon,
    InformationCircleIcon,
    HandThumbUpIcon
} from '@heroicons/react/24/outline';
import Countdown from '@/components/Countdown';
import Calendar from '@/components/Calendar';
import Gallery from '@/components/Gallery';
import Modal from '@/components/Modal';
import Questionnaire from '@/components/Questionnaire';
import AudioPlayer from '@/components/AudioPlayer';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

interface InvitationClientProps {
    event: any;
    invitation_img: string;
    music: string;
    guestInvite?: any;
}

const InvitationClient: React.FC<InvitationClientProps> = ({ event, invitation_img, music, guestInvite }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [questionnaireStatus, setQuestionnaireStatus] = useState<number>(1);
    const t = useTranslations('InvitationPreview');
    const locale = useLocale();

    const isEventPast = event.date ? new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0)) : true;

    useEffect(() => {
        if (!isEventPast) {
            const timer = setTimeout(() => {
                setMessageModalOpen(true);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isEventPast]);

    const openModal = (status: number) => {
        if (isEventPast) return;
        setQuestionnaireStatus(status);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setMessageModalOpen(false);
    };

    const handleSaved = () => {
        setModalOpen(false);
        alert(t('response_accepted'));
    };

    const videoId = event.video_link ? event.video_link.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|&v=|shorts\/))([^#&?]*)/)?.[1] : null;

    return (
        <div className="bg-[#FAF9F6] min-h-screen relative selection:bg-amber-100 italic-fonts pb-12 sm:pb-0">
            {/* Action Buttons - Floating at the top for mobile as requested */}
            <div className="fixed top-4 left-0 right-0 z-[60] px-4 pointer-events-none">
                <div className="max-w-md mx-auto pointer-events-auto bg-white/90 backdrop-blur-xl border border-stone-200/60 p-1.5 rounded-full shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] flex justify-center items-center gap-2">
                    <button
                        disabled={isEventPast}
                        onClick={() => openModal(1)}
                        className="group relative flex-1 py-3 px-6 rounded-full bg-emerald-800 text-white font-bold text-xs uppercase tracking-widest shadow-lg transition-all hover:bg-emerald-900 hover:shadow-emerald-900/20 active:scale-95 disabled:opacity-50 cursor-pointer overflow-hidden"
                    >
                        <span className="relative z-10">{t('yes_going')}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                    </button>
                    <button
                        disabled={isEventPast}
                        onClick={() => openModal(0)}
                        className="group relative flex-1 py-3 px-6 rounded-full border border-stone-200 bg-white text-stone-600 font-bold text-xs uppercase tracking-widest hover:bg-stone-50 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                        {t('no_going')}
                    </button>
                </div>
            </div>
            <div className="h-20 sm:hidden"></div> {/* Spacer for fixed header */}

            <div className="max-w-[850px] mx-auto bg-white shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden font-baltica pb-20 min-h-screen border-x border-stone-100">
                {/* Subtle Textures & Overlays */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

                {/* Top Flourish */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 opacity-20 pointer-events-none">
                    <svg viewBox="0 0 200 100" className="w-full h-full text-amber-600 fill-current">
                        <path d="M100 20 C80 20 70 40 100 60 C130 40 120 20 100 20 Z" />
                    </svg>
                </div>

                {/* Invitation Hero Area */}
                <div
                    className="bg-no-repeat bg-cover bg-center w-full relative z-10 group"
                    style={{ backgroundImage: `url(${event.invitation?.data?.bg_img || '/images/bg/1.jpg'})` }}
                >
                    <div className="absolute inset-0 bg-stone-900/10 pointer-events-none"></div>
                    <div className="max-w-[550px] mx-auto h-[500px] md:h-[600px] relative flex items-center justify-center p-8">
                        {event.invitation?.template?.envelope_img && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[450px] aspect-square transition-transform duration-700 group-hover:scale-105">
                                <Image
                                    className="w-full h-full opacity-40 blur-[2px] -rotate-6 sm:block"
                                    src={event.invitation.template.envelope_img}
                                    alt="Background Theme"
                                    width={500}
                                    height={500}
                                    unoptimized={event.invitation.template.envelope_img.includes('localhost:8000')}
                                />
                            </div>
                        )}
                        <div className="relative z-20 transition-all duration-1000 transform scale-95 group-hover:scale-100 group-hover:-translate-y-2">
                            <Image
                                className="w-[320px] md:w-[380px] mx-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.3)] animate-invitation-float"
                                src={invitation_img}
                                alt="Invitation Card"
                                width={450}
                                height={650}
                                priority
                                unoptimized={invitation_img.includes('localhost:8000')}
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 md:px-12 text-center mt-12 space-y-16 relative z-20">
                    {/* Welcome Text Section */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <div className="px-2 md:px-10 text-xl md:text-2xl font-serif leading-[1.7] text-stone-800 break-words rich-text-content ql-editor border-none"
                            dangerouslySetInnerHTML={{ __html: guestInvite?.invite_text || event.description || '' }}
                        />
                    </div>

                    {/* Gold Divider - Dynamically Animated */}
                    <div className="flex items-center justify-center gap-8 py-6 group/divider">
                        <div className="relative h-[1px] flex-1 max-w-[120px] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-fast"></div>
                        </div>

                        <div className="relative flex items-center justify-center">
                            {/* Animated Glow Aura */}
                            <div className="absolute inset-0 bg-amber-400 blur-xl opacity-20 animate-pulse-slow"></div>

                            {/* Spinning Diamond */}
                            <div className="w-3.5 h-3.5 rounded-sm border-2 border-amber-600 animate-spin-slow relative z-10 shadow-[0_0_15px_rgba(217,119,6,0.6)] bg-white/50 backdrop-blur-[2px]"></div>

                            {/* Concentric circles (Subtle detail) */}
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
                                    ? (event.type === 'party' ? t('event_past_party') : t('event_past_wedding'))
                                    : (event.type === 'party' ? t('left_until_party') : t('left_until_wedding'))}
                            </span>
                            <Countdown deadline={event.date} />
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-12">
                        {/* Calendar Card */}
                        <div className="bg-white rounded-[2.5rem] p-1 border border-stone-100 shadow-xl shadow-stone-200/20 group hover:shadow-2xl transition-all duration-500">
                            <div className="p-4 md:p-8">
                                <Calendar date={event.date} locale={locale} />
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
                                    <p className="text-2xl font-serif italic text-stone-800 text-center mb-8 max-w-sm leading-snug">{event.place}</p>

                                    {event.address?.address && (
                                        <div className="w-full text-center">
                                            <a href={event.address.address.startsWith('http') ? event.address.address : `https://maps.google.com/?q=${encodeURIComponent(event.address.address)}`}
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
                                {event.photos_link && (
                                    <a href={event.photos_link} target="_blank" className="group flex items-center justify-between p-6 bg-white border border-stone-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-amber-100 transition-all duration-500">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-amber-50 p-4 rounded-2xl group-hover:bg-amber-100 transition-colors duration-500">
                                                <PhotoIcon className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <div>
                                                <span className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">{t('photo_gallery')}</span>
                                                <span className="block text-md font-bold text-stone-800">{t('view_photos')}</span>
                                            </div>
                                        </div>
                                        <ArrowTopRightOnSquareIcon className="w-5 h-5 text-stone-300 group-hover:text-amber-500 transition-colors" />
                                    </a>
                                )}

                                {/* Video Link Button-style Card */}
                                {videoId && (
                                    <div className="bg-white border border-stone-100 rounded-[2rem] p-6 shadow-sm flex items-center gap-4 text-left group">
                                        <div className="bg-rose-50 p-4 rounded-2xl group-hover:bg-rose-100 transition-colors duration-500">
                                            <VideoCameraIcon className="w-6 h-6 text-rose-600" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">{t('video')}</span>
                                            <span className="block text-md font-bold text-stone-800">YouTube</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Video Player Modal/Embed Area */}
                        {videoId && (
                            <div className="relative group p-4 border border-stone-100 bg-white shadow-2xl rounded-[3rem] overflow-hidden">
                                <div className="absolute inset-0 bg-stone-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <div className="rounded-[2rem] overflow-hidden shadow-inner bg-black aspect-video relative z-10 transition-transform duration-700 group-hover:scale-[1.01]">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${videoId}`}
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
                    {event.images && event.images.length > 0 && (
                        <div className="pt-8">
                            <div className="flex items-center gap-4 px-2 mb-10 opacity-30">
                                <div className="h-px flex-1 bg-stone-300"></div>
                                <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.4em]">Memory Gallery</span>
                                <div className="h-px flex-1 bg-stone-300"></div>
                            </div>
                            <Gallery images={event.images} />
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="mt-20 pt-5 pb-12 text-center border-t border-stone-100">
                    <div className="max-w-[120px] mx-auto opacity-30 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
                        <a href="/" className="flex flex-col items-center">
                            <img className="w-full mb-3" src="/logo.png" alt="logo" />
                            <span className="text-[8px] font-black text-stone-400 uppercase tracking-[0.5em]">
                                {t('service_footer')}
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Background Decorations (Fixed) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-100/10 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/10 blur-[120px] rounded-full animate-pulse-slow-reverse"></div>
            </div>

            {/* Audio Toggle */}
            {music && <AudioPlayer src={music} />}

            {/* Modals Structure - Keep Logic Same */}
            <Modal modal={modalOpen} title={t('guest_questionnaire')} onClose={closeModal}>
                <div className="py-4">
                    <Questionnaire
                        event_id={event.id}
                        status={questionnaireStatus}
                        guest={guestInvite?.guest}
                        onSaved={handleSaved}
                    />
                </div>
            </Modal>

            <Modal modal={messageModalOpen} onClose={closeModal}>
                <div className="text-center p-6 md:p-10 bg-white/50 backdrop-blur-xl">
                    <div className="bg-stone-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 border border-stone-100 shadow-inner">
                        <InformationCircleIcon className="text-amber-600 w-12 h-12 animate-bounce-slow" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif italic text-stone-900 mb-4 px-4">
                        {t('dear_guest', { name: guestInvite?.guest?.fullname || t('guest') })}
                    </h3>
                    <p className="text-stone-500 mb-10 max-w-xs mx-auto text-sm leading-relaxed">
                        {t('please_respond', { type: event.type === 'party' ? t('party') : t('wedding') })}
                    </p>
                    <button
                        onClick={closeModal}
                        className="group w-full max-w-[280px] flex mx-auto items-center justify-center rounded-full shadow-2xl text-white py-5 px-12 bg-emerald-800 hover:bg-emerald-900 transition-all font-bold text-xs uppercase tracking-[0.2em] active:scale-95"
                    >
                        <HandThumbUpIcon className="w-5 h-5 mr-3 group-hover:scale-125 transition-transform" />
                        {t('ok_button')}
                    </button>
                    <div className="mt-8">
                        <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.3em]">Toi-Invite</span>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default InvitationClient;
