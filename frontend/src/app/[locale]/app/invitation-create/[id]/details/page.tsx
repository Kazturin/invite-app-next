'use client';
import React, { useState, use, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAppStore } from '@/store/useAppStore';
import Stepper from '@/components/Stepper';
import EventForm, { EventFormRef } from '@/components/events/EventForm';
import { useTranslations } from 'next-intl';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

interface PageProps {
    params: Promise<{ id: string }>;
}

const EventCreatePage = ({ params }: PageProps) => {
    const { id } = use(params);
    const router = useRouter();
    const t = useTranslations('InvitationCreate');
    const { invitation } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const formRef = useRef<EventFormRef>(null);

    const handleSubmit = async (formData: FormData, isComplete?: boolean) => {
        setLoading(true);
        setError(null);

        formData.append('invitation[content]', JSON.stringify(invitation.content));
        formData.append('invitation[invitation_img]', invitation.invitation_img || '');
        formData.append('invitation[envelope_img]', invitation.envelope_img || '');
        formData.append('invitation[template_id]', invitation.template_id || '');
        formData.append('invitation[price]', String(invitation.price || 0));
        formData.append('invitation[bg_img]', invitation.bg_img || '');
        formData.append('status', '1');

        try {
            const res = await apiClient.post('/event', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const eventData = res.data.data;

            if (isComplete) {
                toast.success(t('save_success'));
                // Если статус оплаты 0 (или не оплачено/в ожидании), редирект на success
                // Иначе редирект на саму страницу ивента
                const paymentStatus = eventData?.order?.status ?? eventData?.payment_status;

                if (paymentStatus === 0 || paymentStatus === undefined) {
                    router.push(`/app/events/${eventData.id}/success`);
                } else {
                    router.push(`/app/events/${eventData.id}`);
                }
            } else {
                toast.success(t('save_success'));
                router.push(`/app/events/${eventData.id}/update`);
            }
        } catch (err: any) {
            console.error('Failed to save event', err);
            const errorMessage = err.response?.data?.message || t('server_error') || 'Произошла ошибка при сохранении';
            toast.error(errorMessage);

            if (err.response?.data?.errors) {
                setError(err.response.data);
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.push(`/app/invitation-create/${id}`);
    };

    return (
        <div className="container mx-auto py-8">
            <Stepper
                step={3}
                onBack={handleBack}
                onComplete={() => formRef.current?.submit(true)}
                loading={loading}
            >
                <EventForm
                    ref={formRef}
                    onSubmit={handleSubmit}
                    onDeleteImage={async (imageId: number) => {
                        try {
                            await apiClient.delete(`/event-image/${imageId}`);
                            toast.success(t('image_deleted') || 'Изображение удалено');
                        } catch (error) {
                            console.error('Failed to delete image', error);
                            toast.error(t('delete_image_error') || 'Ошибка при удалении изображения');
                        }
                    }}
                    loading={loading}
                    errors={error}
                />
            </Stepper>
        </div>
    );
};

export default EventCreatePage;
