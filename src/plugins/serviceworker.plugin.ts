import { IToastNotificationType } from '@models';
import { defineNuxtPlugin } from '@nuxtjs/composition-api';
import { ToastModule } from '@store';

export default defineNuxtPlugin(({ toast }) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      ToastModule.actions.addToast({
        type: IToastNotificationType.INFO,
        timer: false,
        message: "Une nouvelle version de l'application est disponible",
        actions: [
          {
            handler: () => {
              console.log('Reloading...');
              window.location.reload();
            },
            text: 'Mettre à jour',
          },
        ],
      });
    });
  }
});
