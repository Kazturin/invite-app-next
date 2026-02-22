'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import Stepper from '@/components/Stepper';
import Spinner from '@/components/Spinner';
import InvitationTemplate, { InvitationTemplateRef } from '@/components/invitations/InvitationTemplate';

interface PageProps {
    params: Promise<{ id: string }>;
}

const InvitationEditPage = ({ params }: PageProps) => {
    const { id } = use(params);
    const router = useRouter();
    const { invitation, getInvitation, setContent, setBgImg, setImage, saveInvitation } = useAppStore();

    const [loading, setLoading] = useState(true);
    const captureRef = useRef<InvitationTemplateRef>(null);

    useEffect(() => {
        const fetchInvitation = async () => {
            setLoading(true);
            try {
                await getInvitation(id);
            } catch (error) {
                console.error('Failed to fetch invitation', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvitation();
    }, [id, getInvitation]);

    const incrementStep = async () => {
        if (!captureRef.current) return;

        setLoading(true);
        try {
            const imageString = await captureRef.current.exportAsImage();
            if (imageString) {
                setImage(imageString);

                // Prepare form data for API save
                const formData = new FormData();
                formData.set('content', JSON.stringify(invitation.content));
                formData.set('template_id', (invitation as any).template_id);
                formData.set('invitation_img', imageString);
                formData.set('bg_img', (invitation as any).bg_img || '');
                formData.set('inInvitationImage', (invitation as any).inInvitationImage || '');

                await saveInvitation(id, formData);

                const eventId = (invitation as any).event_id;
                router.push(`/app/events/${eventId}/update`);
                // Note: The original Vue used event_id for routing to EventUpdate, but let's stick to our route structure
                // or check if EventUpdate in Next matches the Vue logic.
            } else {
                console.error('Failed to export image');
            }
        } catch (error) {
            console.error('Error in incrementStep', error);
        } finally {
            setLoading(false);
        }
    };

    const decrementStep = () => {
        alert('Шаблон өзгертілмейді');
    };

    const updateContent = (newContent: any) => {
        setContent(newContent);
    };

    const updateBgImg = (newBgImg: string | null) => {
        setBgImg(newBgImg);
    };

    if (loading && !invitation.content) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <Stepper
                step={2}
                onNext={incrementStep}
                onBack={decrementStep}
                loading={loading}
            >
                {invitation && (invitation as any).template ? (
                    <div className="relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center rounded-2xl">
                                <Spinner />
                            </div>
                        )}
                        <InvitationTemplate
                            ref={captureRef}
                            template={(invitation as any).template}
                            content={invitation.content}
                            edit={true}
                            bg_img={(invitation as any).bg_img}
                            onUpdateContent={updateContent}
                            onUpdateBgImg={updateBgImg}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-20">
                        <Spinner />
                    </div>
                )}
            </Stepper>
        </div>
    );
};

export default InvitationEditPage;
