import { AppTrads } from '@models';
import { defineNuxtPlugin } from '@nuxtjs/composition-api';

export default defineNuxtPlugin((ctx, inject) => {
  inject('messages', AppTrads);
});
