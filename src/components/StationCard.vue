<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { ChargingStation } from '../stores/stations'

const props = defineProps<{
  station: ChargingStation
}>()

const emit = defineEmits(['edit', 'delete'])

function handleEdit() {
  emit('edit', props.station._id)
}

function handleDelete() {
  emit('delete', props.station._id)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
    <div class="p-6">
      <div class="flex justify-between items-start">
        <h3 class="text-xl font-semibold text-gray-800">{{ station.name }}</h3>
        <span 
          :class="station.status === 'active' ? 'status-active' : 'status-inactive'"
        >
          {{ station.status }}
        </span>
      </div>
      
      <div class="mt-4 space-y-2">
        <p class="text-sm text-gray-600">
          <span class="font-medium">Location:</span> 
          {{ station.location.latitude.toFixed(6) }}, {{ station.location.longitude.toFixed(6) }}
        </p>
        <p class="text-sm text-gray-600" v-if="station.location.address">
          <span class="font-medium">Address:</span> {{ station.location.address }}
        </p>
        <p class="text-sm text-gray-600">
          <span class="font-medium">Power Output:</span> {{ station.powerOutput }} kW
        </p>
        <p class="text-sm text-gray-600">
          <span class="font-medium">Connector Type:</span> {{ station.connectorType }}
        </p>
      </div>
      
      <div class="mt-6 flex space-x-2">
        <button 
          @click="handleEdit"
          class="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
        >
          Edit
        </button>
        <button 
          @click="handleDelete"
          class="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>