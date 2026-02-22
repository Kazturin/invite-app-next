<template>
  <div class="container mx-auto">
    <div class="mx-6">
      <Breadcrumbs :links="[{ name: $t('my_events') }]" />
    </div>
    <div v-if="loading" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
      <spinner />
    </div>
    <div v-else>
      <div class="animate-fade-in-down" v-if="events.length > 0">
        <div v-for="item in events" :key="item.id"
          class="flex flex-col sm:flex-row max-w-[750px] mx-6 sm:mx-auto my-2 border-gray-200 border rounded-md shadow-lg">
          <div class="w-64 h-72 relative bg-white mx-auto">
            <img class="w-52 absolute inset-0 -rotate-12 m-auto" :src="item.invitation?.template.envelope_img" alt="">
            <img class="w-40 absolute inset-0 shadow-gray-500 shadow-2xl m-auto" :src="item.invitation?.invitation_img"
              alt="">
          </div>
          <div class="p-8 grow">
            <div class="mb-4 font-semibold text-gray-600">
              {{ item.title }}
            </div>
            <div class="mb-4 flex items-center">
              <ClockIcon class="w-8 h-8 mr-2" /> <span>{{ item.date }}</span>
            </div>
            <div class="mb-6">
              <span class="mr-4">Статус:</span><span>{{ item?.order.statusLabel }}</span>
            </div>
            <div v-if="item.order?.status === 0" class="flex items-center ">
              <router-link
                class="p-2 flex mr-2 bg-theme-secondary text-white shadow-md rounded-md border border-theme-secondary hover:bg-white hover:text-theme-secondary"
                :to="{ name: 'EventUpdate', params: { id: item.id } }">
                <PencilSquareIcon class="w-6" />{{ $t('button.continue') }}
              </router-link>
              <button @click="deleteEvent(item.id)"
                class="p-2 flex bg-red-500 text-white shadow-md rounded-md border border-red-500 hover:bg-white hover:text-red-500 ml-2">
                <TrashIcon class="w-6" />{{ $t('button.delete') }}
              </button>
            </div>
            <div v-else class="flex items-center flex-wrap">
              <router-link v-if="item.order?.status === 1"
                class="p-2 mr-2 flex bg-theme-secondary text-white shadow-md rounded-md border border-theme-secondary hover:bg-white hover:text-theme-secondary"
                :to="{ name: 'EventUpdate', params: { id: item.id } }">
                <PencilSquareIcon class="w-6" /> {{ $t('button.edit') }}
              </router-link>
              <router-link
                class="p-2 mr-2 flex bg-theme-secondary shadow-md rounded-md text-white border border-theme-secondary hover:bg-white hover:text-theme-secondary"
                :to="{ name: 'MyEvent', params: { id: item.id } }">
                <EyeIcon class="w-6" /> {{ $t('button.more') }}
              </router-link>
              <button @click="deleteEvent(item.id)"
                class="p-2 flex bg-red-500 shadow-md text-white border border-red-500 rounded-md hover:bg-white hover:text-red-500 mt-2 sm:mt-0">
                <TrashIcon class="w-6" /> {{ $t('button.delete') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="max-w-[750px] mx-6 sm:mx-auto my-2 border-gray-200 border rounded-md shadow-lg p-4">
        <div>{{ $t('empty_events') }}...</div>
        <div class="mt-8">
          <router-link :to="{ name: 'Step1' }"
            class="bg-theme-primary px-6 py-2 text-white font-semibold rounded shadow-md hover:bg-white border-2 border-transparent hover:border-theme-primary hover:text-theme-primary cursor-pointer transition duration-200"
            href="#download-section">Шақырту жасау</router-link>
          <!--            <link-button btnType="primary" link="#">Шақырту жасау</link-button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { defineAsyncComponent } from "vue";
import { ClockIcon, PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/vue/24/outline'

export default {
  name: "MyEvents",
  computed: {
    ...mapState('app', {
      loading: state => state.events.loading,
      events: state => state.events.data,
    }),
  },
  components: {
    Spinner: defineAsyncComponent(() =>
      import('../components/core/Spinner.vue')
    ),
    Breadcrumbs: defineAsyncComponent(() =>
      import('../components/core/Breadcrumbs.vue')
    ),
    ClockIcon,
    PencilSquareIcon,
    TrashIcon,
    EyeIcon
  },
  methods: {
    deleteEvent(id) {
      if (
        confirm(
          `Өшіруге сенімдісіз бе? Өшірілгеннен кейін қайта қалпына келмейді!!`
        )
      ) {
        this.$store.dispatch("app/deleteEvent", id).then(() => {
          this.$store.commit("notify", {
            type: "success",
            message: "Сәтті өшірілді",
          });
        });
      }
    }
  },
  mounted() {
    this.$store.dispatch('app/getEvents')
  }
}
</script>

<style scoped></style>
