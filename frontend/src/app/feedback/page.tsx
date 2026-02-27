'use client';

import '../editor-fonts.css';
import React, { useState } from 'react';
import apiClient from '@/lib/api-client';
import Alert from '@/components/Alert';
import { useUserStore } from '@/store/useUserStore';

const FeedbackPage = () => {
    const [model, setModel] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            await apiClient.post('/feedback', model);
            setModel({
                name: '',
                email: '',
                message: '',
            });
            setSuccessMsg('Сәтті жіберілді');
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-600 text-gray-100 px-8 py-12 min-h-screen">
            <div className="text-center text-3xl font-vivaldi w-full">
                КБ
            </div>
            <div className="max-w-screen-xl mt-12 px-8 grid gap-8 grid-cols-1 md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 py-16 mx-auto bg-gray-100 text-gray-900 rounded-lg shadow-lg">
                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-600 leading-tight">Бізге хабарлама қалдырыңыз</h2>
                    </div>
                    <div className="mt-8 text-center">
                        <svg className="w-full" xmlns="http://www.w3.org/2000/svg" id="ae37f038-3a9e-4b82-ad68-fc94ba16af2a" data-name="Layer 1" viewBox="0 0 1096 574.74">
                            <defs>
                                <linearGradient id="eb6c86d6-45fa-49e0-9a60-1b0612516196" x1="819.07" y1="732.58" x2="819.07" y2="560.46" gradientUnits="userSpaceOnUse">
                                    <stop offset="0" stopColor="gray" stopOpacity="0.25" />
                                    <stop offset="0.54" stopColor="gray" stopOpacity="0.12" />
                                    <stop offset="1" stopColor="gray" stopOpacity="0.1" />
                                </linearGradient>
                            </defs>
                            <title>contact us</title>
                            <g opacity="0.1">
                                <ellipse cx="479.42" cy="362.12" rx="11.38" ry="14.9" fill="#3f3d56" />
                                <path d="M540.43,461a18,18,0,0,0,2.38-9.11c0-8.23-5.1-14.9-11.39-14.9S520,443.68,520,451.91a18,18,0,0,0,2.38,9.11,18.61,18.61,0,0,0,0,18.21,18.61,18.61,0,0,0,0,18.21,17.94,17.94,0,0,0-2.38,9.11c0,8.22,5.1,14.9,11.38,14.9s11.39-6.68,11.39-14.9a17.94,17.94,0,0,0-2.38-9.11,18.61,18.61,0,0,0,0-18.21,18.61,18.61,0,0,0,0-18.21Z" transform="translate(-52 -162.63)" fill="#3f3d56" />
                                <ellipse cx="479.42" cy="271.07" rx="11.38" ry="14.9" fill="#3f3d56" />
                                <ellipse cx="479.42" cy="252.86" rx="11.38" ry="14.9" fill="#3f3d56" />
                                <path d="M488.82,290.86a53.08,53.08,0,0,1-4.24-6.24l29.9-4.91-32.34.24a54.62,54.62,0,0,1-1-43.2l43.39,22.51-40-29.42a54.53,54.53,0,1,1,90,61,54.54,54.54,0,0,1,6.22,9.94L541.92,321l41.39-13.89a54.53,54.53,0,0,1-8.79,51.2,54.52,54.52,0,1,1-85.7,0,54.52,54.52,0,0,1,0-67.42Z" transform="translate(-52 -162.63)" fill="#667eea" />
                                <path d="M586.19,324.57a54.27,54.27,0,0,1-11.67,33.71,54.52,54.52,0,1,1-85.7,0C481.51,349,586.19,318.45,586.19,324.57Z" transform="translate(-52 -162.63)" opacity="0.1" />
                            </g>
                            <g opacity="0.1">
                                <ellipse cx="612.28" cy="330.26" rx="8.51" ry="11.13" fill="#3f3d56" />
                                <path d="M671,445.26a13.43,13.43,0,0,0,1.77-6.8c0-6.15-3.81-11.14-8.5-11.14s-8.51,5-8.51,11.14a13.33,13.33,0,0,0,1.78,6.8,13.9,13.9,0,0,0,0,13.61,13.9,13.9,0,0,0,0,13.61,13.33,13.33,0,0,0-1.78,6.8c0,6.15,3.81,11.14,8.51,11.14s8.5-5,8.5-11.14a13.43,13.43,0,0,0-1.77-6.8,14,14,0,0,0,0-13.61,14,14,0,0,0,0-13.61Z" transform="translate(-52 -162.63)" fill="#3f3d56" />
                                <ellipse cx="612.28" cy="262.22" rx="8.51" ry="11.13" fill="#3f3d56" />
                                <ellipse cx="612.28" cy="248.61" rx="8.51" ry="11.13" fill="#3f3d56" />
                                <path d="M632.44,318.11a39,39,0,0,1-3.17-4.66l22.35-3.67-24.17.18a40.84,40.84,0,0,1-.78-32.29L659.1,294.5l-29.91-22a40.75,40.75,0,1,1,67.29,45.6,41.2,41.2,0,0,1,4.65,7.43l-29,15.07,30.93-10.38a40.76,40.76,0,0,1-6.57,38.26,40.74,40.74,0,1,1-64,0,40.74,40.74,0,0,1,0-50.38Z" transform="translate(-52 -162.63)" fill="#667eea" />
                                <path d="M705.2,343.3a40.57,40.57,0,0,1-8.72,25.19,40.74,40.74,0,1,1-64,0C627,361.56,705.2,338.73,705.2,343.3Z" transform="translate(-52 -162.63)" opacity="0.1" />
                            </g>
                            <g opacity="0.1">
                                <ellipse cx="1038.58" cy="322.12" rx="11.38" ry="14.9" fill="#3f3d56" />
                                <path d="M1081.57,421a18,18,0,0,1-2.38-9.11c0-8.23,5.1-14.9,11.39-14.9s11.38,6.67,11.38,14.9a18,18,0,0,1-2.38,9.11,18.61,18.61,0,0,1,0,18.21,18.61,18.61,0,0,1,0,18.21,17.94,17.94,0,0,1,2.38,9.11c0,8.22-5.1,14.9-11.38,14.9s-11.39-6.68-11.39-14.9a17.94,17.94,0,0,1,2.38-9.11,18.61,18.61,0,0,1,0-18.21,18.61,18.61,0,0,1,0-18.21Z" transform="translate(-52 -162.63)" fill="#3f3d56" />
                                <ellipse cx="1038.58" cy="231.07" rx="11.38" ry="14.9" fill="#3f3d56" />
                                <ellipse cx="1038.58" cy="212.86" rx="11.38" ry="14.9" fill="#3f3d56" />
                                <path d="M1133.18,250.86a53.08,53.08,0,0,0,4.24-6.24l-29.9-4.91,32.34.24a54.62,54.62,0,0,0,1-43.2l-43.39,22.51,40-29.42a54.53,54.53,0,1,0-90,61,54.54,54.54,0,0,0-6.22,9.94L1080.08,281l-41.39-13.89a54.53,54.53,0,0,0,8.79,51.2,54.52,54.52,0,1,0,85.7,0,54.52,54.52,0,0,0,0-67.42Z" transform="translate(-52 -162.63)" fill="#667eea" />
                                <path d="M1035.81,284.57a54.27,54.27,0,0,0,11.67,33.71,54.52,54.52,0,1,0,85.7,0C1140.49,309,1035.81,278.45,1035.81,284.57Z" transform="translate(-52 -162.63)" opacity="0.1" />
                            </g>
                            <ellipse cx="548" cy="493.13" rx="548" ry="8.86" fill="#667eea" opacity="0.1" />
                            <ellipse cx="548" cy="565.88" rx="548" ry="8.86" fill="#667eea" opacity="0.1" />
                            <ellipse cx="548" cy="341.3" rx="548" ry="8.86" fill="#667eea" opacity="0.1" />
                            <ellipse cx="548" cy="417.21" rx="548" ry="8.86" fill="#667eea" opacity="0.1" />
                            <circle cx="550.08" cy="390.01" r="99.96" fill="#3f3d56" />
                            <path d="M602.08,563.5A15.14,15.14,0,0,0,613,559l43.59-44.37a8.7,8.7,0,0,0-5.5-2H553.15a8.64,8.64,0,0,0-5.5,2L591.25,559A15.08,15.08,0,0,0,602.08,563.5Z" transform="translate(-52 -162.63)" fill="#667eea" />
                        </svg>
                    </div>
                </div>
                <div>
                    <form onSubmit={handleSubmit} className="mt-2 w-full">
                        {errorMsg && (
                            <Alert className="mb-4">
                                <div className="flex justify-between items-center w-full">
                                    <span>{errorMsg}</span>
                                    <span
                                        onClick={() => setErrorMsg(null)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer hover:bg-[rgba(0,0,0,0.2)]"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </span>
                                </div>
                            </Alert>
                        )}
                        {successMsg && (
                            <div className="p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 flex justify-between items-center">
                                <span>{successMsg}</span>
                                <span
                                    onClick={() => setSuccessMsg(null)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer hover:bg-[rgba(0,0,0,0.2)]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </span>
                            </div>
                        )}
                        <div>
                            <span className="uppercase text-sm text-gray-600 font-bold">Аты-жөніңіз</span>
                            <input
                                value={model.name}
                                onChange={(e) => setModel({ ...model, name: e.target.value })}
                                className="w-full bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                type="text"
                                required
                            />
                        </div>
                        <div className="mt-8">
                            <span className="uppercase text-sm text-gray-600 font-bold">Email</span>
                            <input
                                value={model.email}
                                onChange={(e) => setModel({ ...model, email: e.target.value })}
                                className="w-full bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                type="email"
                                required
                            />
                        </div>
                        <div className="mt-8">
                            <span className="uppercase text-sm text-gray-600 font-bold">Хабарлама</span>
                            <textarea
                                value={model.message}
                                onChange={(e) => setModel({ ...model, message: e.target.value })}
                                className="w-full h-32 bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                required
                            ></textarea>
                        </div>
                        <div className="mt-8">
                            <button
                                disabled={loading}
                                className="disabled:cursor-not-allowed flex items-center justify-center disabled:bg-indigo-400 uppercase text-sm font-bold tracking-wide bg-indigo-500 text-gray-100 p-3 rounded-lg w-full focus:outline-none focus:shadow-outline transition duration-200 hover:bg-indigo-600"
                            >
                                {loading && (
                                    <span className="w-5 h-5 mr-2 rounded-full animate-spin border-2 border-solid border-white border-t-transparent"></span>
                                )}
                                <span>Хабарлама жіберу</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="text-center text-white py-6">&copy; toi-invite.kz</div>
        </div>
    );
};

export default FeedbackPage;
