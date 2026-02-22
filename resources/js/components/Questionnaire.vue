<template>
  <Alert v-if="errorMsg" class="flex-col items-stretch text-sm mx-4 mt-4">
    <div>
      {{ errorMsg }}
    </div>
  </Alert>
  <form @submit.prevent="save" class="mt-2 w-full">
    <div class="px-5 pb-5 pt-1">
      <div class="mt-2">
        <label for="fullname" class="text-left block text-sm font-medium leading-6 text-gray-900 mb-2">{{
          labels.fullname || $t('your_fullname') }}</label>
        <div
          class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
          <input v-model="model.fullname" type="text" id="fullname" name="fullname"
            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
        </div>
      </div>
      <div class="mt-2">
        <label for="relative" class="text-left block text-sm font-medium leading-6 text-gray-900 mb-2">
          {{ labels.relative || 'Туыстық қатынас' }}
        </label>
        <div
          class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
          <input v-model="model.relative" type="text" id="relative" name="relative"
            class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            :placeholder="placeholders.relative || $t('relative_example')">
        </div>
      </div>
      <div v-if="status === 1 || status === 2" class="bg-white my-4 border-t border-gray-300">
        <div class="text-md font-semibold mb-2">

          <!-- Add new question -->
          <button type="button" @click="addChild()"
            class="flex items-center text-sm mt-2 py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700">
            {{ labels.addChild || $t('add_quest') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clip-rule="evenodd" />
            </svg>

          </button>
        </div>
        <div>
          <div v-for="(child, index) in model.child" :key="child.key">
            <ChildEditor :child="child" :index="index" @change="childChange" @addChild="addChild"
              @deleteChild="deleteChild" />
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
      <button :disabled="loadingPost" type="submit"
        class="inline-flex w-full justify-center rounded-md bg-theme-primary px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed shadow-sm sm:ml-3 sm:w-auto">
        <span v-if="loadingPost" class="w-5 h-5 mr-1 rounded-full animate-spin
                    border-2 border-solid border-white border-t-transparent"></span>
        <span v-if="status === 1">{{ $t('invitation_page.go') }}</span>
        <span v-if="status === 0">{{ $t('invitation_page.not_go') }}</span>
        <span v-if="status === 2">{{ $t('button.save') }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { onMounted, ref } from "vue";
import store from "../store";
import ChildEditor from "./ChildEditor.vue";
import { v4 as uuidv4 } from "uuid";
import Alert from "./Alert.vue";

const props = defineProps({
  event_id: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  labels: {
    type: Object,
    default: () => ({})
  },
  placeholders: {
    type: Object,
    default: () => ({})
  },
  guest: {
    type: Object,
    required: false
  }
})

let errorMsg = ref(null);
let loadingPost = ref(false);

const emit = defineEmits(["saved"]);

let model = ref({
  fullname: "",
  relative: "",
  email: "",
  phone: "",
  status: props.status,
  event_id: props.event_id,
  personally_invited: false,
  child: []
});

function addChild(index) {
  const newChild = {
    key: uuidv4(),
    fullname: "",
  };
  model.value.child.splice(index, 0, newChild);
}

function childChange(child) {
  model.value.child = model.value.child.map((q) => {
    if (q.key === child.key) {
      return JSON.parse(JSON.stringify(child));
    }
    return q;
  });
}

function deleteChild(child) {
  model.value.child = model.value.child.filter((q) => q !== child);
}

function save() {
  loadingPost.value = true;
  store.dispatch('app/saveGuest', model.value).then((res) => {
    loadingPost.value = false;
    store.commit('notify', {
      type: "success",
      message: "Сәтті жіберілді"
    })
    emit("saved")
  }).catch(err => {
    loadingPost.value = false;
    console.log(err);
    errorMsg.value = err.response.data.message;
  })
}

onMounted(() => {
  if (props.status === 2) {
    model.value.personally_invited = true;
  }
  if (props.guest) {
    model.value = props.guest;
    model.value.status = props.status;
  }
});


</script>

<style scoped></style>
