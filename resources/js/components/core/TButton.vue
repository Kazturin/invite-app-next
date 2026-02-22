<template>
   <button 
       class="bg-theme-primary px-6 py-2 text-white font-semibold rounded disabled:opacity-70 shadow-md border-2 border-transparent disabled:cursor-not-allowed cursor-pointer transition duration-200">
          {{ text }}
        </button>
  </template>
  
  <script setup>
  
  const props = defineProps({
    text: String,
  });
  </script>
  
  <style></style>
  