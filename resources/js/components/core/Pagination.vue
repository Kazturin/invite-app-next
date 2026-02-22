<template>
  <nav aria-label="Page navigation">
    <ul class="flex justify-center space-x-4">
      <li :class="{ disabled: currentPage === 1 }">
        <t-button text="Артқа" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"/>
      </li>
      <!-- <li v-for="page in pages" :key="page">
        <button :class="{ active: page === currentPage }" @click="goToPage(page)">{{ page }}</button>
      </li> -->
      <li :class="{ disabled: currentPage === totalPages }">
        <t-button text="Келесі" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"/>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import TButton from './TButton.vue';

const props = defineProps({
  currentPage: Number,
  totalPages: Number
});

const emit = defineEmits(['page-changed']);

const pages = computed(() => {
  const result = [];
  for (let i = 1; i <= props.totalPages; i++) {
    result.push(i);
  }
  return result;
});

function goToPage(page) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return;
  emit('page-changed', page);
}
</script>

<style scoped>
/* .pagination {
  display: flex;
  list-style: none;
  padding: 0;
}

.pagination li {
  margin: 0 5px;
}

.pagination button {
  background: none;
  border: 1px solid #ccc;
  padding: 5px 10px;
  cursor: pointer;
}

.pagination button:disabled {
  cursor: not-allowed;
}

.pagination .active {
  font-weight: bold;
} */
</style>
