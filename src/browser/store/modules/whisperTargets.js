/* eslint no-param-reassign: off */

export default {
  getters: {
    whisperTargets(state) {
      return state.whisperTargets;
    },
  },
  mutations: {
    updateWhisperTargets(state, targets) {
      state.whisperTargets = (!targets || targets.length === 0) ? null : targets;
    },
  },
  state: {
    whisperTargets: null,
  },
};
