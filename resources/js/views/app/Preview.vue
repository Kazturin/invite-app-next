<template>
  <div class="bg-invitation">
    <div v-if="loading" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
      <Spinner />
    </div>
    <div v-else class="container mx-auto bg-white pb-10 shadow-2xl font-baltica relative overflow-hidden">
      <!-- Subtle Paper Texture Overlay -->
      <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]">
      </div>

      <div
        class="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div class="flex items-center gap-3">
          <div class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <span class="text-sm font-bold text-gray-400 uppercase tracking-widest">Preview Mode</span>
        </div>
        <div class="flex gap-4">
          <router-link
            class="group relative inline-flex items-center px-6 py-2 border-2 border-gray-200 text-gray-600 text-sm font-bold rounded-full transition-all duration-300 hover:border-theme-secondary hover:text-theme-secondary active:scale-95 gap-2"
            :to="{ name: 'EventUpdate', params: { id: $route.params.id } }">
            <PencilSquareIcon class="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span>Өңдеу</span>
          </router-link>
          <button @click="finishBtn"
            class="group relative inline-flex items-center px-8 py-2 bg-theme-secondary text-white text-sm font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-theme-secondary/30 active:scale-95 gap-2">
            <div
              class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            </div>
            <CheckCircleIcon class="w-4 h-4 relative z-10" />
            <span class="relative z-10">Аяқтау</span>
          </button>
        </div>
      </div>
      <div :style="{ backgroundImage: 'url(' + event.invitation.bg_img + ')' }"
        class="bg-no-repeat bg-cover bg-center w-full drop-shadow-md">
        <div class="max-w-[650px] mx-auto h-[550px] relative">
          <img class="w-96 hidden mx-auto absolute top-8 left-[10px] -rotate-12 sm:block animate-fade-in-up"
            :src="event.invitation.template.envelope_img" alt="">
          <div class="relative w-80 mx-auto absolute top-8 left-0 right-0 z-10">
            <img v-if="watermarkInvitation" class="w-full shadow-2xl animate-invitation-float"
              :src="watermarkInvitation" alt="">
          </div>
        </div>

      </div>
      <div class="container mx-auto" v-if="event">
        <div class="text-center text-xl sm:text-2xl mt-5 w-full">
          <!-- <div class="my-4 text-xl font-mon font-medium">{{ event.title }}</div> -->
          <div class="p-6 md:px-20 text-xl font-medium leading-relaxed text-gray-800 break-words"
            v-html="event.description"></div>

          <div class="relative max-w-[500px] mx-auto mt-4 mb-10 px-4 font-baltica">
            <!-- Decorative Ornament Divider -->
            <div class="flex items-center justify-center gap-4 mb-8">
              <div class="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-300"></div>
              <div class="text-yellow-500">
                <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M12,2L14.5,9H22L15.5,13.5L18,21L12,16.5L6,21L8.5,13.5L2,9H9.5L12,2Z" />
                </svg>
              </div>
              <div class="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-300"></div>
            </div>

            <div class="relative flex justify-center">
              <span class="bg-white px-6 py-1 text-sm font-bold text-yellow-700 uppercase tracking-[0.2em]">
                {{ t('invitation_page.until_the_event') }}
              </span>
            </div>

            <div v-scrollanimation class="mt-2">
              <countdown :deadline="event.date" />
            </div>

            <div class="mt-8 flex justify-center">
              <div class="h-1 w-20 bg-gradient-to-r from-transparent via-yellow-200 to-transparent"></div>
            </div>
          </div>
        </div>
        <div v-scrollanimation class="px-4 mb-8 max-w-md mx-auto">
          <Calendar :date="event.date" />
        </div>
        <div v-if="event.photos_link" class="max-w-md mx-auto my-8 px-4">
          <div v-scrollanimation>
            <a :href="event.photos_link" target="_blank"
              class="group relative flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 active:scale-95">
              <div class="flex items-center gap-4">
                <div class="bg-amber-50 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <PhotoIcon class="w-7 h-7 text-amber-600" />
                </div>
                <div class="text-left">
                  <span class="block text-sm font-semibold text-gray-400 uppercase tracking-wider">{{
                    t('invitation_page.hashtag') }}</span>
                  <span class="block text-lg font-bold text-gray-800">{{ t('invitation_page.show_images') }}</span>
                </div>
              </div>
              <div
                class="bg-gray-50 p-2 rounded-full group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                <ArrowTopRightOnSquareIcon class="w-5 h-5" />
              </div>
            </a>
          </div>
        </div>
        <div v-if="event.video_link">
          <div v-scrollanimation
            class="max-w-[750px] mt-8 mx-4 sm:mx-auto border border-gray-100 bg-white p-2 sm:p-4 shadow-2xl rounded-2xl overflow-hidden">
            <div class="flex items-center gap-3 mb-4 px-4 pt-2">
              <div class="bg-red-50 p-2 rounded-lg">
                <VideoCameraIcon class="w-6 h-6 text-red-600" />
              </div>
              <h3 class="text-xl font-bold text-gray-800">Видео</h3>
            </div>
            <div class="rounded-xl overflow-hidden shadow-inner bg-black">
              <iframe :src="'https://www.youtube.com/embed/' + getVideoId(event.video_link)"
                class="w-full max-h-[420px] aspect-video" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            </div>
          </div>
        </div>

        <div
          class="max-w-[750px] mt-8 mx-4 sm:mx-auto border border-gray-100 bg-white p-6 shadow-2xl rounded-2xl overflow-hidden text-gray-800"
          v-scrollanimation>
          <div class="flex flex-col items-center">
            <div class="bg-blue-50 p-3 rounded-full mb-4">
              <MapPinIcon class="w-8 h-8 text-blue-600" />
            </div>

            <h2 class="text-2xl font-bold text-center mb-1">
              {{ t('event.address') }}
            </h2>

            <p class="text-xl text-gray-600 text-center mb-4 font-medium italic">
              {{ event.place }}
            </p>

            <div v-if="event.address.address" class="w-full flex flex-col items-center">
              <div class="w-full h-px bg-gray-100 my-4"></div>

              <div v-if="event.address.address.startsWith('http')" class="text-center">
                <p class="text-gray-400 text-sm mb-4">
                  {{ t('invitation_page.open_map_help') }}
                </p>
                <a :href="event.address.address" target="_blank"
                  class="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-200 active:scale-95 gap-2 group">
                  <span>{{ t('invitation_page.open_map') }}</span>
                  <ArrowTopRightOnSquareIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
              <div v-else class="text-center">
                <p class="text-lg text-gray-700 bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
                  {{ event.address.address }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="event.audio">
          <audio :src="event.audio" type="audio/mpeg" class="hidden" ref="audio" loop>
            Ваш браузер не поддерживает элемент <code>audio</code>.
          </audio>
          <div class="fixed bottom-8 right-8 z-40">
            <div @click="toggleAudio()" :class="[
              'relative w-16 h-16 rounded-full flex justify-center items-center cursor-pointer transition-all duration-500 shadow-xl border-4 border-white active:scale-95',
              isPaused ? 'bg-gray-400' : 'bg-gradient-to-br from-yellow-400 to-amber-600'
            ]">

              <!-- Pulse waves when playing -->
              <div v-if="!isPaused" class="absolute inset-0 rounded-full animate-ping bg-yellow-400 opacity-20"></div>
              <div v-if="!isPaused"
                class="absolute inset-0 rounded-full animate-ping bg-yellow-400 opacity-10 [animation-delay:0.5s]">
              </div>

              <MusicalNoteIcon v-if="isPaused" class="w-8 h-8 text-white transition-all" />
              <div v-else class="relative flex items-end gap-0.5 h-6">
                <div class="w-1 bg-white animate-music-bar-1 h-3"></div>
                <div class="w-1 bg-white animate-music-bar-2 h-5"></div>
                <div class="w-1 bg-white animate-music-bar-3 h-4"></div>
                <div class="w-1 bg-white animate-music-bar-1 h-6"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="event.images && event.images.length > 0" class="container mx-auto px-4">
          <div v-scrollanimation>
            <Gallery :images="event.images" />
          </div>
        </div>

      </div>
      <div>
      </div>

    </div>

  </div>
