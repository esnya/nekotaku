import '@babel/polyfill';
import 'vue-simple-markdown/dist/vue-simple-markdown.css';
import 'vuetify/dist/vuetify.min.css';

import { sync } from 'vuex-router-sync';
import App from '@/browser/App.vue';
import Dice from 'vue-dice-component';
import VeeValidate from 'vee-validate';
import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import VueSimpleMarkdown from 'vue-simple-markdown';
import VueYoutube from 'vue-youtube';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';
import config from '@/browser/config';
import get from 'lodash/get';
import mapValues from 'lodash/mapValues';
import moment from 'moment';
import router from '@/browser/router';
import store from '@/browser/store';

import '@/browser/styles/main.styl';

const VueExtensions = [
  Dice,
  VueSimpleMarkdown,
  VeeValidate,
  VueYoutube,
];

async function main() {
  moment.locale('ja');

  const theme = mapValues(config.theme, (value) => {
    if (value.match(/^#/)) return value;
    return get(colors, value);
  });

  Vue.use(Vuetify, { theme });
  VueExtensions.forEach((ext: any) => Vue.use(ext));

  Vue.directive('scroll', {
    inserted(el, binding) {
      el.classList.add('scroll');
      if (binding.value === 'y') el.classList.add('scroll-y');
      else if (binding.value === 'x') el.classList.add('scroll-x');
      else if (binding.value === 'all') el.classList.add('scroll-all');
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

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
});
