'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { useUserStore } from '@/store/useUserStore';
import Alert from '@/components/Alert';
import apiClient from '@/lib/api-client';

export default function LoginPage() {
    const router = useRouter();
    const { setToken, setUser } = useUserStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const login = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const { data } = await apiClient.post('/login', {
                email,
                password,
                remember
            });

            setToken(data.token);
            setUser(data.user);

            router.push('/');
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.response?.data?.message || 'Қате орын алды');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="mt-4 text-center text-3xl font-semibold font-roboto text-gray-900">
                Аккаунтыңызға кіріңіз
            </h2>
            <p className="mt-2 text-center text-md text-gray-600">
                Аккаунтыңыз жоқ па?{' '}
                <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Тіркелу
                </Link>
            </p>

            <form className="mt-8 space-y-6" onSubmit={login}>
                {errorMsg && (
                    <Alert className="relative">
                        {errorMsg}
                        <span
                            onClick={() => setErrorMsg('')}
                            className="absolute right-2 top-2 p-1 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </Alert>
                )}

                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <input
                            type="email"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Құпия сөз"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Мені есте сақта
                        </label>
                    </div>
                    <div>
                        <Link href="/forgot-password" title="sm" className="text-sm text-gray-600 hover:text-indigo-500">
                            Құпия сөзді ұмыттыңыз ба?
                        </Link>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                        </span>
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Кіру'
                        )}
                    </button>
                </div>
            </form>
        </>
    );
}
