import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { Component } from 'nuxt-property-decorator';
import {
  SvgIcon,
  Spinner,
  Popin,
  Separator,
  VImg,
  Action,
  Container,
  BackButton,
  Modal,
} from '@global';
import { FormContainer } from '@components';
import { defineNuxtPlugin } from '@nuxtjs/composition-api';
import { pluralize } from '@utils';

export default defineNuxtPlugin((ctx, inject) => {
  inject('plural', pluralize);
  Vue.use(Vuelidate);
  const HOOKS = ['asyncData', 'head', 'validations', 'fetch', 'setup'];
  Component.registerHooks(HOOKS);

  const activateDevTools = ['development', 'testing'].includes(process.env.NUXT_ENV_STAGE ?? '');
  Vue.config.devtools = activateDevTools;

  Vue.component('SvgIcon', SvgIcon);
  Vue.component('Spinner', Spinner);
  Vue.component('Popin', Popin);
  Vue.component('Separator', Separator);
  Vue.component('VImg', VImg);
  Vue.component('Action', Action);
  Vue.component('BackButton', BackButton);
  Vue.component('Container', Container);
  Vue.component('Modal', Modal);
  Vue.component('Spinner', Spinner);

  //
  Vue.component('FormContainer', FormContainer);
  Vue.use({
    install(Vue) {
      Vue.mixin({
        data() {
          return {
            isMounted: false,
          };
        },
        mounted() {
          // @ts-ignore
          this.isMounted = true;
        },
      });
    },
  });
});
