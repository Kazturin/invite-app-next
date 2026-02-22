'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import Breadcrumbs from '@/components/Breadcrumbs';
import Spinner from '@/components/Spinner';
import Guests from '@/components/Guests';
import PersonallyInviteGuest from '@/components/PersonallyInviteGuest';
import {
    ClockIcon,
    PencilIcon,
    TrashIcon,
    GlobeAltIcon,
    ArrowDownOnSquareIcon,
    CheckIcon,
    XMarkIcon,
    UserGroupIcon,
    InformationCircleIcon,
    UsersIcon,
    ShareIcon
} from '@heroicons/react/24/outline';

interface PageProps {
    params: Promise<{ id: string }>;
}

const MyEventPage = ({ params }: PageProps) => {
    const { id } = use(params);
    const router = useRouter();
    const { getEvent, getGuests, event, guests, deleteEvent, deleteGuest } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    getEvent(id),
                    getGuests(id)
                ]);
            } catch (error) {
                console.error('Failed to fetch event data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, getEvent, getGuests]);

    const acceptedCount = guests.filter(g => g.status === 1).length;
    const rejectedCount = guests.filter(g => g.status === 0).length;
    const totalCount = guests.reduce((acc, curr) => {
        if (curr.status === 1) {
            return acc + 1 + (curr.child?.length || 0);
        }
        return acc;
    }, 0);

    const handleDeleteEvent = async () => {
        if (confirm('Өшіруге сенімдісіз бе? Өшірілгеннен кейін қайта қалпына келмейді!!')) {
            try {
                await deleteEvent(id);
                router.push('/app/events');
            } catch (error) {
                console.error('Failed to delete event', error);
            }
        }
    };

    const handleDeleteGuest = async (guestId: number) => {
        if (confirm('Өшіруге сенімдісіз бе?')) {
            try {
                await deleteGuest(guestId);
                await getGuests(id);
            } catch (error) {
                console.error('Failed to delete guest', error);
            }
        }
    };

    if (loading && !event.data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    const myEvent = event.data;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = myEvent ? `${baseUrl}/toi/${myEvent.slug}` : '';

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <Breadcrumbs
                    links={[
                        { name: 'Менің іс-шараларым', href: '/app/events' },
                        { name: myEvent?.title || 'Іс-шара' }
                    ]}
                />
            </div>

            {/* Tabs Navigation */}
            <div className="flex justify-center mb-8">
                <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
                    {[
                        { id: 1, name: 'Ақпарат', icon: InformationCircleIcon },
                        { id: 2, name: 'Қонақтар', icon: UsersIcon },
                        { id: 3, name: 'Шақыру', icon: ShareIcon },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                ? 'bg-theme-primary text-white shadow-lg shadow-indigo-100 scale-105'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden min-h-[500px]">
                {/* Tab 1: Info */}
                {activeTab === 1 && myEvent && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row">
                            {/* Visual Preview */}
                            <div className="w-full md:w-80 h-96 relative flex items-center justify-center p-10">
                                {myEvent.invitation?.template?.envelope_img && (
                                    <img
                                        className="w-56 absolute -rotate-12"
                                        src={myEvent.invitation.template.envelope_img}
                                        alt="Envelope"
                                    />
                                )}
                                {myEvent.invitation?.invitation_img && (
                                    <img
                                        className="w-44 absolute shadow-2xl"
                                        src={myEvent.invitation.invitation_img}
                                        alt="Invitation"
                                    />
                                )}
                            </div>

                            {/* Details */}
                            <div className="p-8 md:p-10 grow flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h1 className="text-2xl font-semibold font-roboto text-gray-700 mb-2">{myEvent.title}</h1>
                                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                                            <ClockIcon className="w-5 h-5" />
                                            <span>{myEvent.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {myEvent.order?.status !== 2 && (
                                            <button
                                                onClick={() => router.push(`/app/events/${id}/update`)}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
                                                title="Өңдеу"
                                            >
                                                <PencilIcon className="w-6 h-6" />
                                            </button>
                                        )}
                                        <button
                                            onClick={handleDeleteEvent}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                            title="Өшіру"
                                        >
                                            <TrashIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="mb-8">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${myEvent.order?.status === 2 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {myEvent.order?.statusLabel || (myEvent.order?.status === 2 ? 'Төленген' : 'Күтілуде')}
                                    </span>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                                        <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase tracking-wider mb-1">
                                            <CheckIcon className="w-4 h-4" />
                                            <span>Келеді</span>
                                        </div>
                                        <div className="text-2xl font-black text-green-900">{acceptedCount}</div>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                                        <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider mb-1">
                                            <XMarkIcon className="w-4 h-4" />
                                            <span>Келмейді</span>
                                        </div>
                                        <div className="text-2xl font-black text-red-900">{rejectedCount}</div>
                                    </div>
                                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 col-span-2 lg:col-span-1">
                                        <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
                                            <UserGroupIcon className="w-4 h-4" />
                                            <span>Жалпы қонақ</span>
                                        </div>
                                        <div className="text-2xl font-black text-indigo-900">{totalCount}</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-wrap gap-4">
                                    {myEvent.slug && (
                                        <a
                                            href={`/toi/${myEvent.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                                        >
                                            <GlobeAltIcon className="w-5 h-5" />
                                            Сайтты ашу
                                        </a>
                                    )}
                                    <a
                                        href={myEvent.invitation?.invitation_img}
                                        download={myEvent.title}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                                    >
                                        <ArrowDownOnSquareIcon className="w-5 h-5" />
                                        Жүктеп алу
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Guests */}
                {activeTab === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Guests
                            guests={guests}
                            eventId={id}
                            onDelete={handleDeleteGuest}
                        />
                    </div>
                )}

                {/* Tab 3: Invitation */}
                {activeTab === 3 && (
                    <div className="p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="max-w-xl mx-auto space-y-10">
                            {/* Public Link */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
                                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight italic">Жалпы шақыру сілтемесі</h2>
                                </div>
                                <div className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl text-white shadow-xl shadow-indigo-100">
                                    <p className="text-indigo-100 text-sm mb-4 font-medium opacity-80">
                                        Осы сілтемені кез келген адамға немесе топтық чаттарға жіберуге болады
                                    </p>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                                        <span className="text-sm font-medium truncate grow opacity-90">{shareUrl}</span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(shareUrl);
                                                alert('Көшірілді!');
                                            }}
                                            className="bg-white text-indigo-600 text-xs font-bold px-4 py-2 rounded-xl active:scale-95 transition-all shadow-sm"
                                        >
                                            КӨШІРУ
                                        </button>
                                    </div>

                                    <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-white/10">
                                        <button
                                            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank')}
                                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg group"
                                        >
                                            <svg className="w-6 h-6 text-gray-400 group-hover:text-[#25D366] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.67-1.618-.918-2.213-.242-.594-.487-.513-.67-.522-.172-.007-.37-.008-.568-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.438h.005c6.554 0 11.888-5.335 11.891-11.893a11.826 11.826 0 00-3.483-8.411z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg group"
                                        >
                                            <svg className="w-6 h-6 text-gray-400 group-hover:text-[#0088cc] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.54.26l.21-3.05 5.51-4.97c.239-.213-.052-.331-.371-.12l-6.81 4.28-2.95-.92c-.641-.2-1.062-.641.05-1.08l11.52-4.44c.532-.193 1 .129.831.819z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <div className="h-px bg-gray-100 my-10"></div>

                            {/* Personal Invites */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-1 bg-amber-500 rounded-full"></div>
                                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight italic">Жеке шақыру</h2>
                                </div>
                                <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
                                    <PersonallyInviteGuest
                                        guests={guests}
                                        url={shareUrl}
                                    />
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEventPage;
