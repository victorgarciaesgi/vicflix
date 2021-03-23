import { IToastNotificationType } from '@models';
import { defineNuxtPlugin } from '@nuxtjs/composition-api';
import { ToastModule } from '@store';

export default defineNuxtPlugin(({ toast }) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      ToastModule.actions.addToast({
        type: IToastNotificationType.INFO,
        message: 'Une nouvelle version de Vicflix a été installée',
      });
    });
  }
});
