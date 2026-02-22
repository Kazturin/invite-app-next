<template xmlns="http://www.w3.org/1999/html">
    <div>
        <div class="flex justify-center flex-col max-w-[750px] mx-6 sm:mx-auto mb-10">
            <!-- component -->
            <div class="mb-4">
                <Breadcrumbs :links="[{ name: $t('my_events'), to: { name: 'MyEvents' } }, { name: myEvent?.title }]" />
            </div>
            <ul class="flex justify-center mb-0 list-none p-3 pb-4 flex-row">
                <li class="-mb-px mr-2 w-48 last:mr-0 text-center">
                    <button
                        class="w-full text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal cursor-pointer"
                        v-on:click="toggleTabs(1)"
                        v-bind:class="{ 'text-theme-primary bg-white border border-gray-200': openTab !== 1, 'text-white bg-theme-primary': openTab === 1 }">
                        {{ $t('info') }}
                    </button>
                </li>
                <li class="-mb-px mr-2 w-48 last:mr-0 text-center">
                    <button :disabled="loading"
                        class="w-full text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                        v-on:click="toggleTabs(2)"
                        v-bind:class="{ 'text-theme-primary bg-white border border-gray-200': openTab !== 2, 'text-white bg-theme-primary': openTab === 2 }">
                        {{ $t('guests') }}
                    </button>
                </li>
                <li class="-mb-px mr-2 w-48 last:mr-0 text-center">
                    <button :disabled="loading"
                        class="w-full text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                        v-on:click="toggleTabs(3)"
                        v-bind:class="{ 'text-theme-primary bg-white border border-gray-200': openTab !== 3, 'text-white bg-theme-primary': openTab === 3 }">
                        {{ $t('invitation') }}
                    </button>
                </li>
            </ul>
            <div
                class="relative flex flex-col w-full max-w-[750px] mx-auto my-2 bg-white rounded-md shadow-lg border border-gray-200">
                <div class="">
                    <div class="tab-content tab-space">
                        <div v-bind:class="{ 'hidden': openTab !== 1, 'block': openTab === 1 }">
                            <div v-if="loading" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                                <spinner />
                            </div>
                            <div v-else-if="myEvent" class="flex flex-col sm:flex-row animate-fade-in-down">
                                <div class="w-64 h-72 relative mx-auto">
                                    <img class="w-52 absolute inset-0 -rotate-12 m-auto"
                                        :src="myEvent.invitation.template.envelope_img" alt="">
                                    <img class="w-40 absolute inset-0 shadow-gray-500 shadow-2xl m-auto"
                                        :src="myEvent.invitation.invitation_img" alt="">
                                </div>
                                <div class="p-8 grow">
                                    <div class="flex justify-between">
                                        <div class="mb-4 font-semibold text-gray-600">
                                            {{ myEvent.title }}
                                        </div>

                                        <div class="flex items-center">
                                            <router-link v-if="myEvent.order.status !== 2" class="mr-2 text-gray-500"
                                                :to="{ name: 'EventUpdate', params: { id: myEvent.id } }" title="Өңдеу">
                                                <PencilIcon class="w-5" />
                                            </router-link>
                                            <button title="Өшіру">
                                                <TrashIcon @click="deleteEvent(myEvent.id)"
                                                    class="text-red-500 w-5 h-5 cursor-pointer" />
                                            </button>
                                        </div>
                                    </div>
                                    <div v-if="myEvent.order.status == 2"
                                        class="w-min px-3 py-1 rounded text-sm text-white mb-3"
                                        :style="{ backgroundColor: myEvent.order.color }">
                                        {{ myEvent.order.statusLabel }}
                                    </div>

                                    <div class="mb-4 flex items-center border-b border-gray-300 pb-4">
                                        <ClockIcon class="w-6 h-6 mr-2" /> <span>{{ myEvent.date }}</span>
                                    </div>
                                    <div class="flex text-sm text-gray-500">
                                        <div class="mr-4">
                                            <div v-if="myEvent.slug" class="mt-6 flex items-center">

                                                <GlobeAltIcon class="w-6 h-6 mr-2" /> <router-link
                                                    :to="{ name: 'Invitation', params: { slug: myEvent.slug, lang: currentLanguage } }"
                                                    target='_blank'>Сайт</router-link>
                                            </div>
                                            <div class="mt-6 flex items-center">
                                                <ArrowDownOnSquareIcon class="w-6 h-6 mr-2" />
                                                <a :download="myEvent.title"
                                                    :href="myEvent.invitation.invitation_img">{{
                                                        $t('download_invitation') }}</a>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="mt-6 flex items-center">
                                                <CheckIcon class="w-6 h-6 mr-2" /> <span>{{ $t('accepted_guests') }}: {{
                                                    acceptedGuestsCount }}</span>
                                            </div>
                                            <div class="mt-6 flex items-center">
                                                <XMarkIcon class="w-6 h-6 mr-2" /> <span>{{ $t('rejected_guests') }}: {{
                                                    rejectedGuestsCount }}</span>
                                            </div>
                                            <div class="mt-6 flex items-center">
                                                <UserGroupIcon class="w-6 h-6 mr-2" /> <span>{{ $t('total_guests') }}:
                                                    {{ totalGuests() }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="guests.length > 0" class="mx-auto border-t border-gray-300 mt-6 w-full">
                                        <DonutChart class="mt-4" :inputData="chartData" />
                                    </div>
                                    <div v-else class="text-sm text-gray-500">
                                        {{ $t('no_answers') }}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div v-bind:class="{ 'hidden': openTab !== 2, 'block animate-fade-in-down': openTab === 2 }">
                            <div v-if="myEvent">
                                <Guests :guests="guests" @delete="deleteGuest" :event_id="myEvent.id" />
                            </div>
                        </div>
                        <div v-bind:class="{ 'hidden': openTab !== 3, 'block animate-fade-in-down': openTab === 3 }">
                            <div class="p-4 lg:p-10">
                                <div class="border-2 border-theme-secondary rounded-md mb-6">
                                    <p class="text-xl text-center mb-4 bg-theme-secondary text-white p-2">Жалпы шақыру
                                    </p>
                                    <ul class="flex justify-center items-center">
                                        <li>
                                            <share-link :params="{ u: getUrl }"
                                                socialUrl="https://www.facebook.com/sharer/sharer.php"
                                                svg-path="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                                        </li>
                                        <li>
                                            <whatsup-share :params="{ text: getUrl }" />
                                        </li>
                                        <li>
                                            <share-link :params="{ url: getUrl }" socialUrl="https://t.me/share/url"
                                                svg-path="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z" />
                                        </li>
                                    </ul>
                                </div>

                                <div v-if="getUrl" class="border-2 border-theme-secondary rounded-md">
                                    <p class="text-xl text-center mb-4 bg-theme-secondary text-white p-2">Жеке шақыру
                                    </p>
                                    <div class="p-4">
                                        <PersonallyInviteGuest :guests="personallyInvitedGuests" :url="getUrl"
                                            @saved="successNotify" />

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>

import { defineAsyncComponent, onMounted } from 'vue';
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router"
import { ref } from "@vue/reactivity";
import { useI18n } from "vue-i18n";

const Breadcrumbs = defineAsyncComponent(() =>
    import('../components/core/Breadcrumbs.vue')
)

const Guests = defineAsyncComponent(() =>
    import('../components/Guests.vue')
)
const Spinner = defineAsyncComponent(() =>
    import('../components/core/Spinner.vue')
)
const DonutChart = defineAsyncComponent(() =>
    import('../components/DonutChart.vue')
)
const WhatsupShare = defineAsyncComponent(() =>
    import('../components/share/WhatsupShare.vue')
)
const ShareLink = defineAsyncComponent(() =>
    import('../components/share/ShareLink.vue')
)
const ClockIcon = defineAsyncComponent(() =>
    import('@heroicons/vue/24/outline/esm/ClockIcon')
)
const GlobeAltIcon = defineAsyncComponent(() =>

    import('@heroicons/vue/24/outline/esm/GlobeAltIcon')
)
const ArrowDownOnSquareIcon = defineAsyncComponent(() =>
    import('@heroicons/vue/24/outline/esm/ArrowDownOnSquareIcon')
)
const CheckIcon = defineAsyncComponent(() =>
    import('@heroicons/vue/24/outline/esm/CheckIcon')
)
const XMarkIcon = defineAsyncComponent(() =>
    import('@heroicons/vue/24/outline/esm/XMarkIcon')
)
const UserGroupIcon = defineAsyncComponent(() =>
    import('@heroicons/vue/24/outline/esm/UserGroupIcon')
)
const TrashIcon = defineAsyncComponent(() =>
    import('@heroicons/vue/24/outline/esm/TrashIcon')
)
const PencilIcon = defineAsyncComponent(() =>
    import('@heroicons/vue/24/outline/esm/PencilIcon')
)
const PersonallyInviteGuest = defineAsyncComponent(() =>
    import('../components/PersonallyInviteGuest.vue')
)

const store = useStore();
const route = useRoute();
const router = useRouter();

const chartData = computed(() => [
    ['Жауап', 'Саны'],
    ['Барамын', acceptedGuestsCount.value],
    ['Бара алмаймын', rejectedGuestsCount.value]
]);

const openTab = ref(1);
const baseUrl = window.location.origin;

const guests = computed(() => store.state.app.guests);
const myEvent = computed(() => store.state.app.event.data);
const loading = computed(() => store.state.app.event.loading);
const getUrl = computed(() => {
    if (!myEvent.value) {
        return null
    }
    return `${baseUrl}/toi/${myEvent.value.slug}/${locale.value}`
});


const { locale } = useI18n();
const currentLanguage = locale.value;

const acceptedGuestsCount = computed(() => {
    return guests.value.filter((item) => item.status === 1).length;
});
const rejectedGuestsCount = computed(() => {
    return guests.value.filter((item) => item.status === 0).length;
});

function totalGuests() {
    let count = 0;
    guests.value.forEach((element) => {
        if (element.status === 1) {
            count++;
            count += element.child.length
        }
    });
    return count;
}

function toggleTabs(tabNumber) {
    openTab.value = tabNumber
}
function deleteGuest(id) {
    if (confirm('Өшіруге сенімдісіз бе?')) {
        store.dispatch('app/deleteGuest', id).then(() => {
            store.dispatch('app/getGuests', route.params.id);
            store.commit("notify", {
                type: "success",
                message: "Өшірілді",
            });
        });
    }

}
function deleteEvent(id) {
    if (
        confirm(
            `Өшіруге сенімдісіз бе? Өшірілгеннен кейін қайта қалпына келмейді!!`
        )
    ) {
        store.dispatch("app/deleteEvent", id).then(() => {
            store.commit("notify", {
                type: "success",
                message: "Сәтті өшірілді",
            });
            console.log('deleted')
            router.push({ name: 'MyEvents' })
        });
    }
}

const personallyInvitedGuests = computed(() => {
    return guests.value.filter((item) => item.personally_invited);
});

function successNotify() {
    console.log('successNotify');
    store.commit('notify', {
        type: "success",
        message: "Сәтті сақталды"
    })
}

onMounted(() => {
    store.dispatch("app/getEvent", route.params.id);
    store.dispatch('app/getGuests', route.params.id);
});

// export default {
//     components: { Guests }
// }

</script>

<style scoped></style>