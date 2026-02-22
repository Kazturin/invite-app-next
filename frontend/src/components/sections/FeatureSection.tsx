'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';

interface FeatureSectionProps {
    initialCategories?: any[];
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ initialCategories }) => {
    const { templateCategories, getTemplateCategories } = useAppStore();
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

    useEffect(() => {
        if (!initialCategories) {
            getTemplateCategories();
        }
    }, [getTemplateCategories, initialCategories]);

    const categories = initialCategories || templateCategories.data || [];

    useEffect(() => {
        if (categories && categories.length > 0 && activeCategoryId === null) {
            setActiveCategoryId(categories[0].id);
        }
    }, [categories, activeCategoryId]);

    return (
        <div id="features" className="container mx-auto px-5">
            <section className="py-16">
                <div className="w-full md:w-4/5 lg:w-3/5 mx-auto">
                    <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-900">
                        Сайт шақыртуыңызға шаблон таңдаңыз!
                    </h2>
                    <p className="text-gray-500 text-center mt-7 text-lg">
                        Әр түрлі іс-шараларға арналған шаблондар дайындап қойдық. Онлайн шақырту жасау енді оңай
                    </p>
                </div>

                <div className="mt-10">
                    <ul className="flex flex-col items-center md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4">
                        {categories.map((category: any) => (
                            <li
                                key={category.id}
                                className={`w-full md:w-56 cursor-pointer transition duration-200 border-gray-200 border-b-2 flex justify-center ${activeCategoryId === category.id ? 'md:border-b-4 md:border-theme-secondary' : ''
                                    }`}
                            >
                                <button
                                    onClick={() => setActiveCategoryId(category.id)}
                                    className={`py-5 w-full text-center font-medium cursor-pointer ${activeCategoryId === category.id ? 'text-theme-secondary' : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {category.title_kk || category.title_ru || category.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-16">
                    {categories.map((category: any) => (
                        <div
                            key={category.id}
                            className={activeCategoryId === category.id ? 'block' : 'hidden'}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {category.templates?.slice(0, 3).map((template: any) => (
                                    <div key={template.id} className="group relative overflow-hidden rounded-xl hover:shadow-2xl transition duration-500">
                                        <Link href={`/app/invitation-create/${template.id}`}>
                                            <img
                                                src={template.preview_img}
                                                alt={template.name || `Template ${template.id}`}
                                                className="w-full h-auto object-cover transform transition duration-700"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition duration-500 flex items-center justify-center">
                                                <span className="opacity-0 group-hover:opacity-100 bg-white text-indigo-600 px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition duration-500 shadow-lg">
                                                    Таңдау
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="mt-12 flex justify-center">
                        <Link
                            href="/app/select-template"
                            className="text-lg font-theme-heading font-medium bg-theme-primary px-6 py-2 text-white rounded shadow-md hover:bg-white border-2 border-transparent hover:border-theme-primary hover:text-theme-primary cursor-pointer transition duration-200"
                        >
                            Шақырту жасау
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FeatureSection;
