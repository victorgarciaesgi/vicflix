import Vue, { PluginFunction } from 'vue';
import { ErrorToast, InfoToast, SuccessToast, WarningToast, Toast } from '@constructors';

const installPlugin: PluginFunction<any> = (Vue, options) => {
  Vue.prototype.$toast = {
    success: SuccessToast,
    error: ErrorToast,
    warning: WarningToast,
    info: InfoToast,
    toast: Toast,
  };
};

const ToastsPlugin = {
  install: installPlugin,
};

Vue.use(ToastsPlugin);
