'use client';

import React, { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import Modal from '../Modal';

interface HeroActionsProps {
    screenshot2Url: string;
    guestsScreenUrl: string;
}

const HeroActions: React.FC<HeroActionsProps> = ({ screenshot2Url, guestsScreenUrl }) => {
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
                    Онлайн шақырту сайты (
                    <a
                        className="underline text-sm text-gray-600 hover:text-blue-500 transition-colors"
                        href="https://toi-invite.kz/toi/aslan-men-erkezannyn-toiy"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Мысал
                    </a>)
                </div>
            </li>

            <li className="flex items-start">
                <div className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
                <button
                    onClick={() => openModal('Әлеуметтік желілер арқылы қонақтарды шақыру', screenshot2Url)}
                    className="flex items-center text-left hover:text-blue-500 transition-colors w-full group cursor-pointer"
                >
                    <span className="grow">Әлеуметтік желілер арқылы қонақтарды шақыру</span>
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
                    onClick={() => openModal('Келетін қонақтар туралы ақпарт алу', guestsScreenUrl)}
                    className="flex items-center text-left hover:text-blue-500 transition-colors w-full group cursor-pointer"
                >
                    <span className="grow">Келетін қонақтар туралы ақпарт алу</span>
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
