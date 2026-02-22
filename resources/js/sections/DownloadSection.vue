<script setup>
import downloads from "../data/downloads";
</script>

<template>
    <!-- Download Section Start -->
    <div id="download-section" class="container mx-auto px-5 md:w-4/5">
        <section class="py-16 pt-18">
            <div class="w-4/5 md:w-3/5 mx-auto">
                <h2 class="text-3xl md:text-4xl font-medium text-center">{{ $t('advantages of using our service') }}!</h2>
                <p class="text-gray-400 text-center text-lg font-theme-content mt-7">{{ $t('you can quickly and easily create an invitation site by simply filling out a form') }}</p>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
               <div class="flex flex-col items-center">
                 <img class="w-32 my-4" src="/icons/computer.png" alt="computer-icon" title="computer-icon">
                 <div class="my-2 font-medium">Ақпараттар</div>
                 <p class="text-center">
                     {{ $t('share the information you need with your guests through the site') }}
                 </p>
               </div>
              <div class="flex flex-col items-center">
                <img class="w-32 my-4" src="/icons/information.png" alt="information-icon" title="information-icon">
                <div class="my-2 font-medium">Қонақтар</div>
                <p class="text-center">
                    {{ $t('get information about your incoming and not coming guests') }}
                </p>
              </div>
              <div class="flex flex-col items-center">
                <img class="w-32 my-4" src="/icons/profits.png" alt="hashtag-icon" title="hashtag-icon">
                <div class="my-2 font-medium">Тиімді</div>
                <p class="text-center">
                  Қағазбен салыстырғанда арзан әрі тез дайындалады.
                </p>
              </div>
            </div>
        </section>
      <div class="my-4 flex justify-center">
          <router-link :to="{name:'Step1'}" class="bg-theme-primary px-6 py-2 text-white font-semibold rounded shadow-md hover:bg-white border-2 border-transparent hover:border-theme-primary hover:text-theme-primary cursor-pointer transition duration-200" href="#download-section">
              {{ $t('create invitation') }}
          </router-link>
      </div>
    </div>
    <!-- Download Section End -->
</template>
