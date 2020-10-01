import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { Component } from 'nuxt-property-decorator';

import { Component as Mixin } from 'vue-mixin-decorator';
import {
  SvgIcon,
  Spinner,
  Popin,
  SearchField,
  Separator,
  VImg,
  Action,
  BackButton,
} from '@components';

// Vue.use(VueCompositionApi);
Vue.use(Vuelidate);
const HOOKS = ['asyncData', 'head', 'validations', 'fetch', 'setup'];
Component.registerHooks(HOOKS);

const activateDevTools = ['development', 'testing'].includes(process.env.NUXT_ENV_STAGE ?? '');
Vue.config.devtools = activateDevTools;

Vue.component('SvgIcon', SvgIcon);
Vue.component('Spinner', Spinner);
Vue.component('Popin', Popin);
Vue.component('SearchField', SearchField);
Vue.component('Separator', Separator);
Vue.component('VImg', VImg);
Vue.component('Action', Action);
Vue.component('BackButton', BackButton);

Vue.use({
  install: (Vue) => {
    Vue.mixin({
      data: () => ({
        isMounted: false,
        isCreated: false,
      }),
      mounted() {
        // @ts-ignore
        this.isMounted = true;
      },
      created() {
        // @ts-ignore
        this.isCreated = true;
      },
    });
  },
});
