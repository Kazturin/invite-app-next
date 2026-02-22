import { Metadata } from 'next';
import apiClient from '@/lib/api-client';
import InvitationClient from '@/components/InvitationClient';

async function getInvitation(slug: string, inviteCode?: string) {
    try {
        const url = `/event-by-slug/${slug}${inviteCode ? `?invite_code=${inviteCode}` : ''}`;
        const res = await apiClient.get(url);
        return res.data;
    } catch (error: any) {
        console.error("API Error:", error.response?.status, error.response?.data || error.message);
        return null;
    }
}

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ invite_code?: string }>
}): Promise<Metadata> {
    const { slug } = await props.params;
    const { invite_code } = await props.searchParams;
    const data = await getInvitation(slug, invite_code);

    if (!data || !data.event) return { title: 'Шақыру табылмады' };
    const event = data.event.data || data.event;
    const guestInvite = data.guestInvite;

    const guestName = guestInvite?.guest?.fullname;
    const pageTitle = guestName ? `${guestName}, сізге шақыру!` : 'Тойға шақыру';
    const eventTitle = event.title || '';
    const invitation_img = event.invitation?.data?.invitation_img || event.invitation?.invitation_img || '';

    // Get filename for OG image
    const imageName = invitation_img.split('/').pop() || '';
    const ogImageUrl = imageName ? `https://toi-invite.kz/storage/images/invitations/620x640/${imageName}` : '';

    return {
        title: pageTitle,
        description: eventTitle,
        openGraph: {
            title: pageTitle,
            description: eventTitle,
            type: 'website',
            url: `https://toi-invite.kz/toi/${slug}${invite_code ? `?invite_code=${invite_code}` : ''}`,
            images: ogImageUrl ? [
                {
                    url: ogImageUrl,
                    width: 620,
                    height: 640,
                    alt: 'Тойға шақыру',
                }
            ] : [],
        },
    };
}

export default async function InvitationPage(props: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ invite_code?: string }>
}) {
    const { slug } = await props.params;
    const { invite_code } = await props.searchParams;
    const invitationData = await getInvitation(slug, invite_code);

    if (!invitationData || !invitationData.event) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">Кешіріңіз, шақыру табылмады</h1>
                <a href="/" className="mt-4 text-amber-600 hover:underline">Басты бетке қайту</a>
            </div>
        );
    }

    const event = invitationData.event.data || invitationData.event;
    const invitation_img = event.invitation?.data?.invitation_img || event.invitation?.invitation_img;
    const music = event.audio;

    return (
        <InvitationClient
            event={event}
            invitation_img={invitation_img}
            music={music}
            guestInvite={invitationData.guestInvite}
        />
    );
}
