<template>
  <div id="map" style="height: 500px; width: 100%;"></div>
</template>

<script>
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'ChargerMap',
  props: {
    chargers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      map: null,
      markers: []
    }
  },
  mounted() {
    this.initMap()
  },
  watch: {
    chargers: {
      immediate: true,
      handler(newChargers) {
        if (this.map && newChargers.length) {
          this.renderMarkers()
        }
      }
    }
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView([12.9716, 77.5946], 13) // You can adjust the default location

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map)
    },
    renderMarkers() {
      // Remove existing markers from the map
      this.markers.forEach(marker => this.map.removeLayer(marker))
      this.markers = []

      // Add new markers for each charger/station
      this.chargers.forEach(charger => {
        const lat = charger.latitude || charger.location?.latitude
        const lng = charger.longitude || charger.location?.longitude

        if (lat && lng) {
          const marker = L.marker([lat, lng])
            .addTo(this.map)
            .bindPopup(`
              <strong>${charger.name}</strong><br>
              Power: ${charger.powerOutput || 'N/A'} kW<br>
              Status: ${charger.status || 'Unknown'}<br>
              Connector: ${charger.connectorType || 'Unknown'}
            `)
          this.markers.push(marker)
        }
      })

      // Fit the map view to markers if present
      if (this.markers.length > 0) {
        const group = L.featureGroup(this.markers)
        this.map.fitBounds(group.getBounds().pad(0.2))
      }
    }
  }
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
