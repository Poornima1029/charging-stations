<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStationsStore } from '../stores/stations'
import StationCard from '../components/StationCard.vue'
import FilterPanel from '../components/FilterPanel.vue'

const router = useRouter()
const stationsStore = useStationsStore()
const isLoading = ref(true)
const showConfirmDelete = ref(false)
const stationToDelete = ref<string | null>(null)

onMounted(async () => {
  try {
    await stationsStore.fetchStations()
  } catch (error) {
    console.error('Error fetching stations:', error)
  } finally {
    isLoading.value = false
  }
})

function goToAddStation() {
  router.push('/stations/new')
}

function handleEdit(stationId: string) {
  router.push(`/stations/${stationId}/edit`)

}

function confirmDelete(stationId: string) {
  stationToDelete.value = stationId
  showConfirmDelete.value = true
}

async function handleDelete() {
  if (!stationToDelete.value) return
  
  try {
    await stationsStore.deleteStation(stationToDelete.value)
    showConfirmDelete.value = false
    stationToDelete.value = null
  } catch (error) {
    console.error('Error deleting station:', error)
  }
}

function cancelDelete() {
  showConfirmDelete.value = false
  stationToDelete.value = null
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Charging Stations</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your charging station network</p>
      </div>
      <button
        @click="goToAddStation"
        class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add Station
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Filter Panel -->
      <div class="lg:col-span-1">
        <FilterPanel @filter="stationsStore.fetchStations()" />
      </div>

      <!-- Stations List -->
      <div class="lg:col-span-3">
        <div v-if="isLoading" class="flex justify-center items-center h-64">
          <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div v-else-if="stationsStore.filteredStations.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No charging stations</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by creating a new charging station.
          </p>
          <div class="mt-6">
            <button
              @click="goToAddStation"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Station
            </button>
          </div>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StationCard
            v-for="station in stationsStore.filteredStations"
            :key="station._id"
            :station="station"
            @edit="handleEdit"
            @delete="confirmDelete"
          />
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showConfirmDelete" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      <div class="relative bg-white rounded-lg max-w-md w-full mx-4 p-6 overflow-hidden transform transition-all">
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg font-medium text-gray-900">Delete Charging Station</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Are you sure you want to delete this charging station? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            @click="handleDelete"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Delete
          </button>
          <button
            @click="cancelDelete"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>