/* eslint no-param-reassign: off */
import palette from 'google-material-color';

interface State {
  zoom: number;
  mode: string;
  shapeType: string;
  selected: string | null;
  style: {
  };
  perspective: boolean;
}

export default {
  mutations: {
    addMapZoom(state: State, value: number) {
      state.zoom += value;
    },
    resetMapZoom(state: State) {
      state.zoom = 0;
    },
    updateMapMode(state: State, { mode, shapeType }: { mode: string, shapeType: string }) {
      state.mode = mode;
      state.shapeType = shapeType;
      state.selected = null;
    },
    selectEntity(state: State, selection: string | null) {
      state.selected = selection;
    },
    deselectEntity(state: State) {
      state.selected = null;
    },
    updateMapStyle(state: State, { key, value }: { key: string, value: any }) {
      state.style = {
        ...state.style,
        [key]: value,
      };
    },
    togglePerspective(state: State) {
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
      stroke: palette.get('red'),
      strokeOpacity: 1.0,
      strokeWidth: 2,
      fill: palette.get('red'),
      fillOpacity: 0.5,
    },
  },
};
