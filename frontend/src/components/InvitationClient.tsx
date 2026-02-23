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
import { mon, baltica, academy, vivaldi } from '@/app/fonts';

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
        alert('Жауабыңыз қабылданды! Рахмет!');
    };

    const videoId = event.video_link ? event.video_link.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|&v=|shorts\/))([^#&?]*)/)?.[1] : null;

    return (
        <div className={`bg-[#fdfbf7] min-h-screen ${mon.variable} ${baltica.variable} ${academy.variable} ${vivaldi.variable}`}>
            {/* Action Buttons */}
            <div className="max-w-screen-xl mx-auto fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm border-b border-stone-100 px-4 py-4 sm:static sm:border-none">
                <div className="flex justify-center items-center gap-3 sm:gap-6 max-w-2xl mx-auto">
                    <button
                        disabled={isEventPast}
                        onClick={() => openModal(1)}
                        className="group relative flex-1 max-w-[200px] py-2.5 px-4 rounded-full bg-emerald-700 text-white font-semibold text-sm uppercase tracking-wider shadow-md transition-all hover:bg-emerald-800 hover:shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        Иә, барамын
                    </button>
                    <button
                        disabled={isEventPast}
                        onClick={() => openModal(0)}
                        className="group relative flex-1 max-w-[200px] py-2.5 px-4 rounded-full border border-stone-300 text-stone-500 font-semibold text-sm uppercase tracking-wider hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95 disabled:opacity-50"
                    >
                        Бара алмаймын
                    </button>
                </div>
            </div>
            <div className="sm:hidden h-[74px]"></div>

            <div className="max-w-screen-xl mx-auto bg-white shadow-2xl relative overflow-hidden font-baltica pb-20 min-h-screen">
                {/* Subtle Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

                {/* Invitation Hero */}
                <div
                    className="bg-no-repeat bg-cover bg-center w-full drop-shadow-md pb-12"
                    style={{ backgroundImage: `url(${event.invitation?.data?.bg_img || '/images/bg/1.jpg'})` }}
                >
                    <div className="max-w-[650px] mx-auto h-[550px] relative">
                        {event.invitation?.template?.envelope_img && (
                            <Image
                                className="w-96 hidden mx-auto absolute top-8 left-[10px] -rotate-12 sm:block animate-fade-in-up"
                                src={event.invitation.template.envelope_img}
                                alt="Envelope"
                                width={384}
                                height={384}
                                unoptimized={event.invitation.template.envelope_img.includes('localhost:8000')}
                            />
                        )}
                        <Image
                            className="w-80 mx-auto absolute top-8 left-0 right-0 drop-shadow-2xl animate-invitation-float z-10"
                            src={invitation_img}
                            alt="Invitation"
                            width={400}
                            height={570}
                            priority
                            unoptimized={invitation_img.includes('localhost:8000')}
                        />
                    </div>
                </div>

                <div className="px-4 text-center mt-10 space-y-12">
                    <div className="px-6 md:px-20 text-xl md:text-2xl font-medium leading-relaxed text-gray-800 break-words animate-fade-in-down"
                        dangerouslySetInnerHTML={{ __html: guestInvite?.invite_text || event.description || '' }}
                    />

                    <div className="relative max-w-[500px] mx-auto px-4">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-300"></div>
                            <div className="text-yellow-500">
                                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                                    <path d="M12,2L14.5,9H22L15.5,13.5L18,21L12,16.5L6,21L8.5,13.5L2,9H9.5L12,2Z" />
                                </svg>
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-300"></div>
                        </div>
                        <span className="bg-white px-6 py-1 text-sm font-bold text-yellow-700 uppercase tracking-[0.2em] relative z-10">
                            {isEventPast ? 'Той өтті' : 'Тойға дейін қалды'}
                        </span>
                        <div className="mt-6">
                            <Countdown deadline={event.date} />
                        </div>
                    </div>

                    <div className="max-w-md mx-auto px-4">
                        <Calendar date={event.date} locale="kk" />
                    </div>

                    {event.photos_link && (
                        <div className="max-w-md mx-auto px-4">
                            <a href={event.photos_link} target="_blank" className="group relative flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 active:scale-95">
                                <div className="flex items-center gap-4">
                                    <div className="bg-amber-50 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                        <PhotoIcon className="w-7 h-7 text-amber-600" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-sm font-semibold text-gray-400 uppercase tracking-wider">Галлерея</span>
                                        <span className="block text-lg font-bold text-gray-800">Суреттерді көру</span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-full group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                                </div>
                            </a>
                        </div>
                    )}

                    {videoId && (
                        <div className="max-w-[750px] mx-auto border border-gray-100 bg-white p-2 sm:p-4 shadow-2xl rounded-2xl overflow-hidden">
                            <div className="flex items-center gap-3 mb-4 px-4 pt-2">
                                <div className="bg-red-50 p-2 rounded-lg">
                                    <VideoCameraIcon className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 text-left">Видео</h3>
                            </div>
                            <div className="rounded-xl overflow-hidden shadow-inner bg-black aspect-video">
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

                    <div className="max-w-[750px] mx-auto border border-gray-100 bg-white p-6 shadow-2xl rounded-2xl overflow-hidden text-gray-800">
                        <div className="flex flex-col items-center">
                            <div className="bg-blue-50 p-3 rounded-full mb-4">
                                <MapPinIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-center mb-1">Мекен-жайы</h2>
                            <p className="text-xl text-gray-600 text-center mb-4 font-medium italic">{event.place}</p>

                            {event.address?.address && (
                                <div className="w-full">
                                    <div className="w-full h-px bg-gray-100 my-4"></div>
                                    <div className="text-center">
                                        <p className="text-lg text-gray-700 bg-gray-50 px-6 py-3 rounded-xl border border-gray-100 mb-6">
                                            {event.address.address}
                                        </p>
                                        <a href={event.address.address.startsWith('http') ? event.address.address : `https://maps.google.com/?q=${encodeURIComponent(event.address.address)}`}
                                            target="_blank"
                                            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all duration-300 shadow-lg gap-2 group"
                                        >
                                            <span>Картаны ашу</span>
                                            <ArrowTopRightOnSquareIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {event.images && event.images.length > 0 && (
                        <div className="mb-8">
                            <Gallery images={event.images} />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-20 h-20 text-center p-4 border-yellow-700 border-t bg-white">
                    <a href="/" className="flex flex-col items-center justify-center">
                        <img className="w-32 inline mb-1" src="/logo.png" alt="logo" />
                        <span className="text-xs font-taurus text-yellow-700 uppercase tracking-widest opacity-60">
                            Toi-Invite шақыру сервисі
                        </span>
                    </a>
                </div>
            </div>

            {/* Audio */}
            {music && <AudioPlayer src={music} />}

            {/* Modals */}
            <Modal modal={modalOpen} title="Қонақ сауалнамасы" onClose={closeModal}>
                <Questionnaire
                    event_id={event.id}
                    status={questionnaireStatus}
                    guest={guestInvite?.guest}
                    onSaved={handleSaved}
                />
            </Modal>

            <Modal modal={messageModalOpen} onClose={closeModal}>
                <div className="text-center p-4">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <InformationCircleIcon className="text-blue-500 w-12 h-12" />
                    </div>
                    <p className="text-xl text-amber-800 font-roboto font-semibold mb-4">
                        Құрметті {guestInvite?.guest?.fullname || 'қонақ!'}
                    </p>
                    <p className="text-gray-600 mb-8 max-w-xs mx-auto">
                        Жоғарыдағы «Барамын» және «Бара алмаймын» батырмалары арқылы той иесіне жауап беруіңізді сұраймыз
                    </p>
                    <button
                        onClick={closeModal}
                        className="w-full sm:w-auto flex mx-auto items-center justify-center rounded-full shadow-lg text-white py-4 px-12 bg-emerald-600 hover:bg-emerald-700 transition-all font-bold text-lg active:scale-95"
                    >
                        <HandThumbUpIcon className="w-6 h-6 mr-2" />
                        Жақсы
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default InvitationClient;
