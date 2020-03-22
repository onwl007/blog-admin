'use strict'
import { Message } from 'iview'

const LOGIN_REQUEST = 'LOGIN_REQUEST'
const LOGIN_FAILURE = 'LOGIN_FAILURE'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'

export const state = {
  loading: false,
  info: '',
  token: '',
}

export const getters = {
  loading: s => s.loading,
  info: s => s.info,
  token: s => s.token,
  isLogin: s => !!s.token,
}

export const mutations = {
  [LOGIN_REQUEST]: s => (s.loading = true),
  [LOGIN_FAILURE]: s => (s.loading = false),
  [LOGIN_SUCCESS]: (s, token) => {
    s.loading = false
    s.token = token
  },
}

export const actions = {
  async login({ commit, state }) {
    if (state.loading) {
      return
    }
    commit(LOGIN_REQUEST)
    Message.success('登录成功')
    commit(LOGIN_SUCCESS, 'token')
    return true
  },

  // async logout({ commit, dispatch, state }, params = {}) {
  //   if (state.loading) {
  //     return
  //   }
  // },
}
