import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './icons.js'

createApp(App)
  .component('fa', FontAwesomeIcon)
  .mount('#app')
