'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Modal from '../Modal';

const HeroSection: React.FC = () => {
    const [modal, setModal] = useState(false);
    const [modalImgUrl, setModalImgUrl] = useState<string | null>(null);
    const [modalTitle, setModalTitle] = useState('');

    const openModal = (title: string, imgUrl: string) => {
        setModalTitle(title);
        setModalImgUrl(imgUrl);
        setModal(modal => !modal);
    };

    const closeModal = () => setModal(false);

    return (
        <section className="bg-white w-full bg-left bg-contain overflow-hidden bg-no-repeat h-[550px] relative">
            <div className="container mx-auto relative h-full">
                <div className="absolute top-7 z-20 flex w-full">
                    <div className="w-full lg:w-[740px] flex flex-col items-start text-center px-5">
                        <h1 className="text-left font-semibold text-3xl md:text-4xl mb-7 text-gray-600">
                            Іс-шараңызға арналған онлайн шақыруды өзіңіз жасаңыз
                        </h1>
                        <div className="bg-yellow-500 h-[5px] w-[74px]"></div>
                        <p className="my-7 text-lg text-left animate-fade-in-down text-gray-700">
                            Маманның көмегінсіз сіз оңай жасай аласыз:
                        </p>

                        <div className="animate-fade-in-down block-holder bg-white px-5 py-8 text-left shadow-md border border-gray-200 rounded-lg w-full max-w-lg">
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <CheckIcon className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" />
                                    <div className="text-gray-800">
                                        Онлайн шақырту сайты (
                                        <a
                                            className="underline text-sm text-gray-600 hover:text-blue-500 transition-colors"
                                            href="https://toi-invite.kz/toi/aslan-men-erkezannyn-toiy/kk"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Мысал
                                        </a>)
                                    </div>
                                </li>

                                <li className="flex items-start">
                                    <CheckIcon className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" />
                                    <button
                                        onClick={() => openModal('Әлеуметтік желілер арқылы қонақтарды шақыру', '/images/screenshot_2.jpeg')}
                                        className="flex items-center text-left hover:text-blue-500 transition-colors w-full group"
                                    >
                                        <span className="grow">Әлеуметтік желілер арқылы қонақтарды шақыру</span>
                                        <PhotoIcon className="w-6 h-6 ml-2 text-gray-400 group-hover:text-blue-500" />
                                    </button>
                                </li>

                                <li className="flex items-start">
                                    <CheckIcon className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" />
                                    <button
                                        onClick={() => openModal('Келетін қонақтар туралы ақпарт алу', '/images/guests_screen.png')}
                                        className="flex items-center text-left hover:text-blue-500 transition-colors w-full group"
                                    >
                                        <span className="grow">Келетін қонақтар туралы ақпарт алу</span>
                                        <PhotoIcon className="w-6 h-6 ml-2 text-gray-400 group-hover:text-blue-500" />
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-8">
                            <Link
                                href="/app/select-template"
                                className="text-lg font-theme-heading font-medium bg-theme-primary px-6 py-2 text-white rounded shadow-md hover:bg-white border-2 border-transparent hover:border-theme-primary hover:text-theme-primary cursor-pointer transition duration-200"
                            >
                                Шақырту жасау
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative elements matching Vue styles */}
                <div className="transparent-cover-left hidden sm:inline-block z-10 w-72 h-[550px] bg-hero-pattern-l absolute left-[170px] xl:left-[400px]"></div>

                <div className="right-part hidden sm:inline-block absolute left-[170px] xl:left-[400px] h-[550px] overflow-hidden">
                    <video
                        preload="none"
                        className="h-full object-cover animate-fade-in-up"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src="/video/1.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>

            <Modal modal={modal} title={modalTitle} onClose={closeModal}>
                {modalImgUrl && (
                    <img className="w-full h-auto rounded" src={modalImgUrl} alt={modalTitle} />
                )}
            </Modal>
        </section>
    );
};

export default HeroSection;
