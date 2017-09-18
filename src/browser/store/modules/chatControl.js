/* eslint no-param-reassign: off */

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

const DefaultConfig = {
  name: 'ななしさん',
  color: ['Black', '500'],
};

function getRoomId(state) {
  return state.room && state.room.id;
}

export default {
  actions: {
    setChatName({ rootState, commit }, name) {
      commit('setChatName', name);
      storageSet(getRoomId(rootState), 'name', name);
    },
    setChatColor({ rootState, commit }, color) {
      commit('setChatColor', color);
      storageSet(getRoomId(rootState), 'color', color);
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
