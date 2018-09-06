import Vue from 'vue'
import VueResource from 'vue-resource'
import { sync } from 'vuex-router-sync'
import Vuelidate from 'vuelidate'
import App from './App.vue'

import router from './routes'
import store from './store/store'
import { currency } from './filters/currency'

Vue.use(VueResource)
Vue.use(Vuelidate)
Vue.filter('currency', currency)

Vue.http.options.root = 'https://ml-stock-trader.firebaseio.com/'

const unsync = sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
