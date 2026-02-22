'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import Stepper from '@/components/Stepper';
import EventForm, { EventFormRef } from '@/components/events/EventForm';
import Spinner from '@/components/Spinner';

interface PageProps {
    params: Promise<{ id: string }>;
}

const EventUpdatePage = ({ params }: PageProps) => {
    const { id } = use(params);
    const router = useRouter();
    const { getEvent, updateEvent, event, deleteEventImage } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<EventFormRef>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                await getEvent(id);
            } catch (err) {
                console.error('Failed to fetch event', err);
                setError('Іс-шара мәліметтерін жүктеу мүмкін болмады');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, getEvent]);

    const handleSubmit = async (formData: FormData, isComplete?: boolean) => {
        setSaveLoading(true);
        setError(null);

        try {
            const res = await updateEvent(id, formData);
            if (isComplete) {
                // Если статус оплаты 0 (или не оплачено/в ожидании), редирект на success
                // Иначе редирект на саму страницу ивента
                const paymentStatus = res.data?.order?.status ?? res.data?.payment_status;

                if (paymentStatus === 0 || paymentStatus === undefined) {
                    router.push(`/app/events/${id}/success`);
                } else {
                    router.push(`/app/events/${id}`);
                }
            } else {
                router.push(`/app/events/${id}/update`);
            }
        } catch (err: any) {
            console.error('Failed to update event', err);
            setError(err.response?.data?.message || 'Серверде қате орын алды');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleBack = () => {
        const invitationId = event.data?.invitation?.id;
        if (invitationId) {
            router.push(`/app/invitation-edit/${invitationId}`);
        } else {
            router.back();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
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
                    initialData={event.data}
                    onSubmit={handleSubmit}
                    onDeleteImage={deleteEventImage}
                    onPreview={() => router.push(`/app/events/${id}/preview`)}
                    loading={saveLoading}
                    errors={error}
                />
            </Stepper>
        </div>
    );
};

export default EventUpdatePage;
