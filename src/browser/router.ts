import Vue from 'vue';
import VueRouter from 'vue-router';
import * as RouteNames from '@/browser/constants/route';
import Loading from '@/browser/atoms/Loading.vue';
import NotFound from '@/browser/pages/NotFound.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: RouteNames.Lobby,
      component: () => ({
        component: import(/* webpackChunkName: 'LobbyPage' */ '@/browser/pages/LobbyPage.vue'),
        loading: Loading,
      }),
    },
    {
      path: '/debug',
      name: RouteNames.Debug,
      component: () => ({
        component: import(/* webpackChunkName: 'DebugPage' */ '@/browser/pages/DebugPage.vue'),
        loading: Loading,
      }),
    },
    {
      path: '/:roomId',
      name: RouteNames.Room,
      component: () => ({
        component: import(/* webpackChunkName: 'RoomPage' */ '@/browser/pages/RoomPage.vue'),
        loading: Loading,
      }),
    },
    {
      path: '/:roomId/password',
      name: RouteNames.RoomPassword,
      component: () => ({
        component: import(/* webpackChunkName: 'RoomPasswordPage' */ '@/browser/pages/RoomPasswordPage.vue'),
        loading: Loading,
      }),
    },
    {
      path: '/404',
      name: RouteNames.NotFound,
      component: NotFound,
    },
  ],
} as any);
