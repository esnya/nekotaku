/* eslint no-param-reassign: off */
import _ from 'lodash';
import shortid from 'shortid';
import storage from '../../utilities/localStorage';

function storageKey(roomId: string) {
  return `nekotaku:${roomId}:chatControl`;
}
function storageGet(roomId: string) {
  const data = storage.getItem(storageKey(roomId));
  return data && JSON.parse(data);
}
function storageSet(roomId: string, data: Object) {
  storage.setItem(storageKey(roomId), JSON.stringify(data));
}

const save = _.debounce((roomId: string, data: Object) => {
  storageSet(roomId, data);
}, 1000);

const DefaultId = shortid();
const DefaultConfig = {
  id: DefaultId,
  name: 'ななしさん',
  color: '#000000',
};
const DefaultState = {
  configList: [DefaultConfig],
  selectedId: DefaultId,
};

function getRoomId(state) {
  return state.room && state.room.id;
}

export default {
  actions: {
    addChatConfig({ state, rootState, commit }) {
      commit('addChatConfig');
      save(getRoomId(rootState), state);
    },
    removeChatConfig({ state, rootState, commit }) {
      commit('removeChatConfig');
      save(getRoomId(rootState), state);
    },
    selectChatConfig({ state, rootState, commit }, id) {
      commit('selectChatConfig', id);
      save(getRoomId(rootState), state);
    },
    setChatName({ state, rootState, commit }, name) {
      commit('setChatName', name);
      save(getRoomId(rootState), state);
    },
    setChatColor({ state, rootState, commit }, color) {
      commit('setChatColor', color);
      save(getRoomId(rootState), state);
    },
    loadChatConfig({ commit }, roomId: string) {
      commit('setChatConfig', (roomId && storageGet(roomId)) || DefaultState);
    },
  },
  mutations: {
    addChatConfig(state) {
      const id = shortid();
      state.configList.push({
        ...(state.configList.find(c => c.id === state.selectedId) || DefaultConfig),
        id,
      });
      state.selectedId = id;
    },
    removeChatConfig(state) {
      if (state.configList.length > 1) {
        const { selectedId } = state;
        const nextSelectedIndex = Math.max(
          state.configList.findIndex(c => c.id === selectedId) - 1,
          0,
        );
        state.selectedId = state.configList[nextSelectedIndex].id;
        state.configList = state.configList.filter(c => c.id !== selectedId);
      }
    },
    selectChatConfig(state, id) {
      if (state.configList.find(c => c.id === id)) {
        state.selectedId = id;
      }
    },
    setChatConfig(state, value) {
      Object.assign(state, value);
    },
    setChatName(state, name) {
      state.configList = state.configList.map(config => (
        config.id === state.selectedId
          ? { ...config, name }
          : config
      ));
    },
    setChatColor(state, color) {
      state.configList = state.configList.map(config => (
        config.id === state.selectedId
          ? { ...config, color }
          : config
      ));
    },
  },
  state: DefaultState,
  getters: {
    chatControl(state) {
      return state.configList.find(({ id }) => id === state.selectedId) || DefaultConfig;
    },
    chatConfigList(state) {
      return state.configList;
    },
    selectedChatId(state) {
      return state.selectedId;
    },
  },
};
