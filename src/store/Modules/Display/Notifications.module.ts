import { defineModule } from '@/vuex-typed-modules';
import { INotificationState, INotification } from '@models';

import { timeout } from '@methods';

const TIMEOUT: number = 5000;

//State
const state: INotificationState = {
  notificationCount: 0,
  notificationList: [],
};

// Mutations
const mutations = {
  addNotification(state: INotificationState, alert: INotification) {
    state.notificationList.push(alert);
    state.notificationCount++;
  },
  deleteNotification(state: INotificationState, alert: INotification) {
    var index = state.notificationList.findIndex(element => element.id === alert.id);
    if (index !== -1) {
      state.notificationList.splice(index, 1);
    }
  },
};

// Actions
const actions = {
  async addNotification(context, alert: INotification) {
    alert = {
      ...alert,
      id: state.notificationCount,
      isNotif: alert.isNotif || false,
      link: alert.link,
    };
    NotificationsModule.mutations.addNotification(alert);
    await timeout(TIMEOUT);
    NotificationsModule.mutations.deleteNotification(alert);
  },
};

// Module declaration
export const NotificationsModule = defineModule('NotificationsModule', state, {
  actions,
  mutations,
});
