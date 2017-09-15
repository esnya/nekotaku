import backend from '../backend';
import * as RouteNames from '../constants/route';
import listStore from './listStore';

export default {
  ...listStore('rooms', true),
  actions: {
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
        password,
        router,
      },
    ) {
      const id = await backend.createRoom({
        title,
        dice,
        password,
        characterAttributes,
      }, {
        width: 10,
        height: 10,
      });
      router.push({ name: RouteNames.Room, params: { id } });
    },
  },
};
