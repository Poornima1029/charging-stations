import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// ✅ Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Your global styles (if any)
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
