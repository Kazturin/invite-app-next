<template>
  <div class="container mx-auto mb-8">
    <Stepper v-model:step="step" :backText="$t('backStep')" :nextText="$t('nextStep')" :doneText="$t('lastStep')"
      @increment-step="incrementStep" @decrement-step="decrementStep" @complete="save(true)">
      <template #3>
        <Alert v-if="errors" class="md:w-2/3 mx-auto text-sm">
          <div>
            {{ errors }}
          </div>
        </Alert>
        <div v-if="validationErrors">
          <Alert v-for="value in validationErrors" class="md:w-2/3 mb-2 mx-auto text-sm">
            <div>
              {{ value }}
            </div>
          </Alert>
        </div>

        <form ref="form" class="border border-gray-200 rounded-lg mt-10 w-full md:w-2/3 mx-auto p-4">
          <div class="space-y-6">
            <div class="border-b border-gray-900/10 pb-6">
              <h2 class="text-base font-semibold leading-7 text-gray-900">{{ $t('event.information') }}</h2>

              <div class="mt-10">
                <div>
                  <label for="title" class="text-left block text-sm font-medium leading-6 text-gray-900">{{
                    $t('event.title') }} <span class="text-red-500">*</span></label>
                  <div class="mt-2">
                    <div
                      class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input v-model="model.title" type="text" name="title" id="title" required autocomplete="title"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Әлібек пен Аружанның тойы">
                    </div>
                    <p v-if="validationErrors.title" class="mt-1 text-sm text-red-600">{{ validationErrors.title }}</p>
                  </div>
                </div>

                <div class="mt-4">
                  <label for="description" class="text-left block text-sm font-medium leading-6 text-gray-900">{{
                    $t('event.more_info') }}:</label>

                  <div class="my-2">
                    <QuillEditor theme="snow" v-model:content="model.description" contentType="html"
                      :toolbar="toolbarOptions" class="min-h-[8rem] max-h-[8rem] overflow-y-auto"
                      placeholder="Тойымыздың қадірлі қонағы болыңыздар" @ready="onEditorReady" />
                  </div>
                </div>

                <div class="mt-4">
                  <label for="photos_link" class="text-left block text-sm font-medium leading-6 text-gray-900">{{
                    $t('event.photos_link') }}</label>
                  <div class="mt-2">
                    <div
                      class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input v-model="model.photos_link" type="text" name="photos_link" id="photos_link"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="https://www.instagram.com/explore/search/keyword/?q=%23aidanauzatu">
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
                    $t('event.restaurant_name') }} <span class="text-red-500">*</span></label>
                  <div class="mt-2">
                    <div
                      class="flex h-8 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset group focus-within:ring-indigo-600">
                      <div
                        class="h-full flex justify-center items-center w-8 group-focus-within:border-indigo-600 border-gray-300 border-r">
                        <BuildingLibraryIcon class="w-5 text-gray-600" />
                      </div>
                      <input v-model="model.place" type="text" name="place" id="place" required
                        placeholder="Ресторан 'Алтын орман'"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
                    </div>
                    <p v-if="validationErrors.place" class="mt-1 text-sm text-red-600">{{ validationErrors.place }}</p>
                  </div>
                </div>

                <div class="mt-4">
                  <div class="text-left font-medium text-gray-900 text-sm leading-6">Өтетін жері картасына сілтеме <span
                      class="text-red-500">*</span></div>
                  <div
                    class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input v-model="model.address_link" type="text" name="address_link" id="address_link" required
                      class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="https://go.2gis.com/..." />
                  </div>
                  <p v-if="validationErrors.address_link" class="mt-1 text-sm text-red-600">{{
                    validationErrors.address_link
                  }}</p>
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
                      <input v-model="model.video_link" type="text" name="video_link" id="video_link"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
                    </div>
                  </div>
                </div>
                <div class="mt-4">
                  <div class="flex space-x-2">
                    <label class="relative inline-flex cursor-pointer items-center">
                      <input v-model="model.audioToggle" id="switch" type="checkbox" class="peer sr-only" />
                      <label for="switch" class="hidden"></label>
                      <div
                        class="peer h-6 w-11 rounded-full border bg-slate-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-green-300">
                      </div>
                    </label>
                    <span>Музыка</span>
                  </div>
                  <div v-if="model.audioToggle"
                    class="mt-4 flex items-center flex-col sm:flex-row border p-2 rounded-md animate-fade-in-down">
                    <audio class="mb-2 sm:mb-0 w-full" controls ref="audioPlayer"
                      src="/storage/audio/default.mp3"></audio>
                    <button type="button"
                      class="relative overflow-hidden ml-4 w-fit bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <input ref="audioFileInput" type="file" accept=".mp3" @change="previewAudio"
                        class="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer" />
                      Өзгерту
                    </button>
                  </div>
                </div>
                <div class="mt-4">
                  <div>
                    <label for="date" class="text-left block text-sm font-medium text-gray-700">{{
                      $t('event.start_time') }} <span class="text-red-500">*</span></label>
                    <input v-model="model.date" type="datetime-local" name="date" required id="date"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    <p v-if="validationErrors.date" class="mt-1 text-sm text-red-600">{{ validationErrors.date }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6 flex items-center justify-end space-x-2">
            <button disabled
              class="disabled:cursor-not-allowed opacity-25 bg-theme-secondary px-4 py-2 text-white rounded"
              btnType="muted">{{ $t('button.preview') }}</button>
            <button :disabled="eventSaveLoading" type="button" @click="save(false)"
              class="bg-theme-secondary px-4 py-2 text-white rounded flex items-center"
              :class="{ 'cursor-not-allowed': eventSaveLoading }">
              <span v-if="eventSaveLoading" class="w-5 h-5 mr-1 rounded-full animate-spin
                      border-2 border-solid border-white border-t-transparent"></span><span>{{ $t('button.save')
                      }}</span></button>
            <button type="button" @click="save(true)" :disabled="eventSaveLoading"
              class="bg-theme-primary px-4 py-2 text-white rounded">{{ $t('button.completion') }}</button>
          </div>
        </form>
      </template>
    </Stepper>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { toolbarOptions } from '../../utils/quillConfig';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// Dynamic imports

