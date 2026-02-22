<template>
  <nav v-if="links" class="flex max-w-[750px] mx-auto bg-white text-theme-secondary border border-theme-secondary py-3 px-5 rounded-lg my-4" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <a href="/" class="text-theme-secondary hover:text-sky-800 inline-flex items-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
        </a>
      </li>
      <li v-for="item in links">
        <div v-if="item.to" class="flex items-center">
          <svg class="w-6 h-6 text-theme-secondary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
          <router-link :to="item.to" class="text-theme-secondary hover:text-sky-900 ml-1 md:ml-2 text-sm">{{ item.name }}</router-link>
        </div>
        <div v-else class="flex items-center">
          <svg class="w-6 h-6 text-theme-secondary" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
          <span class="text-theme-secondary ml-1 md:ml-2 text-sm font-medium">{{ item.name }}</span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup>
const props = defineProps({
  links:{
    type: Array,
    required: true
  }
})
</script>

<style scoped>

</style>