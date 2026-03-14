'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Alert from './Alert';
import ChildEditor from './ChildEditor';
import apiClient from '@/lib/api-client';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useTranslations, useLocale } from 'next-intl';

interface Child {
    key: string;
    fullname: string;
}

interface QuestionnaireProps {
    event_id: number;
    status: number;
    labels?: any;
    placeholders?: any;
    guest?: any;
    onSaved?: () => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({
    event_id,
    status,
    labels = {},
    placeholders = {},
    guest,
    onSaved,
}) => {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loadingPost, setLoadingPost] = useState(false);
    const t = useTranslations('Questionnaire');
    const tp = useTranslations('InvitationPreview');
    const locale = useLocale();

    const [model, setModel] = useState({
        fullname: '',
        relative: '',
        email: '',
        phone: '',
        status: status,
        event_id: event_id,
        personally_invited: false,
        child: [] as Child[],
    });

    useEffect(() => {
        if (status === 2) {
            setModel((prev) => ({ ...prev, personally_invited: true }));
        }
        if (guest) {
            setModel({
                ...guest,
                status: status,
            });
        }
    }, [status, guest]);

    const addChild = () => {
        const newChild = {
            key: uuidv4(),
            fullname: '',
        };
        setModel((prev) => ({
            ...prev,
            child: [...prev.child, newChild],
        }));
    };

    const handleChildChange = (updatedChild: Child) => {
        setModel((prev) => ({
            ...prev,
            child: prev.child.map((c) => (c.key === updatedChild.key ? updatedChild : c)),
        }));
    };

    const deleteChild = (childToDelete: Child) => {
        setModel((prev) => ({
            ...prev,
            child: prev.child.filter((c) => c.key !== childToDelete.key),
        }));
    };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingPost(true);
        setErrorMsg(null);
        try {
            await apiClient.post('/guest', model);
            setLoadingPost(false);
            if (onSaved) onSaved();
        } catch (err: any) {
            setLoadingPost(false);
            console.error(err);
            setErrorMsg(err.response?.data?.message || t('error_message'));
        }
    };

    const renderSubmitButtonText = () => {
        if (status === 1) return tp('yes_going');
        if (status === 0) return tp('no_going');
        return t('save_button');
    };

    return (
        <div className="max-w-md mx-auto">
            {errorMsg && (
                <div className="mb-6">
                    <Alert className="bg-rose-50 border-rose-200 text-rose-700 rounded-2xl shadow-sm">
                        <div className="text-sm font-medium">{errorMsg}</div>
                    </Alert>
                </div>
            )}

            <form onSubmit={save} className="space-y-6">
                {/* Main Guest Information Section */}
                <div className="bg-stone-50/50 p-6 rounded-3xl border border-stone-100">
                    <div className="space-y-5">
                        <div className="text-left">
                            <label htmlFor="fullname" className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 ml-1">
                                {labels.fullname || t('fullname_label')}
                            </label>
                            <div className="relative group">
                                <input
                                    value={model.fullname}
                                    onChange={(e) => setModel({ ...model, fullname: e.target.value })}
                                    type="text"
                                    id="fullname"
                                    className="block w-full px-5 py-3.5 bg-white border border-stone-200 rounded-2xl text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all duration-200 shadow-sm"
                                    placeholder={t('fullname_placeholder') || 'Аты-жөніңіз'}
                                    required
                                />
                            </div>
                        </div>

                        <div className="text-left">
                            <label htmlFor="relative" className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 ml-1">
                                {labels.relative || t('relative_label')}
                            </label>
                            <input
                                value={model.relative}
                                onChange={(e) => setModel({ ...model, relative: e.target.value })}
                                type="text"
                                id="relative"
                                className="block w-full px-5 py-3.5 bg-white border border-stone-200 rounded-2xl text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all duration-200 shadow-sm"
                                placeholder={placeholders.relative || t('relative_placeholder')}
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Guests Section */}
                {(status === 1 || status === 2) && (
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-4 px-2">
                            <div className="h-px flex-1 bg-stone-200"></div>
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em]">
                                {t('guests_title')}
                            </span>
                            <div className="h-px flex-1 bg-stone-200"></div>
                        </div>

                        <div className="space-y-3">
                            {model.child.map((child, index) => (
                                <div key={child.key} className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <ChildEditor
                                        child={child}
                                        index={index}
                                        onChange={handleChildChange}
                                        deleteChild={deleteChild}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addChild}
                            className="group flex flex-col items-center justify-center w-full py-5 px-4 border-2 border-dashed border-stone-200 rounded-2xl text-stone-400 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/30 transition-all duration-300 active:scale-[0.98] cursor-pointer"
                        >
                            <div className="bg-stone-100 group-hover:bg-amber-100 p-2 rounded-full mb-1.5 transition-colors">
                                <PlusIcon className="h-5 w-5 text-stone-400 group-hover:text-amber-600" />
                            </div>
                            <span className="text-sm font-semibold tracking-wide uppercase">
                                {labels.addChild || t('add_child')}
                            </span>
                        </button>
                    </div>
                )}

                <div className="pt-4 px-2">
                    <button
                        disabled={loadingPost}
                        type="submit"
                        className="relative w-full overflow-hidden group flex items-center justify-center rounded-2xl bg-amber-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-amber-500/10 hover:bg-amber-600 hover:shadow-amber-500/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all duration-200 cursor-pointer"
                    >
                        {loadingPost ? (
                            <span className="w-5 h-5 mr-3 rounded-full animate-spin border-2 border-solid border-white border-t-transparent"></span>
                        ) : (
                            <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]"></span>
                        )}
                        <span className="relative tracking-widest uppercase">
                            {renderSubmitButtonText()}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Questionnaire;
