import 'vuetify/dist/vuetify.min.css';
import 'mdi/css/materialdesignicons.min.css';

import moment from 'moment';
import Vue from 'vue';
import Vuetify from 'vuetify';
import { sync } from 'vuex-router-sync';
import App from './vue/App.vue';
import router from './router';
import store from './store';

moment.locale('ja');

Vue.use(Vuetify);
sync(store, router);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
