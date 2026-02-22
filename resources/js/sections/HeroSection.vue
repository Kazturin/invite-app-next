<script setup>
import { CheckIcon, PhotoIcon } from '@heroicons/vue/24/outline';
import Modal from "../components/Modal.vue";
import { ref } from "vue";

let modal = ref(false);
let modal_img_url = ref(null);
let modal_title = ref('');

function openModal(title, img_url) {
  modal_title.value = title;
  modal_img_url.value = img_url;
  modal.value = true;
}
function closeModal() {
  modal.value = false;
}
</script>

<template>
  <section class="bg-white w-full bg-left bg-contain overflow-hidden bg-no-repeat h-[550px]">
    <div class="container mx-auto relative">
      <div class="absolute top-7 z-20 flex w-full z-20">
        <div class="w-[740px] flex flex-col items-start text-center px-5">
          <h1 class="text-left font-semibold text-4xl mb-7 text-gray-600 animate-fade-in-up">
            {{ $t('create an online invitation to your event') }}
          </h1>
          <div class="bg-yellow-500 h-[5px] w-[74px]"></div>
          <p class="my-7 text-lg text-left animate-fade-in-down">
            {{ $t('without the help of a specialist you can easily create') }}:</p>
          <div class="animate-fade-in-down block-holder bg-white px-5 py-8 text-left shadow-md border border-gray-200">
            <div class="block">
              <ul>
                <li class="flex">
                  <div class="h-6 w-6 mr-4">
                    <CheckIcon class="h-6 w-6 text-blue-500" />
                  </div>
                  <p>Онлайн шақырту сайты (<a class="underline text-sm text-gray-600"
                      href="https://toi-invite.kz/toi/aslan-men-erkezannyn-toiy/kk" target="_blank">Мысал</a>)</p>
                </li>
                <li class="flex">
                  <div class="h-6 w-6 mr-4">
                    <CheckIcon class="h-6 w-6 text-blue-500" />
                  </div>
                  <div @click="openModal('Әлеуметтік желілер арқылы қонақтарды шақыру', '/images/screenshot_2.jpeg')"
                    class="flex items-center cursor-pointer space-x-4">
                    <div class="grow">Әлеуметтік желілер арқылы қонақтарды шақыру</div>
                    <div class="w-6 h-6">
                      <PhotoIcon class="w-6 h-6" />
                    </div>
                  </div>
                </li>
                <li class="flex">
                  <div class="h-6 w-6 mr-4">
                    <CheckIcon class="h-6 w-6 text-blue-500" />
                  </div>
                  <div @click="openModal('Келетін қонақтар туралы ақпарт алу', '/images/guests_screen.png')"
                    class="mb-2 flex items-center cursor-pointer space-x-4">
                    <div class="grow">Келетін қонақтар туралы ақпарт алу</div>
                    <div class="w-6 h-6">
                      <PhotoIcon class="w-6 h-6" />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-8">
            <router-link :to="{ name: 'Step1' }"
              class="bg-theme-primary px-6 py-2 text-white font-semibold rounded shadow-md hover:bg-white border-2 border-transparent hover:border-theme-primary hover:text-theme-primary cursor-pointer transition duration-200"
              href="#download-section">
              {{ $t('create invitation') }}
            </router-link>
          </div>

        </div>
      </div>
      <div
        class="transparent-cover-left hidden sm:inline-block z-10 w-72 h-[550px] bg-hero-pattern-l absolute  left-[170px] xl:left-[400px]">
      </div>
      <div class="right-part hidden sm:inline-block left-[170px] xl:left-[400px] relative h-[550px]">
        <video preload="none" class="h-full animate-fade-in-up" id="video" muted="muted" autoplay="autoplay" loop="loop"
          src="/video/1.mp4"></video>
      </div>
    </div>

  </section>
  <Modal :modal="modal" :title="modal_title" @close-modal="closeModal" class="z-40">
    <img v-if="modal_img_url" class="w-full" :src="modal_img_url" alt="">
  </Modal>
</template>
<style>
.right-part:after {
  content: "";
  width: 256px;
  height: 550px;
  background-image: linear-gradient(270deg, #fff 0, hsla(0, 0%, 98%, 0));
  position: absolute;
  right: 0;
  top: 0;
  border: none;
}
</style>
