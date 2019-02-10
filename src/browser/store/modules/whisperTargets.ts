/* eslint no-param-reassign: off */

interface State {
  whisperTargets: string[] | null;
}

export default {
  getters: {
    whisperTargets(state: State) {
      return state.whisperTargets;
    },
  },
  mutations: {
    updateWhisperTargets(state: State, targets: string[] | null) {
      state.whisperTargets = (!targets || targets.length === 0) ? null : targets;
    },
  },
  state: {
    whisperTargets: null,
  },
};
