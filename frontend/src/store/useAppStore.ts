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
    };
    events: {
        loading: boolean;
        saveLoading: boolean;
        data: any[];
    };
    event: {
        loading: boolean;
        data: any | null;
    };
    guestInvite: any | null;
    templateCategories: {
        loading: boolean;
        data: any | null;
    };
    template: {
        loading: boolean;
        data: any | null;
    };
    canvasData: any | null;
    guests: any[];

    // Actions
    setInvitation: (payload: any) => void;
    setContent: (payload: any) => void;
    setImage: (payload: string | null) => void;
    setBgImg: (payload: string | null) => void;
    setCanvasData: (payload: any) => void;

    // API Actions (thunks equivalent)
    getEvents: () => Promise<any>;
    getEvent: (id: string) => Promise<any>;
    getTemplate: (id: string) => Promise<any>;
    saveInvitation: (id: string, invitation: any) => Promise<any>;
    saveGuest: (guest: any) => Promise<any>;
    getInvitationBySlug: (slug: string) => Promise<any>;
    getGuests: (eventId: string) => Promise<any>;
    updateGuest: (id: number, guest: any) => Promise<any>;
    deleteGuest: (id: number) => Promise<any>;
    getTemplateCategories: () => Promise<any>;
    getInvitation: (id: string) => Promise<any>;
    saveEvent: (formData: FormData) => Promise<any>;
    updateEvent: (id: string, formData: FormData) => Promise<any>;
    deleteEventImage: (imageId: number) => Promise<any>;
    getWatermarkInvitation: (path: string) => Promise<any>;
    deleteEvent: (id: string) => Promise<any>;
    saveGuestInvite: (invite: any) => Promise<any>;
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
            },
            events: {
                loading: false,
                saveLoading: false,
                data: [],
            },
            event: {
                loading: false,
                data: null,
            },
            guestInvite: null,
            templateCategories: {
                loading: false,
                data: null,
            },
            template: {
                loading: false,
                data: null,
            },
            canvasData: null,
            guests: [],

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
            setContent: (content) => set((state) => ({ invitation: { ...state.invitation, content } })),
            setImage: (invitation_img) => set((state) => ({ invitation: { ...state.invitation, invitation_img } })),
            setBgImg: (bg_img) => set((state) => ({ invitation: { ...state.invitation, bg_img } })),
            setCanvasData: (canvasData) => set({ canvasData }),

            getEvents: async () => {
                set((state) => ({ events: { ...state.events, loading: true } }));
                try {
                    const res = await apiClient.get('/event');
                    set((state) => ({ events: { data: res.data.data, loading: false, saveLoading: false } }));
                    return res.data;
                } catch (err) {
                    set((state) => ({ events: { ...state.events, loading: false } }));
                    throw err;
                }
            },

            getEvent: async (id) => {
                set((state) => ({ event: { ...state.event, loading: true } }));
                try {
                    const res = await apiClient.get(`/event/${id}`);
                    const eventData = res.data.data;
                    set({ event: { data: eventData, loading: false } });
                    if (eventData.invitation) {
                        get().setInvitation(eventData.invitation);
                    }
                    return eventData;
                } catch (err) {
                    set((state) => ({ event: { ...state.event, loading: false } }));
                    throw err;
                }
            },

            getTemplate: async (id) => {
                set((state) => ({ template: { ...state.template, loading: true } }));
                try {
                    const res = await apiClient.get(`/template/${id}`);
                    const templateData = res.data.data;
                    set({
                        template: { data: templateData, loading: false },
                        invitation: {
                            ...get().invitation,
                            template_id: templateData.id,
                            price: templateData.price,
                            envelope_img: templateData.envelope_img,
                        },
                    });
                    return templateData;
                } catch (err) {
                    set((state) => ({ template: { ...state.template, loading: false } }));
                    throw err;
                }
            },

            saveInvitation: async (id, invitation) => {
                try {
                    const res = await apiClient.post(`/invitation/${id}?_method=PUT`, invitation);
                    get().setInvitation(res.data.data);
                    return res.data;
                } catch (err) {
                    throw err;
                }
            },

            saveGuest: async (guest) => {
                try {
                    const res = await apiClient.post('/guest', guest);
                    return res.data;
                } catch (err) {
                    throw err;
                }
            },

            getInvitationBySlug: async (slug) => {
                try {
                    const res = await apiClient.get(`/toi/${slug}`);
                    return res.data;
                } catch (err) {
                    throw err;
                }
            },

            getGuests: async (eventId) => {
                try {
                    const res = await apiClient.get(`/guests/${eventId}`);
                    set({ guests: res.data.data });
                    return res.data;
                } catch (err) {
                    throw err;
                }
            },

            updateGuest: async (id, guest) => {
                try {
                    const res = await apiClient.post(`/guest/${id}?_method=PUT`, guest);
                    return res.data;
                } catch (err) {
                    throw err;
                }
            },

            deleteGuest: async (id) => {
                try {
                    const res = await apiClient.delete(`/guest/${id}`);
                    return res.data;
                } catch (err) {
                    throw err;
                }
            },

            getTemplateCategories: async () => {
                set((state) => ({ templateCategories: { ...state.templateCategories, loading: true } }));
                try {
                    const res = await apiClient.get('/template-categories');
                    set({ templateCategories: { data: res.data.data, loading: false } });
                    return res.data;
                } catch (err) {
                    set((state) => ({ templateCategories: { ...state.templateCategories, loading: false } }));
                    throw err;
                }
            },

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
            saveEvent: async (formData) => {
                set((state) => ({ events: { ...state.events, saveLoading: true } }));
                try {
                    const res = await apiClient.post('/event', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    set((state) => ({ events: { ...state.events, saveLoading: false } }));
                    return res.data;
                } catch (err) {
                    set((state) => ({ events: { ...state.events, saveLoading: false } }));
                    throw err;
                }
            },
            updateEvent: async (id, formData) => {
                set((state) => ({ events: { ...state.events, saveLoading: true } }));
                try {
                    const res = await apiClient.post(`/event/${id}?_method=PUT`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    set((state) => ({ events: { ...state.events, saveLoading: false } }));
                    return res.data;
                } catch (err) {
                    set((state) => ({ events: { ...state.events, saveLoading: false } }));
                    throw err;
                }
            },
            deleteEventImage: async (imageId) => {
                try {
                    const res = await apiClient.delete(`/event-image/${imageId}`);
                    return res.data;
                } catch (err) {
                    throw err;
                }
            },
            getWatermarkInvitation: async (path) => {
                try {
                    const res = await apiClient.get(`/invitation-watermark/${path}`);
                    return res.data;
                } catch (err) {
                    throw err;
                }
            },
            deleteEvent: async (id) => {
                try {
                    const res = await apiClient.post(`/event/${id}/delete`);
                    return res.data;
                } catch (err) {
                    throw err;
                }
            },
            saveGuestInvite: async (invite) => {
                try {
                    const res = await apiClient.post('/guest/invite', invite);
                    return res.data;
                } catch (err) {
                    throw err;
                }
            },
        }),
        {
            name: 'app-storage',
            partialize: (state) => ({
                ...state,
                invitation: {
                    ...state.invitation,
                    invitation_img: null,
                },
            }),
        }
    )
);
