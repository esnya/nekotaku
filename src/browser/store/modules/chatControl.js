/* eslint no-param-reassign: off */
import _ from 'lodash';
import sessionStorage from '../../utilities/sessionStorage';

function storageKey(roomId: string, key: string) {
  return `nekotaku:${roomId}:chat:${key}`;
}
function storageGet(roomId: string, key: string) {
  const data = sessionStorage.getItem(storageKey(roomId, key));
  return data && JSON.parse(data);
}
function storageSet(roomId: string, key: string, data: string) {
  sessionStorage.setItem(storageKey(roomId, key), JSON.stringify(data));
}

const saveName = _.debounce((roomId: string, name: string) => {
  storageSet(roomId, 'name', name);
}, 1000);
const saveColor = _.debounce((roomId: string, color: string[]) => {
  storageSet(roomId, 'color', color);
}, 1000);

const DefaultConfig = {
  name: 'ななしさん',
  color: '#000000',
};

function getRoomId(state) {
  return state.room && state.room.id;
}

export default {
  actions: {
    setChatName({ rootState, commit }, name) {
      commit('setChatName', name);
      saveName(getRoomId(rootState), name);
    },
    setChatColor({ rootState, commit }, color) {
      commit('setChatColor', color);
      saveColor(getRoomId(rootState), color);
    },
    loadChatConfig({ commit }, roomId: string) {
      commit('setChatConfig', roomId ? {
        name: storageGet(roomId, 'name') || DefaultConfig.name,
        color: storageGet(roomId, 'color') || DefaultConfig.color,
      } : DefaultConfig);
    },
  },
  mutations: {
    setChatConfig(state, { name, color }) {
      Object.assign(state, {
        name,
        color,
      });
    },
    setChatName(state, name) {
      state.name = name;
    },
    setChatColor(state, color) {
      state.color = color;
    },
  },
  state: {
    ...DefaultConfig,
  },
};
