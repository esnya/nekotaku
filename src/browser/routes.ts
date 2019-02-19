import { RouteConfig } from 'vue-router';
import Loading from '@/browser/atoms/Loading.vue';

export const Lobby: RouteConfig = {
  path: '/',
  name: 'lobby',
  component: () => ({
    component: import(/* webpackChunkName: 'LobbyPage' */ '@/browser/pages/LobbyPage.vue') as any,
    loading: Loading,
  }),
};

export const Debug: RouteConfig = {
  path: '/debug',
  name: 'debug',
  component: () => ({
    component: import(/* webpackChunkName: 'DebugPage' */ '@/browser/pages/DebugPage.vue') as any,
    loading: Loading,
  }),
};


export const Room: RouteConfig = {
  path: '/:roomId',
  name: 'room',
  component: () => ({
    component: import(/* webpackChunkName: 'RoomPage' */ '@/browser/pages/RoomPage.vue') as any,
    loading: Loading,
  }),
};

export const RoomPassword: RouteConfig = {
  path: '/:roomId/password',
  name: 'room_password',
  component: () => ({
    component: import(/* webpackChunkName: 'RoomPasswordPage' */ '@/browser/pages/RoomPasswordPage.vue') as any,
    loading: Loading,
  }),
};

export default [
  Lobby,
  Debug,
  Room,
  RoomPassword,
];
