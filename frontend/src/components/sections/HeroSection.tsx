import React from 'react';
import { Link } from '@/i18n/routing';
import HeroActions from './HeroActions';
import { useTranslations } from 'next-intl';

import Image from 'next/image';

const HeroSection: React.FC = () => {
    const t = useTranslations('Index');

    return (
        <section className="bg-white w-full overflow-hidden h-[640px] md:h-[550px] relative">
            <Image
                src="/images/left.jpg"
                alt="Background Decoration"
                fill
                priority
                fetchPriority="high"
                unoptimized
                decoding="sync"
                className="object-cover md:object-contain object-left pointer-events-none"
                sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="container mx-auto relative h-full">
                <div className="absolute inset-y-0 z-20 flex w-full">
                    <div className="w-full lg:w-[740px] flex flex-col items-start justify-center text-center px-5">
                        <h1 className="text-left font-semibold text-3xl md:text-4xl mb-7 text-gray-900">
                            {t('hero_title')}
                        </h1>
                        <div className="bg-yellow-500 h-[5px] w-[74px]"></div>
                        <p className="my-6 text-lg text-left text-gray-700 leading-relaxed">
                            {t('hero_subtitle')}
                        </p>

                        <div className="block-holder bg-white px-5 py-8 text-left shadow-md border border-gray-200 rounded-lg w-full max-w-lg">
                            <HeroActions
                                screenshot2Url="/images/screenshot_2.jpeg"
                                guestsScreenUrl="/images/guests_screen.png"
                            />
                        </div>

                        <div className="mt-6 flex flex-wrap gap-4">
                            <Link
                                href="/app/select-template"
                                className="text-lg font-theme-heading font-medium bg-theme-primary px-6 md:px-8 py-2 md:py-3 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-white border-2 border-transparent hover:border-theme-primary hover:text-theme-primary cursor-pointer transition duration-300"
                            >
                                {t('hero_button')}
                            </Link>
                            <a
                                href="https://toi-invite.kz/toi/aslan-men-erkezannyn-toiy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-theme-heading font-medium bg-white px-6 md:px-8 py-2 md:py-3 text-theme-primary rounded-lg shadow-md hover:shadow-lg border-2 border-theme-primary hover:bg-gray-50 cursor-pointer transition duration-300 flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {t('example_link')}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="transparent-cover-left hidden sm:inline-block z-10 w-72 h-[600px] md:h-[550px] bg-hero-pattern-l absolute left-[170px] xl:left-[400px]"></div>

                <div className="right-part hidden sm:inline-block absolute left-[170px] xl:left-[400px] h-[600px] md:h-[550px] overflow-hidden">
                    <video
                        preload="metadata"
                        className="h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src="/video/1.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

