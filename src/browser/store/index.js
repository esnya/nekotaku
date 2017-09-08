/* eslint no-param-reassign: off, no-useless-computed-key: off */
import { merge } from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
import chatControl from './modules/chatControl';
import mapControl from './modules/mapControl';
import characters from './characters';
import map from './map';
import messages from './messages';
import room from './room';
import rooms from './rooms';
import roomJoinInfo from './roomJoinInfo';
import portraits from './portraits';
import shapes from './shapes';

Vue.use(Vuex);

export default new Vuex.Store(merge(
  characters,
  map,
  messages,
  room,
  rooms,
  roomJoinInfo,
  portraits,
  shapes,
  {
    modules: {
      chatControl,
      mapControl,
    },
  },
));
