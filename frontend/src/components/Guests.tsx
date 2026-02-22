'use client';

import React, { useState } from 'react';
import { TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/Modal';
import Questionnaire from '@/components/Questionnaire';
import { useAppStore } from '@/store/useAppStore';

interface GuestChild {
    id: number;
    fullname: string;
}

interface Guest {
    id: number;
    fullname: string;
    relative: string;
    status: number;
    child: GuestChild[];
}

interface GuestsProps {
    guests: Guest[];
    eventId: string;
    onDelete: (id: number) => void;
}

const Guests: React.FC<GuestsProps> = ({ guests, eventId, onDelete }) => {
    const { getGuests } = useAppStore();
    const [modalOpen, setModalOpen] = useState(false);
    const [guestStatusFilter, setGuestStatusFilter] = useState<number>(-1);
    const [searchTerm, setSearchTerm] = useState('');

    const statuses = [
        { value: -1, name: 'Барлығы' },
        { value: 1, name: 'Келеді' },
        { value: 0, name: 'Келе алмайды' },
        { value: 2, name: 'Жауап бермеді' }
    ];

    const guestsFiltered = guests.filter(item => {
        const matchesStatus = guestStatusFilter === -1 || item.status === guestStatusFilter;
        const matchesSearch = item.fullname.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleGuestSaved = async () => {
        setModalOpen(false);
        await getGuests(eventId);
    };

    return (
        <div className="w-full bg-white rounded-xl overflow-hidden">
            <header className="px-6 py-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="w-full md:w-auto">
                        <select
                            className="w-full md:w-52 rounded-xl border border-gray-200 text-sm focus:ring-theme-primary focus:border-theme-primary py-2.5 px-4"
                            value={guestStatusFilter}
                            onChange={(e) => setGuestStatusFilter(parseInt(e.target.value))}
                        >
                            {statuses.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-theme-secondary hover:bg-theme-secondary/80 text-white font-bold py-2.5 px-6 rounded-xl transition-all active:scale-95 cursor-pointer"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Жеке шақыру үшін енгізу</span>
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                        placeholder="Қонақ есімін іздеу..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-gray-500">
                        Табылды: <span className="text-gray-900">{guestsFiltered.length} қонақ</span>
                    </p>
                </div>

                <div className="overflow-x-auto -mx-6">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Есімі</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Кім</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Бірге</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Жауабы</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Әрекет</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {guestsFiltered.map((guest, index) => (
                                    <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs mr-3">
                                                    {guest.fullname.charAt(0)}
                                                </div>
                                                <div className="text-sm font-bold text-gray-900">{guest.fullname}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {guest.relative}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex flex-col gap-1">
                                                {guest.child.map(child => (
                                                    <span key={child.id} className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-800">
                                                        {child.fullname}
                                                    </span>
                                                ))}
                                                {guest.child.length === 0 && <span className="text-gray-300">-</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${guest.status === 1 ? 'bg-green-100 text-green-700' :
                                                guest.status === 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {guest.status === 1 ? 'Келеді' : guest.status === 0 ? 'Келе алмайды' : 'Жауап жоқ'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <button
                                                onClick={() => onDelete(guest.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <TrashIcon className="w-5 h-5 mx-auto" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {guestsFiltered.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-sm">Қонақтар табылмады</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal modal={modalOpen} title="Қонақ қосу" onClose={() => setModalOpen(false)}>
                <div className="p-2">
                    <Questionnaire
                        event_id={parseInt(eventId)}
                        status={2}
                        onSaved={handleGuestSaved}
                        labels={{
                            fullname: 'Қонақтың аты-жөні',
                            relative: 'Кім болып келеді',
                            addChild: 'Бірге келетін адамды қосу (жұбайы немесе басқа)',
                        }}
                        placeholders={{
                            fullname: 'Қонақтың аты-жөні',
                            relative: 'Мысал: ағам, досым, ұжым'
                        }}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Guests;
