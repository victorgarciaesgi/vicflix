import { defineNuxtPlugin } from '@nuxtjs/composition-api';
import VuexPersistence from 'vuex-persist';

function setVhSize() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

export default defineNuxtPlugin(({ store }) => {
  window.addEventListener('resize', setVhSize);
  setVhSize();
});
