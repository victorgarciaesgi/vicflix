import { ButtonTheme } from '@models';
import { RawLocation } from 'vue-router';
import { FormShape, FormStructure, PureTree } from '../forms';
import { actionsComposer } from './alert.constructor';

export enum AlertType {
  'Success' = 'success',
  'Confirm' = 'confirm',
  'Warning' = 'warning',
  'Error' = 'error',
  'Info' = 'info',
  'Form' = 'form',
}

interface AlertCommons<TForm extends FormStructure = never, TEditMode extends boolean = boolean> {
  type: AlertType;
  title: string;
  description?: string;
  strict?: boolean;
  onClose?: () => void | boolean;
  form?: FormShape<TForm>;
  onConfirm?: (...data: TForm extends never ? [] : [PureTree<TForm, TEditMode>]) => void | boolean;
}

export type AlertRoot<
  TForm extends FormStructure = never,
  TEditMode extends boolean = boolean
> = AlertCommons & {
  actions: ActionRoot[];
  id: string;
};

export type AlertReturnType = {
  wait: () => Promise<boolean>;
};

// Types of Alerts ---------------------

export type DefaultAlertArgs<
  TForm extends FormStructure = never,
  TEditMode extends boolean = never
> = AlertCommons & {
  actions: (actions: typeof actionsComposer) => ActionRoot[];
};

export type SuccessAlertArgs = Omit<DefaultAlertArgs, 'type' | 'form'>;
export type WarningAlertArgs = SuccessAlertArgs;
export type ConfirmAlertArgs = SuccessAlertArgs;
export type FormAlertArgs<
  TForm extends FormStructure = never,
  TEditMode extends boolean = never
> = Omit<DefaultAlertArgs<TForm, TEditMode>, 'type'>;

// Actions -----------------------------------------------------------

export enum ActionType {
  'Confirm' = 'confirm',
  'Cancel' = 'cancel',
  'Link' = 'link',
  'Action' = 'action',
}

interface ActionCommons {
  type: ActionType;
  content?: string;
  icon?: string;
  to?: RawLocation;
  theme?: ButtonTheme;
}

export interface ActionRoot extends ActionCommons {
  id: string;
  handler: (id: string) => Promise<void>;
}

// Types of Actions ---------------------

export interface DefaultActionArgs extends ActionCommons {
  onClick?: (...args: any[]) => void | Promise<boolean | void>;
}

export type ConfirmActionArgs = Omit<DefaultActionArgs, 'type' | 'to'>;
export type CancelActionArgs = Omit<DefaultActionArgs, 'type' | 'to'>;
