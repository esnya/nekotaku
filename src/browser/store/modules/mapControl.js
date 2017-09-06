/* eslint no-param-reassign: off */

export default {
  mutations: {
    addMapZoom(state, value) {
      state.zoom += value;
    },
    resetMapZoom(state) {
      state.zoom = 0;
    },
    setMapMode(state, mode) {
      state.mode = mode;
      state.selected = null;
    },
    selectEntity(state, selection) {
      state.selected = selection;
    },
    deselectEntity(state) {
      state.selected = null;
    },
  },
  state: {
    zoom: 0,
    mode: 'move',
    selected: null,
    style: {
      stroke: 'red',
      strokeWidth: 2,
      fill: 'none',
    },
  },
};
