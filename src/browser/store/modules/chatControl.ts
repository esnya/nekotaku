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

interface NameConfiguration {
  id: string;
  name: string;
  color: string;
}

interface State {
  configList: NameConfiguration[];
  selectedId: string;
  messagesLimit: number;
  channel: string;
  selectedChatId: string;
}

interface RootState {
  room: { id: string }
}

function getRoomId(state: RootState) {
  return state.room && state.room.id;
}

interface Context {
  state: State;
  rootState: RootState;
  commit<T>(mutation: string, payload?: T): void;
}

export default {
  actions: {
    addChatConfig({ state, rootState, commit }: Context) {
      commit('addChatConfig');
      save(getRoomId(rootState), state);
    },
    deleteChatConfig({ state, rootState, commit }: Context, id: string) {
      commit('deleteChatConfig', id);
      save(getRoomId(rootState), state);
    },
    selectChatConfig({ state, rootState, commit }: Context, id: string) {
      commit('selectChatConfig', id);
      save(getRoomId(rootState), state);
    },
    setChatName({ state, rootState, commit }: Context, name: string) {
      commit('setChatName', name);
      save(getRoomId(rootState), state);
    },
    setChatColor({ state, rootState, commit }: Context, color: string) {
      commit('setChatColor', color);
      save(getRoomId(rootState), state);
    },
    updateMessagesLimit({ state, rootState, commit }: Context, limit: number) {
      commit('updateMessagesLimit', limit);
      save(getRoomId(rootState), state);
    },
    updateChatConfig({ state, rootState, commit }: Context, config: NameConfiguration) {
      commit('updateChatConfig', config);
      save(getRoomId(rootState), state);
    },
    loadChatConfig({ commit }: Context, roomId: string) {
      commit('setChatConfig', (roomId && storageGet(roomId)) || DefaultState);
    },
    selectChannel({ state, rootState, commit }: Context, channel: string) {
      commit('selectChannel', channel);
      save(getRoomId(rootState), state);
    },
  },
  mutations: {
    addChatConfig(state: State) {
      const id = shortid();
      state.configList.push({
        ...(state.configList.find(c => c.id === state.selectedId) || DefaultConfig),
        id,
      });
      state.selectedId = id;
    },
    deleteChatConfig(state: State, id: string) {
      state.configList = state.configList.filter(c => c.id !== id);
      if (state.configList.length === 0) state.configList = [DefaultConfig];
      if (state.selectedId === id) state.selectedChatId = state.configList[0].id;
    },
    selectChatConfig(state: State, id: string) {
      if (state.configList.find(c => c.id === id)) {
        state.selectedId = id;
      }
    },
    setChatConfig(state: State, value: {}) {
      Object.assign(state, value);
    },
    updateMessagesLimit(state: State, limit: number) {
      state.messagesLimit = Number(limit);
    },
    updateChatConfig(state: State, { id, name, color }: NameConfiguration) {
      state.configList = state.configList.map(config => (
        config.id === id
          ? { ...config, name, color }
          : config
      ));
    },
    selectChannel(state: State, channel: string) {
      state.channel = channel;
    },
  },
  state: DefaultState,
  getters: {
    chatControl(state: State) {
      return state.configList.find(({ id }) => id === state.selectedId) || DefaultConfig;
    },
    chatConfig(state: State) {
      return state.configList.find(({ id }) => id === state.selectedId) || DefaultConfig;
    },
    chatConfigList(state: State) {
      return state.configList;
    },
    selectedChatId(state: State) {
      return state.selectedId;
    },
    messagesLimit(state: State) {
      return state.messagesLimit || 100;
    },
  },
};
