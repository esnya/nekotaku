/* eslint no-param-reassign: off, no-useless-computed-key: off */

import Vue from 'vue';
import Vuex from 'vuex';
import backend from './backend';
import InitialState from './constants/InitialState';

Vue.use(Vuex);

const actions = {
  async joinLobby({ commit }) {
    commit('rooms:clear');
    await backend.joinLobby((event, value) => commit(event, value));
  },
  async leaveLobby() {
    await backend.leaveLobby();
  },
  async createRoom(
    store,
    {
      title,
      dice,
      characterAttributes,
      router,
    },
  ) {
    const id = await backend.createRoom(title, dice, characterAttributes);
    router.push({ name: 'room', params: { id } });
  },
  async joinRoom({ commit }, { id }) {
    commit('clearRoom');
    await backend.joinRoom(id, (event, value) => commit(event, value));
  },
  async leaveRoom({ commit }) {
    await backend.leaveRoom();
    commit('room:update', null);
  },
  async updateRoom(store, { key, value }) {
    await backend.updateRoom(key, value);
  },
  async sendMessage(store, message) {
    const {
      body,
    } = message;

    await backend.sendMessage({
      ...message,
      body: body.split(/\n/g).map(text => ({ type: 'text', text })),
      createdAt: Date.now(),
    });
  },
};
const mutations = {
  clearRoom(state) {
    state.characters = [];
    state.messages = [];
    state.map = null;
    state.portraits = [];
  },

  'characters:add': (state, character) => {
    state.characters.push(character);
  },
  'map:update': (state, map) => {
    state.map = map;
  },
  'messages:add': (state, message) => {
    state.messages.push(message);

    const {
      name,
      face,
    } = message;

    const character = state.characters.find(c => c.name === name);
    if (!character) return;

    const portrait = character.portrait && character.portrait[face];
    if (!portrait) return;

    state.portraits = [
      portrait,
      ...state.portraits.filter(p => p !== portrait),
    ];
  },
  'room:update': (state, room) => {
    state.room = room;
  },
  'rooms:clear': (state) => {
    state.rooms = [];
  },
  'rooms:add': (state, room) => {
    state.rooms = [
      room,
      ...state.rooms,
    ];
  },
  'shapes:add': (state, shape) => {
    state.shapes.push(shape);
  },
};
const getters = {};

export default new Vuex.Store({
  state: InitialState,
  actions,
  mutations,
  getters,
});
