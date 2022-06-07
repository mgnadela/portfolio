export default {
  namespaced: true,

  state: {
    lang: 'en',
    counter: 0
  },

  mutations: {
    TRIGGER_COUNT (state) {
      state.counter++
    }
  }
}
