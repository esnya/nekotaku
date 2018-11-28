import Vue from 'vue';
import VueRouter from 'vue-router';
import * as RouteNames from '@/browser/constants/route';
import Loading from '@/browser/components/Loading.vue';
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
        component: import('@/browser/pages/LobbyPage.vue' /* webpackChunkName: "LobbyPage" */),
        loading: Loading,
      }),
    },
    {
      path: '/:id',
      name: RouteNames.Room,
      component: () => ({
        component: import('@/browser/pages/RoomPage.vue' /* webpackChunkName: "RoomPage" */),
        loading: Loading,
      }),
    },
    {
      path: '/:id/password',
      name: RouteNames.RoomPassword,
      component: () => ({
        component: import('@/browser/pages/RoomPasswordPage.vue' /* webpackChunkName: "RoomPasswordPage" */),
        loading: Loading,
      }),
    },
    {
      path: '/404',
      name: RouteNames.NotFound,
      component: NotFound,
    },
  ],
});
