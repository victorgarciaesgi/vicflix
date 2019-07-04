// import 'es6-shim';
import 'reflect-metadata';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import App from './App.vue';
import { sync } from 'vuex-router-sync';
import { createStore } from '@/vuex-typed-modules';
import { Router } from '@router';
import { Component } from 'vue-property-decorator';
import { SvgIcon, Spinner, VButton, Popup, SearchField, InfiniScroll } from '@components';

import './registerServiceWorker';
import i18n from './i18n';

// Plugins declaration
Vue.use(Vuelidate);
Component.registerHooks(['validations']);

// Global components
Vue.component('SvgIcon', SvgIcon);
Vue.component('Spinner', Spinner);
Vue.component('VButton', VButton);
Vue.component('Popup', Popup);
Vue.component('SearchField', SearchField);
Vue.component('InfiniScroll', InfiniScroll);

Vue.config.productionTip = false;

const store = createStore({});

// Sync VueRouter and VuexStore
sync(store, Router, { moduleName: 'RouterModule' });

// Vue keycodes modifiers
Vue.config.keyCodes = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  esc: 27,
};

// Instance creation
new Vue({
  store,
  router: Router,
  i18n,
  render: h => h(App),
}).$mount('#app');
