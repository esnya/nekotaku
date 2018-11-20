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
});
