<script setup>
import HeroSection from "../sections/HeroSection.vue";
import FeatureSection from "../sections/FeatureSection.vue";
import DownloadSection from "../sections/DownloadSection.vue";
import StepsSection from "../sections/StepsSection.vue";
import FooterSection from "../sections/FooterSection.vue";

</script>

<template>
  <HeroSection v-once />

  <FeatureSection v-once />

  <DownloadSection v-once />

  <StepsSection v-once/>

<!--   <FaqSection /> -->

<!--  <SubscribeSection />-->
    <FooterSection v-once/>

</template>

<style scoped>

</style>
