import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    heroesImageCache: null,
    itemsImageCache: null,
    matches: []
  },
  mutations: {
    setMatches (state, payload) {
      state.matches.push(...payload)
    },
    setHeroesImageCache (state, payload) {
      state.heroesImageCache = payload
    },
    setItemsImageCache (state, payload) {
      state.itemsImageCache = payload
    }
  }
})
