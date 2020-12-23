import { routerPagesNames } from '@models';
import { defineNuxtPlugin } from '@nuxtjs/composition-api';

export default defineNuxtPlugin((ctx, inject) => {
  inject('routesNames', routerPagesNames);
});
