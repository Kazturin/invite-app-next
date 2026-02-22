<template>
  <div class="container mx-auto">
    <Stepper v-model:step="step" :backText="$t('backStep')" :doneText="$t('button.completion')"
      :donetText="$t('lastStep')" @decrement-step="decrementStep" @complete=save(true)>
      <template #3>
        <Alert v-if="errors" class="flex-col items-stretch text-sm">

          {{ errors }}

        </Alert>
        <form v-if="eventDetails" ref="form"
          class="border border-gray-200 rounded-lg mt-10 w-full md:w-2/3 mx-auto p-4">
          <div class="space-y-6">
            <div class="border-b border-gray-900/10 pb-8">
              <h2 class="text-base font-semibold leading-7 text-gray-900">{{ $t('event.information') }}</h2>
              <div class="mt-10">
                <div>
                  <label for="title" class="text-left block text-sm font-medium leading-6 text-gray-900">{{
                    $t('event.title') }}</label>
                  <div class="mt-2">
                    <div
                      class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input v-model="eventDetails.title" type="text" name="title" id="title" required
                        autocomplete="title"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
                    </div>
                  </div>
                </div>

                <div class="mt-4">
                  <label for="description" class="text-left block text-sm font-medium leading-6 text-gray-900">{{
                    $t('event.additional_information') }}</label>

                  <div class="my-2" :class="{ 'ql-fullscreen': isFullscreen }">
                    <QuillEditor ref="quillEditor" theme="snow" v-model:content="eventDetails.description"
                      contentType="html" :toolbar="toolbarOptions" name="description"
                      class="min-h-[8rem] overflow-y-auto" :class="{ 'max-h-[8rem]': !isFullscreen }"
                      placeholder="Тойымыздың қадірлі қонағы болыңыздар" />
                  </div>
                </div>

                <div class="mt-4">
                  <label for="photos_link" class="text-left block text-sm font-medium leading-6 text-gray-900">{{
                    $t('event.photos_link') }}</label>
                  <div class="mt-2">
                    <div
                      class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input v-model="eventDetails.photos_link" type="text" name="photos_link" id="photos_link"
                        autocomplete="photos_link"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
                    </div>
                  </div>
                </div>

                <div class="mt-4">
                  <label class="text-left block text-sm font-medium leading-6 text-gray-900">
                    Фотогалерея (макс. 5 фото)
                  </label>
                  <div class="mt-2">
                    <div class="flex flex-wrap gap-4">
                      <div v-for="(image, index) in galleryPreviews" :key="index" class="relative w-24 h-24">
                        <img :src="image.url" class="w-full h-full object-cover rounded-md" />
                        <button type="button" @click="removeGalleryImage(index)"
                          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
                          x
                        </button>
                      </div>
                      <label v-if="galleryPreviews.length < 5"
                        class="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-indigo-500">
                        <span class="text-2xl text-gray-400">+</span>
                        <input type="file" multiple accept="image/*" @change="handleGalleryUpload" class="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-b border-gray-900/10 pb-6">
              <div class="mt-5">
                <div class="">
                  <label for="place" class="text-left block text-sm font-medium leading-6 text-gray-900">{{
                    $t('event.restaurant_name') }}</label>
                  <div class="mt-2">
                    <div
                      class="flex h-8 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <div
                        class="h-full flex justify-center items-center w-8 group-focus-within:border-indigo-600 border-gray-300 border-r">
                        <BuildingLibraryIcon class="w-5 text-gray-600" />
                      </div>
                      <input v-model="eventDetails.place" type="text" name="place" id="place" required
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
                    </div>
                  </div>
                </div>
                <div class="mt-4">
                  <div class="text-left font-medium text-gray-900 text-sm leading-6">Өтетін жері картасына сілтеме</div>
                  <div
                    class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input v-model="addressLink" type="text" name="address_link" id="address_link"
                      class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="https://go.2gis.com/..." />
                  </div>
                </div>
                <div class="mt-4">
                  <label for="video_link"
                    class="text-left block text-sm font-medium leading-6 text-gray-900">Видео(youtube {{ $t('link')
                    }})</label>
                  <div class="mt-2">
                    <div
                      class="flex h-8 items-center rounded-md overflow-hidden shadow-sm ring-1 ring-inset ring-gray-300 group focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <div
                        class="h-full flex justify-center items-center w-8 group-focus-within:border-indigo-600 group-focus-within:border-r-2 border-gray-300 border-r">
                        <GlobeAltIcon class="w-5 text-gray-600" />
                      </div>
                      <input v-model="eventDetails.video_link" type="text" name="video_link" id="video_link"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
                    </div>
                  </div>
                </div>
                <div class="mt-4">
                  <div class="flex space-x-2">
                    <label class="relative inline-flex cursor-pointer items-center">
                      <input v-model="audioToggle" id="switch" type="checkbox" class="peer sr-only" />
                      <label for="switch" class="hidden"></label>
                      <div
                        class="peer h-6 w-11 rounded-full border bg-slate-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-green-300">
                      </div>
                    </label>
                    <span>Музыка</span>
                  </div>
                  <div v-if="audioToggle"
                    class="mt-4 flex items-center flex-col sm:flex-row border p-2 rounded-md animate-fade-in-down">
                    <audio class="mb-2 sm:mb-0 w-full" controls ref="audioPlayer"
                      :src="eventDetails.audio ?? '/storage/audio/default.mp3'"></audio>
                    <button type="button"
                      class="relative overflow-hidden ml-4 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <input ref="audioFileInput" type="file" @change="previewAudio"
                        class="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer" />
                      Өзгерту
                    </button>
                  </div>
                </div>
                <div class="mt-4">
                  <div>
                    <label for="date" class="text-left block text-sm font-medium text-gray-700">{{
                      $t('event.start_time') }}</label>
                    <input v-model="eventDetails.date" type="datetime-local" name="date" required id="date"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6 flex items-center justify-end gap-x-2">
            <router-link :disabled="eventSaveLoading"
              class="disabled:cursor-not-allowed bg-theme-secondary px-4 py-2 text-white rounded" btnType="muted"
              :to="{ name: 'Preview', params: { id: $route.params.id } }">{{ $t('button.preview') }}</router-link>
            <button @click="save(false)" type="button" :disabled="eventSaveLoading"
              class="bg-theme-secondary px-4 py-2 text-white rounded flex items-center disabled:cursor-not-allowed">
              <span v-if="eventSaveLoading" class="w-5 h-5 mr-1 rounded-full animate-spin
                      border-2 border-solid border-white border-t-transparent"></span><span>{{ $t('button.save')
                      }}</span>
            </button>
            <button :disabled="eventSaveLoading" type="button" @click="save(true)"
              class="bg-theme-primary px-4 py-2 text-white rounded disabled:cursor-not-allowed">{{
                $t('button.completion') }}</button>
          </div>
        </form>
        <div v-else class="absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2 ">
          <div class="border-t-transparent border-solid animate-spin  rounded-full border-blue-500 border-2 w-12 h-12">
          </div>
        </div>
      </template>
    </Stepper>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { toolbarOptions } from '../../utils/quillConfig';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// Async component imports

