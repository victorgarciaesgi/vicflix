import { INotification } from '@models';
import { NotificationsModule } from '@store';

export class UserNotification {
  constructor(options: INotification) {
    NotificationsModule.actions.addNotification(options);
  }
}

export class SuccessNotification {
  constructor(message: string) {
    NotificationsModule.actions.addNotification({
      type: 'success',
      message,
    });
  }
}

export class ErrorNotification {
  constructor(message: string) {
    NotificationsModule.actions.addNotification({
      type: 'error',
      message,
    });
  }
}
export class WarningNotification {
  constructor(message: string) {
    NotificationsModule.actions.addNotification({
      type: 'warning',
      message,
    });
  }
}
