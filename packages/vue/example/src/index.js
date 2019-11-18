import FleurVue from '../../dist/index'
import Vue from 'vue'
import App from './app.vue'
import Fleur from '@fleur/fleur'
import { CountStore } from './CountStore'

const fleurApp = new Fleur({ stores: [CountStore] })

Vue.use(FleurVue)

document.addEventListener('DOMContentLoaded', () => {
  const app = new Vue({
    ...App,
    context: fleurApp.createContext(),
  })

  app.$mount(document.getElementById('root'))
})
