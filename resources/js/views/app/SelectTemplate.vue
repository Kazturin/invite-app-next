<template>
  <div class="container mx-auto">
    <Stepper :step="1" :nextText="$t('nextStep')">
      <template #1>
        <div id="features" class="container mx-auto px-5">
          <section class="py-16">
            <div class="w-full md:w-3/5 mx-auto">
              <h2 class="text-2xl md:text-3xl font-semibold text-center">{{ $t('choose a template for your upcoming evet') }}!</h2>
              <p class="text-theme-grayish-blue text-center my-7 font-theme-content text-md">
                {{ $t('we have prepared templates for various events. Making an online invitation is now easy') }}!
              </p>
              <div class="flex justify-center">
                <button @click="openModal('Үлгі','/video/Instructions.mp4')"
                     class="flex bg-theme-primary cursor-pointer px-6 py-2 text-white rounded focus:ring-4 focus:outline-none focus:ring-primary transition-all font-semibold mr-2">
                     <PlayIcon class="w-6 h-6 mr-1"/>
                     <span>Үлгі</span></button>
              <button @click="openModal('Жеке шақыру','/video/preview.mp4')"
                     class="flex bg-theme-primary cursor-pointer px-6 py-2 text-white rounded focus:ring-4 focus:outline-none focus:ring-primary transition-all font-semibold">
                     <PlayIcon class="w-6 h-6 mr-1"/>
                     <span>Жеке шақыру</span></button>
              </div>
              
            </div>

            <div class="mt-10">
              <ul class="flex flex-col items-center md:flex-row justify-center">
                <li v-for="category in categories" 
                    :key="category.id" 
                    :class="{'md:border-b-4 md:border-theme-secondary': selectedCategory === category.id}"
                    class="w-full md:w-56 cursor-pointer hover:text-theme-secondary transition duration-200 border-gray-300 border-b-2 border-t-2 md:border-t-0 flex justify-center">
                  <a @click="selectCategory(category.id)" 
                     href="#" 
                     :class="selectedCategory === category.id ? 'border-theme-secondary' : ''" 
                     class="py-5 md:border-b-0 border-b-4">
                    {{ category[`title_${$i18n.locale}`] }}
                  </a>
                </li>
              </ul>
            </div>

            <div class="mt-16">
              <div v-if="loading" class="relative">
                <Spinner />
              </div>
              <div v-else>
                <div class="grid gap-8 lg:grid-cols-3 items-center">
                  <div v-for="template in paginatedTemplates" 
                       :key="template.id" 
                       @click="selectTemplate(template.id)" 
                       class="relative cursor-pointer group hover:border">
                    <div class="absolute right-4 top-4 bg-theme-primary text-white p-1 rounded text-sm opacity-0 group-hover:opacity-100">{{ $t('choice') }}</div>
                    <div class="absolute right-4 bottom-4 font-semibold text-green-500 rounded text-lg">{{ template.price }} тг</div>
                    <img 
                      v-lazy-load
                      :data-src="template.preview_img" 
                      :alt="template.title"
                      class="template-image"
                      @load="onImageLoad"
                    >
                    <div v-if="!template.loaded" class="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
                
                <!-- Pagination -->
                <Pagination
              :currentPage="currentPage"
              :totalPages="totalPages"
              @page-changed="handlePageChange"
              class="mt-8"
            />
              </div>
            </div>
          </section>
        </div>
      </template>
    </Stepper>
  </div>
    <Modal :modal="modal" :title="modal_title" @close-modal="closeModal">
  <iframe
       :src="modal_video_url"
       class="w-full max-w-sm mx-auto aspect-[9/16]"
       controls="1"
      allowfullscreen
      allowtransparency
      allow="autoplay"
    ></iframe>
        
    </Modal>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import Stepper from "../../components/Stepper.vue";
import Spinner from '../../components/core/Spinner.vue';
import Pagination from "../../components/core/Pagination.vue";
import Modal from "../../components/Modal.vue";
import { PlayIcon } from '@heroicons/vue/24/outline'

const store = useStore();
const router = useRouter();
const route = useRoute();

const selectedCategory = ref(1);
const currentPage = ref(1);
const itemsPerPage = 6;

const loading = computed(() => store.state.app.templateCategories.loading);
const categories = computed(() => store.state.app.templateCategories.data);

// const filteredTemplates = computed(() => categories.value?.find((item) => item.id === selectedCategory.value)?.templates || []);
const filteredTemplates = computed(() => {
  const templates = categories.value?.find((item) => item.id === selectedCategory.value)?.templates || [];
  return templates.map(template => ({
    ...template,
    loaded: ref(false)
  }));
});

const totalPages = computed(() => Math.ceil(filteredTemplates.value.length / itemsPerPage));

const paginatedTemplates = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTemplates.value.slice(start, end);
});

const vLazyLoad = {
  mounted(el) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.src = el.dataset.src;
          observer.unobserve(el);
        }
      });
    }, { rootMargin: '50px' });
    observer.observe(el);
  }
};

let modal =  ref(false);
let modal_title = ref('');
let modal_video_url = ref('');

function openModal(title,video_url){
    modal_video_url.value = video_url;
    modal_title.value = title;
    modal.value = true;
}
function closeModal(){
    modal.value = false;
}

function onImageLoad(event) {
  const template = paginatedTemplates.value.find(t => t.preview_img === event.target.src);
  if (template) {
    template.loaded = true;
  }
}

function selectCategory(categoryId) {
  selectedCategory.value = categoryId;
  currentPage.value = 1;
  router.replace({
    query: { category: categoryId, page: 1 },
  });
}

function handlePageChange(page) {
  currentPage.value = page;
  router.replace({
    query: { ...route.query, page },
  });
}

function selectTemplate(templateId) {
  router.push({ name: 'Step2', params: { id: templateId } });
}
// watch(selectedCategory, () => {
//   currentPage.value = 1;
// });

watch(
  () => route.query,
  (newQuery) => {
    const categoryFromUrl = newQuery.category ? parseInt(newQuery.category, 10) : 1;
    const pageFromUrl = newQuery.page ? parseInt(newQuery.page, 10) : 1;

    if (categories.value.some((cat) => cat.id === categoryFromUrl)) {
      selectedCategory.value = categoryFromUrl;
    }
    if (pageFromUrl > 0 && pageFromUrl <= totalPages.value) {
      currentPage.value = pageFromUrl;
    }
  }
);

onMounted(() => {
  store.dispatch('app/getTemplateCategories');

  // Чтение параметров из URL
  const categoryFromUrl = route.query.category ? parseInt(route.query.category, 10) : 1;
  const pageFromUrl = route.query.page ? parseInt(route.query.page, 10) : 1;

  // Проверка, существует ли категория
  if (categories.value && categories.value.some((cat) => cat.id === categoryFromUrl)) {
    selectedCategory.value = categoryFromUrl;
  }
  // Проверка, валидна ли страница
  if (pageFromUrl > 0 && pageFromUrl <= totalPages.value) {
    currentPage.value = pageFromUrl;
  }
});
</script>

<style scoped>
/* Add any scoped styles here */
</style>