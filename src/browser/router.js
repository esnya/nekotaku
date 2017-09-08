import Vue from 'vue';
import VueRouter from 'vue-router';
import * as RouteNames from './constants/route';
import Lobby from './vue/Lobby.vue';
import Room from './vue/Room.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: RouteNames.Lobby,
      component: Lobby,
    },
    {
      path: '/:id',
      name: RouteNames.Room,
      component: Room,
    },
  ],
});
