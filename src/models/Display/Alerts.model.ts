import { AlertsElement } from '@constructors';

export interface IAlertsState {
  alertShow: boolean;
  alertData: AlertsElement.Alert;
  submitting: boolean;
}
