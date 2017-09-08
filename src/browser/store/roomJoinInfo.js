/* eslint no-param-reassign: off */

export default {
  mutations: {
    setJoinRoomPassword(state, { id, password }) {
      state.roomJoinInfo[id] = {
        ...state.roomJoinInfo[id],
        password,
      };
    },
  },
  state: {
    roomJoinInfo: {},
  },
};
