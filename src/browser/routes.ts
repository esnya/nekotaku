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

export const RoomPassword: RouteConfig = {
  path: '/:roomId/password',
  name: 'room_password',
  component: () => ({
    component: import(/* webpackChunkName: 'RoomPasswordPage' */ '@/browser/pages/RoomPasswordPage.vue') as any,
    loading: Loading,
  }),
};

export const Sushi: RouteConfig = {
  path: '/🍣',
  name: '🍣',
  component: () => ({
    component: import(/* webpackChunkName: 'Sushi' */ '@/browser/pages/🍣.vue') as any,
    loading: Loading,
  }),
};

export const Chat: RouteConfig = {
  path: 'chat',
  alias: '',
  name: 'room',
  component: () => ({
    component: import(/* webpackChunkName: 'RoomChatPage' */ '@/browser/organisims/Chat.vue') as any,
    loading: Loading,
  }),
};

export const Memos: RouteConfig = {
  path: 'memos',
  name: 'room_memos',
  component: () => ({
    component: import(/* webpackChunkName: 'RoomChatPage' */ '@/browser/organisims/Memos.vue') as any,
    loading: Loading,
  }),
};

export const Characters: RouteConfig = {
  path: 'characters',
  name: 'room_characters',
  component: () => ({
    component: import(/* webpackChunkName: 'RoomChatPage' */ '@/browser/organisims/Characters.vue') as any,
    loading: Loading,
  }),
};

export const Map: RouteConfig = {
  path: 'map',
  name: 'room_map',
  component: () => ({
    component: import(/* webpackChunkName: 'RoomChatPage' */ '@/browser/organisims/Map.vue') as any,
    loading: Loading,
  }),
};

export const Room: RouteConfig = {
  path: '/:roomId',
  name: 'room',
  children: [
    // { path: '', redirect: 'chat' },
    Chat,
    Memos,
    Characters,
    Map,
  ],
  component: () => ({
    component: import(/* webpackChunkName: 'RoomPage' */ '@/browser/pages/RoomPage.vue') as any,
    loading: Loading,
  }),
};

export default [
  Lobby,
  Debug,
  Sushi,
  Room,
  RoomPassword,
];
