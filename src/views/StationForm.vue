<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStationsStore, type ChargingStation } from '../stores/stations'

const router = useRouter()
const route = useRoute()
const stationsStore = useStationsStore()

const isEditMode = computed(() => route.params.id !== undefined)
const title = computed(() => isEditMode.value ? 'Edit Charging Station' : 'Add Charging Station')

const station = ref<ChargingStation>({
  name: '',
  location: {
    latitude: 0,
    longitude: 0,
    address: ''
  },
  status: 'active',
  powerOutput: 50,
  connectorType: 'Type 2'
})

const loading = ref(false)
const error = ref('')
const success = ref('')

// Connector type options
const connectorTypes = [
  'Type 1',
  'Type 2',
  'CCS',
  'CHAdeMO',
  'Tesla'
]

onMounted(async () => {
  if (isEditMode.value) {
    const stationId = route.params.id as string
    loading.value = true
    
    try {
      const data = await stationsStore.getStation(stationId)
      if (data) {
        station.value = data
      } else {
        error.value = 'Station not found'
        setTimeout(() => {
          router.push('/stations')
        }, 2000)
      }
    } catch (err) {
      console.error(err)
      error.value = 'Failed to load station data'
    } finally {
      loading.value = false
    }
  }
})

async function handleSubmit() {
  if (!station.value.name) {
    error.value = 'Name is required'
    return
  }
  
  if (!station.value.location.latitude || !station.value.location.longitude) {
    error.value = 'Location coordinates are required'
    return
  }
  
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    if (isEditMode.value) {
      await stationsStore.updateStation(route.params.id as string, station.value)
      success.value = 'Station updated successfully'
    } else {
      await stationsStore.createStation(station.value)
      success.value = 'Station created successfully'
    }
    
    // Redirect after short delay
    setTimeout(() => {
      router.push('/stations')
    }, 1500)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Operation failed. Please try again.'
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  router.push('/stations')
}

// Handle geolocation
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        station.value.location.latitude = position.coords.latitude
        station.value.location.longitude = position.coords.longitude
      },
      (err) => {
        error.value = 'Error getting current location: ' + err.message
      }
    )
  } else {
    error.value = 'Geolocation is not supported by this browser'
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
      <p class="mt-1 text-sm text-gray-500">
        {{ isEditMode ? 'Update charging station details' : 'Add a new charging station to your network' }}
      </p>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else>
      <div v-if="error" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ error }}</span>
      </div>

      <div v-if="success" class="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ success }}</span>
      </div>

      <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
        <!-- Station Name -->
        <div class="mb-6">
          <label for="name" class="block text-sm font-medium text-gray-700">Name *</label>
          <input
            id="name"
            v-model="station.name"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Enter station name"
            required
          />
        </div>

        <!-- Location -->
        <div class="mb-6">
          <div class="flex justify-between items-center">
            <label class="block text-sm font-medium text-gray-700">Location *</label>
            <button
              type="button"
              @click="getCurrentLocation"
              class="text-sm text-primary-600 hover:text-primary-700"
            >
              Use current location
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
            <div>
              <label for="latitude" class="block text-xs text-gray-500">Latitude</label>
              <input
                id="latitude"
                v-model.number="station.location.latitude"
                type="number"
                step="0.000001"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Enter latitude"
                required
              />
            </div>
            <div>
              <label for="longitude" class="block text-xs text-gray-500">Longitude</label>
              <input
                id="longitude"
                v-model.number="station.location.longitude"
                type="number"
                step="0.000001"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Enter longitude"
                required
              />
            </div>
          </div>

          <div class="mt-2">
            <label for="address" class="block text-xs text-gray-500">Address (optional)</label>
            <input
              id="address"
              v-model="station.location.address"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter address"
            />
          </div>
        </div>

        <!-- Status -->
        <div class="mb-6">
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            v-model="station.status"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Power Output -->
        <div class="mb-6">
          <label for="powerOutput" class="block text-sm font-medium text-gray-700">Power Output (kW)</label>
          <input
            id="powerOutput"
            v-model.number="station.powerOutput"
            type="number"
            min="1"
            step="0.1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Enter power output"
          />
        </div>

        <!-- Connector Type -->
        <div class="mb-6">
          <label for="connectorType" class="block text-sm font-medium text-gray-700">Connector Type</label>
          <select
            id="connectorType"
            v-model="station.connectorType"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option v-for="type in connectorTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="handleCancel"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {{ isEditMode ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>