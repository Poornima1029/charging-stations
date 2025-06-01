<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { useStationsStore } from '../stores/stations'

const emit = defineEmits(['filter'])
const stationsStore = useStationsStore()

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

const powerOutputOptions = [
  { value: 50, label: '50+ kW' },
  { value: 100, label: '100+ kW' },
  { value: 150, label: '150+ kW' },
  { value: 250, label: '250+ kW' }
]

const status = ref(stationsStore.statusFilter)
const powerOutput = ref(stationsStore.powerOutputFilter)
const connectorType = ref(stationsStore.connectorTypeFilter)

function applyFilters() {
  stationsStore.setFilters({
    status: status.value,
    powerOutput: powerOutput.value,
    connectorType: connectorType.value
  })
  emit('filter')
}

function resetFilters() {
  status.value = null
  powerOutput.value = null
  connectorType.value = null
  stationsStore.clearFilters()
  emit('filter')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-lg font-medium text-gray-800 mb-4">Filters</h3>
    
    <div class="space-y-4">
      <!-- Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select 
          v-model="status"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option :value="null">All</option>
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      
      <!-- Power Output Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Power Output</label>
        <select 
          v-model="powerOutput"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option :value="null">All</option>
          <option v-for="option in powerOutputOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      
      <!-- Connector Type Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Connector Type</label>
        <select 
          v-model="connectorType"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option :value="null">All</option>
          <option v-for="type in stationsStore.connectorTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex space-x-2 pt-2">
        <button
          @click="applyFilters"
          class="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Apply
        </button>
        <button
          @click="resetFilters"
          class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>