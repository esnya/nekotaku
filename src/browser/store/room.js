import backend from '../backend';
import objectStore from './objectStore';

export default {
  ...objectStore('room'),
  actions: {
    async joinRoom({ commit }, { id }) {
      [
        'characters',
        'map',
        'messages',
        'portraits',
        'shapes',
      ].forEach(key => commit(`${key}:clear`));

      await backend.joinRoom(id, (event, value) => commit(event, value));
    },
    async leaveRoom({ commit }) {
      await backend.leaveRoom();
      commit('room:update', null);
    },
    async updateRoom(context, { key, value }) {
      await backend.updateRoom(key, value);
    },
  },
};
