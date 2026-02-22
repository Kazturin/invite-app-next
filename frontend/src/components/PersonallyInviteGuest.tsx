'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
import Alert from '@/components/Alert';
import {
    ChatBubbleLeftRightIcon,
    LinkIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { toolbarOptions } from '@/lib/quillConfig';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface Guest {
    id: number;
    fullname: string;
    relative: string;
    invite?: {
        id: number;
        guest_id: number;
        invite_text: string;
        invite_code: string;
    };
}

interface PersonallyInviteGuestProps {
    guests: Guest[];
    url: string;
}

const PersonallyInviteGuest: React.FC<PersonallyInviteGuestProps> = ({ guests, url }) => {
    const { saveGuestInvite } = useAppStore();
    const [saved, setSaved] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loadingPost, setLoadingPost] = useState(false);

    const [model, setModel] = useState({
        id: null as number | null,
        guest_id: '',
        invite_text: '<p><span style="color: rgb(255, 194, 102);">Құрметті Аслан</span></p><p><br></p><p>Тойымыздың қадірлі қонағы болыңыз.</p>',
        invite_code: '',
    });

    const getFullUrl = () => {
        if (model.invite_code) {
            return `${url}?invite_code=${model.invite_code}`;
        }
        return null;
    };

    const loadInviteData = (guestId: string) => {
        if (!guestId) {
            resetForm();
            return;
        }

        const selectedGuest = guests.find(g => g.id === Number(guestId));
        if (selectedGuest && selectedGuest.invite) {
            setModel({
                id: selectedGuest.invite.id,
                guest_id: String(selectedGuest.invite.guest_id),
                invite_text: selectedGuest.invite.invite_text,
                invite_code: selectedGuest.invite.invite_code,
            });
            setSaved(true);
        } else {
            resetForm(guestId);
            setSaved(false);
        }
    };

    const resetForm = (guestId = '') => {
        setModel({
            id: null,
            guest_id: guestId,
            invite_text: '<p><span style="color: rgb(255, 194, 102);">Құрметті Аслан</span></p><p><br></p><p>Тойымыздың қадірлі қонағы болыңыз.</p>',
            invite_code: uuidv4(),
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!model.guest_id) {
            setErrorMsg('Қонақты таңдаңыз');
            return;
        }

        setLoadingPost(true);
        setErrorMsg(null);

        try {
            await saveGuestInvite(model);
            setSaved(true);
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Сақтау кезінде қате орын алды');
        } finally {
            setLoadingPost(false);
        }
    };

    const shareOnWhatsapp = () => {
        const fullUrl = getFullUrl();
        if (!fullUrl) return;
        const text = encodeURIComponent(`Сәлеметсіз бе! Сізді тойға шақырамыз: ${fullUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    return (
        <div className="space-y-6">
            {errorMsg && <Alert className="mb-4">{errorMsg}</Alert>}

            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                        Қонақты таңдаңыз
                    </label>
                    <select
                        value={model.guest_id}
                        onChange={(e) => loadInviteData(e.target.value)}
                        className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 transition-all"
                    >
                        <option value="" disabled>Қонақты таңдаңыз</option>
                        {guests.map(guest => (
                            <option key={guest.id} value={guest.id}>
                                {guest.fullname} — {guest.relative}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                        Шақыру мәтіні
                    </label>
                    <div className="relative text-black">
                        <ReactQuill
                            theme="snow"
                            value={model.invite_text}
                            onChange={(content) => setModel(prev => ({ ...prev, invite_text: content }))}
                            modules={{ toolbar: toolbarOptions }}
                            className="min-h-[150px] mb-12 bg-gray-50 rounded-xl"
                            placeholder="Шақыру мәтінін енгізіңіз..."
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center gap-4">
                    <button
                        type="submit"
                        disabled={loadingPost}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loadingPost ? (
                            <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        ) : (
                            <span>Сақтау</span>
                        )}
                    </button>

                    {saved && (
                        <button
                            type="button"
                            onClick={shareOnWhatsapp}
                            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5c] text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95"
                        >
                            <img src="/icons/whatsapp-icon.png" className="w-5 h-5 invert brightness-0" alt="WA" />
                            <span>WhatsApp</span>
                        </button>
                    )}
                </div>
            </form>

            {saved && (
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 space-y-3">
                    <p className="text-xs font-bold text-indigo-900 uppercase tracking-widest">Жеке сілтеме дайын:</p>
                    <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-indigo-200 shadow-sm overflow-hidden">
                        <LinkIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-xs text-indigo-600 font-medium truncate grow">
                            {getFullUrl()}
                        </span>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(getFullUrl() || '');
                                alert('Көшірілді!');
                            }}
                            className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded hover:bg-indigo-100"
                        >
                            КӨШІРУ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonallyInviteGuest;
