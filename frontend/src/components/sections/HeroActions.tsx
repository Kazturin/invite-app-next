'use client';

import React, { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import Modal from '../Modal';
import { useTranslations } from 'next-intl';

interface HeroActionsProps {
    screenshot2Url: string;
    guestsScreenUrl: string;
}

const HeroActions: React.FC<HeroActionsProps> = ({ screenshot2Url, guestsScreenUrl }) => {
    const t = useTranslations('Index');
    const [modal, setModal] = useState(false);
    const [modalImgUrl, setModalImgUrl] = useState<string | null>(null);
    const [modalTitle, setModalTitle] = useState('');

    const openModal = (title: string, imgUrl: string) => {
        setModalTitle(title);
        setModalImgUrl(imgUrl);
        setModal(true);
    };

    const closeModal = () => setModal(false);

    return (
        <ul className="space-y-4">
            <li className="flex items-start">
                <div className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
                <div className="text-gray-800">
                    {t('invitation_website')}
                </div>
            </li>

            <li className="flex items-start">
                <div className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
                <button
                    onClick={() => openModal(t('social_invite_title'), screenshot2Url)}
                    className="flex items-center text-left hover:text-blue-500 transition-colors w-full group cursor-pointer"
                >
                    <span className="grow">{t('social_invite_title')}</span>
                    <PhotoIcon className="w-6 h-6 ml-2 text-gray-400 group-hover:text-blue-500" />
                </button>
            </li>

            <li className="flex items-start">
                <div className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
                <button
                    onClick={() => openModal(t('guest_info_title'), guestsScreenUrl)}
                    className="flex items-center text-left hover:text-blue-500 transition-colors w-full group cursor-pointer"
                >
                    <span className="grow">{t('guest_info_title')}</span>
                    <PhotoIcon className="w-6 h-6 ml-2 text-gray-400 group-hover:text-blue-500" />
                </button>
            </li>

            <Modal modal={modal} title={modalTitle} onClose={closeModal}>
                {modalImgUrl && (
                    <img className="w-full h-auto rounded" src={modalImgUrl} alt={modalTitle} />
                )}
            </Modal>
        </ul>
    );
};

export default HeroActions;

