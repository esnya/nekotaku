import Vue from 'vue';
import VueRouter from 'vue-router';
import * as RouteNames from './constants/route';
import Loading from './vue/Loading.vue';
import NotFound from './vue/NotFound.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: RouteNames.Lobby,
      component: () => ({
        component: import('./vue/Lobby.vue'),
        loading: Loading,
      }),
    },
    {
      path: '/404',
      name: RouteNames.NotFound,
      component: NotFound,
    },
    {
      path: '/:id',
      name: RouteNames.Room,
      component: () => ({
        component: import('./vue/Room.vue'),
        loading: Loading,
      }),
    },
  ],
});
