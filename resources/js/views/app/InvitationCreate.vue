<template>
  <div class="container mx-auto">
    <div v-if="loading" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
      <Spinner />
    </div>
    <Stepper v-model:step="step" :backText="$t('backStep')" :nextText="$t('nextStep')" @increment-step="incrementStep"
      @decrement-step="decrementStep">
      <template #2>
        <div v-if="template && template.content">
          <InvitationTemplate :key="template.id" ref="captureRef" :template="template" :content="template.content"
            :bg_img="null" @update:content="updateContent" @update:bg_img="updateBgImg" />
        </div>
        <div v-else class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <Spinner />
        </div>
      </template>
    </Stepper>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import Stepper from "../../components/Stepper.vue";
import Spinner from "../../components/core/Spinner.vue";
import InvitationTemplate from "../../components/invitations/InvitationTemplate.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();

const loading = ref(false);
const step = ref(2);
const captureRef = ref(null);

const template = computed(() => store.state.app.template.data);

const updateContent = (newContent) => {
  store.commit('app/setContent', newContent);
};

const updateBgImg = (newBgImg) => {
  store.commit('app/setBgImg', newBgImg);
}

const incrementStep = async () => {
  if (!captureRef.value) return;

  // 1. Экспортируем изображение
  const imageString = await captureRef.value.exportAsImage();
  console.log(imageString);
  if (imageString) {
    store.commit('app/setImage', imageString);
  } else {
    console.error('Не удалось экспортировать изображение.');
    return;
  }

  // 2. Состояние `content` уже актуально в Vuex благодаря событию @update:content
  // Просто переходим на следующий шаг
  router.replace({ name: "Step3", params: { id: route.params.id } });
};

const decrementStep = () => {
  router.replace({ name: "Step1" });
};

onMounted(() => {
  store.dispatch('app/getTemplate', route.params.id).then(templateData => {
    // Инициализируем контент приглашения контентом из шаблона
    if (templateData.content) {
      store.commit('app/setContent', templateData.content)
    }
  });
});
</script>