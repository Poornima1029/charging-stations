<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function goToLogin() {
  router.push('/login')
}

function goToRegister() {
  router.push('/register')
}

function goToStations() {
  router.push('/stations')
}
</script>

<template>
  <div class="relative">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-primary-500 to-primary-700 text-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative z-10 py-16 md:py-28">
          <div class="max-w-2xl">
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
              Manage your charging stations with ease
            </h1>
            <p class="mt-6 text-xl">
              ChargingHub provides a complete platform for managing electric vehicle charging stations. Monitor status, track performance, and visualize your network on an interactive map.
            </p>
            <div class="mt-10 flex flex-col sm:flex-row gap-4">
              <button 
                v-if="!authStore.isAuthenticated"
                @click="goToRegister"
                class="btn btn-primary text-base font-medium px-6 py-3 bg-white text-primary-600 hover:bg-gray-100"
              >
                Get Started
              </button>
              <button 
                v-else
                @click="goToStations"
                class="btn btn-primary text-base font-medium px-6 py-3 bg-white text-primary-600 hover:bg-gray-100"
              >
                View Stations
              </button>
              <button 
                v-if="!authStore.isAuthenticated"
                @click="goToLogin"
                class="btn btn-secondary text-base font-medium px-6 py-3 bg-transparent border-2 border-white hover:bg-white/10"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Background pattern -->
      <div class="absolute top-0 right-0 h-full w-1/2 bg-white/5">
        <svg class="h-full w-full" viewBox="0 0 400 400" fill="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V0H40" fill="none" stroke="currentColor" stroke-opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Features</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your charging station network efficiently
          </p>
        </div>

        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-md flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-900">Easy Management</h3>
            <p class="mt-2 text-base text-gray-600">
              Add, update, and remove charging stations with an intuitive interface. Keep track of all your stations in one place.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-md flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-900">Interactive Map</h3>
            <p class="mt-2 text-base text-gray-600">
              Visualize your charging network on an interactive map. Quickly locate stations and view their status at a glance.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-md flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-900">Advanced Filtering</h3>
            <p class="mt-2 text-base text-gray-600">
              Filter stations by status, power output, and connector type to quickly find the information you need.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-primary-600 rounded-lg shadow-xl overflow-hidden">
          <div class="px-6 py-12 md:p-12 md:flex md:items-center md:justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white sm:text-3xl">
                Ready to get started?
              </h2>
              <p class="mt-3 max-w-3xl text-lg text-primary-200">
                Create an account today and start managing your charging stations.
              </p>
            </div>
            <div class="mt-8 md:mt-0">
              <button 
                v-if="!authStore.isAuthenticated"
                @click="goToRegister"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-600 bg-white hover:bg-primary-50"
              >
                Sign up for free
              </button>
              <button 
                v-else
                @click="goToStations"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-600 bg-white hover:bg-primary-50"
              >
                View your stations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>