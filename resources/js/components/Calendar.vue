<template>
  <div class="bg-white rounded-md drop-shadow-lg overflow-hidden">
    <section class="py-2 px-4 text-white bg-gradient-to-r from-[#dbaf97] to-[#b77856]">
      <h1 class="text-center text-md font-semibold">{{ currentMonthInName() }} {{ currentYear }}</h1>
    </section>
    <section>
      <div class="text-center grid grid-cols-7">
        <p class="p-2" v-for="(day, index) in days[locale]" :key="index">{{ day }}</p>
      </div>
    </section>
    <section>
      <div class="p-2 grid grid-cols-7 w-full text-center">
        <p class="py-4 text-gray-200" v-for="day in daysNumber[startDay()] - 1" :key="'empty-' + day"> · </p>
        <div v-for="date in daysInMonth(currentYear, currentMonthInNumber)" :key="date"
          class="relative py-2 flex justify-center items-center">
          <p :class="[
            'w-10 h-10 flex justify-center items-center rounded-full transition-all duration-300',
            date === currentDay ? 'bg-theme-secondary text-white shadow-lg scale-110 z-10' : 'text-gray-500 hover:bg-gray-50'
          ]">
            {{ date }}
          </p>
          <!-- Heart indicator for the event day -->
          <div v-if="date === currentDay" class="absolute -top-1 -right-1 text-red-500 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const props = defineProps({
  date: String,
});

const days = {
  kk: ["дс", "сс", "ср", "бс", "жм", "сб", "жб"],
  ru: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
}
const months = {
  kk: [
    "Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр", "Маусым",
    "Шілде", "Тамыз", "Қыркүйек", "Қазан", "Қараша", "Желтоқсан"
  ],
  ru: [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ]
}

const currentYear = new Date(props.date).getFullYear();
const currentMonthInNumber = new Date(props.date).getMonth();
const currentDay = new Date(props.date).getDate();

const daysNumber = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 0: 7 };

function currentMonthInName() {
  return months[locale.value][currentMonthInNumber];
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function startDay() {
  return new Date(currentYear, currentMonthInNumber, 1).getDay();
}
</script>

<style scoped></style>