const Stepper = defineAsyncComponent(() => import('../../components/Stepper.vue'));
const GlobeAltIcon = defineAsyncComponent(() => import('@heroicons/vue/24/outline/GlobeAltIcon'));
const BuildingLibraryIcon = defineAsyncComponent(() => import('@heroicons/vue/24/outline/BuildingLibraryIcon'));

const Alert = defineAsyncComponent(() => import('../../components/Alert.vue'));
const Spinner = defineAsyncComponent(() => import('../../components/core/Spinner.vue'));
const QuillEditor = defineAsyncComponent(() => import('@vueup/vue-quill').then(m => m.QuillEditor));

const store = useStore();
const router = useRouter();
const route = useRoute();

const step = ref(3);
const formCompleted = ref(false);
const errors = ref(null);
const audioToggle = ref(false);
const audioFile = ref(null);
const form = ref(null);
const audioPlayer = ref(null);
const audioFileInput = ref(null);
const galleryPreviews = ref([]);
const galleryFiles = ref([]);
const addressLink = ref('');

const eventDetails = computed(() => store.state.app.event.data);
const invitation = computed(() => store.state.app.invitation);
const eventSaveLoading = computed(() => store.state.app.event.saveLoading);
const quillEditor = ref(null);
const isFullscreen = ref(false);

