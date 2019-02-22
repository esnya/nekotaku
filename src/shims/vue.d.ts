// import Vue from 'vue';
// import { Validator } from 'vee-validate';
// import VueRouter, { Route } from 'vue-router';

// declare module '*.vue' {
//   interface NekoVue extends Vue {
//     $route: Route;
//     $router: VueRouter;
//     $validator: Validator;
//   }

//   export default NekoVue;
// }

// declare module 'vue/types/vue' {
//   interface VueConstructor {
//     $route: Route;
//     $router: VueRouter;
//     $validator: Validator;
//   }
// }
import Vue, { VNode } from 'vue';

declare module '*.vue' {
  import Vue, { VNode } from 'vue';
  export default Vue;
}

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    // interface IntrinsicElements {
    //   [elem: string]: any;
    // }
  }
}
