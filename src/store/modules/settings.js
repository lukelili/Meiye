import { getItem, setItem } from '@/utils/storage'
const state = {
  dark: getItem('dark') || false
}

const mutations = {
  SET_DARK(state, bool) {
    state.dark = bool
    setItem('dark', bool)
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
