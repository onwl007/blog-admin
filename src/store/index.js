'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
import storeModules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: storeModules,
})
