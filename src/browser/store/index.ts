/* eslint no-param-reassign: off */

import Vue from 'vue';
import Vuex from 'vuex';
import chatControl from './modules/chatControl';
import chatMessage from './modules/chatMessage';
import mapControl from './modules/mapControl';
import whisperTargets from './modules/whisperTargets';

Vue.use(Vuex);

interface Message {
  title: string;
  body: string;
}

interface State {
  loadingCount: number;
  messages: Message[];
  room: { id: string };
}

const initialState: State = {
  loadingCount: 0,
  messages: [],
  room: { id: '' },
};

export default new Vuex.Store({
  modules: {
    chatControl,
    chatMessage,
    mapControl,
    whisperTargets,
  },
  state: initialState,
  mutations: {
    setLoading(state: State, loading: boolean) {
      if (loading) state.loadingCount += 1;
      else state.loadingCount -= 1;
    },
    pushMessage(state: State, { title, body }: Message) {
      state.messages.push({ title, body });
    },
  },
});
