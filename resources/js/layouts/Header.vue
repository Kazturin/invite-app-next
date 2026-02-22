<script setup>
    import { ref, defineAsyncComponent } from 'vue';
    import { useStore } from "vuex";
    import { computed } from "vue";
    import { useRouter } from "vue-router";
    import {useI18n} from 'vue-i18n'

    const Notification = defineAsyncComponent(() =>
        import('../components/Notification.vue')
    )
    const UserCircleIcon = defineAsyncComponent(() =>
        import('@heroicons/vue/24/outline/esm/UserCircleIcon')
    )
    const ArrowRightStartOnRectangleIcon = defineAsyncComponent(() =>
        import('@heroicons/vue/24/outline/esm/ArrowRightStartOnRectangleIcon')
    )
    const {t, locale } = useI18n({useScope: "global"})

    let mobileNav = ref(false);
    let dropDownNav = ref(false);

    let toggleMobileNav = () => {
        mobileNav.value = !mobileNav.value;
    }

    const store = useStore();
    const router = useRouter();

    if (router.currentRoute.value.meta.requiresAuth){
      store.dispatch("getUser");
    }

    let user = computed(() => store.state.user);

    function switchLang(ev){
        console.log(ev.target.value)
        locale.value = ev.target.value;
        localStorage.setItem('lang',ev.target.value);
        store.commit('setLanguage');
        // router.push({
        //     name: "Main",
        // });
    }

    function logout() {
      mobileNav.value = false;
      store.dispatch("logout").then(() => {
        router.push({
          name: "Main",
        });
      });
    }

    const phone = '+77005742909';

    function toWhatsapp(){
            let userAgent = navigator.userAgent || navigator.vendor || window.opera;

            if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
                window.location.href = "whatsapp://send?phone=" + phone+ '&text=' + encodeURI('toi-invite.kz сайты бойынша сұрағым бар. Сұрағым:');
            } else {
                window.open("https://web.whatsapp.com/send?phone=" + phone+ '&text=' + encodeURI('toi-invite.kz сайты бойынша сұрағым бар. Сұрағым:'), '_blank');
            }
    }

</script>

<template>
    <!-- Navbar Start -->
  <div class="border-gray-200 border-b-2">
    <div class="container mx-auto px-5">
      <header class="flex justify-between items-center py-4">
        <div>
          <a href="/">
            <img class="w-52" src="/logo.png" alt="Site Logo">
          </a>
        </div>

        <nav class="flex justify-end flex-row items-center">
          <!-- Menu Toggler -->
            <div class="w-20 md:hidden mr-2">
                <select
                    name="lang"
                    class="mt-1 block w-full py-2 px-3 border-0 bg-white rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    v-model="$i18n.locale"
                    @change="switchLang"
                >
                    <option value="kk">
                        KAZ
                    </option>
                    <option value="ru">
                        RUS
                    </option>
                </select>
            </div>
          <button @click="toggleMobileNav()" type="button" class="flex md:hidden focus:outline-none">
            <svg viewBox="0 0 24 24" class="h-6 w-6 fill-current">
              <path fill-rule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
            </svg>
          </button>

          <!-- Desktop Menu -->
          <ul class="space-x-5 font-medium text-sm items-center hidden md:flex  flex-col space-y-7 md:space-y-0 md:flex-row">
            <!--                    <li class="uppercase hover:text-theme-secondary transition duration-200"><a href="#features">Үйлену тойы</a></li>-->
              <li class="uppercase hover:text-theme-secondary transition duration-200">
                  <a href="https://www.instagram.com/toi_invite.kz" target="_blank">
                     <img class="w-6 my-4" src="/icons/_insta.svg" alt="insta-icon" title="insta-icon">
                  </a></li>
            <li class="uppercase hover:text-theme-secondary transition duration-200"><router-link :to="{name: 'MyEvents'}">
                {{$t('my_events')}}</router-link></li>
              <li class="uppercase hover:text-theme-secondary transition duration-200"><router-link :to="{name: 'Feedback'}">{{$t('feedback')}}</router-link></li>
              <li class="uppercase bg-theme-primary px-6 py-2 text-white rounded shadow-md hover:bg-white border-2 border-transparent hover:border-theme-secondary hover:text-theme-secondary cursor-pointer transition duration-200">
              <a href="/blog">Блог</a>
            </li>
              <li>
                  <div class="w-20">
                      <select
                          name="lang"
                          class="mt-1 block w-full py-2 px-3 border-0 bg-white rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                          v-model="$i18n.locale"
                          @change="switchLang"
                      >
                          <option value="kk">
                              KAZ
                          </option>
                          <option value="ru">
                              RUS
                          </option>
                      </select>
                  </div>
              </li>

            <li v-if="user.token" class="relative transition duration-200">
              <div  @click="dropDownNav = !dropDownNav">
                <UserCircleIcon class="w-8 h-8 text-gray-500"/>
              </div>
              <button class="fixed inset-0 h-full w-full cursor-default focus:outline-none" v-if="dropDownNav" @click="dropDownNav = false" tabindex="-1"></button>
              <transition enter-active-class="transition-all duration-200 ease-out" leave-active-class="transition-all duration-750 ease-in" enter-class="opacity-0 scale-75" enter-to-class="opacity-100 scale-100" leave-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-75">
                <div class="absolute shadow-lg border w-48 rounded py-1 px-2 text-sm mt-4 bg-white z-10 right-0" v-if="dropDownNav">
                  <a
                      @click="logout"
                      :class="[
                          'block px-4 py-2 text-sm text-gray-700 cursor-pointer',
                        ]">Шығу</a>
                </div>
              </transition>
            </li>
            <li v-else>
              <router-link :to="{name:'Login'}">
                <ArrowRightStartOnRectangleIcon class="w-8 h-8 text-gray-500"/>
              </router-link>
            </li>
