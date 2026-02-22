import axiosClient from "../../axios";
import VuexPersistence from 'vuex-persist'

export default {
    namespaced: true,
    state: {
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
            data: []
        },
        event: {
            loading: false,
            data: null
        },
        guestInvite: null,
        templateCategories: {
            loading: false,
            data: null
        },
        template: {
            loading: false,
            data: null
        },
        canvasData: null,
        guests: []
    },
    getters: {

    },
    actions: {
        saveEvent({ commit, state }, event) {
            commit('setEventSaveLoading', true);

            return axiosClient.post("/event", event).then((res) => {
                commit('setEvent', res.data.data);
                commit('setEventSaveLoading', false);
                return res.data;
            }).catch((err) => {
                commit('setEventSaveLoading', false);
                return Promise.reject(err);
            });
        },
        updateEvent({ commit }, payload) {
            commit('setEventSaveLoading', true);
            return axiosClient.post(`/event/${payload.id}?_method=PUT`, payload.event).then((res) => {
                commit('setEvent', res.data.data);
                commit('setEventSaveLoading', false);
                return res.data;
            }).catch((err) => {
                commit('setEventSaveLoading', false);
                return Promise.reject(err);
            });
        },
        deleteEvent({ dispatch }, id) {
            return axiosClient.post(`/event/${id}/delete`).then((res) => {
                dispatch('getEvents')
                return res;
            });
        },
        deleteEventImage({ }, id) {
            return axiosClient.delete(`/event-image/${id}`);
        },
        getEvent({ commit }, id) {
            commit('setEventLoading', true);
            return axiosClient.get(`/event/${id}`).then((res) => {
                commit('setEvent', res.data.data);
                commit('setInvitation', res.data.data.invitation);
                commit('setEventLoading', false);
                return res.data.data;
            }).catch((err) => {
                commit("setEventLoading", false);
                throw err;
            });
        },
        getEventEdit({ commit }, id) {
            commit('setEventLoading', true);
            return axiosClient.get(`/event/${id}/edit`).then((res) => {
                commit('setEvent', res.data.data);
                commit('setInvitation', res.data.data.invitation);
                commit('setEventLoading', false);
                return res.data.data;
            }).catch((err) => {
                commit("setEventLoading", false);
                throw err;
            });
        },
        getEventBySlug({ commit }, { slug, inviteCode }) {
            commit('setEventLoading', true);
            return axiosClient
                .get(`/event-by-slug/${slug}`, {
                    params: { invite_code: inviteCode }
                })
                .then((res) => {
                    commit("setEvent", res.data.event);
                    commit("setGuestInvite", res.data.guestInvite);
                    commit('setEventLoading', false);
                    return res.data.event;
                })
                .catch((err) => {
                    commit('setEventLoading', false);
                    throw err;
                });
        },
        getEvents({ commit }) {
            commit('setEventsLoading', true);
            return axiosClient.get(`/event`).then((res) => {
                commit('setEvents', res.data);
                commit('setEventsLoading', false);
                return res.data;
            }).catch((err) => {
                commit("setEventsLoading", false);
                throw err;
            });
        },
        getGuests({ commit }, id) {
            return axiosClient.get(`/guests/${id}`).then((res) => {
                commit('setGuests', res.data);
                return res.data;
            })
        },
        saveGuestInvite({ commit }, quest) {
            return axiosClient.post(`/guest/invite`, quest).then(() => {
                //    commit('setGuestInvite',res.data);
                return true;
            })
        },
        saveGuest({ commit }, quest) {
            return axiosClient.post("/guest", quest).then(() => {
                //   commit('setGuest', res.data);
                return true;
            }).catch((err) => {
                throw err;
            });
        },
        deleteGuest({ }, id) {
            return axiosClient.post(`/guest/delete/${id}`).then(() => {
                return true;
            });
        },
        getInvitation({ commit }, id) {
            return axiosClient.get(`/invitation/${id}`).then((res) => {

                res.data.data.inInvitationImage = null;
                commit('setInvitation', res.data.data);
                return res.data.data;
            })
        },
        getWatermarkInvitation({ commit }, invitation_url) {
            console.log(invitation_url);
            return axiosClient.get(`/invitation-watermark/${invitation_url}`).then((res) => {
                return res.data;
            })
        },
        saveInvitation({ commit }, payload) {
            return axiosClient.post(`/invitation/${payload.id}?_method=PUT`, payload.invitation).then((res) => {
                commit('setInvitation', res.data.data);
                commit('setInInvitationImg', null);
                return true;
            });
        },
        getTemplateCategories({ commit }) {
            commit('setTemplateCategoriesLoading', true);
            return axiosClient
                .get(`/template-categories`)
                .then((res) => {
                    commit("setTemplateCategories", res.data);
                    commit('setTemplateCategoriesLoading', false);
                    return res.data;
                })
                .catch((err) => {
                    commit('setTemplateCategoriesLoading', false);
                    throw err;
                });
        },
        getTemplate({ commit }, id) {
            commit('setTemplateLoading', true);
            return axiosClient
                .get(`/template/${id}`)
                .then((res) => {
                    commit("setTemplate", res.data);
                    commit('setTemplateLoading', false);
                    return res.data.data;
                })
                .catch((err) => {
                    commit('setTemplateLoading', false);
                    throw err;
                });
        },
    },
    mutations: {
        setImage: (state, payload) => {
            state.invitation.invitation_img = payload
        },
        setBgImg: (state, payload) => (state.invitation.bg_img = payload),
        setEnvelopeImg: (state, payload) => (state.invitation.envelope_img = payload),
        setContent: (state, payload) => {
            state.invitation.content = payload
        },
        setInInvitationImg: (state, payload) => {
            state.invitation.inInvitationImage = payload
        },
        setEvents: (state, playload) => (state.events.data = playload.data),
        setEventsLoading: (state, playload) => (state.events.loading = playload),
        setEvent: (state, data) => {
            state.event.data = data;
        },
        setGuestInvite: (state, data) => {
            state.guestInvite = data;
        },
        setEventLoading: (state, playload) => (state.event.loading = playload),
        setEventSaveLoading: (state, playload) => (state.event.saveLoading = playload),
        setInvitation: (state, payload) => {
            if (typeof payload.content === 'string') {
                payload.content = JSON.parse(payload.content)
            }
            state.invitation = payload;
        },
        setGuests: (state, payload) => (state.guests = payload.data),
        setTemplateId: (state, payload) => (state.invitation.template_id = payload),
        setTemplateCategories: (state, playload) => (state.templateCategories.data = playload.data),
        setTemplateCategoriesLoading: (state, playload) => (state.templateCategories.loading = playload),
        setTemplate: (state, playload) => {
            state.template.data = playload.data;
            state.invitation.envelope_img = playload.data.envelope_img,
                state.invitation.price = playload.data.price,
                state.invitation.template_id = playload.data.id
        },
        setTemplateLoading: (state, playload) => (state.template.loading = playload),
        setCanvasData: (state, payload) => {
            state.canvasData = payload;
        }
    },

    plugins: [new VuexPersistence().plugin]
}
