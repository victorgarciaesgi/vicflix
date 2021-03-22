import { VuexModule } from 'vuex-typed-modules';
import { AlertRoot } from '@constructors';

// Module
export const AlertsModule = new VuexModule({
  name: 'AlertsModule',
  state: {
    alertsList: [] as AlertRoot[],
  },
  getters: {
    focusedAlert({ alertsList }) {
      if (alertsList.length) {
        return alertsList[0];
      }
      return null;
    },
  },
  actions: {
    async createAlert(_, alert: AlertRoot) {
      AlertsModule.updateState(({ alertsList }) => {
        alertsList.push(alert);
      });
    },
    async deleteAlert({ state }, alertId: string) {
      const content = state.alertsList.find((alert) => alert.id === alertId);
      if (content) {
        if (content.onClose && typeof content.onClose === 'function') {
          const type = content.onClose.constructor.name as 'Function' | 'AsyncFunction';
          if (type === 'Function') {
            content.onClose();
          } else {
            await content.onClose();
          }
        }
        AlertsModule.updateState(({ alertsList }) => ({
          alertsList: alertsList.filter((f) => f.id !== alertId),
        }));
      }
    },
  },
});
