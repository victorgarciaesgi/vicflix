import { defineNuxtPlugin } from '@nuxtjs/composition-api';

export default defineNuxtPlugin(() => {
  window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
});
