<template>
  <div class="countdown-container py-4">
    <div class="flex justify-center items-center gap-3 sm:gap-6" v-if="currentTime">
      <!-- Days -->
      <div class="flex flex-col items-center transition-transform duration-300 group" v-if="days">
        <div
          class="relative flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 bg-white border border-yellow-200 rounded-2xl shadow-lg mb-2 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-yellow-400 font-bold text-xl sm:text-2xl text-gray-800">
          <span class="z-10">{{ days }}</span>
          <div class="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
          </div>
        </div>
        <span class="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-semibold">{{
          $t('invitation_page.day') }}</span>
      </div>

      <!-- Hours -->
      <div class="flex flex-col items-center transition-transform duration-300 group" v-if="hours">
        <div
          class="relative flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 bg-white border border-yellow-200 rounded-2xl shadow-lg mb-2 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-yellow-400 font-bold text-xl sm:text-2xl text-gray-800">
          <span class="z-10">{{ hours }}</span>
          <div class="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
          </div>
        </div>
        <span class="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-semibold">{{
          $t('invitation_page.hour') }}</span>
      </div>

      <!-- Minutes -->
      <div class="flex flex-col items-center transition-transform duration-300 group">
        <div
          class="relative flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 bg-white border border-yellow-200 rounded-2xl shadow-lg mb-2 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-yellow-400 font-bold text-xl sm:text-2xl text-gray-800">
          <span class="z-10">{{ minutes }}</span>
          <div class="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
          </div>
        </div>
        <span class="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-semibold">минут</span>
      </div>

      <!-- Seconds -->
      <div class="flex flex-col items-center transition-transform duration-300 group">
        <div
          class="relative flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 bg-white border border-yellow-200 rounded-2xl shadow-lg mb-2 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-yellow-400 font-bold text-xl sm:text-2xl text-gray-800">
          <span class="z-10 text-yellow-600">{{ seconds }}</span>
          <div class="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
          </div>
        </div>
        <span class="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-semibold">секунд</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script>
export default {
  props: {
    deadline: {
      type: String,
      required: true,
    },
    speed: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      currentTime: Date.parse(this.deadline) - Date.parse(new Date())
    };
  },
  mounted() {
    setTimeout(this.countdown, 1000);
  },
  computed: {
    seconds() {
      return this.formatTime(Math.floor((this.currentTime / 1000) % 60));
    },
    minutes() {
      return this.formatTime(Math.floor((this.currentTime / 1000 / 60) % 60));
    },
    hours() {
      return this.formatTime(Math.floor((this.currentTime / (1000 * 60 * 60)) % 24));
    },
    days() {
      return this.formatTime(Math.floor(this.currentTime / (1000 * 60 * 60 * 24)));
    }
  },
  methods: {
    countdown() {
      this.currentTime = Date.parse(this.deadline) - Date.parse(new Date());
      if (this.currentTime > 0) {
        setTimeout(this.countdown, this.speed);
      } else {
        this.currentTime = null;
      }
    },
    formatTime(value) {
      if (value < 10) {
        return "0" + value;
      }
      return value;
    }
  },
}
</script>
