import * as Constants from '@constants';
import { defineNuxtPlugin } from '@nuxtjs/composition-api';

export default defineNuxtPlugin((ctx, inject) => {
  inject('constants', Constants);
});
