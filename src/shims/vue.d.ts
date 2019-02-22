import Vue from 'vue';
import { Validator } from 'vee-validate';
import VueRouter, { Route } from 'vue-router';

declare module '*.vue' {
  interface NekoVue extends Vue {
    $route: Route;
    $router: VueRouter;
    $validator: Validator;
  }

  export default NekoVue;
}

declare module 'vue/types/vue' {
  interface VueConstructor {
    $route: Route;
    $router: VueRouter;
    $validator: Validator;
  }
}
