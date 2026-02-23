import React from 'react';
import Link from 'next/link';
import HeroActions from './HeroActions';

const HeroSection: React.FC = () => {
    return (
        <section className="bg-white w-full bg-left bg-contain overflow-hidden bg-no-repeat h-[550px] relative">
            <div className="container mx-auto relative h-full">
                <div className="absolute top-7 z-20 flex w-full">
                    <div className="w-full lg:w-[740px] flex flex-col items-start text-center px-5">
                        <h1 className="text-left font-semibold text-3xl md:text-4xl mb-7 text-gray-600">
                            Іс-шараңызға арналған онлайн шақыру жасаңыз
                        </h1>
                        <div className="bg-yellow-500 h-[5px] w-[74px]"></div>
                        <p className="my-7 text-lg text-left text-gray-700">
                            Тез әрі оңай жасай аласыз:
                        </p>

                        <div className="block-holder bg-white px-5 py-8 text-left shadow-md border border-gray-200 rounded-lg w-full max-w-lg">
                            <HeroActions
                                screenshot2Url="/images/screenshot_2.jpeg"
                                guestsScreenUrl="/images/guests_screen.png"
                            />
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
