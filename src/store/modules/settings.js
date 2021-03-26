import { getItem, setItem } from '@/utils/storage'
const state = {
  dark: getItem('dark') || 'light'
}

const mutations = {
  SET_STATE(state, data) {
    state[data.key] = data.value
    setItem(data.key, data.value)
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
