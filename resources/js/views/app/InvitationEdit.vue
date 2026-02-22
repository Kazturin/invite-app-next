<template>
  <div class="container mx-auto">
    <div v-if="loading" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
      <Spinner />
    </div>
    <Stepper
      v-model:step="step"
      :backText="$t('backStep')"
      :nextText="$t('nextStep')"
      @increment-step="incrementStep"
      @decrement-step="decrementStep"
    >
      <template #2>
        <div v-if="invitation && invitation.template">
          <InvitationTemplate
            ref="capture"
            :template="invitation.template"
            :content="invitation.content"
            :edit="true"
            :bg_img="invitation.bg_img"
            @update:content="updateContent"
            @update:bg_img="updateBgImg"
          />
        </div>
      </template>
    </Stepper>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
// import { domToJpeg } from 'modern-screenshot';
import InvitationTemplate from '../../components/invitations/InvitationTemplate.vue';

const Spinner = defineAsyncComponent(() => import('../../components/core/Spinner.vue'));
const Stepper = defineAsyncComponent(() => import('../../components/Stepper.vue'));

const store = useStore();
const router = useRouter();
const route = useRoute();

const step = ref(2);
const loading = ref(false);
const contentUpdated = ref(false);
const capture = ref(null);

const invitation = computed(() => store.state.app.invitation);

onMounted(async () => {
  await store.dispatch('app/getInvitation', route.params.id);
});

const incrementStep = async () => {

    await saveInvitationImage();
    loading.value = false;
  
  changeRoute({ name: 'EventUpdate', params: { id: invitation.value.event_id } });
};

const decrementStep = () => {
  alert('Шаблон өзгертілмейді');
};

const saveInvitationImage = async () => {
  
  loading.value = true;
  try {
    // await domToJpeg(capture.value.getInvitationHtml(), { width: 1140, height: 1620 });
    // const imageString = await domToJpeg(capture.value.getInvitationHtml(), { width: 1140, height: 1620 });
     const imageString = await capture.value.exportAsImage();
    await store.commit('app/setImage', imageString);
    const formData = new FormData();
      formData.set('content', JSON.stringify(invitation.value.content));
      formData.set('template_id', invitation.value.template_id);
      formData.set('invitation_img', invitation.value.invitation_img);
      formData.set('bg_img', invitation.value.bg_img);
      formData.set('inInvitationImage', invitation.value.inInvitationImage);
    await store.dispatch('app/saveInvitation', { id: invitation.value.id, invitation: formData });
    loading.value = false;
    return Promise.resolve(1);
  } catch (error) {
    store.commit('notify', {
      type: 'error',
      message: 'Қате!',
    });
    loading.value = false;
    return Promise.reject('Error');
  }
};

const changeRoute = (route) => {
  router.replace(route);
};

const updateContent = (newContent) => {
  store.commit('app/setContent', newContent);
};

const updateBgImg = (newBgImg) => {
  store.commit('app/setBgImg', newBgImg);
}
</script>

<style scoped>
/* Styles remain unchanged */
</style>