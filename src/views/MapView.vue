<template>
  <div ref="mapContainer" class="map-container"></div>

  <div v-if="showStationInfo && selectedStation" class="station-info">
    <h2>{{ selectedStation.name }}</h2>
    <p>{{ selectedStation.powerOutput }} kW - {{ selectedStation.connectorType }}</p>
    <p>Status: {{ selectedStation.status }}</p>
    <button @click="showStationInfo = false">Close</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { useStationsStore } from '@/stores/stations'; // ✅ Check spelling & file name
import type { Station } from '@/interfaces/station.interface';

const stationsStore = useStationsStore();

const map = ref<L.Map>();
const mapContainer = ref<HTMLDivElement | null>(null);
const markerClusterGroup = ref<L.MarkerClusterGroup | null>(null);
const selectedStation = ref<Station | null>(null);
const showStationInfo = ref(false);

function getMarkerIcon(status: string): L.Icon {
  const iconUrl = {
    Available: '/icons/green-marker.png',
    Occupied: '/icons/red-marker.png',
    'Out of Service': '/icons/gray-marker.png',
  }[status] || '/icons/default-marker.png';

  return L.icon({
    iconUrl,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
  });
}

function updateMarkers() {
  if (!markerClusterGroup.value) return;

  markerClusterGroup.value.clearLayers();

  stationsStore.stations.forEach((station: { location: { latitude: number; longitude: number; }; status: string; name: any; powerOutput: any; connectorType: any; }) => {
    const marker = L.marker(
      [station.location.latitude, station.location.longitude],
      { icon: getMarkerIcon(station.status) }
    );

    marker.bindPopup(`
      <div class="station-popup">
        <h3>${station.name}</h3>
        <p>${station.powerOutput} kW - ${station.connectorType}</p>
        <span class="status ${station.status.replace(/\s+/g, '-')}">${station.status}</span>
      </div>
    `);

    marker.on('click', () => {
      selectedStation.value = station;
      showStationInfo.value = true;
    });

    markerClusterGroup.value?.addLayer(marker);
  });
}

onMounted(() => {
  if (!mapContainer.value) return;

  map.value = L.map(mapContainer.value).setView([20.5937, 78.9629], 5); // India center

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map.value);

  markerClusterGroup.value = L.markerClusterGroup();
  map.value.addLayer(markerClusterGroup.value);

  updateMarkers();
});

watch(
  () => stationsStore.stations,
  updateMarkers,
  { deep: true }
);
</script>

<style scoped>
.map-container {
  height: 100vh;
  width: 100%;
}

.station-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.station-popup {
  font-size: 14px;
}

.status {
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
}

.status.Available {
  background: green;
}
.status.Occupied {
  background: red;
}
.status.Out-of-Service {
  background: gray;
}
</style>
