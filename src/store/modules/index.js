'use strict'
import * as app from './app'
import * as auth from './auth'
import * as category from './category'
import * as tag from './tag'

export default {
  app: { namespaced: true, ...app },
  auth: { namespaced: true, ...auth },
  category: { namespaced: true, ...category },
  tag: { namespaced: true, ...tag },
}