<!--              <li>{{ user.token }}</li>-->
          </ul>
        </nav>
      </header>
      <!-- Mobile Menu Start-->
      <div v-show="mobileNav">
        <div class="absolute px-5 py-12 block z-30 top-0 left-0 w-full h-full bg-gradient-to-b from-theme-dark-blue via-theme-dark-blue-tp to-theme-dark-blue">
          <div class="flex justify-between items-center">
            <a href="/">
              <img src="/logo.png" class="w-52" alt="Logo">
            </a>
            <button @click="toggleMobileNav()" type="button" class="focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x text-white" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
          <ul class="uppercase text-white text-md tracking-widest items-center flex flex-col mt-14">
            <li class="hover:text-theme-secondary transition duration-200 py-4 border-t border-b border-theme-grayish-blue w-full text-center">
              <a  @click="toggleMobileNav()" href="/blog">Блог</a>
            </li>
            <li class="hover:text-theme-secondary transition duration-200 py-4 border-b border-theme-grayish-blue w-full text-center">
              <router-link  @click="toggleMobileNav()" :to="{name: 'MyEvents'}">{{$t('my_events')}}</router-link>
            </li>
              <li class="hover:text-theme-secondary transition duration-200 py-4 border-b border-theme-grayish-blue w-full text-center">
                  <router-link @click="toggleMobileNav()" :to="{name: 'Feedback'}">{{$t('feedback')}}</router-link>
              </li>
              <li v-if="user.token" class="hover:text-theme-secondary transition duration-200 py-4 border-b border-theme-grayish-blue w-full text-center">
              <a  @click="logout" href="#subscribe">Аккаунттан шығу</a>
            </li>
            <li v-else class="bg-transparent border-2 rounded px-6 py-2 mt-6 w-full text-center cursor-pointer hover:text-theme-secondary transition duration-200">
              <router-link :to="{name:'Login'}"  @click="toggleMobileNav()" href="#download-section">Аккаунтқа кіру</router-link>
            </li>
          </ul>
          <div class="flex justify-center items-end h-20">
            <ul class="flex space-x-8">
              <li>
                  <a href="https://www.instagram.com/toi_invite.kz" target="_blank">
                  <svg width="26" height="26" fill="currentColor" class="text-white hover:text-theme-secondary transition duration-200 cursor-pointer" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  </a>
              </li>
              <li>
                <svg width="26" height="26" fill="currentColor" class="bi bi-facebook text-white hover:text-theme-secondary transition duration-200" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </li>
<!--              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-twitter text-white hover:text-theme-secondary transition duration-200 cursor-pointer" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                </svg>
              </li>-->
            </ul>
          </div>
        </div>
      </div>
      <!-- Mobile Menu End-->
    </div>
      <div>
          <div class="fixed bottom-0 left-0 w-16 h-16 ml-8 mb-8 z-20 cursor-pointer">
              <img @click="toWhatsapp()" src="/icons/questionIcon.png" alt="email-icon">
          </div>
      </div>
  </div>

  <div>
    <router-view :key="$route.path"></router-view>
  </div>
  <Notification />
    <!-- Navbar End -->
</template>
