import { createStore } from "vuex";

export const userStore = createStore({
  state: {
    user: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    }
  }
});
