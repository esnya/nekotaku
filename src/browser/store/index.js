/* eslint no-param-reassign: off, no-useless-computed-key: off */
import { merge } from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
import chatControl from './modules/chatControl';
import mapControl from './modules/mapControl';
import characters from './characters';
import map from './map';
import member from './member';
import memos from './memos';
import messages from './messages';
import room from './room';
import rooms from './rooms';
import roomJoinInfo from './roomJoinInfo';
import shapes from './shapes';

Vue.use(Vuex);

export default new Vuex.Store(merge(
  characters,
  map,
  member,
  memos,
  messages,
  room,
  rooms,
  roomJoinInfo,
  shapes,
  {
    modules: {
      chatControl,
      mapControl,
    },
  },
));
