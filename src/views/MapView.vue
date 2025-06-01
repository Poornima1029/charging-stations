<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStationsStore, type ChargingStation } from '../stores/stations'
import L, { Map as LeafletMap, Marker, Icon } from 'leaflet'

const router = useRouter()
const stationsStore = useStationsStore()
const isLoading = ref(true)
const mapContainer = ref<HTMLElement | null>(null)
const map = ref<LeafletMap | null>(null)
const selectedStation = ref<ChargingStation | null>(null)
const showStationInfo = ref(false)

onMounted(async () => {
  try {
    await stationsStore.fetchStations()

    if (!mapContainer.value) return

    map.value = L.map(mapContainer.value).setView([40, -95], 4)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.value)

    const boundsCoords: L.LatLngExpression[] = []

    stationsStore.stations.forEach((station) => {
      const lat = Number(station.location.latitude)
      const lng = Number(station.location.longitude)

      const iconUrl =
        station.status === 'active'
          ? 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png'
          : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'

      const icon: Icon = L.icon({
        iconUrl,
        shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      const marker: Marker = L.marker([lat, lng], { icon }).addTo(map.value!)

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
  } catch (error) {
    console.error('Error initializing map:', error)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
    map.value = null
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
