import { defineNuxtPlugin } from '@nuxtjs/composition-api';

function setVhSize() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

export default defineNuxtPlugin(() => {
  window.addEventListener('resize', setVhSize);
  setVhSize();
});
