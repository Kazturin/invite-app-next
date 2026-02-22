<template>
    <GChart
        type="PieChart"
        :data="inputData"
        :options="options"
    />
</template>
<script setup>

import { GChart } from 'vue-google-charts';

const props = defineProps({
    inputData:{
        type: Array,
        required: true
    },
})

const options = {
    // title: 'Қонақтардың жауабы',
    legend:{
        position: 'bottom'
    },
    // pieHole: 0.4,
    sliceVisibilityThreshold: 0,
    colors: ['#008ffb','#ff6384'],
};


</script>
<style lang="">

</style>
