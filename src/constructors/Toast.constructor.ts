import { IToastNotificationType, IToastPayload } from '@models';
import { ToastModule } from '@store';

export const SuccessToast = (
  message: string,
  title?: string,
  options?: Omit<IToastPayload, 'message' | 'title' | 'type'>
) => {
  return ToastModule.actions.addToast({
    type: IToastNotificationType.SUCCESS,
    message,
    title,
    ...options,
  });
};

export const ErrorToast = ({
  message,
  e,
  title,
  namespace,
}: {
  message?: string;
  title?: string;
  e?: any;
  namespace?: string;
}) => {
  return ToastModule.actions.addToast({
    type: IToastNotificationType.ERROR,
    message,
    title,
    errorMessage: e,
    namespace,
  });
};
export const WarningToast = (message: string, title?: string) => {
  return ToastModule.actions.addToast({
    type: IToastNotificationType.WARNING,
    message,
    title,
  });
};
export const InfoToast = (message: string, title?: string) => {
  return ToastModule.actions.addToast({
    type: IToastNotificationType.INFO,
    message,
    title,
  });
};

export const Toast = (data: IToastPayload) => {
  return ToastModule.actions.addToast(data);
};
