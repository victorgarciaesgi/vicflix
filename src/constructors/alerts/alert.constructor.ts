import { AlertsModule } from '@store';
import { FormStructure } from 'constructors/forms';
import { nanoid } from 'nanoid';
import {
  DefaultActionArgs,
  ActionRoot,
  ActionType,
  DefaultAlertArgs,
  AlertRoot,
  AlertReturnType,
  ConfirmActionArgs,
  AlertType,
  ConfirmAlertArgs,
  FormAlertArgs,
  SuccessAlertArgs,
  WarningAlertArgs,
} from './alert.types';

function createAction({ onClick, ...rest }: DefaultActionArgs): ActionRoot {
  const id = nanoid(6);
  const handler = async (id: string) => {
    if (onClick && typeof onClick === 'function') {
      await onClick();
    }
    await AlertsModule.actions.deleteAlert(id);
  };

  return {
    ...rest,
    id,
    handler,
  };
}

function createConfirmAction(args: ConfirmActionArgs): ActionRoot {
  return createAction({
    ...args,
    type: ActionType.Confirm,
  });
}
function createCancelAction({ content = 'Annuler', ...args }: ConfirmActionArgs): ActionRoot {
  return createAction({
    ...args,
    content,
    type: ActionType.Cancel,
  });
}

export const actionsComposer = {
  confirm: createConfirmAction,
  cancel: createCancelAction,
};

// Alert ---------------------------------------------------------------

export function createAlert<TForm extends FormStructure = never, TEdit extends boolean = never>({
  actions,
  ...rest
}: DefaultAlertArgs<TForm, TEdit>): AlertReturnType {
  const id = nanoid(6);

  let resolver: ((arg: boolean) => void) | null = null;
  const filteredActions = actions(actionsComposer).map(({ handler, ...rest }) => {
    return {
      ...rest,
      handler: async (id: string) => {
        try {
          await handler(id);
          resolver?.(rest?.type === ActionType.Cancel);
        } catch (e) {
          resolver?.(false);
        }
      },
    };
  });
  AlertsModule.actions.createAlert({ ...rest, actions: filteredActions, id });
  return {
    wait: () => {
      return new Promise<boolean>((resolve, reject) => {
        resolver = resolve;
      });
    },
  };
}

export function createSuccessAlert(args: SuccessAlertArgs) {
  return createAlert({
    ...args,
    type: AlertType.Success,
  });
}

export function createWarningAlert(args: WarningAlertArgs) {
  return createAlert({
    ...args,
    type: AlertType.Warning,
  });
}

export function createConfirmAlert(args: ConfirmAlertArgs) {
  return createAlert({
    ...args,
    type: AlertType.Confirm,
  });
}

export function createFormAlert<
  TForm extends FormStructure = never,
  TEditMode extends boolean = never
>(args: FormAlertArgs<TForm, TEditMode>) {
  return createAlert({
    ...args,
    type: AlertType.Confirm,
  });
}

// createAlert({
//   title: 'Bonjour',
//   type: AlertType.Confirm,
//   actions: ({ confirm }) => [
//     confirm({
//       content: 'Valider',
//       onClick: () => {
//         console.log('ok');
//       },
//     }),
//   ],
// });
