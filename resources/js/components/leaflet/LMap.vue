<template>
  <div class="relative">
    <div id="mapContainer" />
    <div v-if="loading" class="loading-overlay">
      <spinner class="top-1/2"/>
    </div>
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import 'leaflet-geosearch/assets/css/leaflet.css'
import { GeoSearchControl } from 'leaflet-geosearch'
import Spinner from '../core/Spinner.vue'

const props = defineProps({
  marker: {
    type: Object,
    required: false,
  },
  search: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['result'])

const mapCenter = ref([43.2387615, 76.9451363])
const map = ref(null)
const currentMarker = ref(null)
const loading = ref(false)
const error = ref(null)

const greenIcon = new L.Icon({
  iconUrl: '/icons/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

onMounted(() => {
  createMapLayer()
})

onBeforeMount(() => {
  if (map.value) {
    map.value.remove()
  }
  if (props.marker) {
    mapCenter.value = [props.marker.latitude, props.marker.longitude]
  }
})

const createMapLayer = () => {
  map.value = L.map('mapContainer').setView(mapCenter.value, 16)
  L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map.value)

  if (props.search) {
    setupSearch()
  }

  if (props.marker) {
    addMarker(props.marker.latitude, props.marker.longitude, props.marker.description)
  }
}

const setupSearch = () => {
  const provider = new OpenStreetMapProvider({
    searchUrl: '/api/nominatim/search',
    params: {
    'email': 'kazturin.a@gmail.com', // <-- Укажите здесь ваш реальный email
  },
  })
  
  const searchControl = new GeoSearchControl({
    marker: {
      icon: greenIcon,
      draggable: true,
    },
    provider: provider,
    style: 'bar',
    searchLabel: 'Мекенжайды тауып, белгілеңіз',
    resultFormat: ({ result }) => result.label
  })

  map.value.addControl(searchControl)

  map.value.on('geosearch/showlocation', (e) => {
    emit('result', e.location)
  })

  map.value.on('click', handleMapClick(provider))
}

const handleMapClick = (provider) => async (ev) => {
  if (loading.value) return;
  loading.value = true
  error.value = null

  try {
    if (currentMarker.value && map.value.hasLayer(currentMarker.value)) {
      map.value.removeLayer(currentMarker.value)
    }

    const latlng = map.value.mouseEventToLatLng(ev.originalEvent)
    const results = await provider.search({ query: `${latlng.lat}, ${latlng.lng}` })

    if (results.length > 0) {
      emit('result', results[0])
      addMarker(latlng.lat, latlng.lng, results[0].label)
    } else {
      throw new Error('Мекен-жай табылмады')
    }
  } catch (e) {
    error.value = `Қате орын алды: ${e.message} .Қайтадан таңдап көріңіз`
    console.error('Error in handleMapClick:', e)
  } finally {
    loading.value = false
  }
}

const addMarker = (lat, lng, popupContent) => {
  currentMarker.value = L.marker([lat, lng], { icon: greenIcon })
    .addTo(map.value)
    .bindPopup(popupContent)
    .openPopup()
}
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 500px;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.error-message {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 1000;
}
</style>