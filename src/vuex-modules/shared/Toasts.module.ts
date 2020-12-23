import { nanoid } from 'nanoid';
import { VuexModule } from 'vuex-typed-modules';
import { IToastNotification, IToastPayload } from '@models';
import { timeout } from '@utils';

const DEFAULT_TIMEOUT = 5000;
export interface IToastNotificationState {
  toastList: IToastNotification[];
}
// State
const state: IToastNotificationState = {
  toastList: [],
};

// Module declaration
export const ToastModule = new VuexModule({
  name: 'ToastModule',
  state,
  mutations: {
    deleteToast({ toastList }, id: string) {
      let index = toastList
        .filter((f): f is IToastNotification => !('name' in f))
        .findIndex((element) => element.id === id);
      if (index !== -1) {
        toastList.splice(index, 1);
      }
    },
    addToast({ toastList }, toast: IToastNotification) {
      toastList.push(toast);
    },
  },
  actions: {
    async addToast(ctx, { timer = true, actions, namespace, ...data }: IToastPayload) {
      const id = nanoid(6);
      let formatedActions = actions?.map((action) => {
        return {
          ...action,
          ...(action.handler && {
            handler: async () => {
              await action.handler?.();
              ToastModule.mutations.deleteToast(id);
            },
          }),
        };
      });

      ToastModule.mutations.addToast({ ...data, id, actions: formatedActions });
      if (timer && !data.errorMessage) {
        let toastTimeout = typeof timer === 'number' ? timer : DEFAULT_TIMEOUT;
        await timeout(toastTimeout);
        ToastModule.mutations.deleteToast(id);
      }
    },
  },
});