const Alert = defineAsyncComponent(() => import("../../components/Alert.vue"));
const Stepper = defineAsyncComponent(() => import("../../components/Stepper.vue"));
const QuillEditor = defineAsyncComponent(() => import('@vueup/vue-quill').then(m => m.QuillEditor));

// Icons
const GlobeAltIcon = defineAsyncComponent(() => import('@heroicons/vue/24/outline/GlobeAltIcon'));
const BuildingLibraryIcon = defineAsyncComponent(() => import('@heroicons/vue/24/outline/BuildingLibraryIcon'));

const store = useStore();
const router = useRouter();

const step = ref(3);
const errors = ref(null);
const validationErrors = ref({});
const form = ref(null);
const audioPlayer = ref(null);
const audioFileInput = ref(null);
const galleryPreviews = ref([]);
const galleryFiles = ref([]);

const model = reactive({
  address: null,
  address_link: '',
  title: '',
  description: '<p><span class="ql-font-Mon" style="color: rgb(178, 107, 0);">Тойымыздың қадірлі қонағы болыңыз</span></p>',
  photos_link: null,
  place: '',
  date: '',
  video_link: null,
  audio: '/audio/default.mp3',
  audioFile: null,
  status: 1,
  created_by: null,
  audioToggle: false,
});

// const eventSaveLoading = computed(() => store.state.app.event.saveLoading);
const eventSaveLoading = ref(false);


const onEditorReady = (quill) => {
  quill.format('font', 'Mon');
};

const incrementStep = () => {
  if (formCompleted.value) {
    if (model.status === 1) {
      changeRoute({ name: "MyEvent", params: { id: router.currentRoute.value.params.id } });
    } else {
      changeRoute({ name: "LastStep", params: { id: router.currentRoute.value.params.id } });
    }
  }
};

