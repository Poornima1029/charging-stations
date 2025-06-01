<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStationsStore, type ChargingStation } from '../stores/stations'
import L from 'leaflet'

const router = useRouter()
const stationsStore = useStationsStore()
const isLoading = ref(true)
const mapContainer = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const selectedStation = ref<ChargingStation | null>(null)
const showStationInfo = ref(false)

onMounted(async () => {
  try {
    await stationsStore.fetchStations()

    if (mapContainer.value) {
      map.value = L.map(mapContainer.value).setView([40, -95], 4)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map.value)

      const boundsCoords: [number, number][] = []

      stationsStore.stations.forEach(station => {
        const lat = Number(station.location.latitude)
        const lng = Number(station.location.longitude)

        const iconUrl = station.status === 'active'
          ? 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png'
          : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'

        const icon = L.icon({
          iconUrl,
          shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })

        const marker = L.marker([lat, lng], { icon }).addTo(map.value)

        marker.bindPopup(`
          <strong>${station.name}</strong><br>
          ${station.powerOutput} kW - ${station.connectorType}<br>
          <span class="${station.status === 'active' ? 'text-green-600' : 'text-red-600'}">${station.status}</span>
        `)

        marker.on('click', () => {
          selectedStation.value = station
          showStationInfo.value = true
        })

        boundsCoords.push([lat, lng])
      })

      if (boundsCoords.length > 0) {
        const bounds = L.latLngBounds(boundsCoords)
        map.value.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  } catch (error) {
    console.error('Error initializing map:', error)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

function handleEdit(stationId: string) {
  router.push(`/stations/${stationId}/edit`)
}

function handleClose() {
  showStationInfo.value = false
  selectedStation.value = null
}
</script>

<template>
  <div style="height: calc(100vh - 64px);">
    <div v-if="isLoading" class="flex justify-center items-center h-full">
      <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else class="relative h-full">
      <div ref="mapContainer" class="h-full z-0" style="height: 100%"></div>

      <div
        v-if="showStationInfo && selectedStation"
        class="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 z-10 animate-fade-in"
      >
        <div class="flex justify-between items-start">
          <h3 class="text-lg font-semibold text-gray-800">{{ selectedStation.name }}</h3>
          <button @click="handleClose" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div class="mt-2">
          <span :class="selectedStation.status === 'active' ? 'text-green-600' : 'text-red-600'">
            {{ selectedStation.status }}
          </span>
        </div>

        <div class="mt-3 space-y-2">
          <p class="text-sm text-gray-600">
            <span class="font-medium">Location:</span>
            {{ selectedStation.location.latitude.toFixed(6) }}, {{ selectedStation.location.longitude.toFixed(6) }}
          </p>
          <p class="text-sm text-gray-600" v-if="selectedStation.location.address">
            <span class="font-medium">Address:</span> {{ selectedStation.location.address }}
          </p>
          <p class="text-sm text-gray-600">
            <span class="font-medium">Power Output:</span> {{ selectedStation.powerOutput }} kW
          </p>
          <p class="text-sm text-gray-600">
            <span class="font-medium">Connector Type:</span> {{ selectedStation.connectorType }}
          </p>
        </div>

        <div class="mt-4">
          <button
            @click="handleEdit(selectedStation._id!)"
            class="w-full py-2 px-4 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Edit Station
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:global(.leaflet-marker-icon),
:global(.leaflet-marker-shadow) {
  max-width: none !important;
}
</style>
