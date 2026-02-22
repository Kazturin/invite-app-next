<template>
  <div class="bg-invitation">
    <div v-if="loading" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
      <Spinner />
    </div>

    <div class="container mx-auto bg-white pb-10 shadow-2xl font-baltica relative overflow-hidden">
      <!-- Subtle Paper Texture Overlay -->
      <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]">
      </div>

      <!-- Action Buttons -->
      <div
        class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-stone-100 px-4 py-4 sm:static sm:bg-transparent sm:border-none">

        <div class="flex justify-center items-center gap-3 sm:gap-6">
          <button
            class="group relative flex-1 max-w-[200px] py-2.5 px-4 rounded-full bg-emerald-700 text-white font-semibold text-sm uppercase tracking-wider shadow-md transition-all hover:bg-emerald-800 hover:shadow-lg active:scale-95 disabled:opacity-50"
            @click="openModal(1)" :disabled="isEventPast">
            <span class="flex items-center justify-center gap-2">
              <span>{{ t('invitation_page.go') }}</span>
            </span>
          </button>

          <button
            class="group relative flex-1 max-w-[200px] py-2.5 px-4 rounded-full border border-stone-300 text-stone-500 font-semibold text-sm uppercase tracking-wider hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95 disabled:opacity-50"
            @click="openModal(0)" :disabled="isEventPast">
            {{ t('invitation_page.not_go') }}
          </button>
        </div>
      </div>
      <div class="block sm:hidden h-[66px] w-full"></div>
      <!-- Invitation Content -->
      <div v-if="eventDetails?.invitation">
        <div :style="{ backgroundImage: `url(${eventDetails.invitation.bg_img})` }"
          class="bg-no-repeat bg-cover bg-center w-full drop-shadow-md">
          <div class="max-w-[650px] mx-auto h-[550px] relative">
            <img class="w-96 hidden mx-auto absolute top-8 left-[10px] -rotate-12 sm:block animate-fade-in-up"
              :src="eventDetails.invitation.template.envelope_img" alt="Envelope" />
            <img class="w-80 mx-auto absolute top-8 left-0 right-0 drop-shadow-2xl animate-invitation-float z-10"
              :src="eventDetails.invitation.invitation_img" alt="Invitation" />
          </div>
        </div>

        <!-- Event Details -->
        <div class="container mx-auto mb-6">
          <div class="text-center text-xl sm:text-2xl mt-10 w-full">
            <div
              class="px-6 md:px-20 text-xl font-medium leading-relaxed text-gray-800 break-words animate-fade-in-down"
              v-html="fullDescription"></div>

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
                  <template v-if="!isEventPast">{{ t('invitation_page.until_the_event') }}</template>
                  <template v-else>{{ t('invitation_page.event_passed', { date: formattedDate }) }}</template>
                </span>
              </div>

              <div v-scrollanimation class="mt-2">
                <Countdown :deadline="eventDetails.date" />
              </div>

              <div class="mt-8 flex justify-center">
                <div class="h-1 w-20 bg-gradient-to-r from-transparent via-yellow-200 to-transparent"></div>
              </div>
            </div>
          </div>

          <!-- Calendar -->
          <div v-scrollanimation class="px-4 mb-8 max-w-md mx-auto animate-fade-in-down">
            <Calendar :date="eventDetails.date" />
          </div>

          <!-- Hashtag -->
          <div v-if="eventDetails.photos_link" class="max-w-md mx-auto my-8 px-4">
            <div v-scrollanimation>
              <a :href="eventDetails.photos_link" target="_blank"
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



          <div v-if="eventDetails?.video_link">
            <div v-scrollanimation
              class="max-w-[750px] mt-8 mx-4 sm:mx-auto border border-gray-100 bg-white p-2 sm:p-4 shadow-2xl rounded-2xl overflow-hidden">
              <div class="flex items-center gap-3 mb-4 px-4 pt-2">
                <div class="bg-red-50 p-2 rounded-lg">
                  <VideoCameraIcon class="w-6 h-6 text-red-600" />
                </div>
                <h3 class="text-xl font-bold text-gray-800">Видео</h3>
              </div>
              <div class="rounded-xl overflow-hidden shadow-inner bg-black">
                <iframe :src="`https://www.youtube.com/embed/${videoId}`" class="w-full max-h-[420px] aspect-video"
                  frameborder="0"
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
                {{ eventDetails.place }}
              </p>

              <div v-if="eventDetails.address.address" class="w-full flex flex-col items-center">
                <div class="w-full h-px bg-gray-100 my-4"></div>

                <div v-if="eventDetails.address.address.startsWith('http')" class="text-center">
                  <p class="text-gray-400 text-sm mb-4">
                    {{ t('invitation_page.open_map_help') }}
                  </p>
                  <a :href="eventDetails.address.address" target="_blank"
                    class="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-200 active:scale-95 gap-2 group">
                    <span>{{ t('invitation_page.open_map') }}</span>
                    <ArrowTopRightOnSquareIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                </div>
                <div v-else class="text-center">
                  <p class="text-lg text-gray-700 bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
                    {{ eventDetails.address.address }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Gallery -->
          <div v-if="eventDetails.images && eventDetails.images.length > 0" class="mb-8">
            <div v-scrollanimation>
              <Gallery :images="eventDetails.images" />
            </div>
          </div>

          <div v-if="eventDetails?.audio">
            <audio ref="audioPlayer" :src="eventDetails.audio" type="audio/mpeg" class="hidden" loop></audio>
            <div class="fixed bottom-8 right-8 z-40">
              <div @click="toggleAudio" :class="[
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
        </div>
      </div>

      <!-- Modals -->
      <Modal :modal="modal" :title="t('guest_questionnaire')" @close-modal="closeModal">
        <Questionnaire :event_id="eventDetails?.id" :status="questionnaireStatus" @saved="handleGuestSaved"
          :guest="guestInvite?.guest" />
      </Modal>

      <Modal :modal="messageModal" @close-modal="closeModal">
        <div>
          <div class="mt-2 mb-4">
            <InformationCircleIcon class="block mx-auto text-blue-500 w-12" />
          </div>
          <p class="text-center font-semibold">
            {{ t('invitation_page.greeting') }} <span>{{ guestInvite?.guest?.fullname || t('invitation_page.guest')
              }}</span>
          </p>
          <p class="p-4 text-center">
            {{ t('invitation_page.response_prompt') }}
          </p>
          <div class="mb-4">
            <button
              class="flex mx-auto items-center rounded shadow-lg text-white py-2 px-4 bg-green-500 hover:bg-green-700 w-30"
              @click="closeModal">
              <HandThumbUpIcon class="w-5 mr-2" />
              {{ t('invitation_page.confirm') }}
            </button>
          </div>
        </div>
      </Modal>
    </div>

    <!-- Footer -->
    <div class="bg-white h-14 text-center p-2 border-yellow-700 border-t">
      <a href="/" class="flex items-center justify-center space-x-2">
        <img class="w-32 inline" src="/logo.png" alt="logo" />
        <span class="text-sm font-taurus text-yellow-700">
          {{ t('invitation_page.footer') }}
        </span>
      </a>
    </div>

    <Notification />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { FALSE } from 'sass';

// Interfaces
interface EventDetails {
  id: string;
  date: string;
  title: string;
  description: string;
  place: string;
  hashtag: string;
  video_link?: string;
  audio?: string;
  invitation: {
    bg_img: string;
    envelope_img: string;
    invitation_img: string;
  };
  address: {
    lat: number;
    long: number;
    address: string;
  };
}

interface GuestInvite {
  guest: {
    fullname: string;
  };
  invite_text?: string;
}

// Async Components
const Questionnaire = defineAsyncComponent(() => import('../components/Questionnaire.vue'));
const Modal = defineAsyncComponent(() => import('../components/Modal.vue'));
const Spinner = defineAsyncComponent(() => import('../components/core/Spinner.vue'));
const Countdown = defineAsyncComponent(() => import('../components/Countdown.vue'));
const Notification = defineAsyncComponent(() => import('../components/Notification.vue'));
const PhotoIcon = defineAsyncComponent(() => import('@heroicons/vue/24/outline/PhotoIcon'));
const XMarkIcon = defineAsyncComponent(() => import('@heroicons/vue/24/outline/XMarkIcon'));
const MusicalNoteIcon = defineAsyncComponent(() => import('@heroicons/vue/24/solid/MusicalNoteIcon'));
const VideoCameraIcon = defineAsyncComponent(() => import('@heroicons/vue/24/outline/VideoCameraIcon'));
const MapPinIcon = defineAsyncComponent(() => import('@heroicons/vue/24/outline/MapPinIcon'));
const ArrowTopRightOnSquareIcon = defineAsyncComponent(() => import('@heroicons/vue/24/outline/ArrowTopRightOnSquareIcon'));

const InformationCircleIcon = defineAsyncComponent(() => import('@heroicons/vue/24/outline/InformationCircleIcon'));
const HandThumbUpIcon = defineAsyncComponent(() => import('@heroicons/vue/24/outline/HandThumbUpIcon'));
const Calendar = defineAsyncComponent(() => import('../components/Calendar.vue'));
const Gallery = defineAsyncComponent(() => import('../components/Gallery.vue'));

// State
const modal = ref(false);
const messageModal = ref(false);
const questionnaireStatus = ref<boolean | number>(false);
const audioPlayer = ref<HTMLAudioElement | null>(null);
const isPaused = ref(true);

// Store and Router
const store = useStore();
const route = useRoute();
const { t, locale } = useI18n();

// Computed Properties
const loading = computed(() => store.state.app.event.loading);
const eventDetails = computed<EventDetails | undefined>(() => store.state.app.event.data);
const guestInvite = computed<GuestInvite | undefined>(() => store.state.app.guestInvite);
const isEventPast = computed(() => {
  if (!eventDetails.value?.date) return true;
  return new Date(eventDetails.value.date) < new Date(new Date().setHours(0, 0, 0, 0));
});
const fullDescription = computed(() => {
  return guestInvite.value?.invite_text || eventDetails.value?.description || '';
});
const videoId = computed(() => getVideoId(eventDetails.value?.video_link || ''));

// Methods
const setLanguage = () => {
  if (route.params.lang) {
    locale.value = route.params.lang as string;
    localStorage.setItem('lang', route.params.lang as string);
    store.commit('setLanguage');
  }
};

const openModal = (status: number) => {
  questionnaireStatus.value = status;
  modal.value = true;
};

const closeModal = () => {
  modal.value = false;
  messageModal.value = false;
};

const formattedDate = (input?: string): string => {
  if (!input) return '';
  const date = new Date(input.replace(' ', 'T'));
  if (isNaN(date.getTime())) return '';
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`;
};

const handleGuestSaved = () => {
  modal.value = false;
  store.commit('notify', {
    type: 'success',
    message: t('invitation_page.success_message'),
  });
};

const getVideoId = (url: string): string | null => {
  const regExp =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|u\/\w\/|watch\?v=|&v=|shorts\/))([a-zA-Z0-9_-]{11})(?:[^\s]*)$/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
};

const tryPlayAudio = () => {
  if (!audioPlayer.value) return;
  const playPromise = audioPlayer.value.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isPaused.value = false;
      })
      .catch((error) => {
        console.warn('Auto-play failed:', error);
      });
  }
};

const toggleAudio = () => {
  if (!audioPlayer.value) return;
  if (isPaused.value) {
    const playPromise = audioPlayer.value.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPaused.value = false;
        })
        .catch((error) => {
          console.warn('Manual play failed:', error);
        });
    }
  } else {
    audioPlayer.value.pause();
    isPaused.value = true;
  }
};

// Lifecycle Hooks
onMounted(async () => {
  setLanguage();

  const inviteCode = route.query.invite_code as string;
  try {
    const data = await store.dispatch('app/getEventBySlug', {
      slug: route.params.slug,
      inviteCode,
    });

    if (data && Date.parse(data.date) > Date.now()) {
      setTimeout(() => {
        if (!modal.value) messageModal.value = true;
      }, 4000);
    }
  } catch (error) {
    console.error('Failed to fetch event:', error);
    store.commit('notify', {
      type: 'error',
      message: t('invitation_page.error_fetching'),
    });
  }

  const handleFirstInteraction = () => {
    if (audioPlayer.value) {
      tryPlayAudio();
    }
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
  };

  document.addEventListener('click', handleFirstInteraction);
  document.addEventListener('touchstart', handleFirstInteraction);
});

onUnmounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value = null;
  }
  document.removeEventListener('click', () => { });
  document.removeEventListener('touchstart', () => { });
});
</script>

<style scoped>
.before-enter {
  opacity: 0;
  transform: translateY(100px);
  transition: all 1s ease-out;
}

.enter {
  opacity: 1;
  transform: translateY(0);
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

@keyframes invitation-float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-10px) rotate(1deg);
  }

  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

.animate-invitation-float {
  animation: invitation-float 6s ease-in-out infinite;
}
</style>