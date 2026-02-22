'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import Breadcrumbs from '@/components/Breadcrumbs';
import Spinner from '@/components/Spinner';
import {
    ClockIcon,
    PencilSquareIcon,
    TrashIcon,
    EyeIcon,
    PlusIcon
} from '@heroicons/react/24/outline';

const MyEventsPage = () => {
    const { getEvents, events, deleteEvent } = useAppStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                await getEvents();
            } catch (error) {
                console.error('Failed to fetch events', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [getEvents]);

    const handleDelete = async (id: string) => {
        if (confirm('Өшіруге сенімдісіз бе? Өшірілгеннен кейін қайта қалпына келмейді!!')) {
            try {
                await deleteEvent(id);
                // Refresh events list
                await getEvents();
            } catch (error) {
                console.error('Failed to delete event', error);
            }
        }
    };

    if (loading && events.data.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="max-w-[850px] mx-auto px-4 py-8">
            <div className="mb-6">
                <Breadcrumbs links={[{ name: 'Менің іс-шараларым' }]} />
            </div>

            {/* <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Менің іс-шараларым</h1>
                <Link
                    href="/app/select-template"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Жаңа шақырту
                </Link>
            </div> */}

            {events.data.length > 0 ? (
                <div className="grid gap-6">
                    {events.data.map((item: any) => (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row  w-full bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        >
                            {/* Invitation Preview */}
                            <div className="w-full sm:w-64 h-72 relative bg-gray-50 flex items-center justify-center p-6">
                                {item.invitation?.template?.envelope_img && (
                                    <img
                                        className="w-48 absolute -rotate-12 transition-transform hover:rotate-0 duration-500"
                                        src={item.invitation.template.envelope_img}
                                        alt="Envelope"
                                    />
                                )}
                                {item.invitation?.invitation_img && (
                                    <img
                                        className="w-36 absolute shadow-2xl transition-transform hover:scale-110 duration-500"
                                        src={item.invitation.invitation_img}
                                        alt="Invitation"
                                    />
                                )}
                            </div>

                            {/* Event Info */}
                            <div className="p-8 grow flex flex-col">
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-gray-600 mb-1">{item.title}</h2>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <ClockIcon className="w-4 h-4 mr-1.5" />
                                        <span>{item.date}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <span className="text-sm text-gray-500 mr-2">Статус:</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.order?.status === 2 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                        {item.order?.statusLabel || (item.order?.status === 2 ? 'Төленген' : 'Күтілуде')}
                                    </span>
                                </div>

                                <div className="mt-auto flex flex-wrap gap-2">
                                    {item.order?.status === 0 ? (
                                        <>
                                            <Link
                                                href={`/app/events/${item.id}/update`}
                                                className="inline-flex items-center px-4 py-2 bg-theme-secondary text-white rounded-lg text-sm font-bold hover:bg-theme-secondary/80 transition-colors gap-2"
                                            >
                                                <PencilSquareIcon className="w-4 h-4" />
                                                Жалғастыру
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            {item.order?.status === 1 && (
                                                <Link
                                                    href={`/app/events/${item.id}/update`}
                                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors gap-2"
                                                >
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                    Өңдеу
                                                </Link>
                                            )}
                                            <Link
                                                href={`/app/events/${item.id}`}
                                                className="inline-flex items-center px-4 py-2 bg-theme-secondary text-white rounded-lg text-sm font-bold hover:bg-theme-secondary/80 transition-colors gap-2"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                                Толығырақ
                                            </Link>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="inline-flex items-center px-4 py-2 bg-white border border-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors gap-2"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        Өшіру
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="max-w-[850px] mx-auto text-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <PlusIcon className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-gray-500 mb-8 text-lg">Сізде әлі іс-шаралар жоқ</p>
                    <Link
                        href="/app/select-template"
                        className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all hover:-translate-y-1 shadow-lg shadow-indigo-100"
                    >
                        Шақырту жасау
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyEventsPage;
