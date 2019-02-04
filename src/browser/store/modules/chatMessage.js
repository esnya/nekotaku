/* eslint no-param-reassign: off */

export default {
  getters: {
    chatMessage(state) {
      return state.chatMessage;
    },
  },
  mutations: {
    updateChatMessage(state, message) {
      state.chatMessage = message;
    },
  },
  state: {
    chatMessage: null,
  },
};