</template>

<script setup>

import { XMarkIcon, MusicalNoteIcon, PhotoIcon, MapPinIcon, ArrowTopRightOnSquareIcon, PencilSquareIcon, CheckCircleIcon, VideoCameraIcon } from '@heroicons/vue/24/outline';
import { defineAsyncComponent, ref, watch } from 'vue'
import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router"
import { useI18n } from 'vue-i18n';

const Questionnaire = defineAsyncComponent(() =>
  import('../../components/Questionnaire.vue')
);
const Modal = defineAsyncComponent(() =>
  import('../../components/Modal.vue')
);
const Spinner = defineAsyncComponent(() =>
  import('../../components/core/Spinner.vue')
);
const Countdown = defineAsyncComponent(() =>
  import('../../components/Countdown.vue')
);


const Calendar = defineAsyncComponent(() =>
  import('../../components/Calendar.vue')
);
const Gallery = defineAsyncComponent(() =>
  import('../../components/Gallery.vue')
);

const { t, locale } = useI18n();

const modal = ref(false);
const watermarkInvitation = ref(null);
const audio = ref(null);
const isPaused = ref(true);

const store = useStore();
const route = useRoute();
const router = useRouter();

store.dispatch('app/getEventEdit', route.params.id).then(data => {
  store.dispatch('app/getWatermarkInvitation', data.invitation.invitation_img_path).then(res => {
    watermarkInvitation.value = res;
  })
});

