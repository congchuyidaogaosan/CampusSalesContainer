import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // 用户登录
  async login({ commit }, userInfo) {
    try {
      const { username, password } = userInfo
      const data = await login({ adminAccount: username.trim(), adminPassword:password })
      // commit('SET_TOKEN', data.token)
      setToken("64688434343834846684egsgaws64gwa64gwa46gwa46g6wa4")
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  // 获取用户信息
  async getInfo({ commit }) {
    try {
      const data = await getInfo()
      const { name, avatar, roles } = data
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_ROLES', roles)
      return data
    } catch (error) {
      console.error('GetInfo error:', error)
      throw error
    }
  },

  // 用户登出
  async logout({ commit }) {
    try {
      await logout()
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
} 