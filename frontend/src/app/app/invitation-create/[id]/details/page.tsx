'use client';

import React, { useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import Stepper from '@/components/Stepper';
import EventForm, { EventFormRef } from '@/components/events/EventForm';

interface PageProps {
    params: Promise<{ id: string }>;
}

const EventCreatePage = ({ params }: PageProps) => {
    const { id } = use(params);
    const router = useRouter();
    const { saveEvent, invitation, deleteEventImage } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<EventFormRef>(null);

    const handleSubmit = async (formData: FormData, isComplete?: boolean) => {
        setLoading(true);
        setError(null);

        // Add invitation details from store
        formData.append('invitation[content]', JSON.stringify(invitation.content));
        formData.append('invitation[invitation_img]', invitation.invitation_img || '');
        formData.append('invitation[envelope_img]', invitation.envelope_img || '');
        formData.append('invitation[template_id]', invitation.template_id || '');
        formData.append('invitation[price]', String(invitation.price || 0));
        formData.append('invitation[bg_img]', invitation.inInvitationImage || '');
        formData.append('status', '1');

        try {
            const res = await saveEvent(formData);
            if (isComplete) {
                // Если статус оплаты 0 (или не оплачено/в ожидании), редирект на success
                // Иначе редирект на саму страницу ивента
                const paymentStatus = res.data?.order?.status ?? res.data?.payment_status;

                if (paymentStatus === 0 || paymentStatus === undefined) {
                    router.push(`/app/events/${res.data.id}/success`);
                } else {
                    router.push(`/app/events/${res.data.id}`);
                }
            } else {
                router.push(`/app/events/${res.data.id}/update`);
            }
        } catch (err: any) {
            console.error('Failed to save event', err);
            setError(err.response?.data?.message || 'Серверде қате орын алды');
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
                    onDeleteImage={deleteEventImage}
                    loading={loading}
                    errors={error}
                />
            </Stepper>
        </div>
    );
};

export default EventCreatePage;
