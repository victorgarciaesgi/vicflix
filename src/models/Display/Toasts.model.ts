import { Location } from 'vue-router';

export enum IToastNotificationType {
  'SUCCESS' = 'success',
  'ERROR' = 'error',
  'WARNING' = 'warning',
  'INFO' = 'info',
}

export interface IToastNotification {
  type: IToastNotificationType;
  title?: string;
  message?: string;
  link?: Location;
  errorMessage?: any;
  timer?: boolean | number;
  actions?: {
    handler?: () => Promise<void> | void;
    to?: Location;
    text: string;
  }[];
  namespace?: string;
  id: string;
}

export interface IToastGroup {
  name: string;
  list: IToastNotification[];
  id: string;
}

export type IToastPayload = Omit<IToastNotification, 'id'>;
