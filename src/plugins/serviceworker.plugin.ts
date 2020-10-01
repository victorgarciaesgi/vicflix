import { IToastNotificationType } from '@models';
import { ToastModule } from '@store';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    ToastModule.actions.addToast({
      type: IToastNotificationType.INFO,
      message: "Une nouvelle version de l'application est disponible",
      actions: [
        {
          handler: () => window.location.reload(),
          text: 'Mettre à jour',
        },
      ],
    });
  });
}
