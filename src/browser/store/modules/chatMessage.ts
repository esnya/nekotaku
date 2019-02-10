/* eslint no-param-reassign: off */

interface State {
  chatMessage: string;
}

export default {
  getters: {
    chatMessage(state: State) {
      return state.chatMessage;
    },
  },
  mutations: {
    updateChatMessage(state: State, message: string) {
      state.chatMessage = message;
    },
  },
  state: {
    chatMessage: null,
  },
};
