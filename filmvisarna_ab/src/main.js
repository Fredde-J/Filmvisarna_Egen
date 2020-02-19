import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import M from '../public/js/materialize.min.js'

Vue.prototype.$M = M
Vue.$M = Vue.prototype.$M

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