const toggleFullscreen = (event) => {
  event.stopPropagation();
  isFullscreen.value = !isFullscreen.value;
};

onMounted(async () => {
  try {
    const res = await store.dispatch('app/getEventEdit', route.params.id);
    if (res.order.status === 2) {
      router.push({ name: 'Forbidden' });
    }
    formCompleted.value = true;
    if (eventDetails.value && eventDetails.value.audio !== null) {
      audioToggle.value = true;
    }
    if (eventDetails.value && eventDetails.value.images) {
      galleryPreviews.value = eventDetails.value.images.map(img => ({
        url: '/storage/' + img.path,
        id: img.id,
        file: null
      }));
    }
    if (eventDetails.value && eventDetails.value.address) {
      addressLink.value = eventDetails.value.address.address;
    }
  } catch (error) {
    console.error('Error fetching event details:', error);
  }

  if (quillEditor.value) {
    // Находим панель инструментов
    const toolbar = quillEditor.value.getToolbar();

    // Создаем кнопку
    const fullscreenButton = document.createElement('button');
    fullscreenButton.setAttribute('type', 'button');
    fullscreenButton.innerHTML = `<svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 22h-24v-20h24v20zm-1-19h-22v18h22v-18zm-4 7h-1v-3.241l-11.241 11.241h3.241v1h-5v-5h1v3.241l11.241-11.241h-3.241v-1h5v5z"/></svg>`;
    fullscreenButton.classList.add('ql-fullscreen-btn'); // Добавляем класс для стилизации

    // Добавляем обработчик клика
    fullscreenButton.addEventListener('click', toggleFullscreen);

    // Вставляем кнопку в панель
    toolbar.appendChild(fullscreenButton);
  }
});



const decrementStep = () => {
  router.push({ name: "InvitationEdit", params: { id: eventDetails.value.invitation.id } });
};

const changeRoute = (complete) => {
  if (complete) {
    if (eventDetails.value.order.status === 0) {
      router.push({ name: "LastStep", params: { id: route.params.id } });
    } else {
      router.push({ name: "MyEvent", params: { id: route.params.id } });
    }
  } else {
    store.dispatch('app/getEventEdit', route.params.id);
  }
};

const save = async (complete) => {
  const formData = new FormData(form.value);
  formData.append('id', eventDetails.value.id);
  formData.append('address[address]', addressLink.value);
  formData.append('address[lat]', 0);
  formData.append('address[long]', 0);
  formData.append('status', eventDetails.value.status);
  formData.append('description', eventDetails.value.description);

  if (audioToggle.value && !audioFile.value && !eventDetails.value.audio) {
    formData.append('audio', '/audio/default.mp3');
  }
  if (audioFile.value) {
    formData.append('audioFile', audioFile.value);
  }
  if (galleryFiles.value.length > 0) {
    galleryFiles.value.forEach((file) => {
      formData.append('gallery[]', file);
    });
  }

  try {
    await store.dispatch('app/updateEvent', { id: eventDetails.value.id, event: formData });
    changeRoute(complete);
    store.commit("notify", {
      type: "success",
      message: "Сәтті сақталды",
    });
  } catch (error) {
    errors.value = error.response.data.message;
    console.error('Error saving event:', error.response.data.message);
    window.scroll(0, 0);
  }

};

const previewAudio = async () => {
  const file = audioFileInput.value.files[0];
  if (!file) return;

  try {
    const result = await readFileAsDataURL(file);
    audioFile.value = file;
    audioPlayer.value.src = result;
  } catch (error) {
    console.error('Error reading audio file:', error);
  }
};

const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Watch for changes in audioToggle
watch(audioToggle, (newValue) => {
  if (newValue === true && !audioFile.value && audioPlayer.value) {
    audioPlayer.value.src = '/storage/audio/default.mp3';
  }
});

