<template>
    <div class="flex justify-center space-x-2 overflow-x-auto py-2 bg-gray-100 border-b border-gray-300">
        <div class="slider-container">
            <div class="slider">
                <div v-for="(image, index) in backgroundImages" :key="index" class="slider-item"
                    :class="{ 'selected': currentBg === image.original }"
                    @click="$emit('changeBackground', image.original)">
                    <img :src="image.thumbnail" alt="Background" class="slider-image" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    backgroundImages: {
        type: Array,
        required: true
    },
    currentBg: {
        type: String,
        default: ''
    }
});

defineEmits(['changeBackground']);
</script>

<style scoped>
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
