<template>
  <div class="rounded-md overflow-hidden">
    <div class="tab__header bg-gradient-to-tr from-indigo-500 to-indigo-700">
      <a href="#" class="tab__link p-4 block bg-blue-dark hover:bg-blue-darker no-underline text-white flex justify-between" @click.prevent="active = !active">
        <strong>{{title}}</strong>
        <span class="down-Arrow" v-show="!active">&#9660;</span>
        <span class="up-Arrow" v-show="active">&#9650;</span>
      </a>
    </div>
    <div class="tab__content p-2 bg-white" v-show="active"><slot /></div>
  </div>
</template>

<script>
export default {
name: "Accordion",
  props: [
    'title'
  ],
  data() {
    return {
      active: false,
    }
  },
}
</script>

<style scoped>

</style>
