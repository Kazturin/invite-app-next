<template>
  <transition name="fade">
    <div v-if="modal" class="relative z-0">
      <div @click="$emit('closeModal')" class="fixed inset-0 opacity-70 bg-gray-500 z-40"></div>
      <div class="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            class="relative transform m-auto overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
            <div class="bg-white">
              <div class="flex justify-end">
                <XMarkIcon @click="$emit('closeModal')" class="w-6 h-6 cursor-pointer text-red-500 mt-2 mr-2" />
              </div>
              <h3 v-if="title"
                class="text-lg text-center font-semibold leading-6 text-gray-900 pb-4 border-b border-gray-300"
                id="modal-title">{{ title }}</h3>
              <div>
                <slot></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';
const props = defineProps({
  modal: Boolean,
  title: String
});


</script>

<style scoped>
/*.enter {*/
/*    opacity: 0;*/
/*    transform: translateY(0px);*/
/*}*/

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 400ms ease-in-out;
}
</style>
