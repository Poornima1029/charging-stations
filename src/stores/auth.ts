import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
    
    try {
      user.value = jwtDecode(newToken)
    } catch (error) {
      console.error('Failed to decode token:', error)
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password })
      setToken(response.data.token)
      return response.data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const response = await api.post('/auth/register', { name, email, password })
      setToken(response.data.token)
      return response.data
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  // Initialize user from token if it exists
  if (token.value) {
    try {
      user.value = jwtDecode(token.value)
    } catch (error) {
      console.error('Invalid token:', error)
      logout()
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout
  }
})