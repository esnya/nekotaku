/* eslint no-param-reassign: off */

export default {
  mutations: {
    setChatName(state, name) {
      state.name = name;
    },
    setChatColor(state, color) {
      state.color = color;
    },
  },
  state: {
    name: 'ななしさん',
    color: ['Black', '500'],
  },
};
