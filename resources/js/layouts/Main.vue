<script setup>
import { defineAsyncComponent } from 'vue';

const HeroSection = defineAsyncComponent(() =>
    import('../sections/HeroSection.vue')
)
const FeatureSection = defineAsyncComponent(() =>
    import('../sections/FeatureSection.vue')
)
const DownloadSection = defineAsyncComponent(() =>
    import('../sections/DownloadSection.vue')
)
const FaqSection = defineAsyncComponent(() =>
    import('../sections/FaqSection.vue')
)
const StepsSection = defineAsyncComponent(() =>
    import('../sections/StepsSection.vue')
)
const FooterSection = defineAsyncComponent(() =>
    import('../sections/FooterSection.vue')
)

</script>

<template>
    <HeroSection />

    <FeatureSection />

    <DownloadSection />

    <StepsSection/>

    <FaqSection />

    <FooterSection/>

</template>
