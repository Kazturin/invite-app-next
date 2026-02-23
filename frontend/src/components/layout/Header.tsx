'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { UserCircleIcon, ArrowRightStartOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Header: React.FC = () => {
    const [mobileNav, setMobileNav] = useState(false);
    const [dropDownNav, setDropDownNav] = useState(false);
    const { user, token, logout } = useUserStore();
    const router = useRouter();
    const pathname = usePathname();

    const toggleMobileNav = () => setMobileNav(!mobileNav);

    const handleLogout = () => {
        setMobileNav(false);
        logout();
        router.push('/');
    };

    const toWhatsapp = () => {
        const phone = '+77005742909';
        const text = encodeURI('toi-invite.kz сайты бойынша сұрағым бар. Сұрағым:');
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

        if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
            window.location.href = `whatsapp://send?phone=${phone}&text=${text}`;
        } else {
            window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${text}`, '_blank');
        }
    };

    return (
        <div className="border-gray-200 border-b-2">
            <div className="container mx-auto px-5">
                <header className="flex justify-between items-center py-4">
                    <div>
                        <Link href="/">
                            <Image src="/logo.png" alt="Site Logo" width={208} height={50} className="w-52" priority />
                        </Link>
                    </div>

                    <nav className="flex justify-end flex-row items-center">
                        {/* Language Toggler (Mobile) */}
                        <div className="w-20 md:hidden mr-2">
                            <select className="mt-1 block w-full py-2 px-3 border-0 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm">
                                <option value="kk">KAZ</option>
                                <option value="ru">RUS</option>
                            </select>
                        </div>

                        <button onClick={toggleMobileNav} type="button" className="flex md:hidden focus:outline-none">
                            <Bars3Icon className="h-6 w-6 fill-current" />
                        </button>

                        {/* Desktop Menu */}
                        <ul className="space-x-5 font-medium text-sm items-center hidden md:flex flex-col space-y-7 md:space-y-0 md:flex-row">
                            <li className="uppercase hover:text-theme-secondary transition duration-200">
                                <a href="https://www.instagram.com/toi_invite.kz" target="_blank" rel="noopener noreferrer">
                                    <Image src="/icons/_insta.svg" alt="insta-icon" width={24} height={24} className="w-6 my-4" />
                                </a>
                            </li>
                            <li className="uppercase hover:text-theme-secondary transition duration-200">
                                <Link href="/app/events">Менің шақыруларым</Link>
                            </li>
                            {/* <li className="uppercase hover:text-theme-secondary transition duration-200">
                                <Link href="/feedback">Кері байланыс</Link>
                            </li> */}
                            <li className="uppercase bg-theme-primary px-6 py-2 text-white rounded shadow-md hover:bg-white border-2 border-transparent hover:border-amber-600 hover:text-amber-600 cursor-pointer transition duration-200">
                                <Link href="#">Блог</Link>
                            </li>
                            <li>
                                <div className="w-20">
                                    <select className="mt-1 block w-full py-2 px-3 border-0 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm">
                                        <option value="kk">KAZ</option>
                                        <option value="ru">RUS</option>
                                    </select>
                                </div>
                            </li>

                            {token ? (
                                <li className="relative transition duration-200">
                                    <div onClick={() => setDropDownNav(!dropDownNav)} className="cursor-pointer">
                                        <UserCircleIcon className="w-8 h-8 text-gray-500" />
                                    </div>
                                    {dropDownNav && (
                                        <>
                                            <button
                                                className="fixed inset-0 h-full w-full cursor-default focus:outline-none"
                                                onClick={() => setDropDownNav(false)}
                                                tabIndex={-1}
                                            />
                                            <div className="absolute shadow-lg border w-48 rounded py-1 px-2 text-sm mt-4 bg-white z-10 right-0">
                                                <a onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 cursor-pointer">
                                                    Шығу
                                                </a>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ) : (
                                <li>
                                    <Link href="/login">
                                        <ArrowRightStartOnRectangleIcon className="w-8 h-8 text-gray-500" />
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>
                </header>

                {/* Mobile Menu */}
                {mobileNav && (
                    <div className="fixed inset-0 px-5 py-12 block z-50 bg-gradient-to-b from-[#0a192f] via-[#0a192f]/90 to-[#0a192f]">
                        <div className="flex justify-between items-center">
                            <Link href="/" onClick={toggleMobileNav}>
                                <Image src="/logo.png" className="w-52" alt="Logo" width={208} height={50} />
                            </Link>
                            <button onClick={toggleMobileNav} type="button" className="focus:outline-none">
                                <XMarkIcon className="w-[30px] h-[30px] text-white" />
                            </button>
                        </div>
                        <ul className="uppercase text-white text-md tracking-widest items-center flex flex-col mt-14">
                            <li className="hover:text-amber-500 transition duration-200 py-4 border-t border-b border-gray-700 w-full text-center">
                                <Link href="/blog" onClick={toggleMobileNav}>Блог</Link>
                            </li>
                            <li className="hover:text-amber-500 transition duration-200 py-4 border-b border-gray-700 w-full text-center">
                                <Link href="/app/my-invitations" onClick={toggleMobileNav}>Менің шақыруларым</Link>
                            </li>
                            <li className="hover:text-amber-500 transition duration-200 py-4 border-b border-gray-700 w-full text-center">
                                <Link href="/feedback" onClick={toggleMobileNav}>Кері байланыс</Link>
                            </li>
                            {token ? (
                                <li className="hover:text-amber-500 transition duration-200 py-4 border-b border-gray-700 w-full text-center">
                                    <a onClick={handleLogout} className="cursor-pointer">Аккаунттан шығу</a>
                                </li>
                            ) : (
                                <li className="bg-transparent border-2 rounded px-6 py-2 mt-6 w-full text-center cursor-pointer hover:text-amber-500 transition duration-200">
                                    <Link href="/login" onClick={toggleMobileNav}>Аккаунтқа кіру</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
            <div>
                <div className="fixed bottom-0 left-0 w-16 h-16 ml-8 mb-8 z-20 cursor-pointer">
                    <Image onClick={toWhatsapp} src="/icons/questionIcon.png" alt="email-icon" width={64} height={64} />
                </div>
            </div>
        </div>
    );
};

export default Header;
