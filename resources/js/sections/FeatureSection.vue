<script setup>

// import categories from '../data/categories.js';
// import templates from "../data/templates.js";
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
let isOpen = ref(1);

store.dispatch('app/getTemplateCategories');

const categories = computed(() => store.state.app.templateCategories.data);
const categoriesLoading = computed(() => store.state.app.templateCategories.loading);

// function getTemplates(id){
//   return templates.filter((item) => item.category_id === id).slice(0,3);
// }

</script>

<template>
    <div id="features" class="container mx-auto px-5">
        <section class="py-16">
            <div class="w-4/5 md:w-3/5 mx-auto">
                <h2 class="text-3xl md:text-4xl font-semibold text-center">Сайт шақыртуыңызға шаблон таңдаңыз!</h2>
                <p class="text-gray-400 text-center mt-7 font-theme-content text-lg">
                    Әр түрлі іс-шараларға арналған шаблондар дайындап қойдық. Онлайн шақырту жасау енді оңай
                </p>
            </div>
            <div class="mt-10">
                <ul class="flex flex-col items-center md:flex-row justify-center">
                    <li v-for="category in categories" :key="category.id"
                        :class="['w-full md:w-56 cursor-pointer transition duration-200 border-gray-200 border-b-2 border-t-2 md:border-t-0 flex justify-center', { 'md:border-b-4 md:border-theme-secondary': isOpen === category.id }]">
                        <a @click.prevent="isOpen = category.id" href="#"
                            :class="['py-5 md:border-b-0 border-b-4', { 'border-theme-secondary': isOpen === category.id }]">
                            {{ category['title_' + $i18n.locale] }}
                        </a>
                    </li>
                </ul>
            </div>
            <div class="mt-16">
                <template v-for="category in categories" :key="category.id">
                    <div v-show="isOpen === category.id">
                        <div class="grid grid-cols-1 md:grid-cols-3">
                            <template v-for="template in category.templates.slice(0, 3)" :key="template.id">
                                <div class="carousel__item">
                                    <router-link :to="{ name: 'Step2', params: { id: template.id } }">
                                        <img :src="template.preview_img"
                                            :alt="`${category.name_kz} шаблоны ${template.id}`"
                                            :title="`${category.name_kz} шаблоны`" loading="lazy">
                                    </router-link>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>
                <div class="mt-8 flex justify-center">
                    <router-link :to="{ name: 'Step1' }"
                        class="text-lg font-theme-heading font-medium bg-theme-primary px-6 py-2 text-white rounded shadow-md hover:bg-white border-2 border-transparent hover:border-theme-primary hover:text-theme-primary cursor-pointer transition duration-200 mr-5">
                        Шақырту жасау
                    </router-link>
                </div>
            </div>
        </section>
    </div>
</template>
