<template>
    <div class="container mx-auto mt-6">
        <div v-if="loading" class="absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2 ">
            <div
                class="border-t-transparent border-solid animate-spin  rounded-full border-blue-500 border-2 w-12 h-12">
            </div>
        </div>
        <div class="mx-5" v-else>
            <div
                class="flex flex-col sm:flex-row max-w-[750px] mx-auto bg-white animate-fade-in-up rounded-md shadow-lg text-gray-500 border border-gray-200">
                <div v-if="eventDetails.invitation" class="w-64 h-72 relative bg-white mx-auto sm:mx-0">
                    <img class="w-52 absolute inset-0 -rotate-12 m-auto animate-fade-in-down"
                        :src="eventDetails.invitation.template?.envelope_img" alt="env">
                    <img v-if="watermarkInvitation" ref="image"
                        class="w-40 absolute inset-0 drop-shadow-2xl m-auto animate-fade-in-down"
                        :src="watermarkInvitation" alt="inv">
                    <canvas ref="test" style="display: none;"></canvas>
                </div>
                <div class="p-8 font-baltica">
                    <div class="flex justify-between">
                        <div class="mb-4 font-semibold text-gray-600">
                            {{ eventDetails.title }}
                        </div>
                        <div class="flex items-center">
                            <router-link class="mr-2 text-gray-500"
                                :to="{ name: 'EventUpdate', params: { id: eventDetails.id } }" title="Өңдеу">
                                <PencilIcon class="w-5" />
                            </router-link>
                            <button title="Өшіру">
                                <TrashIcon @click="deleteEvent(eventDetails.id)"
                                    class="text-red-500 w-5 h-5 cursor-pointer" />
                            </button>
                        </div>
                    </div>
                    <div class="mb-4 flex items-center">
                        <ClockIcon class="w-8 h-8 mr-2" /> <span>{{ eventDetails.date }}</span>
                    </div>
                    <div v-if="eventDetails.order?.status === 0" class="rounded-md border border-gray-200 p-3">
                        <div class="mb-2">{{ $t('after_payment') }}:</div>
                        <div class="mb-2 ">
                            <router-link class="block flex items-center space-x-4"
                                :to="{ name: 'Preview', params: { id: $route.params.id } }">
                                <div class="w-6 h-6">
                                    <CheckIcon class="w-6 h-6 text-green-600" />
                                </div>
                                <div class="grow">
                                    {{ $t('invite_site') }}
                                </div>
                                <div class="w-6 h-6">
                                    <EyeIcon class="w-6 h-6" />
                                </div>
                            </router-link>
                        </div>
                        <div @click="openModal('Whatsapp арқылы шақыру', '/images/screenshot_2.jpeg')"
                            class="mb-2 flex items-center space-x-4 cursor-pointer">
                            <div class="w-6 h-6">
                                <CheckIcon class="w-6 h-6 text-green-600" />
                            </div>
                            <div class="grow">{{ $t('invitation_via_social') }}</div>
                            <div class="w-6 h-6">
                                <PhotoIcon class="w-6 h-6" />
                            </div>
                        </div>
                        <div @click="openModal('Қонақтар туралы ақпарат', '/images/guests_screen.png')"
                            class="mb-2 flex items-center cursor-pointer space-x-4">
                            <div class="w-6 h-6">
                                <CheckIcon class="w-6 h-6 text-green-600 block" />
                            </div>
                            <div class="grow">{{ $t('guest_information') }}</div>
                            <div class="w-6 h-6">
                                <PhotoIcon class="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    <div v-else class="mb-4">
                        <p class="text-lg font-semibold text-green-700">Төлем қабылданды</p>
                        <router-link
                            class="p-2 w-52 mt-4 flex justify-center font-semibold bg-theme-secondary shadow-md rounded-md text-white border border-theme-secondary hover:bg-white hover:text-theme-secondary"
                            :to="{ name: 'MyEvent', params: { id: eventDetails.id } }">
                            <EyeIcon class="w-6 mr-2" /> Толығырақ
                        </router-link>
                    </div>
                    <!--                <div class="mt-4">
                    <span class="mr-4 text-lg">Статус:</span><span>{{ eventDetails.order.statusLabel }}</span>
                </div>-->
                    <div v-if="eventDetails.order?.status === 0" class="mt-4 mb-2 text-lg font-semibold text-green-700">
                        <span class="mr-4">Бағасы:</span><span>{{ eventDetails.order.price }} тг</span>
                        <button @click="toWhatsapp(encodeURI('Заказ номері - ' + this.$route.params.id))"
                            class="flex items-center px-4 py-1 border border-theme-primary text-theme-primary rounded-md"><img
                                class="w-10 mr-2" src="/icons/whatsapp-icon.png" alt=""><span
                                class="font-semibold text-lg">Төлем жасау үшін байланысу</span></button>
                    </div>

                </div>
            </div>
            <div>
                <SurveyForm />
            </div>
        </div>

    </div>
    <!-- BEGIN MODAL -->
    <div>
        <Modal :modal="modal" :title="modal_title" @close-modal="closeModal">
            <img v-if="modal_img_url" class="w-full" :src="modal_img_url" alt="">
        </Modal>

        <Modal :modal="messageModal" @close-modal="closeModal">
            <div>
                <div class="mt-2 mb-4">
                    <ChatBubbleLeftEllipsisIcon class="block mx-auto text-blue-500 w-12" />
                </div>
                <p class="text-center font-semibold">Құрметті қолданушы</p>
                <p class="p-4 text-center">
                    Біздің веб-сервиске қош келдіңіз. Сервисті қолдануды оңай әрі жағымды ету үшін үнемі жұмыс жасаймыз.
                    Егер сізде қандай да бір идеялар, өтініштер немесе қателіктер туындаса, бізге хабарлаңыз! Сіздің
                    пікіріңіз біздің қызметімізді жақсартуға көмектеседі.<br>
                    Ең жақсы тілектермен,
                    toi-invite.kz
                </p>
                <div class="mb-4 flex justify-center items-center space-x-4">
                    <button class="rounded text-white" @click="toWhatsapp(encodeURI('Кері байланыс'))">
                        <img class="w-10" src="/icons/whatsapp-icon.png" alt="whatsapp-logo">
                    </button>
                    <router-link :to="{ name: 'Feedback' }" class="block font-medium text-green-500">
                        <EnvelopeOpenIcon class="w-8" />
                    </router-link>
                </div>
                <div class="text-center border-t p-2">
                    <button @click="closeModal"
                        class="cursor-pointer px-4 py-2 border border-red-500 text-red-500 rounded-md">Жабу</button>
                </div>

            </div>
        </Modal>
    </div>

    <!-- END MODAL -->
