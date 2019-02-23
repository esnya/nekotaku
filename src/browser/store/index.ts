/* eslint no-param-reassign: off */

import palette from 'google-material-color';
import Vue from 'vue';
import Vuex from 'vuex';
import Point from '../map/Point';

Vue.use(Vuex);

interface Entity {
  id: string;
  type: string;
  offset: Point;
}

interface MapStyle {
  stroke: string;
  strokeOpacity: number;
  strokeWidth: number;
  fill: string;
  fillOpacity: number;
}

interface MapStyleUpdate {
  stroke?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  fill?: string;
  fillOpacity?: number;
}

interface State {
  chatLimit: number;
  chatMessage: string | null;
  chatNameId: string | null;
  chatTo: string[] | null,
  mapZoom: number;
  mapMode: string;
  mapShapeType: string;
  mapSelected: Entity | null;
  mapStyle: MapStyle;
  mapPerspective: boolean;
}

const initialState: State = {
  chatLimit: 100,
  chatMessage: null,
  chatNameId: null,
  chatTo: null,
  mapZoom: 0,
  mapMode: 'move',
  mapShapeType: 'circle',
  mapSelected: null,
  mapStyle: {
    stroke: palette.get('Red'),
    strokeOpacity: 1.0,
    strokeWidth: 2,
    fill: palette.get('Red'),
    fillOpacity: 0.5,
  },
  mapPerspective: true,
};

export default new Vuex.Store({
  state: initialState,
  mutations: {
    updateChatMessage(state: State, message: string) {
      state.chatMessage = message;
    },

    selectChatName(state: State, chatNameId: string) {
      state.chatNameId = chatNameId;
    },

    updateChatTo(state: State, to: string[] | null) {
      state.chatTo = to;
    },

    addMapZoom(state: State, value: number) {
      state.mapZoom += value;
    },
    resetMapZoom(state: State) {
      state.mapZoom = 0;
    },
    selectMapEntity(state: State, entity: Entity) {
      state.mapSelected = entity;
    },
    deselectMapEntity(state: State) {
      state.mapSelected = null;
    },
    updateMapStyle(state: State, style: MapStyleUpdate) {
      state.mapStyle = {
        ...state.mapStyle,
        ...style,
      };
    },
    togglePerspective(state: State) {
      state.mapPerspective = !state.mapPerspective;
    },
  },
});
