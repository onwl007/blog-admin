import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router, { connectStore } from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.config.productionTip = false

Vue.use(iView)

connectStore(store)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
