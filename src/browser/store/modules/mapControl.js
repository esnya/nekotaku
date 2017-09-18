/* eslint no-param-reassign: off */

export default {
  mutations: {
    addMapZoom(state, value) {
      state.zoom += value;
    },
    resetMapZoom(state) {
      state.zoom = 0;
    },
    setMapMode(state, { mode, shapeType }) {
      state.mode = mode;
      state.shapeType = shapeType;
      state.selected = null;
    },
    selectEntity(state, selection) {
      state.selected = selection;
    },
    deselectEntity(state) {
      state.selected = null;
    },
    updateMapStyle(state, { key, value }) {
      state.style = {
        ...state.style,
        [key]: value,
      };
    },
    togglePerspective(state) {
      state.perspective = !state.perspective;
    },
  },
  state: {
    zoom: 0,
    perspective: false,
    mode: 'move',
    shapeType: null,
    selected: null,
    style: {
      stroke: ['Red', '500'],
      strokeOpacity: 1.0,
      strokeWidth: 2,
      fill: ['Red', '500'],
      fillOpacity: 0.5,
    },
  },
};
