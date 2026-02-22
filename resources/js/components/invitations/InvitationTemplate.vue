<template>
  <div class="relative">
    <div class="flex space-x-4 justify-center items-center py-4">
      <div @click="editBlock = 'text'" class="cursor-pointer text-center"
        :class="{ 'text-blue-500': editBlock === 'text' }">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-auto" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M22 0h-20v6h1.999c0-1.174.397-3 2.001-3h4v16.874c0 1.174-.825 2.126-2 2.126h-1v2h9.999v-2h-.999c-1.174 0-2-.952-2-2.126v-16.874h4c1.649 0 2.02 1.826 2.02 3h1.98v-6z" />
        </svg>
        <p>Текст</p>
      </div>
      <div @click="editBlock = 'bg'" class="cursor-pointer text-center"
        :class="{ 'text-blue-500': editBlock === 'bg' }">
        <PhotoIcon class="w-7 h-7 mx-auto" />
        <p>{{ $t('button.background_color') }}</p>
      </div>
      <!-- <div @click="editBlock = 'image'" class="cursor-pointer text-center"
        :class="{ 'text-blue-500': editBlock === 'image' }">
        <svg class="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
        <p>Изображение</p>
      </div> -->
    </div>
    {{ content }}
    <div class="w-full max-w-lg mx-auto mb-4">
      <div class="bg-white border-gray-600 border my-2">
        <div class="min-h-[120px] flex flex-wrap items-center justify-center gap-2 px-4 py-2">

          <TextToolbar v-if="editBlock === 'text'" :selectedObject="selectedObject" :fonts="FONTS" @addText="addText"
            @changeFontStyle="changeFontStyle" @changeFontWeight="changeFontWeight" @changeFontSize="changeFontSize"
            @setFontSize="setFontSize" @changeTextColor="changeTextColor" @centerText="centerText"
            @changeFont="changeFont" @deleteSelected="deleteSelected" @changeTextCase="changeTextCase" />

          <BackgroundToolbar v-if="editBlock === 'bg'" :backgroundImages="BACKGROUND_IMAGES" :currentBg="bgImg"
            @changeBackground="changeBackground" />

          <ImageToolbar v-if="editBlock === 'image'" :selectedObject="selectedObject" @addImage="addImage"
            @deleteSelected="deleteSelected" />

        </div>
      </div>
    </div>
    <div :style="{ backgroundImage: `url(${bgImg})` }"
      class="relative block h-[700px] sm:h-[900px] bg-no-repeat bg-cover mb-10 flex justify-center items-center p-4">
      <div ref="canvasWrapper" class="relative w-full h-full max-w-lg">


        <div class="relative z-10">
          <canvas ref="fabricCanvas" class="border-amber-500 border top-0 left-0"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import { PhotoIcon } from '@heroicons/vue/24/outline';
import { useFabric } from '../../composables/useFabric';
import { FONTS, BACKGROUND_IMAGES } from '../../data/invitation-constants';
import TextToolbar from './TextToolbar.vue';
import BackgroundToolbar from './BackgroundToolbar.vue';
import ImageToolbar from './ImageToolbar.vue';

const props = defineProps({
  template: { type: Object, required: true },
  content: { required: true },
  edit: { type: Boolean },
  bg_img: { type: String },
});

const emit = defineEmits(['update:content', 'update:bg_img']);

const editBlock = ref('text');
const bgImg = ref(null);

const {
  fabricCanvas,
  canvasWrapper,
  selectedObject,
  initCanvas,
  loadCanvasState,
  setupResizeObserver,
  resizeCanvas,
  addText,
  changeFontSize,
  setFontSize,
  changeTextColor,
  changeFontStyle,
  changeFontWeight,
  centerText,
  changeFont,
  changeTextCase,
  deleteSelected,
  addImage,
  exportAsImage
} = useFabric(props, emit);

const changeBackground = (image) => {
  bgImg.value = image;
  emit('update:bg_img', image);
};

// Watch for selection changes to switch tabs
watch(selectedObject, (newObj) => {

  if (newObj) {
    if (newObj.type === 'i-text') {
      editBlock.value = 'text';
    } else if (newObj.type === 'image') {
      console.log(newObj.type)
      editBlock.value = 'image';
    }
  }
});

onMounted(async () => {
  await nextTick();
  initCanvas();
  await loadCanvasState();
  setupResizeObserver();

  // Initial resize
  await new Promise(resolve => setTimeout(resolve, 100));
  resizeCanvas();

  bgImg.value = props.bg_img || BACKGROUND_IMAGES[0]?.original;
  if (bgImg.value) {
    emit('update:bg_img', bgImg.value);
  }
});

defineExpose({
  exportAsImage
});
</script>
<style scoped>
/* Ваши стили остаются без изменений */
.slider-container {
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
}

.slider {
  display: flex;
  gap: 10px;
}

.slider-item {
  flex: 0 0 auto;
  width: 60px;
  height: 60px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.3s;
}

.slider-item.selected {
  border-color: #007bff;
}

.slider-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
</style>