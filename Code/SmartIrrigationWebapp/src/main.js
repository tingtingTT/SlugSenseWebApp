import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import router from './router'
import store from './store'

import 'vuetify/dist/vuetify.min.css'
import './style/material_icon.css'
import 'reset-css/reset.css'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
  created () {
    console.log('Created')
    this.$store.dispatch('setAsyncUserData', 'Do the initial query to server here!!!!')
    console.log('Created End')
  }
})
