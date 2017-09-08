import backend, { JoinResult } from '../backend';
import * as RouteNames from '../constants/route';
import objectStore from './objectStore';

export default {
  ...objectStore('room'),
  actions: {
    async joinRoom({ commit, state }, { id, router }) {
      [
        'characters',
        'map',
        'messages',
        'portraits',
        'shapes',
      ].forEach(key => commit(`${key}:clear`));

      const { password } = state.roomJoinInfo[id] || {};
      const {
        result,
        title,
      } = await backend.joinRoom(id, password, (event, value) => commit(event, value));

      if (result === JoinResult.PasswordRequired) {
        commit('room:update', {
          id,
          title,
          locked: true,
          passwordIncorrect: false,
        });
      } else if (result === JoinResult.IncorrectPassword) {
        commit('room:update', {
          id,
          title,
          locked: true,
          passwordIncorrect: true,
        });
      } else if (result === JoinResult.NotFound) {
        router.push({ name: RouteNames.NotFound });
      }
    },
    async leaveRoom({ commit }) {
      commit('room:update', null);
      await backend.leaveRoom();
    },
    async updateRoom(context, { key, value }) {
      await backend.updateRoom(key, value);
    },
  },
};
