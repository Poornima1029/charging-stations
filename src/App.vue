<script setup lang="ts">
// ❌ Removed unused: onMounted, useRouter
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <footer class="bg-gray-800 text-white py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <h3 class="text-xl font-bold">ChargingHub</h3>
            <p class="text-gray-400 text-sm mt-1">Manage your charging stations with ease</p>
          </div>
          <div class="flex space-x-6">
            <a href="#" class="text-gray-400 hover:text-white" aria-label="Facebook">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12..." clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white" aria-label="Twitter">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675..." />
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white" aria-label="GitHub">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425..." clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        <div class="mt-4 text-center md:text-left text-sm text-gray-400">
          © 2025 ChargingHub. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>
