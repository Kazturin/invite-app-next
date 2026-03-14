import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '@/lib/api-client';

interface AppState {
    invitation: {
        invitation_img: string | null;
        content: any;
        template_id: string | null;
        price: number | null;
        envelope_img: string | null;
        inInvitationImage: string | null;
        bg_img: string | null;
    };
    canvasData: any | null;

    // Actions
    setInvitation: (payload: any) => void;
    updateInvitationMeta: (payload: Partial<AppState['invitation']>) => void;
    setContent: (payload: any) => void;
    setImage: (payload: string | null) => void;
    setBgImg: (payload: string | null) => void;
    setInInvitationImage: (payload: string | null) => void;
    setCanvasData: (payload: any) => void;


    getInvitation: (id: string) => Promise<any>;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            invitation: {
                invitation_img: null,
                content: null,
                template_id: null,
                price: null,
                envelope_img: null,
                inInvitationImage: null,
                bg_img: null,
            },

            canvasData: null,

            setInvitation: (payload) => {
                let content = payload.content;
                if (typeof content === 'string') {
                    try {
                        content = JSON.parse(content);
                    } catch (e) {
                        console.error('Failed to parse invitation content', e);
                    }
                }
                set({ invitation: { ...payload, content } });
            },
            updateInvitationMeta: (payload) => set((state) => ({ invitation: { ...state.invitation, ...payload } })),
            setContent: (content) => set((state) => ({ invitation: { ...state.invitation, content } })),
            setImage: (invitation_img) => set((state) => ({ invitation: { ...state.invitation, invitation_img } })),
            setBgImg: (bg_img) => set((state) => ({ invitation: { ...state.invitation, bg_img } })),
            setInInvitationImage: (inInvitationImage) => set((state) => ({ invitation: { ...state.invitation, inInvitationImage } })),
            setCanvasData: (canvasData) => set({ canvasData }),

            getInvitation: async (id) => {
                try {
                    const res = await apiClient.get(`/invitation/${id}`);
                    const invitationData = res.data.data;
                    get().setInvitation(invitationData);
                    return invitationData;
                } catch (err) {
                    throw err;
                }
            },
        }),
        {
            name: 'app-storage',
            partialize: (state) => ({
                invitation: {
                    ...state.invitation,
                    invitation_img: null,
                    bg_img: null,
                    envelope_img: null,
                    inInvitationImage: null,
                },
            }),
        }
    )
);
