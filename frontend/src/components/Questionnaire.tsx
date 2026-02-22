'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Alert from './Alert';
import ChildEditor from './ChildEditor';
import { useAppStore } from '@/store/useAppStore';
import { PlusIcon } from '@heroicons/react/24/outline';

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
    const saveGuest = useAppStore((state) => state.saveGuest);

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
            await saveGuest(model);
            setLoadingPost(false);
            if (onSaved) onSaved();
        } catch (err: any) {
            setLoadingPost(false);
            console.error(err);
            setErrorMsg(err.response?.data?.message || 'Қате орын алды');
        }
    };

    return (
        <>
            {errorMsg && (
                <Alert className="flex-col items-stretch text-sm mx-4 mt-4">
                    <div>{errorMsg}</div>
                </Alert>
            )}
            <form onSubmit={save} className="mt-2 w-full">
                <div className="px-5 pb-5 pt-1">
                    <div className="mt-2 text-left">
                        <label htmlFor="fullname" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                            {labels.fullname || 'Сіздің аты-жөніңіз'}
                        </label>
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600">
                            <input
                                value={model.fullname}
                                onChange={(e) => setModel({ ...model, fullname: e.target.value })}
                                type="text"
                                id="fullname"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-2 text-left">
                        <label htmlFor="relative" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                            {labels.relative || 'Туыстық қатынас'}
                        </label>
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600">
                            <input
                                value={model.relative}
                                onChange={(e) => setModel({ ...model, relative: e.target.value })}
                                type="text"
                                id="relative"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder={placeholders.relative || 'Мысалы: Досы, Әріптесі'}
                            />
                        </div>
                    </div>

                    {(status === 1 || status === 2) && (
                        <div className="bg-white my-4 border-t border-gray-300">
                            <div className="text-md font-semibold mb-2">
                                <button
                                    type="button"
                                    onClick={addChild}
                                    className="flex items-center text-sm mt-2 py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700 transition-colors"
                                >
                                    {labels.addChild || 'Тағы адам қосу'}
                                    <PlusIcon className="h-4 w-4 ml-1" />
                                </button>
                            </div>
                            <div>
                                {model.child.map((child, index) => (
                                    <ChildEditor
                                        key={child.key}
                                        child={child}
                                        index={index}
                                        onChange={handleChildChange}
                                        deleteChild={deleteChild}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                        disabled={loadingPost}
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-amber-500 px-6 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed shadow-sm sm:ml-3 sm:w-auto hover:bg-amber-600 transition-colors"
                    >
                        {loadingPost && (
                            <span className="w-5 h-5 mr-2 rounded-full animate-spin border-2 border-solid border-white border-t-transparent"></span>
                        )}
                        {status === 1 ? 'Барамын' : status === 0 ? 'Бара алмаймын' : 'Сақтау'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default Questionnaire;
