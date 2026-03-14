'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import Breadcrumbs from '@/components/Breadcrumbs';
import Spinner from '@/components/Spinner';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import {
    ClockIcon,
    PencilSquareIcon,
    TrashIcon,
    EyeIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import apiClient from '@/lib/api-client';

const MyEventsPage = () => {
    const t = useTranslations('MyEvents');

    const { data: events, isLoading, mutate } = useSWR('/event', fetcher);

    const handleDelete = async (id: string) => {
        if (confirm(t('confirm_delete'))) {
            try {
                await apiClient.post(`/event/${id}/delete`);
                await mutate();
            } catch (error) {
                console.error('Failed to delete event', error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="max-w-[850px] mx-auto px-4 py-8">
            <div className="mb-6">
                <Breadcrumbs links={[{ name: t('title') }]} />
            </div>

            {events && events.length > 0 ? (
                <div className="grid gap-6">
                    {events.map((item: any) => (
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
                                    <span className="text-sm text-gray-500 mr-2">{t('status_label')}</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.order?.status === 2 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                        {item.order?.statusLabel}
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
                                                {t('continue_button')}
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            {item.order?.status === 1 && (
                                                <Link
                                                    href={`/app/events/${item.id}/update`}
                                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer gap-2"
                                                >
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                    {t('edit_button')}
                                                </Link>
                                            )}
                                            <Link
                                                href={`/app/events/${item.id}`}
                                                className="inline-flex items-center px-4 py-2 bg-theme-secondary text-white rounded-lg text-sm font-bold hover:bg-theme-secondary/80 transition-colors cursor-pointer gap-2"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                                {t('details_button')}
                                            </Link>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="inline-flex items-center px-4 py-2 bg-white border border-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors cursor-pointer cursor-pointer gap-2"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        {t('delete_button')}
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
                    <p className="text-gray-500 mb-8 text-lg">{t('no_events')}</p>
                    <Link
                        href="/app/select-template"
                        className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all hover:-translate-y-1 shadow-lg shadow-indigo-100"
                    >
                        {t('create_first_invitation')}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyEventsPage;
