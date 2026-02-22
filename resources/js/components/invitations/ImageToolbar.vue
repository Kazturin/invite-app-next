<template>
    <div class="flex justify-center items-center gap-4 py-4">
        <button @click="triggerFileInput" class="bg-blue-500 text-white px-6 py-3 rounded-lg text-2xl">
            Суретті өзгерту
        </button>
        <template v-if="selectedObject && selectedObject.isUserImage">
            <TrashIcon @click="$emit('deleteSelected')" class="text-red-500 w-7 h-7 md:w-10 md:h-10 cursor-pointer" />
        </template>
        <input ref="fileInput" type="file" @change="onImageChoose" class="hidden" accept="image/*" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { TrashIcon } from '@heroicons/vue/24/outline';

defineProps({
    selectedObject: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['deleteSelected', 'addImage']);

const fileInput = ref(null);

const triggerFileInput = () => {
    fileInput.value?.click();
};

const onImageChoose = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    emit('addImage', file);
    event.target.value = '';
};
</script>
