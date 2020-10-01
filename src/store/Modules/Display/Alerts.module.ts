import { VuexModule } from 'vuex-typed-modules';
import { Alerts } from '@constructors';

export interface IAlertsState {
  alertList: Alerts.Alert[];
}

// State
const state: IAlertsState = {
  alertList: [],
};

const getters = {
  showAlert({ alertList }: IAlertsState) {
    return alertList.length > 0;
  },
};

// Mutations
const mutations = {};

//  as AlertActions
const actions = {
  async createAlert(context, alert: Alerts.Alert) {
    AlertsModule.helpers.addListItem('alertList', alert);
  },
  async deleteAlert(ctx, id: string) {
    const content = AlertsModule.state.alertList.find((alert) => alert.id === id);
    if (content) {
      if (content.onClose && typeof content.onClose === 'function') {
        await content.onClose();
      }
      AlertsModule.helpers.removeListItem('alertList', { id });
    }
  },
};

// Module
export const AlertsModule = new VuexModule({
  name: 'AlertsModule',
  state,
  getters,
  actions,
  mutations,
});
