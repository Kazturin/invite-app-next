import React, { useState, useEffect, useRef } from 'react';
import { BuildingLibraryIcon, GlobeAltIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Alert from '@/components/Alert';
import { useUserStore } from '@/store/useUserStore';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { toolbarOptions } from '@/lib/quillConfig';
import { useTranslations } from 'next-intl';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export interface EventFormRef {
    submit: (isComplete: boolean) => void;
}

interface EventFormProps {
    initialData?: any;
    onSubmit: (formData: FormData, isComplete?: boolean) => void;
    onDeleteImage?: (imageId: number) => Promise<void>;
    onPreview?: () => void;
    loading: boolean;
    errors?: any | null;
}

const EventForm = React.forwardRef<EventFormRef, EventFormProps>(({ initialData, onSubmit, onDeleteImage, onPreview, loading, errors }, ref) => {
    const { user } = useUserStore();
    const t = useTranslations('EventForm');
    const [validationErrors, setValidationErrors] = useState<any>({});

    const [model, setModel] = useState({
        title: initialData?.title || '',
        type: initialData?.type || 'wedding',
        description: initialData?.description || t.raw('additional_info_placeholder'),
        photos_link: initialData?.photos_link || '',
        place: initialData?.place || '',
        address_link: initialData?.address?.address || initialData?.address_link || '',
        video_link: initialData?.video_link || '',
        date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
        audioToggle: !!initialData?.audio || false,
        audio: initialData?.audio || '/audio/default.mp3',
    });

    const [galleryPreviews, setGalleryPreviews] = useState<any[]>([]);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const audioPlayerRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (initialData?.images) {
            setGalleryPreviews(initialData.images.map((img: any) => ({
                url: img.path.startsWith('http') ? img.path : `/storage/${img.path}`,
                id: img.id
            })));
        }
    }, [initialData]);

    useEffect(() => {
        if (errors && typeof errors === 'object' && errors.errors) {
            const serverErrors: any = {};
            Object.keys(errors.errors).forEach(key => {
                const errorValue = Array.isArray(errors.errors[key]) ? errors.errors[key][0] : errors.errors[key];

                // Map server keys to form field IDs if they differ
                let fieldKey = key;
                if (key === 'address.address') fieldKey = 'address_link';
                // Add other mappings if necessary

                serverErrors[fieldKey] = errorValue;
            });
            setValidationErrors(serverErrors);

            // Scroll to first server error
            const firstErrorField = Object.keys(serverErrors)[0];
            const element = document.getElementById(firstErrorField);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [errors]);

    const scrollToFirstError = (errorsObj: any) => {
        const firstErrorField = Object.keys(errorsObj)[0];
        const element = document.getElementById(firstErrorField);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            window.scrollTo(0, 0);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setModel(prev => ({ ...prev, [name]: value }));
    };

    const handleAudioToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModel(prev => ({ ...prev, audioToggle: e.target.checked }));
    };

    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        const remainingSlots = 5 - galleryPreviews.length;
        const filesToProcess = files.slice(0, remainingSlots);

        filesToProcess.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                setGalleryPreviews(prev => [...prev, { url: reader.result as string, id: null, file }]);
                setGalleryFiles(prev => [...prev, file]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeGalleryImage = async (index: number) => {
        const image = galleryPreviews[index];
        if (image.id && onDeleteImage) {
            try {
                await onDeleteImage(image.id);
            } catch (err) {
                console.error('Failed to delete image', err);
                return;
            }
        }
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
        if (!image.id) {
            setGalleryFiles(prev => prev.filter(f => f !== image.file));
        }
    };

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        setAudioFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            if (audioPlayerRef.current) {
                audioPlayerRef.current.src = reader.result as string;
            }
        };
        reader.readAsDataURL(file);
    };

    const handleFormSubmit = (e: React.MouseEvent, isComplete: boolean) => {
        e.preventDefault();

        const errors: any = {};
        if (!model.title) errors.title = t('errors.title_required');
        if (!model.place) errors.place = t('errors.place_required');
        if (!model.address_link) errors.address_link = t('errors.address_required');
        if (!model.date) errors.date = t('errors.date_required');

        if (model.video_link) {
            const ytRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
            if (!model.video_link.match(ytRegex)) {
                errors.video_link = t('errors.youtube_invalid');
            }
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            scrollToFirstError(errors);
            return;
        }

        const formData = new FormData();
        formData.append('title', model.title);
        formData.append('type', model.type);
        formData.append('description', model.description);
        formData.append('place', model.place);
        formData.append('address[address]', model.address_link);
        formData.append('address[lat]', '0');
        formData.append('address[long]', '0');
        formData.append('date', model.date);
        formData.append('photos_link', model.photos_link);
        formData.append('video_link', model.video_link);
        formData.append('created_by', user?.id || '');

        if (model.audioToggle) {
            formData.append('audio', model.audio);
            if (audioFile) {
                formData.append('audioFile', audioFile);
            }
        }

        galleryFiles.forEach(file => {
            formData.append('gallery[]', file);
        });

        onSubmit(formData, isComplete);
    };

    React.useImperativeHandle(ref, () => ({
        submit: (isComplete: boolean) => {
            const mockEvent = { preventDefault: () => { } } as React.MouseEvent;
            handleFormSubmit(mockEvent, isComplete);
        }
    }));

    return (
        <form onSubmit={(e) => e.preventDefault()} className="border border-gray-200 rounded-lg mt-10 w-full md:w-2/3 mx-auto p-4 bg-white text-left">
            <div className="space-y-6">
                <div className="border-b border-gray-900/10 pb-6">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">{t('event_info')}</h2>

                    {errors && typeof errors === 'string' && <Alert className="mb-4">{errors}</Alert>}
                    {errors && typeof errors === 'object' && errors.message && <Alert className="mb-4">{errors.message}</Alert>}

                    <div className="mt-10">
                        <div>
                            <label htmlFor="title" className="text-left block text-sm font-medium leading-6 text-gray-900">
                                {t('event_name')} <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={model.title}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                                    placeholder={t('event_name_placeholder')}
                                />
                                {validationErrors.title && <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>}
                            </div>
                        </div>

                        <div className="mt-4" id="type">
                            <label className="text-left block text-sm font-medium leading-6 text-gray-900">
                                {t('event_type')} <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2 flex items-center space-x-6">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="wedding"
                                        checked={model.type === 'wedding'}
                                        onChange={handleChange}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <span className="ml-2 block text-sm text-gray-900">{t('wedding')}</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="party"
                                        checked={model.type === 'party'}
                                        onChange={handleChange}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <span className="ml-2 block text-sm text-gray-900">{t('party')}</span>
                                </label>
                            </div>
                            {validationErrors.type && <p className="mt-1 text-sm text-red-600">{validationErrors.type}</p>}
                        </div>

                        <div className="mt-4">
                            <label htmlFor="description" className="text-left block text-sm font-medium leading-6 text-gray-900">
                                {t('additional_info')}
                            </label>
                            <div className="mt-2 text-black" id="description">
                                <ReactQuill
                                    theme="snow"
                                    value={model.description}
                                    onChange={(content) => setModel(prev => ({ ...prev, description: content }))}
                                    modules={{ toolbar: toolbarOptions }}
                                    className="min-h-[10rem] mb-12"
                                />
                                {validationErrors.description && <p className="mt-[-2.5rem] mb-4 text-sm text-red-600">{validationErrors.description}</p>}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="photos_link" className="text-left block text-sm font-medium leading-6 text-gray-900">
                                {t('photos_link')}
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="photos_link"
                                    id="photos_link"
                                    value={model.photos_link}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                                    placeholder="https://www.instagram.com/..."
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-left block text-sm font-medium leading-6 text-gray-900">
                                {t('gallery')}
                            </label>
                            <div className="mt-2">
                                <div className="flex flex-wrap gap-4">
                                    {galleryPreviews.map((image, index) => (
                                        <div key={index} className="relative w-24 h-24">
                                            <img src={image.url} className="w-full h-full object-cover rounded-md" />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                                            >
                                                x
                                            </button>
                                        </div>
                                    ))}
                                    {galleryPreviews.length < 5 && (
                                        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-indigo-500">
                                            <span className="text-2xl text-gray-400">+</span>
                                            <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-900/10 pb-6">
                    <div className="mt-5">
                        <div>
                            <label htmlFor="place" className="text-left block text-sm font-medium leading-6 text-gray-900">
                                {t('restaurant_name')} <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                    <div className="flex items-center justify-center w-10 border-r border-gray-300">
                                        <BuildingLibraryIcon className="w-5 text-gray-600" />
                                    </div>
                                    <input
                                        type="text"
                                        name="place"
                                        id="place"
                                        value={model.place}
                                        onChange={handleChange}
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder={t('restaurant_placeholder')}
                                    />
                                </div>
                                {validationErrors.place && <p className="mt-1 text-sm text-red-600">{validationErrors.place}</p>}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="address_link" className="text-left block text-sm font-medium leading-6 text-gray-900">
                                {t('map_link')} <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="address_link"
                                    id="address_link"
                                    value={model.address_link}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                                    placeholder="https://go.2gis.com/..."
                                />
                                {validationErrors.address_link && <p className="mt-1 text-sm text-red-600">{validationErrors.address_link}</p>}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="video_link" className="text-left block text-sm font-medium leading-6 text-gray-900">
                                {t('video_link')}
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                    <div className="flex items-center justify-center w-10 border-r border-gray-300">
                                        <GlobeAltIcon className="w-5 text-gray-600" />
                                    </div>
                                    <input
                                        type="text"
                                        name="video_link"
                                        id="video_link"
                                        value={model.video_link}
                                        onChange={handleChange}
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                {validationErrors.video_link && <p className="mt-1 text-sm text-red-600">{validationErrors.video_link}</p>}
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center space-x-2">
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={model.audioToggle}
                                        onChange={handleAudioToggle}
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-6 w-11 rounded-full border bg-slate-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-green-300"></div>
                                </label>
                                <span>{t('music')}</span>
                            </div>

                            {model.audioToggle && (
                                <div className="mt-4 flex items-center flex-col sm:flex-row border p-2 rounded-md animate-fade-in-down">
                                    <audio className="mb-2 sm:mb-0 w-full" controls ref={audioPlayerRef} src={model.audio}></audio>
                                    <button type="button" className="relative overflow-hidden ml-4 w-fit bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                                        <input type="file" accept=".mp3" onChange={handleAudioUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        {t('change_button')}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <label htmlFor="date" className="text-left block text-sm font-medium text-gray-700">
                                {t('start_time')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="date"
                                id="date"
                                value={model.date}
                                onChange={handleChange}
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 border"
                            />
                            {validationErrors.date && <p className="mt-1 text-sm text-red-600">{validationErrors.date}</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-2">
                <button
                    type="button"
                    onClick={onPreview}
                    disabled={!onPreview || loading}
                    className="disabled:opacity-25 disabled:cursor-not-allowed bg-gray-500 hover:bg-gray-600 px-4 py-2 text-white rounded font-medium transition-colors cursor-pointer"
                >
                    {t('preview_button')}
                </button>
                <button
                    type="button"
                    onClick={(e) => handleFormSubmit(e, false)}
                    disabled={loading}
                    className="bg-gray-600 px-4 py-2 text-white rounded flex items-center disabled:opacity-50 font-medium hover:bg-gray-700 transition-colors cursor-pointer"
                >
                    {loading && (
                        <span className="w-4 h-4 mr-2 rounded-full animate-spin border-2 border-solid border-white border-t-transparent"></span>
                    )}
                    {t('save_button')}
                </button>
                <button
                    type="button"
                    onClick={(e) => handleFormSubmit(e, true)}
                    disabled={loading}
                    className="bg-indigo-600 px-4 py-2 text-white rounded disabled:opacity-50 font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                    {t('complete_button')}
                </button>
            </div>
        </form>
    );
});

export default EventForm;
