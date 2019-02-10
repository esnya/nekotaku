/* eslint no-param-reassign: off */
import _ from 'lodash';
import shortid from 'shortid';
import storage from '../../wrappers/localStorage';

function storageKey(roomId: string) {
  return `nekotaku:${roomId}:chatControl`;
}
function storageGet(roomId: string) {
  const data = storage.getItem(storageKey(roomId));
  return data && JSON.parse(data);
}
function storageSet(roomId: string, data: {}) {
  storage.setItem(storageKey(roomId), JSON.stringify(data));
}

const save = _.debounce((roomId: string, data: {}) => {
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
  messagesLimit: 100,
  channel: 'メイン',
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
    deleteChatConfig({ state, rootState, commit }, id) {
      commit('deleteChatConfig', id);
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
    updateMessagesLimit({ state, rootState, commit }, limit) {
      commit('updateMessagesLimit', limit);
      save(getRoomId(rootState), state);
    },
    updateChatConfig({ state, rootState, commit }, config) {
      commit('updateChatConfig', config);
      save(getRoomId(rootState), state);
    },
    loadChatConfig({ commit }, roomId: string) {
      commit('setChatConfig', (roomId && storageGet(roomId)) || DefaultState);
    },
    selectChannel({ state, rootState, commit }, channel) {
      commit('selectChannel', channel);
      save(getRoomId(rootState), state);
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
    deleteChatConfig(state, id) {
      state.configList = state.configList.filter(c => c.id !== id);
      if (state.configList.length === 0) state.configList = [DefaultConfig];
      if (state.selectedId === id) state.selectedChatId = state.configList[0].id;
    },
    selectChatConfig(state, id) {
      if (state.configList.find(c => c.id === id)) {
        state.selectedId = id;
      }
    },
    setChatConfig(state, value) {
      Object.assign(state, value);
    },
    updateMessagesLimit(state, limit) {
      state.messagesLimit = Number(limit);
    },
    updateChatConfig(state, { id, name, color }) {
      state.configList = state.configList.map(config => (
        config.id === id
          ? { ...config, name, color }
          : config
      ));
    },
    selectChannel(state, channel) {
      state.channel = channel;
    },
  },
  state: DefaultState,
  getters: {
    chatControl(state) {
      return state.configList.find(({ id }) => id === state.selectedId) || DefaultConfig;
    },
    chatConfig(state) {
      return state.configList.find(({ id }) => id === state.selectedId) || DefaultConfig;
    },
    chatConfigList(state) {
      return state.configList;
    },
    selectedChatId(state) {
      return state.selectedId;
    },
    messagesLimit(state) {
      return state.messagesLimit || 100;
    },
  },
};
