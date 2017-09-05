import 'vuetify/dist/vuetify.min.css';
import 'mdi/css/materialdesignicons.min.css';

import moment from 'moment';
import Vue from 'vue';
import Vuetify from 'vuetify';
import { sync } from 'vuex-router-sync';
import App from './vue/App.vue';
import Loading from './vue/Loading.vue';
import router from './router';
import store from './store';

async function main() {
  moment.locale('ja');

  Vue.use(Vuetify);
  const loading = new Vue(Loading).$mount('#static-loading');

  await import('./utilities/bcdice');

  sync(store, router);

  loading.$destroy();
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
}
main();
