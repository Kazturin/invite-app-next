<template>
  <div>
    <!-- Table -->
    <div class="w-full mx-auto bg-white">
      <header class="px-5 py-4 border-b border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="mb-2">
            <select class="w-52 form-select pr-8 rounded-md border-gray-300 focus:border-gray-400" name="category_id"
              id="category" @change="selectGuestStatus">
              <option v-for="status in statuses" :key="status.value" :value="status.value">
                {{ status.name }}
              </option>
            </select>
          </div>
          <button @click="openModal()"
            class="bg-theme-secondary ml-auto w-full md:w-fit font-semibold py-2 px-4 text-white rounded">Жеке шақыру
            үшін енгізу +</button>
        </div>
        <input
          class="mb-1 focus:ring-amber-500 focus:border-amber-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          type="text" v-model="searchInput" :placeholder="$t('search')" />
      </header>
      <div class="p-3">
        <p class="mb-2 text-gray-500">{{ guestsFiltered().length }} қонақ</p>
        <div class="overflow-x-auto">
          <table class="table-auto w-full">
            <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
              <tr>
                <th class="p-2 whitespace-nowrap">
                  <div class="font-semibold text-left">#</div>
                </th>
                <th class="p-2 whitespace-nowrap">
                  <div class="font-semibold text-left">Есімі</div>
                </th>
                <th class="p-2 whitespace-nowrap">
                  <div class="font-semibold text-left">Кім</div>
                </th>
                <th class="p-2 whitespace-nowrap">
                  <div class="font-semibold text-left">{{ $t('with') }}</div>
                </th>
                <th class="p-2 whitespace-nowrap">
                  <div class="font-semibold text-left">Жауабы</div>
                </th>
                <th class="p-2 whitespace-nowrap">
                  <div class="font-semibold text-center"></div>
                </th>
              </tr>
            </thead>
            <tbody class="text-sm divide-y divide-gray-100">
              <tr v-for="(guest, index) in guestsFiltered()" :key="guest.id">
                <td class="p-2">
                  <div class="text-left">{{ index + 1 }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
                      <img class="rounded-full" src="/images/user.png" width="40" height="40" alt="Alex Shatov">
                    </div>
                    <div class="font-medium text-gray-800">{{ guest.fullname }}</div>
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-left">{{ guest.relative }}</div>
                </td>
                <td class="p-2">
                  <div class="text-left">
                    <div v-for="item in guest.child">{{ item.fullname }}</div>
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-left">{{ guest.status ? 'Келеді' : 'Келе алмайды' }}</div>
                </td>
                <td class="p-2">
                  <div class="text-lg text-center text-red-500">
                    <TrashIcon class="w-6 h-6 mx-auto cursor-pointer" @click="$emit('delete', guest.id)" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="my-4" v-if="guestsFiltered().length === 0">
            <p>Әзірге жауаптар жоқ</p>
          </div>
        </div>
      </div>
    </div>
    <Modal :modal="modal" title="Қонақ қосу" @close-modal="closeModal">
      <Questionnaire :event_id="event_id" :status="2" @saved="guestSaved" :labels="{
        fullname: 'Қанақтың аты-жөні',
        relative: 'Кім болып келеді',
        addChild: 'Бірге келетін адамды қосу(жұбайы немесе басқа)',
      }" :placeholders="{
        fullname: 'Қанақтың аты-жөні',
        relative: 'Мысал: ағам,досым,ұжым'
      }" />
    </Modal>
  </div>
</template>

<script setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { ref } from "@vue/reactivity";
import { defineAsyncComponent } from "vue";
import store from "../store";

const Questionnaire = defineAsyncComponent(() =>
  import('../components/Questionnaire.vue')
);
const Modal = defineAsyncComponent(() =>
  import('../components/Modal.vue')
);

const props = defineProps({
  guests: {
    type: Array,
    required: true
  },
  event_id: {
    type: Number,
    required: true
  },
})

const statuses = [
  { value: -1, name: 'Барлығы' },
  { value: 1, name: 'Келеді' },
  { value: 0, name: 'Келе алмайды' },
  { value: 2, name: 'Жауап бермеді' }
];

const emit = defineEmits(["delete"]);
const modal = ref(false);

let guestStatus = ref(-1);
let searchInput = ref('');

function guestsFiltered() {
  return props.guests.filter(item => (guestStatus.value === -1 || item.status === guestStatus.value) && item.fullname.toLowerCase().includes(searchInput.value.toLowerCase()))
}

function selectGuestStatus(ev) {
  // console.log(typeof ev.target.value);
  guestStatus.value = parseInt(ev.target.value);
}
function openModal() {
  modal.value = true;
}

function closeModal() {
  modal.value = false;
}

function guestSaved() {
  modal.value = false;

  store.dispatch('app/getGuests', props.event_id)
}

</script>

<style scoped></style>
