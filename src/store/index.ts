import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import jwt_decode from "jwt-decode"; // eslint-disable-line
import { LaunchWrapperType } from '@/electronMain/models/gameLaunchArgs'
import StoreModel, { StoreServerModel } from '@/models/storeModel'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    firstLaunch: true,
    auth: {
      loggedIn: false,
      jwt: '',
      username: 'Dropship',
      userId: -1
    },
    bepinex: {
      installed: false,
      releaseId: -1
    },
    serverList: [],
    gameInstallInfo: {
      location: 'AMONGUSDIR',
      launchWrapper: LaunchWrapperType.Standard,
      customExecLine: ''
    }
  } as StoreModel,
  mutations: {
    login (state) {
      state.auth.loggedIn = true
    },
    logout (state) {
      state.auth.loggedIn = false
    },
    removeJwt (state) {
      state.auth.jwt = ''
    },
    addUserInfo (state, payload: { username: string; userId: number}) {
      state.auth.username = payload.username
      state.auth.userId = payload.userId
    },
    removeUserInfo (state) {
      state.auth.username = ''
      state.auth.userId = -1
    },
    addJwt (state, payload: string) {
      state.auth.jwt = payload
    },
    updateFirstLaunch (state, payload: boolean) {
      state.firstLaunch = payload
    },
    updateBepinexInstalled (state, payload: boolean) {
      state.bepinex.installed = payload
    },
    updateBepinexVersion (state, payload: number) {
      state.bepinex.releaseId = payload
    },
    addServer (state, payload: StoreServerModel) {
      state.serverList.push(payload)
    },
    removeServer (state, payload: StoreServerModel) {
      state.serverList = state.serverList.filter(s =>
        !(s.name === payload.name &&
        s.ipAddress === payload.ipAddress &&
        s.port === payload.port))
    },
    updateInstallLocation (state, path: string) {
      state.gameInstallInfo.location = path
    },
    updateLaunchWrapperType (state, launchWrapperType: LaunchWrapperType) {
      state.gameInstallInfo.launchWrapper = launchWrapperType
    },
    updateCustomExecLine (state, customExecLine: string) {
      state.gameInstallInfo.customExecLine = customExecLine
    }
  },
  actions: {
    login ({ commit }, payload) {
      commit('login')
      commit('addJwt', payload)
      const decoded: any = jwt_decode(payload); // eslint-disable-line
      commit('addUserInfo', {
        userId: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'],
        username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
      })
    },
    logout ({ commit, state }) {
      commit('logout')
      commit('removeJwt')
      commit('removeUserInfo')
      state.serverList.forEach(server => commit('removeServer', server.id))
    },
    installBepinex ({ commit }, payload: number) {
      commit('updateBepinexInstalled', true)
      commit('updateBepinexVersion', payload)
    },
    updateGameLaunchInfo ({ commit }, payload: { launchWrapper: LaunchWrapperType;
                                                customExecLine: string; }) {
      commit('updateLaunchWrapperType', payload.launchWrapper)
      commit('updateCustomExecLine', payload.customExecLine)
    }
  },
  modules: {
  },
  plugins: [createPersistedState({
    overwrite: true
  })]
})

export default store