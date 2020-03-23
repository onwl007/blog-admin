'use strict'

const APPLY_LAYOUT = 'APPLY_LAYOUT'

export const state = {
  layout: 'empty',
}

export const getters = {
  layout: s => s.layout,
}

export const mutations = {
  [APPLY_LAYOUT]: (s, layout = 'default') => (s.layout = layout),
}

export const actions = {}
