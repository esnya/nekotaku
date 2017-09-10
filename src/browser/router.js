import Vue from 'vue';
import VueRouter from 'vue-router';
import * as RouteNames from './constants/route';
import NotFound from './vue/NotFound.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: RouteNames.Lobby,
      component: () => import('./vue/Lobby.vue'),
    },
    {
      path: '/404',
      name: RouteNames.NotFound,
      component: NotFound,
    },
    {
      path: '/:id',
      name: RouteNames.Room,
      component: () => import('./vue/Room.vue'),
    },
  ],
});