const handleGalleryUpload = async (event) => {
  const files = Array.from(event.target.files);
  const remainingSlots = 5 - galleryPreviews.value.length;
  const filesToProcess = files.slice(0, remainingSlots);

  for (const file of filesToProcess) {
    try {
      const result = await readFileAsDataURL(file);
      galleryPreviews.value.push({ url: result, file: file, id: null });
      galleryFiles.value.push(file);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }
};

const removeGalleryImage = async (index) => {
  const image = galleryPreviews.value[index];
  if (image.id) {
    try {
      await store.dispatch('app/deleteEventImage', image.id);
      galleryPreviews.value.splice(index, 1);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  } else {
    galleryPreviews.value.splice(index, 1);
    // Find and remove from galleryFiles
    const fileIndex = galleryFiles.value.indexOf(image.file);
    if (fileIndex > -1) {
      galleryFiles.value.splice(fileIndex, 1);
    }
  }
};

</script>

<style lang="scss">
/* 👇 Стили для полноэкранного режима */
.ql-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  /* Высокий z-index, чтобы быть поверх всего */
  background: white;
  display: flex;
  flex-direction: column;
}

/* В полноэкранном режиме редактор должен занимать все доступное пространство */
.ql-fullscreen .ql-container {
  flex-grow: 1;
  height: auto !important;
  /* !important нужен для переопределения инлайн-стилей Quill */
}

.ql-fullscreen .ql-editor {
  max-height: none;
  /* Убираем ограничение по высоте */
}

/* 👇 Стили для кастомной кнопки */
.ql-toolbar .ql-fullscreen-btn {
  width: 28px;
  height: 24px;
  padding: 3px 5px;
}

.ql-toolbar .ql-fullscreen-btn svg {
  width: 100%;
  height: 100%;
}

.ql-editor {
  font-family: 'Mon';
  font-size: 24px;
}

.ql-picker.ql-font {

  .ql-picker-label[data-value=vAcade]::before,
  .ql-picker-item[data-value=vAcade]::before {
    content: "Academy";
    font-family: vAcade;
  }

  .ql-picker-label[data-value=Mon]::before,
  .ql-picker-item[data-value=Mon]::before {
    content: "Mon";
    font-family: Mon;
  }

  .ql-picker-label[data-value=Balmoral]::before,
  .ql-picker-item[data-value=Balmoral]::before {
    content: "Balmoral";
    font-family: Balmoral;
  }

  .ql-picker-label[data-value=RosaMarena]::before,
  .ql-picker-item[data-value=RosaMarena]::before {
    content: "RosaMarena";
    font-family: RosaMarena;
  }

  .ql-picker-label[data-value=Baltica]::before,
  .ql-picker-item[data-value=Baltica]::before {
    content: "Baltica";
    font-family: Baltica;
  }

  .ql-picker-label[data-value=Vivaldi]::before,
  .ql-picker-item[data-value=Vivaldi]::before {
    content: "Vivaldi";
    font-family: Vivaldi;
  }

  .ql-picker-label[data-value=Boyarsky]::before,
  .ql-picker-item[data-value=Boyarsky]::before {
    content: "Boyarsky";
    font-family: Boyarsky;
  }

  .ql-picker-label[data-value=Taurus]::before,
  .ql-picker-item[data-value=Taurus]::before {
    content: "Taurus";
    font-family: Taurus;
  }

  .ql-picker-label[data-value=Cooper]::before,
  .ql-picker-item[data-value=Cooper]::before {
    content: "Cooper";
    font-family: Cooper;
  }

  .ql-picker-label[data-value=Downtown]::before,
  .ql-picker-item[data-value=Downtown]::before {
    content: "Downtown";
    font-family: Downtown;
  }

  .ql-picker-label[data-value=Poster]::before,
  .ql-picker-item[data-value=Poster]::before {
    content: "Poster";
    font-family: Poster;
  }

  .ql-picker-label[data-value=Bernn]::before,
  .ql-picker-item[data-value=Bernn]::before {
    content: "Bernn";
    font-family: Bernn;
  }

  .ql-picker-label[data-value=Handel]::before,
  .ql-picker-item[data-value=Handel]::before {
    content: "Handel";
    font-family: Handel;
  }
}
</style>