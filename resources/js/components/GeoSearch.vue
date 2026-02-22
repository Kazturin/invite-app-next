<template>
<!--  <l-map ref="map" v-model:zoom="zoom" :center="[47.413220, -1.219482]" :use-global-leaflet="false">-->
<!--    <l-tile-layer-->
<!--        url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"-->
<!--        layer-type="base"-->
<!--        name="OpenStreetMap"-->
<!--    ></l-tile-layer>-->
<!--  </l-map>-->
  <l-map/>
</template>

<script>
import "leaflet/dist/leaflet.css";
//import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import LMap from "./leaflet/LMap.vue";

import { OpenStreetMapProvider  } from "leaflet-geosearch";
import "leaflet-geosearch/assets/css/leaflet.css";
import { GeoSearchControl } from "leaflet-geosearch";
import {ref} from "vue";

export default {
  name: "GeoSearch",
  data() {
    return {
      zoom: 2,
      //map: ref(null),
    };
  },
  mounted() {

    this.$nextTick(() => {
     // this.map = this.$refs.map.leafletObject
      console.log(this.$refs.map.leafletObject);
   //   console.log(this.map.value.leafletObject)
    })
    // console.log(this.map);
    // const map = this.$refs.map.mapobject;
    const searchcontrol = new GeoSearchControl({
      provider: OpenStreetMapProvider ,
      // ... some more options
    });
     console.log(searchcontrol);
    // map.addcontrol(searchcontrol);
  },
  methods: {
    test(){
      console.log('test');
    }
  },
  components: {
    LMap,
  //  LTileLayer
  },
}
</script>

<style scoped>

</style>