'use strict'
import * as app from './app'
import * as auth from './auth'
import * as category from './category'

export default {
  app: { namespaced: true, ...app },
  auth: { namespaced: true, ...auth },
  category: { namespaced: true, ...category },
}
