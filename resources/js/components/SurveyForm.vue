<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const survey = computed(() => store.state.survey.survey);
const selectedAnswer = computed({
    get: () => store.state.survey.selectedAnswer,
    set: (value) => store.commit('survey/SET_SELECTED_ANSWER', value)
});
const answersStats = computed(() => store.state.survey.answersStats);
const totalAnswers = computed(() => store.state.survey.totalAnswers);
const userHasAnswered = computed(() => store.state.survey.userHasAnswered);
const errorMessage = computed(() => store.state.survey.errorMessage);

onMounted(() => {
    store.dispatch('survey/fetchSurvey');
});

const submitAnswer = () => {
    store.dispatch('survey/submitAnswer');
};
</script>

<template>
    <div v-if="survey"
        class="max-w-[750px] bg-white rounded-md shadow-lg  animate-fade-in-down border border-gray-200 mx-auto mt-4 mb-10 p-8">
        <h2 class="font-baltica text-lg font-bold mb-4">{{ survey.question }}</h2>

        <!-- Блок с вопросами -->
        <div v-if="!userHasAnswered">
            <div v-for="option in survey.options" :key="option" class="mb-2">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="selectedAnswer" :value="option.option" class="mr-2" />
                    {{ option.option }}
                </label>
            </div>
            <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
            <button @click="submitAnswer" class="mt-4 bg-theme-primary text-white px-4 py-2 rounded">
                Жауап беру
            </button>
        </div>

        <!-- Блок с результатами -->
        <div v-else>
            <p class="animate-fade-in-down text-lg text-green-600">Жауап бергеніңізге рақмет!</p>
            <h3 class="text-md font-semibold mt-4">Нәтиже:</h3>
            <div v-for="(count, option) in answersStats" :key="option" class="mt-2">
                <div class="flex justify-between items-center">
                    <span>{{ option }}</span>
                    <span>{{ ((count / totalAnswers) * 100).toFixed(1) }}%</span>
                </div>
                <div class="w-full bg-gray-200 h-2 rounded">
                    <div class="bg-theme-primary h-2 rounded " :style="{ width: ((count / totalAnswers) * 100) + '%' }">
                    </div>
                </div>
            </div>
            <p class="text-sm text-gray-500 mt-4">Барлық жауаптар: {{ totalAnswers }}</p>
        </div>
    </div>
</template>