</template>

<script>
import { mapState } from "vuex";
import {
    CheckIcon,
    ClockIcon,
    EyeIcon,
    PhotoIcon,
    LinkIcon,
    ChatBubbleLeftEllipsisIcon,
    EnvelopeOpenIcon,
    PencilIcon,
    TrashIcon
} from '@heroicons/vue/24/outline'
import Stepper from "../../components/Stepper.vue";
import Spinner from "../../components/core/Spinner.vue";
import Modal from "../../components/Modal.vue";
import SurveyForm from "../../components/SurveyForm.vue";

export default {
    name: "LastStep",
    data() {
        return {
            modal: false,
            modal_title: '',
            messageModal: false,
            modal_img_url: null,
            imageLoaded: false,
            watermarkInvitation: null
        }
    },
    created() {

        this.$store.dispatch('app/getEventEdit', this.$route.params.id).then(item => {
            console.log(item)
            this.$store.dispatch('app/getWatermarkInvitation', item.invitation.invitation_img_path).then(res => {
                this.watermarkInvitation = res;
            });
        });
    },
    methods: {
        openModal(title, img_url) {
            this.modal_title = title;
            this.modal_img_url = img_url;
            this.modal = true;
        },
        closeModal() {
            this.modal = false;
            this.messageModal = false;
        },
        decrementStep() {
            this.changeRoute({ name: "EventUpdate", params: { id: this.$route.params.id } })
        },
        changeRoute(route) {
            this.$router.push(route)
        },
        toWhatsapp(def_text) {
            const phone = '+77005742909';
            let userAgent = navigator.userAgent || navigator.vendor || window.opera;

            if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
                window.location.href = "whatsapp://send?phone=" + phone + '&text=' + def_text;
            } else {
                window.open("https://web.whatsapp.com/send?phone=" + phone + '&text=' + def_text, '_blank');
            }
        },
        deleteEvent(id) {
            if (
                confirm(
                    `Өшіруге сенімдісіз бе?`
                )
            ) {
                this.$store.dispatch("app/deleteEvent", id).then(() => {
                    this.$store.commit("notify", {
                        type: "success",
                        message: "Сәтті өшірілді",
                    });
                    this.$router.push({ name: 'MyEvents' })
                });
            }
        },
    },
    computed: {
        ...mapState('app', {
            eventDetails: state => state.event.data,
            loading: state => state.event.loading,
        }),
    },
    mounted() {
        // setTimeout(() => {
        //    this.messageModal = true;
        // }, 3000);
    },
    components: {
        CheckIcon,
        Stepper,
        Spinner,
        ClockIcon,
        EyeIcon,
        Modal,
        PhotoIcon,
        LinkIcon,
        ChatBubbleLeftEllipsisIcon,
        EnvelopeOpenIcon,
        PencilIcon,
        TrashIcon,
        SurveyForm
    }
}
</script>

<style scoped></style>
