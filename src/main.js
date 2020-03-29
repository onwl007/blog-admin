import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router, { connectStore } from './router'
import store from './store'
import iView from 'iview'
import iEditor from 'iview-editor'
import 'iview/dist/styles/iview.css'

Vue.config.productionTip = false

Vue.use(iView)
Vue.use(iEditor)

connectStore(store)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
