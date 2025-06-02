<template>
  <section class="charger-map">
    <header class="map-header">
      <h2>🗺 Charger Locations</h2>
    </header>
    <div id="map" ref="mapContainer"></div>
  </section>
</template>

<script>
import { onMounted, ref, watch } from 'vue'

export default {
  props: {
    chargers: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const mapContainer = ref(null)
    let mapInstance = null
    let markers = []

    onMounted(async () => {
      if (!mapContainer.value) return

      const L = await import('leaflet')

      mapInstance = L.map(mapContainer.value).setView([20, 0], 2)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance)

      updateMarkers(L)
    })

    const updateMarkers = (L) => {
      if (!mapInstance || !L) return

      // Remove previous markers
      markers.forEach(marker => mapInstance.removeLayer(marker))
      markers = []

      // Add new markers
      props.chargers.forEach(charger => {
        if (charger.latitude && charger.longitude) {
          const iconUrl = charger.status === 'active'
            ? 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png'
            : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'

          const icon = L.icon({
            iconUrl,
            shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          })

          const marker = L.marker([charger.latitude, charger.longitude], { icon })
            .addTo(mapInstance)
            .bindPopup(`
              <strong>${charger.name}</strong><br/>
              ${charger.location}<br/>
              Type: ${charger.type}<br/>
              <span style="color:${charger.status === 'active' ? 'green' : 'red'}">${charger.status}</span><br/>
              $${charger.price?.toFixed(2) || 0} / kWh
            `)

          markers.push(marker)
        }
      })

      // Fit bounds if any markers
      if (markers.length) {
        const group = L.featureGroup(markers)
        mapInstance.fitBounds(group.getBounds().pad(0.2))
      }
    }

    watch(() => props.chargers, async () => {
      const L = await import('leaflet')
      updateMarkers(L)
    }, { deep: true })

    return {
      mapContainer,
    }
  },
}
</script>

<style scoped>
.charger-map {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.map-header {
  background-color: #004080;
  color: white;
  padding: 16px 20px;
  font-weight: 700;
  font-size: 1.6rem;
  text-align: center;
  user-select: none;
}

#map {
  flex: 1;
  width: 100%;
  min-height: 400px;
}

.leaflet-container {
  background: #e6f0ff;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

@media (max-width: 600px) {
  .map-header {
    font-size: 1.3rem;
    padding: 12px 16px;
  }

  #map {
    min-height: 300px;
  }
}
</style>
