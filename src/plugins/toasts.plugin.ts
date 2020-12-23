import { ErrorToast, InfoToast, SuccessToast, WarningToast, Toast } from '@constructors';
import { defineNuxtPlugin } from '@nuxtjs/composition-api';

export default defineNuxtPlugin((ctx, inject) => {
  inject('toast', {
    success: SuccessToast,
    error: ErrorToast,
    warning: WarningToast,
    info: InfoToast,
    default: Toast,
  });
});
