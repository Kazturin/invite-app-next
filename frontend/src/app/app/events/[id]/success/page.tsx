'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import {
    CheckIcon,
    ClockIcon,
    EyeIcon,
    PhotoIcon,
    PencilIcon,
    TrashIcon,
    ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import Spinner from '@/components/Spinner';
import Modal from '@/components/Modal';


interface PageProps {
    params: Promise<{ id: string }>;
}

const SuccessPage = ({ params }: PageProps) => {
    const { id } = use(params);
    const router = useRouter();
    const { getEvent, getWatermarkInvitation, deleteEvent, event } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [watermarkInvitation, setWatermarkInvitation] = useState<string | null>(null);
    const [modal, setModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalImgUrl, setModalImgUrl] = useState<string | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const eventData = await getEvent(id);
                if (eventData.invitation?.invitation_img_path) {
                    console.log(eventData.invitation.invitation_img_path)
                    const watermarkData = await getWatermarkInvitation(eventData.invitation.invitation_img_path);
                    setWatermarkInvitation(watermarkData);
                }
            } catch (error) {
                console.error('Failed to fetch event or watermark', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, getEvent, getWatermarkInvitation]);

    const toWhatsapp = (text: string) => {
        const phone = '+77005742909';
        const encodedText = encodeURIComponent(text);
        const url = `https://wa.me/${phone.replace('+', '')}?text=${encodedText}`;
        window.open(url, '_blank');
    };

    const handleDelete = async () => {
        if (confirm('Өшіруге сенімдісіз бе?')) {
            try {
                await deleteEvent(id);
                router.push('/app/events');
            } catch (error) {
                console.error('Failed to delete event', error);
            }
        }
    };

    const openModal = (title: string, imgUrl: string) => {
        setModalTitle(title);
        setModalImgUrl(imgUrl);
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
    };

    if (loading || !event.data) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    const eventDetails = event.data;

    return (
        <div className="container mx-auto mt-6 px-4">
            <div className="flex flex-col md:flex-row max-w-[850px] mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Image Section */}
                <div className="w-full md:w-80 h-96 relative flex items-center justify-center p-8">
                    {eventDetails.invitation?.template?.envelope_img && (
                        <img
                            className="w-64 absolute transition-all duration-700 -rotate-12 hover:rotate-0"
                            src={eventDetails.invitation.template.envelope_img}
                            alt="Envelope"
                        />
                    )}
                    {watermarkInvitation && (
                        <img
                            className="w-48 absolute drop-shadow-2xl transition-all duration-700 hover:scale-105"
                            src={watermarkInvitation}
                            alt="Invitation Preview"
                        />
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-8 md:p-10">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 leading-tight">
                            {eventDetails.title}
                        </h1>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => router.push(`/app/events/${id}/update`)}
                                className="p-2 text-gray-400 hover:text-indigo-600 transition-colors bg-gray-50 rounded-full"
                                title="Өңдеу"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-full"
                                title="Өшіру"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-8 bg-indigo-50 w-fit px-4 py-2 rounded-full">
                        <ClockIcon className="w-5 h-5 mr-2 text-indigo-600" />
                        <span className="font-medium">{eventDetails.date}</span>
                    </div>

                    {eventDetails.order?.status === 0 ? (
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
                                    Төлемнен кейін қолжетімді:
                                </h3>
                                <div className="space-y-4">
                                    <button
                                        onClick={() => router.push(`/app/events/${id}/preview`)}
                                        className="w-full flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-green-100 p-1.5 rounded-lg text-green-600">
                                                <CheckIcon className="w-4 h-4" />
                                            </div>
                                            <span className="text-gray-700 font-medium">Шақыру сайты</span>
                                        </div>
                                        <EyeIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                                    </button>

                                    <div
                                        onClick={() => openModal('Әлеуметтік желі арқылы шақыру', '/images/screenshot_2.jpeg')}
                                        className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-green-100 p-1.5 rounded-lg text-green-600">
                                                <CheckIcon className="w-4 h-4" />
                                            </div>
                                            <span className="text-gray-700 font-medium">Әлеуметтік желі арқылы шақыру</span>
                                        </div>
                                        <PhotoIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                                    </div>

                                    <div
                                        onClick={() => openModal('Қонақтар туралы ақпарат', '/images/guests_screen.png')}
                                        className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-green-100 p-1.5 rounded-lg text-green-600">
                                                <CheckIcon className="w-4 h-4" />
                                            </div>
                                            <span className="text-gray-700 font-medium">Қонақтар туралы ақпарат</span>
                                        </div>
                                        <PhotoIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                                    </div>

                                </div>
                            </div>

                            <div className="pt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-medium text-lg">Бағасы:</span>
                                    <span className="text-green-600 font-bold text-2xl">{eventDetails.order.price} тг</span>
                                </div>
                                <button
                                    onClick={() => toWhatsapp(`Заказ номері - ${id}`)}
                                    className="w-full flex items-center justify-center space-x-3 bg-[#25D366] hover:bg-[#20bd5c] text-white py-4 px-6 rounded-2xl font-bold shadow-lg shadow-green-100 transition-all hover:-translate-y-0.5 cursor-pointer"
                                >
                                    <img className="w-6 h-6" src="/icons/whatsapp-icon.png" alt="WA" />
                                    <span>Төлем жасау үшін байланысу</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex flex-col items-center">
                            <div className="bg-green-100 text-green-600 p-4 rounded-full mb-4">
                                <CheckIcon className="w-10 h-10" />
                            </div>
                            <p className="text-2xl font-bold text-green-800 mb-6">Төлем қабылданды</p>
                            <button
                                onClick={() => router.push(`/app/events/${id}`)}
                                className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-10 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
                            >
                                <EyeIcon className="w-5 h-5" />
                                <span>Толығырақ</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Support Message Section */}
            <div className="max-w-[850px] mx-auto mt-12 mb-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-10 text-white overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <ChatBubbleLeftEllipsisIcon className="w-12 h-12 mb-4 opacity-50" />
                        <h2 className="text-2xl font-bold mb-4">Құрметті қолданушы!</h2>
                        <p className="text-indigo-100 max-w-lg leading-relaxed">
                            Біздің веб-сервиске қош келдіңіз. Егер сізде қандай да бір идеялар, өтініштер немесе қателіктер туындаса, бізге хабарлаңыз! Сіздің пікіріңіз біздің қызметімізді жақсартуға көмектеседі.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 min-w-[200px]">
                        <button
                            onClick={() => toWhatsapp('Кері байланыс')}
                            className="flex items-center justify-center space-x-2 bg-white text-indigo-600 py-3 px-6 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-xl cursor-pointer"
                        >
                            <img className="w-5 h-5" src="/icons/whatsapp-icon.png" alt="WA" />
                            <span>Кері байланыс</span>
                        </button>
                    </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-500 rounded-full opacity-20"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-white rounded-full opacity-10"></div>
            </div>

            <Modal modal={modal} title={modalTitle} onClose={closeModal}>
                {modalImgUrl && <img className="w-full" src={modalImgUrl} alt={modalTitle} />}
            </Modal>
        </div>

    );
};

export default SuccessPage;
