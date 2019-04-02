import { ActionsElements, AlertsElement } from '@constructors';
import { IAlertsState } from '@models';
import { defineModule } from '@/vuex-typed-modules';

let resolveAlert;
let rejectAlert;

// State
const state: IAlertsState = {
  alertData: null,
  alertShow: false,
  submitting: false,
};

// Mutations
const mutations = {
  showAlert(state: IAlertsState, alert: AlertsElement.Alert) {
    state.alertData = alert;
    state.alertShow = true;
  },
  hideAlert(state: IAlertsState) {
    AlertsModule.actions.onCloseAction({ alert: Object.assign({}, state.alertData), value: true });
    state.alertData = null;
    state.alertShow = false;
    if (resolveAlert) {
      resolveAlert();
    }
  },
  confirmAlert(state: IAlertsState) {
    AlertsModule.actions.onCloseAction({ alert: Object.assign({}, state.alertData), value: true });
    state.alertData = null;
    state.alertShow = false;
    if (resolveAlert) {
      resolveAlert(true);
    }
  },
  cancelAlert(state: IAlertsState) {
    AlertsModule.actions.onCloseAction({ alert: Object.assign({}, state.alertData), value: false });
    state.alertData = null;
    state.alertShow = false;
    if (resolveAlert) {
      resolveAlert(false);
    }
  },
  closeAlert(state: IAlertsState) {
    state.alertData = null;
    state.alertShow = false;
    state.submitting = false;
  },
  updateSubmittingState(
    state: IAlertsState,
    { action, value }: { action: ActionsElements.Action; value: boolean }
  ) {
    state.alertData.actions.find(f => f.text === action.text).submitting = value;
  },
};

//  as AlertActions
const actions = {
  async addAlert(context, alert: AlertsElement.Alert) {
    AlertsModule.mutations.showAlert(alert);
    return new Promise((resolve, reject) => {
      resolveAlert = resolve;
      rejectAlert = reject;
    });
  },
  async hideAlert() {
    AlertsModule.mutations.hideAlert();
  },

  async onCloseAction(context, { alert, value }: { alert: AlertsElement.Alert; value: boolean }) {
    if (alert.onClose) {
      try {
        for (const trigger of alert.onClose) {
          await trigger();
        }
        resolveAlert(value);
      } catch (e) {
        rejectAlert(e);
      }
    }
  },

  async executeAction(
    context,
    { action, value }: { action: ActionsElements.Action; value: boolean }
  ) {
    try {
      AlertsModule.mutations.updateSubmittingState({ action, value: true });
      if (action.trigger) {
        await action.trigger();
        resolveAlert(value);
      } else if (action.triggers) {
        for (const trigger of action.triggers) {
          await trigger();
        }
        resolveAlert(value);
      }
    } catch (e) {
      rejectAlert(e);
      Promise.reject(e);
    } finally {
      AlertsModule.mutations.closeAlert();
    }
  },
};

// Module
export const AlertsModule = defineModule('AlertsModule', state, {
  actions,
  mutations,
});
