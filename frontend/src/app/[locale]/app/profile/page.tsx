'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useTranslations } from 'next-intl';
import apiClient from '@/lib/api-client';
import { useRouter } from '@/i18n/routing';
import Modal from '@/components/Modal';
import { UserCircleIcon, EnvelopeIcon, CalendarIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Alert from '@/components/Alert';

export default function ProfilePage() {
    const { user, logout } = useUserStore();
    const t = useTranslations('Profile');
    const router = useRouter();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setError('');
        try {
            await apiClient.delete('/user');
            logout();
            router.push('/');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Error deleting account');
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="container mx-auto px-5 py-10 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">{t('title')}</h1>

            {error && (
                <div className="mb-6">
                    <Alert>{error}</Alert>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header/Banner Section */}
                <div className="h-32 bg-gradient-to-r from-amber-500 to-amber-600"></div>

                <div className="px-8 pb-8">
                    {/* User Info Section */}
                    <div className="relative flex flex-col items-center sm:items-start -mt-16 mb-8">
                        <div className="p-1 bg-white rounded-full">
                            <UserCircleIcon className="w-32 h-32 text-gray-300 bg-white rounded-full" />
                        </div>
                        <div className="mt-4 text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-gray-900">{user.name || 'User'}</h2>
                            <p className="text-gray-500 flex items-center justify-center sm:justify-start mt-1">
                                <EnvelopeIcon className="w-4 h-4 mr-2" />
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Data Column */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{t('personal_data')}</h3>

                            <div className="flex items-center text-gray-700">
                                <CalendarIcon className="w-5 h-5 mr-3 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('register_date')}</p>
                                    <p className="font-medium">
                                        {(user as any).created_at ? new Date((user as any).created_at).toLocaleDateString() : '—'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Settings/Account Column */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{t('delete_account')}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {t('delete_confirm')}
                            </p>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="flex items-center text-red-600 hover:text-red-700 font-medium transition duration-200 cursor-pointer"
                            >
                                <TrashIcon className="w-5 h-5 mr-2" />
                                {t('delete_account')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                modal={isDeleteModalOpen}
                onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                title={t('delete_account')}
            >
                <div className="flex flex-col items-center text-center py-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
                    </div>
                    <p className="text-gray-600 mb-8 max-w-sm">
                        {t('delete_confirm')}
                    </p>

                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="flex-1 bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition duration-200 disabled:bg-red-300 cursor-pointer"
                        >
                            {isDeleting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    ...
                                </span>
                            ) : t('delete_button')}
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                            className="flex-1 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition duration-200 cursor-pointer"
                        >
                            {t('cancel_button')}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
