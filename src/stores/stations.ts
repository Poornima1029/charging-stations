import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export interface ChargingStation {
  _id?: string
  name: string
  location: {
    latitude: number
    longitude: number
    address?: string
  }
  status: 'active' | 'inactive'
  powerOutput: number
  connectorType: string
  createdAt?: string
  updatedAt?: string
}

export const useStationsStore = defineStore('stations', () => {
  const stations = ref<ChargingStation[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Filters
  const statusFilter = ref<string | null>(null)
  const powerOutputFilter = ref<number | null>(null)
  const connectorTypeFilter = ref<string | null>(null)

  const filteredStations = computed(() => {
    return stations.value.filter(station => {
      if (statusFilter.value && station.status !== statusFilter.value) return false
      if (powerOutputFilter.value && station.powerOutput < powerOutputFilter.value) return false
      if (connectorTypeFilter.value && station.connectorType !== connectorTypeFilter.value) return false
      return true
    })
  })

  // Get all connector types for filter options
  const connectorTypes = computed(() => {
    const types = new Set<string>()
    stations.value.forEach(station => {
      types.add(station.connectorType)
    })
    return Array.from(types)
  })

  async function fetchStations() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/stations')
      stations.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch charging stations'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function getStation(id: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/stations/${id}`)
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch charging station'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createStation(station: ChargingStation) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/stations', station)
      stations.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = 'Failed to create charging station'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateStation(id: string, station: ChargingStation) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/stations/${id}`, station)
      const index = stations.value.findIndex(s => s._id === id)
      if (index !== -1) {
        stations.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to update charging station'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteStation(id: string) {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/stations/${id}`)
      stations.value = stations.value.filter(s => s._id !== id)
    } catch (err) {
      error.value = 'Failed to delete charging station'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilters({
    status,
    powerOutput,
    connectorType
  }: {
    status?: string | null,
    powerOutput?: number | null,
    connectorType?: string | null
  }) {
    if (status !== undefined) statusFilter.value = status
    if (powerOutput !== undefined) powerOutputFilter.value = powerOutput
    if (connectorType !== undefined) connectorTypeFilter.value = connectorType
  }

  function clearFilters() {
    statusFilter.value = null
    powerOutputFilter.value = null
    connectorTypeFilter.value = null
  }

  return {
    stations,
    filteredStations,
    loading,
    error,
    statusFilter,
    powerOutputFilter,
    connectorTypeFilter,
    connectorTypes,
    fetchStations,
    getStation,
    createStation,
    updateStation,
    deleteStation,
    setFilters,
    clearFilters
  }
})