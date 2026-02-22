import { createStore } from "vuex";
import axiosClient from '../axios';
import app from './modules/app';
import survey from "./modules/survey";
// import vuexPersist from './vuexPersist'; 

//const axiosClient = () => import('../axios.js');
//const app = () => import('./modules/app');

const store = createStore({
    state: {
        lang:  localStorage.getItem('language') || 'kk',
        user: {
            data: {},
            token: sessionStorage.getItem("TOKEN"),
        },
        notification: {
            show: false,
            type: 'success',
            message: ''
        }
    },
    actions:{
        register({commit}, user) {
            return axiosClient.post('/register', user)
                .then(({data}) => {
                    commit('setUser', data.user);
                    commit('setToken', data.token);
                    return data;
                })
        },
        login({commit}, user) {
            console.log('login')
            return axiosClient.post('/login', user)
                .then(({data}) => {
                    commit('setUser', data.user);
                    commit('setToken', data.token)
                    return data;
                })
        },
        googleLogin({commit}, user) {
            return axiosClient.post('/login-google', user)
                .then(({data}) => {
                    commit('setUser', data.user);
                    commit('setToken', data.token)
                    return data;
                })
        },
        logout({commit}) {
            return axiosClient.post('/logout')
                .then(response => {
                    commit('logout')
                    return response;
                })
        },
        forgotPassword({commit},user){
            return axiosClient.post('forgot-password',user)
                .then(({data}) => {
                    return data
                })
        },
        resetPassword({commit},user){
            return axiosClient.post('reset-password',user)
                .then(({data}) => {
                    return data
                })
        },
        getUser({commit}) {
            return axiosClient.get('/user')
                .then(res => {
                    commit('setUser', res.data)
                })
        },
    },
    mutations: {
        logout: (state) => {
            state.user.token = null;
            state.user.data = {};
            sessionStorage.removeItem("TOKEN");
        },

        setUser: (state, user) => {
            state.user.data = user;
        },
        setToken: (state, token) => {
            state.user.token = token;
            sessionStorage.setItem('TOKEN', token);
        },
        notify: (state, {message, type}) => {
            state.notification.show = true;
            state.notification.type = type;
            state.notification.message = message;
            setTimeout(() => {
                state.notification.show = false;
            }, 3000)
        },
        setLanguage: (state) => {
            state.lang = localStorage.getItem('language') || 'kk';
        },
    },
    modules: {
        app,
        survey
    },
    // plugins: [vuexPersist.plugin] 
});

export default store;
