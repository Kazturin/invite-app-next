<template>
    <div v-if="images && images.length > 0" class="my-8">
        <h2 class="text-2xl font-semibold text-center mb-6 text-gray-800 font-baltica">{{ title }}</h2>

        <!-- Grid Layout -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 px-4 sm:px-0">
            <div v-for="(image, index) in images" :key="index"
                class="relative group cursor-pointer overflow-hidden rounded-lg shadow-md aspect-square"
                @click="openLightbox(index)">
                <img :src="getImageUrl(image)"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    alt="Gallery Image" />
                <div
                    class="absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div
                        class="bg-white/20 backdrop-blur-md rounded-full p-4 transform scale-50 group-hover:scale-100 transition-transform duration-300 border border-white/30 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lightbox Modal -->
        <Transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm"
                @click.self="closeLightbox">
                <!-- Close Button -->
                <button @click="closeLightbox"
                    class="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none z-50 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Navigation Buttons -->
                <button v-if="images.length > 1" @click.stop="prevImage"
                    class="absolute left-4 text-white hover:text-gray-300 focus:outline-none z-50 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button v-if="images.length > 1" @click.stop="nextImage"
                    class="absolute right-4 text-white hover:text-gray-300 focus:outline-none z-50 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <!-- Main Image -->
                <div class="relative max-w-full max-h-screen p-4 flex items-center justify-center">
                    <Transition name="slide" mode="out-in">
                        <img :key="currentIndex" :src="getImageUrl(images[currentIndex])"
                            class="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl rounded-sm select-none"
                            alt="Gallery Image" @click.stop />
                    </Transition>
                </div>

                <!-- Counter -->
                <div
                    class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded-full">
                    {{ currentIndex + 1 }} / {{ images.length }}
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
    images: {
        type: Array,
        required: true,
        default: () => []
    },
    title: {
        type: String,
        default: 'Фотогалерея'
    }
});

const isOpen = ref(false);
const currentIndex = ref(0);

const getImageUrl = (image) => {
    if (typeof image === 'string') {
        return image;
    }
    return image.path ? `/storage/${image.path}` : image.url;
};

const openLightbox = (index) => {
    currentIndex.value = index;
    isOpen.value = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
};

const closeLightbox = () => {
    isOpen.value = false;
    document.body.style.overflow = ''; // Restore scrolling
};

const nextImage = () => {
    currentIndex.value = (currentIndex.value + 1) % props.images.length;
};

const prevImage = () => {
    currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
};

const handleKeydown = (e) => {
    if (!isOpen.value) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    } else if (e.key === 'ArrowLeft') {
        prevImage();
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = ''; // Ensure scrolling is restored
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: scale(0.95);
}

.slide-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
