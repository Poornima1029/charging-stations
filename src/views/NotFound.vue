<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 text-center">
    <h1 class="text-6xl md:text-8xl font-bold text-primary-500">404</h1>
    <p class="mt-4 text-xl md:text-2xl text-gray-700">Page not found</p>
    <p class="mt-2 text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
    <button 
      @click="goHome"
      class="mt-8 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      Go back home
    </button>
  </div>
</template>