'use client';

import React, { useState, useRef, use } from 'react';
import { useRouter } from '@/i18n/routing';
import Stepper from '@/components/Stepper';
import EventForm, { EventFormRef } from '@/components/events/EventForm';
import Spinner from '@/components/Spinner';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface PageProps {
    params: Promise<{ id: string }>;
}

const EventUpdatePage = ({ params }: PageProps) => {
    const t = useTranslations('InvitationCreate');
    const { id } = use(params);
    const router = useRouter();
    const { data: myEvent, isLoading, error: fetchError } = useSWR(`/event/${id}`, fetcher);

    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const formRef = useRef<EventFormRef>(null);

    const handleSubmit = async (formData: FormData, isComplete?: boolean) => {
        setSaveLoading(true);
        setError(null);

        try {
            const res = await apiClient.post(`/event/${id}?_method=PUT`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const eventData = res.data.data;

            if (isComplete) {
                toast.success(t('save_success'));
                // Если статус оплаты 0 (или не оплачено/в ожидании), редирект на success
                // Иначе редирект на саму страницу ивента
                const paymentStatus = eventData?.order?.status ?? eventData?.payment_status;

                if (paymentStatus === 0 || paymentStatus === undefined) {
                    router.push(`/app/events/${id}/success` as any);
                } else {
                    router.push(`/app/events/${id}` as any);
                }
            } else {
                toast.success(t('save_success'));
                router.push(`/app/events/${id}/update` as any);
            }
        } catch (err: any) {
            console.error('Failed to update event', err);
            const errorMessage = err.response?.data?.message || t('server_error');
            toast.error(errorMessage);

            // If server returns validation errors (usually 422), pass the whole data
            if (err.response?.data?.errors) {
                setError(err.response.data);
            } else {
                setError(errorMessage);
            }
        } finally {
            setSaveLoading(false);
        }
    };

    const handleBack = () => {
        const invitationId = myEvent?.invitation?.id;
        if (invitationId) {
            router.push(`/app/invitation-edit/${invitationId}` as any);
        } else {
            router.back();
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Іс-шара мәліметтерін жүктеу мүмкін болмады
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <Stepper
                step={3}
                onBack={handleBack}
                onComplete={() => formRef.current?.submit(true)}
                loading={saveLoading}
            >
                <EventForm
                    ref={formRef}
                    initialData={myEvent}
                    onSubmit={handleSubmit}
                    onDeleteImage={async (imageId: number) => {
                        try {
                            await apiClient.delete(`/event-image/${imageId}`);
                            toast.success(t('image_deleted'));
                        } catch (error) {
                            console.error('Failed to delete image', error);
                            toast.error(t('delete_image_error'));
                        }
                    }}
                    onPreview={() => window.location.href = `/app/events/${id}/preview`}
                    loading={saveLoading}
                    errors={error}
                />
            </Stepper>
        </div>
    );
};

export default EventUpdatePage;
