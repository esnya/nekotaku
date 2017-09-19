import Vue from 'vue';
import VueRouter from 'vue-router';
import * as RouteNames from './constants/route';
import LobbyPage from './vue/LobbyPage.vue';
import NotFound from './vue/NotFound.vue';
import RoomPage from './vue/RoomPage.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: RouteNames.Lobby,
      component: LobbyPage,
    },
    {
      path: '/404',
      name: RouteNames.NotFound,
      component: NotFound,
    },
    {
      path: '/:id',
      name: RouteNames.Room,
      component: RoomPage,
    },
  ],
});
