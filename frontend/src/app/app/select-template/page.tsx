'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import Stepper from '@/components/Stepper';
import Spinner from '@/components/Spinner';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import { PlayIcon } from '@heroicons/react/24/outline';

const SelectTemplateContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { templateCategories, getTemplateCategories } = useAppStore();

    const [selectedCategory, setSelectedCategory] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [modal, setModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalVideoUrl, setModalVideoUrl] = useState('');

    const itemsPerPage = 6;

    useEffect(() => {
        getTemplateCategories();
    }, [getTemplateCategories]);

    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        const pageFromUrl = searchParams.get('page');

        if (categoryFromUrl) {
            setSelectedCategory(parseInt(categoryFromUrl, 10));
        }
        if (pageFromUrl) {
            setCurrentPage(parseInt(pageFromUrl, 10));
        }
    }, [searchParams]);

    const categories = templateCategories.data || [];
    const loading = templateCategories.loading;

    const activeCategory = categories.find((cat: any) => cat.id === selectedCategory);
    const filteredTemplates = activeCategory?.templates || [];

    const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedTemplates = filteredTemplates.slice(start, end);

    const openModal = (title: string, videoUrl: string) => {
        setModalVideoUrl(videoUrl);
        setModalTitle(title);
        setModal(true);
    };

    const closeModal = () => setModal(false);

    const selectCategory = (categoryId: number) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', categoryId.toString());
        params.set('page', '1');
        router.replace(`/app/select-template?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.replace(`/app/select-template?${params.toString()}`);
    };

    const selectTemplate = (templateId: number) => {
        router.push(`/app/invitation-create/${templateId}`);
    };

    return (
        <div className="container mx-auto">
            <Stepper step={1}>
                <div id="features" className="container mx-auto px-0 sm:px-5">
                    <section className="py-8 sm:py-16">
                        <div className="w-full md:w-4/5 lg:w-3/5 mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
                                Алдағы іс-шараңызға арналған шаблонды таңдаңыз!
                            </h2>
                            <p className="text-gray-500 text-center my-7 text-lg">
                                Әр түрлі іс-шараларға арналған шаблондар дайындап қойдық. Онлайн шақырту жасау енді оңай!
                            </p>

                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => openModal('Үлгі', '/video/Instructions.mp4')}
                                    className="flex items-center bg-theme-primary cursor-pointer px-6 py-2 text-white rounded-lg hover:bg-white border-2 border-transparent hover:border-theme-primary hover:text-theme-primary transition-all font-bold shadow-md"
                                >
                                    <PlayIcon className="w-6 h-6 mr-2" />
                                    <span>Үлгі</span>
                                </button>
                                <button
                                    onClick={() => openModal('Жеке шақыру', '/video/preview.mp4')}
                                    className="flex items-center bg-theme-primary cursor-pointer px-6 py-2 text-white rounded-lg hover:bg-white border-2 border-transparent hover:border-theme-primary hover:text-theme-primary transition-all font-bold shadow-md"
                                >
                                    <PlayIcon className="w-6 h-6 mr-2" />
                                    <span>Жеке шақыру</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 overflow-x-auto">
                            <ul className="flex flex-nowrap md:flex-wrap justify-start md:justify-center border-b border-gray-100 min-w-max">
                                {categories.map((category: any) => (
                                    <li
                                        key={category.id}
                                        className={`cursor-pointer transition duration-300 px-8 py-4 font-bold text-sm uppercase tracking-wider ${selectedCategory === category.id
                                            ? 'text-theme-secondary border-b-4 border-theme-secondary'
                                            : 'text-gray-400 hover:text-gray-600 border-b-2 border-gray-200'
                                            }`}
                                        onClick={() => selectCategory(category.id)}
                                    >
                                        {category.title_kk || category.name}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-12">
                            {loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center">
                                        {paginatedTemplates.map((template: any) => (
                                            <div
                                                key={template.id}
                                                onClick={() => selectTemplate(template.id)}
                                                className="relative cursor-pointer group rounded-2xl overflow-hidden hover:shadow-2xl transition duration-500 bg-white"
                                            >
                                                <div className="absolute right-4 top-4 z-10 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition duration-500">
                                                    Таңдау
                                                </div>
                                                <div className="absolute left-4 bottom-4 z-10 font-bold text-green-600 bg-white/90 px-3 py-1 rounded-lg shadow-sm">
                                                    {template.price} тг
                                                </div>
                                                <img
                                                    src={template.preview_img}
                                                    alt={template.title}
                                                    className="w-full h-auto object-cover transform transition duration-700"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChanged={handlePageChange}
                                        className="mt-16"
                                    />
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </Stepper>

            <Modal modal={modal} title={modalTitle} onClose={closeModal}>
                <div className="w-full aspect-[9/16] max-w-[320px] mx-auto overflow-hidden rounded-2xl shadow-2xl">
                    <iframe
                        src={modalVideoUrl}
                        className="w-full h-full"
                        allowFullScreen
                        allow="autoplay"
                    ></iframe>
                </div>
            </Modal>
        </div>
    );
};

export default function SelectTemplatePage() {
    return (
        <Suspense fallback={<Spinner />}>
            <SelectTemplateContent />
        </Suspense>
    );
}
