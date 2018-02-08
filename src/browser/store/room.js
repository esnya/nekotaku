import backend, { JoinResult } from '../backend';
import * as RouteNames from '../constants/route';
import objectStore from './objectStore';

export default {
  ...objectStore('room'),
  actions: {
    async joinRoom({ commit, dispatch, state }, { id, router }) {
      [
        'characters',
        'maps',
        'memos',
        'messages',
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
      } else {
        dispatch('loadChatConfig', id);
      }
    },
    async leaveRoom({ commit }) {
      commit('room:update', null);
      await backend.leaveRoom();
    },
    async updateRoom(context, { key, value }) {
      await backend.updateRoom(key, value);
    },
    async clearRoomPassword() {
      await backend.clearRoomPassword();
    },
    async updateRoomPassword(context, password) {
      await backend.updateRoomPassword(password);
    },
    async removeRoom({ state }, router) {
      await backend.removeRoom(state.map, state.characters);
      router.push({ name: RouteNames.Lobby });
    },
  },
};
