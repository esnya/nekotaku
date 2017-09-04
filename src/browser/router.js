import Vue from 'vue';
import VueRouter from 'vue-router';
import Lobby from './vue/Lobby.vue';
import Room from './vue/Room.vue';
import JoinRoom from './vue/JoinRoom.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'lobby',
      component: Lobby,
    },
    {
      path: '/rooms/:id/join',
      name: 'join-room',
      component: JoinRoom,
    },
    {
      path: '/rooms/:id',
      name: 'room',
      component: Room,
    },
  ],
});
