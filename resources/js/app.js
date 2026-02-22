import './assets/style.css';
import {createApp} from "vue";
import App from "./App.vue";
import router from './router'
import store from './store'
import { createI18n } from 'vue-i18n'
import {defaultLocale} from "./i18n";
import {languages} from "./i18n";
import ScrollAnimation from './directives/scrollanimation.js';

const messages = Object.assign({}, languages);
const locale = localStorage.getItem('language') || defaultLocale;
const i18n = createI18n({ legacy: false, locale, fallbackLocale: 'kk', messages });
const app = createApp(App).use(router).use(i18n).use(store);
app.directive('scrollanimation', ScrollAnimation);
app.mount('#app');

