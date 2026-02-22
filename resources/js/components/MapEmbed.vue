<template>
  <div class="space-y-4">
    <input
      v-model="inputUrl"
      type="url"
      placeholder="Вставьте ссылку с Яндекс.Карт или 2ГИС"
      class="w-full p-2 border rounded"
    />

    <div v-if="embedUrl" class="w-full h-96">
      <iframe
        :src="embedUrl"
        width="100%"
        height="100%"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>

    <div v-else-if="inputUrl" class="text-red-600">
      Невозможно отобразить карту по этой ссылке.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputUrl = ref('')

// Создаём embed-ссылку на карту, если возможно
const embedUrl = computed(() => {
  if (!inputUrl.value) return null

  const url = inputUrl.value.trim()

  // ✅ Яндекс.Карты
  if (url.includes('yandex.kz/maps')) {
    const llMatch = url.match(/ll=([\d.-]+)%2C([\d.-]+)/)
    const zMatch = url.match(/z=(\d+)/)

    if (llMatch && zMatch) {
      const ll = `${llMatch[1]}%2C${llMatch[2]}`
      const z = zMatch[1]
      return `https://yandex.kz/maps/-/CHvCvUpI`
    }

    // Иногда координаты в конце ссылки
    const coordsMatch = url.match(/~?([\d.]+),([\d.]+)/)
    if (coordsMatch) {
      const ll = `${coordsMatch[1]}%2C${coordsMatch[2]}`
      return `https://yandex.kz/map-widget/v1/?ll=${ll}&z=15`
    }
  }

  // ✅ 2ГИС: пытаемся вытащить firm_id
  if (url.includes('2gis.ru')) {
    const idMatch = url.match(/geo\/(\d{10,})/)
    if (idMatch) {
      return `https://widgets.2gis.com/widget?type=firm&firm_id=${idMatch[1]}`
    }
  }

  return null
})
</script>
