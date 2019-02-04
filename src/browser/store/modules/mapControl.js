/* eslint no-param-reassign: off */
import colors from 'vuetify/es5/util/colors';

export default {
  mutations: {
    addMapZoom(state, value) {
      state.zoom += value;
    },
    resetMapZoom(state) {
      state.zoom = 0;
    },
    updateMapMode(state, { mode, shapeType }) {
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
    gridVisibility: true,
    style: {
      stroke: colors.red.base,
      strokeOpacity: 1.0,
      strokeWidth: 2,
      fill: colors.red.base,
      fillOpacity: 0.5,
    },
  },
};
