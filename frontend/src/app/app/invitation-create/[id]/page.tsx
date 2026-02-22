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

const InvitationCreatePage = ({ params }: PageProps) => {
    const { id } = use(params);
    const router = useRouter();
    const { template, getTemplate, setContent, setBgImg, setImage, invitation } = useAppStore();

    const [loading, setLoading] = useState(true);
    const captureRef = useRef<InvitationTemplateRef>(null);

    useEffect(() => {
        const fetchTemplate = async () => {

            setLoading(true);
            try {
                const templateData = await getTemplate(id);
                if (templateData.content) {
                    setContent(templateData.content);
                }
            } catch (error) {
                console.error('Failed to fetch template', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [id, getTemplate, setContent]);

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

    if (loading && !template.data) {
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
                {template.data && template.data.content ? (
                    <div className="relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center rounded-2xl">
                                <Spinner />
                            </div>
                        )}
                        <InvitationTemplate
                            key={template.data.id}
                            ref={captureRef}
                            template={template.data}
                            content={template.data.content}
                            bg_img={null}
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

export default InvitationCreatePage;