const loading = computed(() => store.state.app.event.loading);
const event = computed(() => store.state.app.event.data);

function openModal() {
  modal.value = true;
};
function closeModal() {
  modal.value = false;
};
function getVideoId(url) {
  const regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|u\/\w\/|watch\?v=|&v=|shorts\/))([a-zA-Z0-9_-]{11})(?:[^\s]*)$/;
  const match = url.match(regExp);

  return (match && match[1].length === 11) ? match[1] : null;
}
function finishBtn() {
  let routeUrl = event.value.order.status === 0 ? { name: 'LastStep', params: { id: route.params.id } }
    : { name: 'MyEvent', params: { id: route.params.id } }
  router.push(routeUrl)
};

function initializeAudio() {
  if (audio.value) {
    const playPromise = audio.value.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPaused.value = false
        })
        .catch(error => {
          console.warn('Автозапуск музыки не удался:', error)
        })
    }
  }
}
function toggleAudio() {
  if (audio.value) {
    if (isPaused.value) {
      audio.value.play()
      isPaused.value = false
    } else {
      audio.value.pause()
      isPaused.value = true
    }
  }
}

const handleFirstInteraction = () => {
  initializeAudio()

  // Удаляем обработчики после первого взаимодействия
  document.removeEventListener('click', handleFirstInteraction)
  document.removeEventListener('touchstart', handleFirstInteraction)
}


onMounted(() => {
  const handleFirstInteraction = () => {
    initializeAudio()

    // Удаляем обработчики после первого взаимодействия
    document.removeEventListener('click', handleFirstInteraction)
    document.removeEventListener('touchstart', handleFirstInteraction)
  }

  // Добавляем обработчики для разных типов взаимодействия
  document.addEventListener('click', handleFirstInteraction)
  document.addEventListener('touchstart', handleFirstInteraction)
})

onUnmounted(() => {
  document.removeEventListener('click', handleFirstInteraction)
  document.removeEventListener('touchstart', handleFirstInteraction)
})
</script>

<style scoped>
.before-enter {
  opacity: 0;
  transform: translateY(100px);
  transition: all 1s ease-out;
}

/*
  If the element intersects with the viewport, the before-enter class is added.
*/
.enter {
  opacity: 1;
  transform: translateY(0px);
}

@keyframes music-bar {

  0%,
  100% {
    height: 8px;
  }

  50% {
    height: 20px;
  }
}

.animate-music-bar-1 {
  animation: music-bar 0.8s ease-in-out infinite;
}

.animate-music-bar-2 {
  animation: music-bar 0.6s ease-in-out infinite 0.1s;
}

.animate-music-bar-3 {
  animation: music-bar 1s ease-in-out infinite 0.2s;
}
</style>
