'use strict'
import * as auth from './auth'

export default {
  auth: { namespaced: true, ...auth },
}
