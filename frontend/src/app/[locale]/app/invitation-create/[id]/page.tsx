'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import Stepper from '@/components/Stepper';
import Spinner from '@/components/Spinner';
import InvitationTemplate, { InvitationTemplateRef } from '@/components/invitations/InvitationTemplate';
import apiClient from '@/lib/api-client';

interface PageProps {
    params: Promise<{ id: string }>;
}

const InvitationCreatePage = ({ params }: PageProps) => {
    const { id } = use(params);
    const router = useRouter();
    const { updateInvitationMeta, setContent, setBgImg, setImage, setInInvitationImage, invitation } = useAppStore();

    const [loading, setLoading] = useState(true);
    const [templateData, setTemplateData] = useState<any>(null);
    const captureRef = useRef<InvitationTemplateRef>(null);

    useEffect(() => {
        const fetchTemplate = async () => {

            setLoading(true);
            try {
                const res = await apiClient.get(`/template/${id}`);
                const data = res.data.data;
                setTemplateData(data);
                if (data.content) {
                    setContent(data.content);
                }
                updateInvitationMeta({
                    template_id: data.id,
                    price: data.price,
                    envelope_img: data.envelope_img,
                });
            } catch (error) {
                console.error('Failed to fetch template', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [id, setContent, updateInvitationMeta]);

    const incrementStep = async () => {
        if (!captureRef.current) return;
        setLoading(true);

        try {
            // Даем React возможность отрендерить состояние loading: true
            await new Promise(resolve => setTimeout(resolve, 50));

            const imageString = await captureRef.current.exportAsImage();
            if (imageString) {
                setImage(imageString);
                router.push(`/app/invitation-create/${id}/details`);
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
        router.push('/app/select-template');
    };

    const updateContent = (newContent: any) => {
        setContent(newContent);
    };

    const updateBgImg = (newBgImg: string | null) => {
        setBgImg(newBgImg);
    };

    const updateInInvitationImage = (url: string | null) => {
        setInInvitationImage(url);
    };

    if (loading && !templateData) {
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
                {templateData && templateData.content ? (
                    <div className="relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center rounded-2xl">
                                <Spinner />
                            </div>
                        )}
                        <InvitationTemplate
                            key={templateData.id}
                            ref={captureRef}
                            template={templateData}
                            content={templateData.content}
                            bg_img={null}
                            onUpdateContent={updateContent}
                            onUpdateBgImg={updateBgImg}
                            onUpdateInInvitationImage={updateInInvitationImage}
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

export default InvitationCreatePage;
