<template>
    <div>
        <a href="/">
            <img
                class="mx-auto h-auto w-48"
                src="/logo.png"
                alt="logo"
            />
        </a>
        <h2 class="mt-4 text-center text-3xl font-extrabold text-gray-900">
            Құпия сөзді өзгерту
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
            <router-link
                :to="{ name: 'Login' }"
                class="font-medium text-indigo-600 hover:text-indigo-500"
            >
               Кіру
            </router-link>
        </p>
    </div>
    <form class="mt-8 space-y-6" @submit="reset">
        <Alert v-if="responseMsg" :class="[responseMsg.status===true?'bg-green-500':'bg-red-500']">
            {{ responseMsg.message }}
            <span
                @click="errorMsg = ''"
                class="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer hover:bg-[rgba(0,0,0,0.2)]"
            >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </span>
        </Alert>
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
            <div>
                <label for="email-address" class="sr-only">Email address</label>
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required=""
                    v-model="user.email"
                    class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                />
            </div>
        </div>

        <div>
            <button
                type="submit"
                :disabled="loading"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                :class="{
          'cursor-not-allowed': loading,
          'hover:bg-indigo-500': loading,
        }"
            >
        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
          <LockClosedIcon
              class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
              aria-hidden="true"
          />
        </span>
                <svg
                    v-if="loading"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    ></circle>
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
                Жіберу
            </button>
        </div>
    </form>
</template>

<script setup>

import store from "../store";
import {useRoute, useRouter} from "vue-router";
import {defineAsyncComponent, ref} from "vue";
const Alert = defineAsyncComponent(() =>
    import('../components/Alert.vue')
)
const LockClosedIcon = defineAsyncComponent(() =>
    import('@heroicons/vue/24/solid/esm/LockClosedIcon')
)


const router = useRouter();
const route = useRoute();

const user = {
    email: "",
};
let loading = ref(false);
let responseMsg = ref("");

function reset(ev) {
    ev.preventDefault();

    loading.value = true;
    store
        .dispatch("forgotPassword", user)
        .then((res) => {
            loading.value = false;
            responseMsg.value = res
            // router.push({
            //     name: "Dashboard",
            // });
        })
        .catch((err) => {
            loading.value = false;
            responseMsg.value = err.response.data.error;
        });
}
</script>
