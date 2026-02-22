'use client';

import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

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

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setFullname(newName);
        onChange({ ...child, fullname: newName });
    };

    return (
        <>
            <div className="flex items-center">
                <div className="grow">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            name={`child_${index}`}
                            value={fullname}
                            onChange={handleNameChange}
                            placeholder="Толық аты-жөні"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-1.5 px-3 border outline-none"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => deleteChild(child)}
                            className="text-red-500 hover:text-red-700 p-1"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
            <hr className="my-4 border-gray-200" />
        </>
    );
};

export default ChildEditor;
