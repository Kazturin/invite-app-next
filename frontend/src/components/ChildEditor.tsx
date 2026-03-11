'use client';

import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

interface Child {
    key: string;
    fullname: string;
}

interface ChildEditorProps {
    child: Child;
    index: number;
    onChange: (child: Child) => void;
    deleteChild: (child: Child) => void;
}

const ChildEditor: React.FC<ChildEditorProps> = ({ child, index, onChange, deleteChild }) => {
    const [fullname, setFullname] = useState(child.fullname);
    const t = useTranslations('Questionnaire');

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setFullname(newName);
        onChange({ ...child, fullname: newName });
    };

    return (
        <div className="group flex items-center gap-2 p-1 bg-white border border-stone-200 rounded-2xl shadow-sm hover:border-amber-200 hover:shadow-md transition-all duration-300">
            <div className="flex-1 pl-4">
                <input
                    type="text"
                    name={`child_${index}`}
                    value={fullname}
                    onChange={handleNameChange}
                    placeholder={t('child_name_placeholder')}
                    className="w-full py-2.5 bg-transparent border-none text-stone-900 placeholder:text-stone-400 focus:ring-0 text-sm font-medium"
                    required
                />
            </div>
            <button
                type="button"
                onClick={() => deleteChild(child)}
                className="p-2.5 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200"
                title={t('delete_child') || 'Удалить'}
            >
                <TrashIcon className="h-5 w-5" />
            </button>
        </div>
    );
};

export default ChildEditor;
