'use strict'
import * as app from './app'
import * as auth from './auth'

export default {
  app: { namespaced: true, ...app },
  auth: { namespaced: true, ...auth },
}
