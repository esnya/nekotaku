import 'vue-dice-component/lib/dice.css';
import 'vue-simple-markdown/dist/vue-simple-markdown.css';
import 'mdi/css/materialdesignicons.min.css';

import moment from 'moment';
import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import Dice from 'vue-dice-component';
import VueSimpleMarkdown from 'vue-simple-markdown';
import Vuetify from 'vuetify';
import { sync } from 'vuex-router-sync';
import App from './vue/App.vue';
import config from './config';
import router from './router';
import store from './store';

import './styles/vuetify.styl';
import './styles/main.styl';

async function main() {
  moment.locale('ja');

  Vue.use(Dice);
  Vue.use(Vuetify);
  Vue.use(VueSimpleMarkdown);
  Vue.directive('scroll', {
    inserted(el, binding) {
      el.classList.add('scroll');
      if (binding.value === 'y') el.classList.add('scroll-y');
      else if (binding.value === 'x') el.classList.add('scroll-x');
      else if (binding.value === 'all') el.classList.add('scroll-all');

      // el.addEventListener('touchmove', e => e.stopPropagation());
    },
  });

  if (config.googleAnalytics) {
    Vue.use(VueAnalytics, {
      id: config.googleAnalytics.id,
      router,
    });
  }

  sync(store, router);

  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
}
main();
