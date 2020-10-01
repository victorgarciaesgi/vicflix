import { nanoid } from 'nanoid';
import { VuexModule } from 'vuex-typed-modules';
import { IToastGroup, IToastNotification, IToastPayload } from '@models';
import { timeout } from '@utils';

type MixedGroup = IToastNotification | IToastGroup;

const DEFAULT_TIMEOUT = 3000;
export interface IToastNotificationState {
  toastList: IToastNotification[];
}
// State
const state: IToastNotificationState = {
  toastList: [],
};

// Mutations
const mutations = {
  deleteToast({ toastList }: IToastNotificationState, id: string) {
    let index = toastList
      .filter((f): f is IToastNotification => !('name' in f))
      .findIndex((element) => element.id === id);
    if (index !== -1) {
      toastList.splice(index, 1);
    } else {
      // const group = toastList
      //   .filter((f): f is IToastGroup => 'name' in f)
      //   .find((element) => !!element.list.find((f) => f.id === id));
      // if (group) {
      //   const index = group.list.findIndex((f) => f.id === id);
      //   group.list.splice(index, 1);
      //   if (!group.list.length) {
      //     toastList.splice(
      //       toastList.findIndex((f) => f.id === group.id),
      //       1
      //     );
      //   }
      // }
    }
  },
  // addToastToNamespace(
  //   { toastList }: IToastNotificationState,
  //   data: { name: string; toast: IToastNotification }
  // ) {
  //   const group = toastList
  //     .filter((f): f is IToastGroup => 'name' in f)
  //     .find((element) => element.name === data.name);
  //   if (group) {
  //     group.list.push(data.toast);
  //   }
  // },
  addToast({ toastList }: IToastNotificationState, toast: IToastNotification) {
    toastList.push(toast);
  },
};

// Actions
const actions = {
  async addToast(context, { timer = true, actions, namespace, ...data }: IToastPayload) {
    const id = nanoid(6);
    let formatedActions = actions?.map((action) => {
      return {
        ...action,
        handler: async () => {
          await action.handler;
          ToastModule.mutations.deleteToast(id);
        },
      };
    });
    if (namespace) {
      // const existingNamespace = ToastModule.state.toastList.find((element) => {
      //   if ('name' in element) {
      //     return namespace === element.name;
      //   }
      // });
      // console.log(existingNamespace);
      // if (existingNamespace) {
      //   ToastModule.mutations.addToastToNamespace({
      //     name: namespace,
      //     toast: { ...data, id, actions: formatedActions, namespace },
      //   });
      // } else {
      //   const namespaceId = nanoid(5);
      //   ToastModule.mutations.addToast({
      //     id: namespaceId,
      //     name: namespace,
      //     list: [{ ...data, id, actions: formatedActions, namespace }],
      //   });
      // }
    } else {
      ToastModule.mutations.addToast({ ...data, id, actions: formatedActions });
    }
    if (timer && !data.errorMessage) {
      let toastTimeout = typeof timer === 'number' ? timer : DEFAULT_TIMEOUT;
      await timeout(toastTimeout);
      ToastModule.mutations.deleteToast(id);
    }
  },
};

// Module declaration
export const ToastModule = new VuexModule({
  name: 'ToastModule',
  state,
  actions,
  mutations,
});
