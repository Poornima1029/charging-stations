<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Navigation Links -->
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-xl font-bold text-primary-600">ChargingHub</router-link>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              to="/"
              class="inline-flex items-center px-1 pt-1 border-b-2"
              :class="$route.path === '/' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
            >
              Home
            </router-link>
            <router-link
              v-if="isAuthenticated"
              to="/stations"
              class="inline-flex items-center px-1 pt-1 border-b-2"
              :class="$route.path.includes('/stations') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
            >
              Stations
            </router-link>
            <router-link
              v-if="isAuthenticated"
              to="/map"
              class="inline-flex items-center px-1 pt-1 border-b-2"
              :class="$route.path === '/map' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
            >
              Map
            </router-link>
          </div>
        </div>
        
        <!-- Auth Buttons -->
        <div class="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
          <template v-if="isAuthenticated">
            <button
              @click="logout"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md"
            >
              Sign Up
            </router-link>
          </template>
        </div>
        
        <!-- Mobile Menu Button -->
        <div class="flex items-center sm:hidden">
          <button
            @click="toggleMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="isOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div :class="{ 'block': isOpen, 'hidden': !isOpen }" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          to="/"
          class="block pl-3 pr-4 py-2 border-l-4"
          :class="$route.path === '/' ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'"
          @click="isOpen = false"
        >
          Home
        </router-link>
        <router-link
          v-if="isAuthenticated"
          to="/stations"
          class="block pl-3 pr-4 py-2 border-l-4"
          :class="$route.path.includes('/stations') ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'"
          @click="isOpen = false"
        >
          Stations
        </router-link>
        <router-link
          v-if="isAuthenticated"
          to="/map"
          class="block pl-3 pr-4 py-2 border-l-4"
          :class="$route.path === '/map' ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'"
          @click="isOpen = false"
        >
          Map
        </router-link>
      </div>
      
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4">
          <template v-if="isAuthenticated">
            <button
              @click="logout"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full"
              @click="isOpen = false"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full"
              @click="isOpen = false"
            >
              Sign Up
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>