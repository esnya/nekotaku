/* eslint no-param-reassign: off */

import Vue from 'vue';
import Vuex from 'vuex';
import chatControl from './modules/chatControl';
import mapControl from './modules/mapControl';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    chatControl,
    mapControl,
  },
  state: {
    loadingCount: 0,
    messages: [],
  },
  mutations: {
    setLoading(state, loading) {
      if (loading) state.loadingCount += 1;
      else state.loadingCount -= 1;
    },
    pushMessage(state, { title, body }) {
      this.messages.push({ title, body });
    },
  },
});
