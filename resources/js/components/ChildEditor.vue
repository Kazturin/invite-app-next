<template>
  <div class="flex items-center justify-between">
  </div>
  <div class="flex items-center">
    <div class="grow">
      <div class="flex">
        <input
            type="text"
            :name="'child_' + model.data"
            v-model="model.fullname"
            @change="dataChange"
            :id="'child_' + model.data"
            class="
          mt-1
          focus:ring-indigo-500 focus:border-indigo-500
          block
          w-full
          shadow-sm
          sm:text-sm
          border-gray-300
          rounded-md
        "
            required
        />
        <button
            type="button"
            @click="deleteChild()"
            class="
          text-xs
          py-1
          px-3
          rounded-sm
          border border-transparent
          text-red-500
          hover:border-red-600
        "
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
          >
            <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

    </div>

  </div>

  <hr class="my-4" />
</template>

<script setup>
// import { v4 as uuidv4 } from "uuid";
import { computed, ref } from "@vue/reactivity";

const props = defineProps({
  child: Object,
  index: Number,
});

const emit = defineEmits(["change", "addChild", "deleteChild"]);

// Re-create the whole question data to avoid unintentional reference change
const model = ref(JSON.parse(JSON.stringify(props.child)));

function upperCaseFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function typeChange() {
  dataChange();
}

// Emit the data change
function dataChange() {
  const data = model.value;

  emit("change", data);
}

function addChild() {
  emit("addChild", props.index + 1);
}

function deleteChild() {
  emit("deleteChild", props.child);
}
</script>

<style></style>