const decrementStep = () => {
  changeRoute({ name: "Step2", params: { id: router.currentRoute.value.params.id } });
};

const changeRoute = (route) => {
  router.replace(route);
};

const save = async (complete) => {
  if (eventSaveLoading.value) return;

  validationErrors.value = {};
  let isValid = true;

  if (!model.title) {
    validationErrors.value.title = 'Той атауын толтырыңыз';
    isValid = false;
  }
  if (!model.place) {
    validationErrors.value.place = 'Өтетін жерін толтырыңыз';
    isValid = false;
  }
  if (!model.address_link) {
    validationErrors.value.address_link = 'Картаға сілтемені көрсетіңіз';
    isValid = false;
  }
  if (!model.date) {
    validationErrors.value.date = 'Басталу уақытын көрсетіңіз';
    isValid = false;
  }

  if (!isValid) {
    window.scrollTo(0, 0);
    return;
  }
  errors.value = null;

  eventSaveLoading.value = true;
  const formData = new FormData(form.value);
  formData.set('created_by', store.state.user.data.id);
  if (model.address_link) {
    formData.set('address[address]', model.address_link);
    formData.set('address[lat]', 0);
    formData.set('address[long]', 0);
  }
  formData.set('description', model.description);
  if (model.audioFile) {
    formData.set('audioFile', model.audioFile);
  }
  if (model.audioToggle) {
    formData.set('audio', model.audio);
  }
  if (galleryFiles.value.length > 0) {
    galleryFiles.value.forEach((file) => {
      formData.append('gallery[]', file);
    });
  }
  formData.set('status', 1);
  formData.set('invitation[content]', JSON.stringify(store.state.app.invitation.content));
  formData.set('invitation[invitation_img]', store.state.app.invitation.invitation_img);
  formData.set('invitation[envelope_img]', store.state.app.invitation.envelope_img);
  formData.set('invitation[event_id]', null);
  formData.set('invitation[template_id]', store.state.app.invitation.template_id);
  formData.set('invitation[price]', store.state.app.invitation.price);
  formData.set('invitation[bg_img]', store.state.app.invitation.bg_img);
  formData.set('inInvitationImage', store.state.app.invitation.inInvitationImage);
  console.log(store.state.app.invitation.content);
  try {
    const { data } = await store.dispatch('app/saveEvent', formData);
    if (complete) {
      changeRoute({ name: 'LastStep', params: { id: data.id } });
    } else {
      changeRoute({ name: 'EventUpdate', params: { id: data.id } });
    }
    store.commit('notify', {
      type: 'success',
      message: 'Сәтті сақталды',
    });
  } catch (error) {
    console.log(error);
    errors.value = error.response.data.message;
    window.scroll(0, 0);
  }
  finally {
    eventSaveLoading.value = false;
  }
};

const validateYoutubeUrl = (url) => {
  // const p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  const p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    return url.match(p)[1];
  }
  return false;
};


const previewAudio = async () => {
  const fileInput = audioFileInput.value;
  const file = fileInput.files[0];

  if (!file) {
    return;
  }

  try {
    const result = await readFileAsDataURL(file);
    model.audioFile = file;
    audioPlayer.value.src = result;
  } catch (error) {
    console.error('Ошибка при чтении файла:', error);
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

onMounted(() => {
  if (store.state.app.event.data) {
    Object.assign(model, store.state.app.event.data);
    if (store.state.app.event.data.images) {
      galleryPreviews.value = store.state.app.event.data.images.map(img => ({
        url: '/storage/' + img.path,
        id: img.id,
        file: null
      }));
    }
    if (store.state.app.event.data.address) {
      model.address_link = store.state.app.event.data.address.address;
    }
  }
});

onBeforeUnmount(() => {
  model.value = {};
});
</script>
<style lang="scss">
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
}
</style>