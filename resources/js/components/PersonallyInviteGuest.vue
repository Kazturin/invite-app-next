<template>
    <Alert v-if="errorMsg" class="flex-col items-stretch text-sm mx-4 mt-4">
        <div>
            {{ errorMsg }}
        </div>
    </Alert>
    <form @submit.prevent="save" class="mt-2 w-full">
        <div class="mt-4">
            <select v-model="guestInviteModel.guest_id"
                class="w-full bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                @change="loadInviteData">
                <option value="" disabled selected>Қонақты таңдаңыз</option>
                <option v-for="guest in props.guests" :key="guest.id" :value="guest.id">
                    {{ guest.fullname }} - {{ guest.relative }}
                </option>
            </select>
        </div>
        <div class="mt-4">
            <label for="description" class="text-left block text-sm font-medium leading-6 text-gray-900">Шақыру
                мәтіні</label>
            <div class="my-2">
                <QuillEditor :key="guestInviteModel.invite_code" theme="snow"
                    v-model:content="guestInviteModel.invite_text" contentType="html" :toolbar="toolbarOptions"
                    class="min-h-[8rem] max-h-[8rem] overflow-y-auto"
                    placeholder="Тойымыздың қадірлі қонағы болыңыздар" />
            </div>
        </div>
        <button type="submit" :disabled="loadingPost"
            class="inline-flex bg-theme-secondary text-white px-4 py-2 rounded-md">
            <span v-if="loadingPost" class="w-5 h-5 mr-1 rounded-full animate-spin
                    border-2 border-solid border-white border-t-transparent"></span>
            <span>Сақтау</span></button>
    </form>
    <ul class="flex justify-center items-center my-4">

        <li>
            <share-link :disabled="!saved" :params="{ u: getUrl }"
                socialUrl="https://www.facebook.com/sharer/sharer.php"
                svg-path="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
        </li>
        <li>
            <whatsup-share :params="{ text: getUrl }" :disabled="!saved" />
        </li>
        <li>
            <share-link :disabled="!saved" :params="{ url: getUrl }" socialUrl="https://t.me/share/url"
                svg-path="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z" />
        </li>
    </ul>
</template>

<script setup>

import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { v4 as uuidv4 } from "uuid";
import Alert from "./Alert.vue";
import { ref, computed, defineAsyncComponent } from "vue";
import store from "../store";
import { toolbarOptions } from '../utils/quillConfig';

const QuillEditor = defineAsyncComponent(() => import('@vueup/vue-quill').then(m => m.QuillEditor));

const WhatsupShare = defineAsyncComponent(() =>
    import('../components/share/WhatsupShare.vue')
)
const ShareLink = defineAsyncComponent(() =>
    import('../components/share/ShareLink.vue')
)
const props = defineProps({
    guests: {
        type: Array,
        required: true
    },
    url: {
        type: String,
        required: true
    },
})

const emit = defineEmits(["saved"]);
let saved = ref(false)

const getUrl = computed(() => {
    if (guestInviteModel.value.invite_code !== "") {
        return props.url + '?invite_code=' + guestInviteModel.value.invite_code;
    }
    return null;
});

let errorMsg = ref(null);
let loadingPost = ref(false);

let guestInviteModel = ref({
    id: null,
    guest_id: "",
    invite_text: '<p><span style="color: rgb(255, 194, 102);" class="ql-font-Mon ql-size-large">Құрметті Аслан</span></p><p><br></p><p>Тойымыздың қадірлі қонағы болыңыз. </p>',
    invite_code: "",
});

async function save() {
    loadingPost.value = true;

    if (!guestInviteModel.value.invite_code) {
        guestInviteModel.value.invite_code = uuidv4();
    }

    try {
        await store.dispatch('app/saveGuestInvite', guestInviteModel.value);
        loadingPost.value = false;
        saved.value = true;
        emit("saved");
    } catch (err) {
        loadingPost.value = false;
        errorMsg.value = err.response?.data?.message || 'Ошибка при сохранении';
    }
}


function loadInviteData() {
    const guestId = guestInviteModel.value.guest_id;
    if (!guestId) {
        resetForm();
        return;
    }

    const selectedGuest = props.guests.find(guest => guest.id === Number(guestId));
    if (selectedGuest && selectedGuest.invite) {
        // Если у гостя есть invite, заполняем форму
        guestInviteModel.value = {
            id: selectedGuest.invite.id,
            guest_id: selectedGuest.invite.guest_id,
            invite_text: selectedGuest.invite.invite_text,
            invite_code: selectedGuest.invite.invite_code,
        };
    } else {
        // Если invite нет, сбрасываем форму
        resetForm(guestId);
    }
}

function resetForm(guestId = "") {
    guestInviteModel.value = {
        id: null,
        guest_id: guestId,
        invite_text: '<p><span style="color: rgb(255, 194, 102);" class="ql-font-Mon ql-size-large">Құрметті Аслан</span></p><p><br></p><p>Тойымыздың қадірлі қонағы болыңыз. </p>',
        invite_code: uuidv4(),
    };
}

</script>

<style lang="scss">
.ql-editor {
    font-family: 'vAcade';
    font-size: 24px;
}

.ql-picker.ql-font {

    .ql-picker-label[data-value=vAcade]::before,
    .ql-picker-item[data-value=vAcade]::before {
        content: "Academy";
        font-family: vAcade;
    }

    .ql-picker-label[data-value=Mon]::before,
    .ql-picker-item[data-value=Mon]::before {
        content: "Mon";
        font-family: Mon;
    }

    .ql-picker-label[data-value=Balmoral]::before,
    .ql-picker-item[data-value=Balmoral]::before {
        content: "Balmoral";
        font-family: Balmoral;
    }

    .ql-picker-label[data-value=RosaMarena]::before,
    .ql-picker-item[data-value=RosaMarena]::before {
        content: "RosaMarena";
        font-family: RosaMarena;
    }

    .ql-picker-label[data-value=Baltica]::before,
    .ql-picker-item[data-value=Baltica]::before {
        content: "Baltica";
        font-family: Baltica;
    }

    .ql-picker-label[data-value=Vivaldi]::before,
    .ql-picker-item[data-value=Vivaldi]::before {
        content: "Vivaldi";
        font-family: Vivaldi;
    }

    .ql-picker-label[data-value=Boyarsky]::before,
    .ql-picker-item[data-value=Boyarsky]::before {
        content: "Boyarsky";
        font-family: Boyarsky;
    }

    .ql-picker-label[data-value=Taurus]::before,
    .ql-picker-item[data-value=Taurus]::before {
        content: "Taurus";
        font-family: Taurus;
    }

    .ql-picker-label[data-value=Cooper]::before,
    .ql-picker-item[data-value=Cooper]::before {
        content: "Cooper";
        font-family: Cooper;
    }

    .ql-picker-label[data-value=Downtown]::before,
    .ql-picker-item[data-value=Downtown]::before {
        content: "Downtown";
        font-family: Downtown;
    }

    .ql-picker-label[data-value=Poster]::before,
    .ql-picker-item[data-value=Poster]::before {
        content: "Poster";
        font-family: Poster;
    }

    .ql-picker-label[data-value=Bernn]::before,
    .ql-picker-item[data-value=Bernn]::before {
        content: "Bernn";
        font-family: Bernn;
    }
}
</style>