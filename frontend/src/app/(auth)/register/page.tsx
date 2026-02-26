'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { useUserStore } from '@/store/useUserStore';
import Alert from '@/components/Alert';
import apiClient from '@/lib/api-client';

export default function RegisterPage() {
    const router = useRouter();
    const { setToken, setUser, token, _hasHydrated } = useUserStore();

    React.useEffect(() => {
        if (_hasHydrated && token) {
            router.push('/');
        }
    }, [_hasHydrated, token, router]);

    const [model, setModel] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const register = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const { data } = await apiClient.post('/register', model);
            setToken(data.token);
            setUser(data.user);
            router.push('/');
        } catch (err: any) {
            console.error(err);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Тіркелу
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Аккаунтыңыз бар ма? Кіру
                </Link>
            </p>

            <form className="mt-8 space-y-6" onSubmit={register}>
                {Object.keys(errors).length > 0 && (
                    <Alert className="flex-col items-stretch text-sm">
                        {Object.keys(errors).map((field) => (
                            <div key={field}>
                                {errors[field].map((error, i) => (
                                    <div key={i}>* {error}</div>
                                ))}
                            </div>
                        ))}
                    </Alert>
                )}

                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <input
                            type="text"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Толық аты-жөніңіз"
                            value={model.name}
                            onChange={(e) => setModel({ ...model, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            value={model.email}
                            onChange={(e) => setModel({ ...model, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Құпия сөз"
                            value={model.password}
                            onChange={(e) => setModel({ ...model, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Құпия сөзді қайталаңыз"
                            value={model.password_confirmation}
                            onChange={(e) => setModel({ ...model, password_confirmation: e.target.value })}
                        />
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
                            'Тіркелу'
                        )}
                    </button>
                </div>
            </form>
        </>
    );
}
