<template>
    <div class="flex flex-wrap items-center justify-center gap-2">
        <button @click="$emit('addText')" title="Добавить текст">
            <img src="/icons/add_text.svg" alt="Добавить текст" class="w-7 h-7 md:w-10 md:h-10">
        </button>

        <template v-if="selectedObject && selectedObject.type === 'i-text'">
            <button @click="$emit('changeFontStyle')"
                class="border-2 border-gray-400 text-gray-400 w-7 h-7 md:w-10 md:h-10 p-1 italic font-academy text-xs md:text-base flex items-center justify-center hover:bg-gray-100"
                :class="{
                    'bg-gray-200': selectedObject.fontStyle === 'italic'
                }">
                I
            </button>
            <button @click="$emit('changeFontWeight')"
                class="border-2 border-gray-400 text-gray-400 w-7 h-7 md:w-10 md:h-10 p-1 font-bold text-xs md:text-base flex items-center justify-center hover:bg-gray-100"
                :class="{ 'bg-gray-200': selectedObject.fontWeight === 'bold' }">
                B
            </button>
            <button @click="$emit('changeTextCase', 'uppercase')"
                class="border-2 border-gray-400 text-gray-400 w-7 h-7 md:w-10 md:h-10 p-1 font-bold text-xs md:text-sm flex items-center justify-center hover:bg-gray-100"
                title="Uppercase">
                AA
            </button>
            <button @click="$emit('changeTextCase', 'lowercase')"
                class="border-2 border-gray-400 text-gray-400 w-7 h-7 md:w-10 md:h-10 p-1 font-bold text-xs md:text-sm flex items-center justify-center hover:bg-gray-100"
                title="Lowercase">
                aa
            </button>

            <div class="text-center flex items-center space-x-4 border-gray-600 pr-3 border-r">
                <div class="flex items-center border-2 border-gray-500 rounded-xl overflow-hidden">
                    <div @click="$emit('changeFontSize', 2)"
                        class="select-none cursor-pointer p-1 text-xl font-semibold w-7 h-7 md:w-10 md:h-10 text-gray-500">
                        +</div>
                    <div class="flex items-center text-gray-500 border-l border-r border-gray-500">
                        <input type="number" :value="Math.round(selectedObject.fontSize)"
                            @input="$emit('setFontSize', $event.target.value)" min="20" max="176"
                            class="border-none p-0 text-xs md:text-sm w-7 h-7 md:w-10 md:h-10 font-semibold text-center">
                    </div>
                    <div @click="$emit('changeFontSize', -2)"
                        class="select-none cursor-pointer p-1 text-xl font-semibold w-7 h-7 md:w-10 md:h-10 text-gray-500">
                        -</div>
                </div>
            </div>

            <div class="flex items-center space-x-4 border-r border-gray-600 pr-3 md:pr-6">
                <input type="color" class="w-7 h-7 md:w-10 md:h-10 rounded-md" :value="selectedObject.fill"
                    @input="$emit('changeTextColor', $event.target.value)">
            </div>

            <button class="text-gray-500 border-r border-gray-600 pr-3 md:pr-6" @click="$emit('centerText')"
                title="Центрировать текст">
                <svg class="mx-auto w-7 h-7 md:w-10 md:h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="m6 17.75c0-.414.336-.75.75-.75h10.5c.414 0 .75.336.75.75s-.336.75-.75.75h-10.5c-.414 0-.75-.336-.75-.75zm-4-4c0-.414.336-.75.75-.75h18.5c.414 0 .75.336.75.75s-.336.75-.75.75h-18.5c-.414 0-.75-.336-.75-.75zm0-4c0-.414.336-.75.75-.75h18.5c.414 0 .75.336.75.75s-.336.75-.75.75h-18.5c-.414 0-.75-.336-.75-.75zm4-4c0-.414.336-.75.75-.75h10.5c.414 0 .75.336.75.75s-.336.75-.75.75h-10.5c-.414 0-.75-.336-.75-.75z"
                        fill-rule="nonzero" />
                </svg>
            </button>

            <div class="text-left">
                <select :value="selectedObject.fontFamily" @change="$emit('changeFont', $event.target.value)"
                    class="rounded-md p-1 md:p-2">
                    <option v-for="font in fonts" :key="font.key" :value="font.key" class="text-base md:text-lg">{{
                        font.name }}</option>
                </select>
            </div>

            <TrashIcon @click="$emit('deleteSelected')" class="text-red-500 w-7 h-7 md:w-10 md:h-10 cursor-pointer" />
        </template>

        <p v-else class="text-2xl md:text-3xl font-baltica">{{ $t('select_text') }}</p>
    </div>
</template>

<script setup>
import { TrashIcon, ItalicIcon, BoldIcon } from '@heroicons/vue/24/outline';

defineProps({
    selectedObject: {
        type: Object,
        default: null
    },
    fonts: {
        type: Array,
        required: true
    }
});

defineEmits([
    'addText',
    'changeFontStyle',
    'changeFontWeight',
    'changeFontSize',
    'setFontSize',
    'changeTextColor',
    'centerText',
    'changeFont',
    'deleteSelected',
    'changeTextCase'
]);
</script>
