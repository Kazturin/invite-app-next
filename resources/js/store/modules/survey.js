import axios from "../../axios";

export default {
    namespaced: true,
    state: () => ({
        survey: null,
        selectedAnswer: '',
        answersStats: null, // Добавляем статистику
        totalAnswers: 0, // Всего ответов
        userHasAnswered: false,
        errorMessage: ''
    }),
    mutations: {
        SET_SURVEY(state, survey) {
            state.survey = survey;
        },
        SET_SELECTED_ANSWER(state, answer) {
            state.selectedAnswer = answer;
        },
        SET_ANSWERS_STATS(state, stats) {
            state.answersStats = stats;
            state.totalAnswers = Object.values(stats).reduce((acc, count) => acc + count, 0);
        },
        SET_USER_HAS_ANSWERED(state, hasAnswered) {
            state.userHasAnswered = hasAnswered;
        },
        SET_ERROR_MESSAGE(state, message) {
            state.errorMessage = message;
        }
    },
    actions: {
        async fetchSurvey({ commit }) {
            try {
                const { data } = await axios.get('/survey');
                commit('SET_SURVEY', data.survey);
                commit('SET_ANSWERS_STATS', data.stats); // Загружаем статистику
                commit('SET_USER_HAS_ANSWERED', data.userHasAnswered);
            } catch (error) {
                console.error(error);
            }
        },
        async submitAnswer({ state, commit, dispatch }) {
            if (!state.selectedAnswer) return;

            try {
                await axios.post('/survey/answer', {
                    survey_id: state.survey.id,
                    answer: state.selectedAnswer
                });

                await dispatch('fetchSurvey'); // Обновляем данные после ответа
            } catch (error) {
                commit('SET_ERROR_MESSAGE', error.response.data.message);
            }
        }
    }
};
