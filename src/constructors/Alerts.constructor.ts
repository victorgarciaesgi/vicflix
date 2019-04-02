import { AlertsModule } from '@store';
import { Forms } from './Form.constructor';
import { oc } from 'ts-optchain';

export namespace AlertsElement {
  type AlertType = 'success' | 'confirm' | 'warning' | 'error' | 'info' | 'form';
  type formParam = {
    form: Forms.Form<any>;
    validations?: {
      [x: string]: any;
    };
    submit: {
      params?: { [x: string]: any };
      trigger: (...args: any[]) => void;
    };
  };

  export class Alert {
    public type: AlertType;
    public title: string;
    public message?: string;
    public strict?: boolean;
    public actions: ActionsElements.Action[];
    public formElement?: formParam;
    public onClose?: Array<() => void>;

    constructor({
      actions,
      ...fields
    }: {
      type: AlertType;
      title: string;
      message?: string;
      strict?: boolean;
      actions: ActionsElements.Action[];
      formElement?: formParam;
      onClose?: Array<() => void>;
    }) {
      const filteredActions = actions.filter(f => !!f);
      Object.assign(this, {
        ...fields,
        actions: filteredActions,
      });
      AlertsModule.actions.addAlert(this);
    }

    public async waitResponse() {
      return AlertsModule.actions.addAlert(this);
    }
  }

  export class ConfirmAlert extends Alert {
    constructor(fields?: {
      title: string;
      message?: string;
      strict?: boolean;
      actions?: ActionsElements.Action[];
      onClose?: Array<() => void>;
    }) {
      const actions = fields.actions.filter(f => !!f) || [];
      const confirmAction =
        actions && actions.find(m => m.type === 'confirm')
          ? undefined
          : new ActionsElements.ConfirmAction({});
      const cancelAction =
        actions && actions.find(m => m.type === 'cancel')
          ? undefined
          : new ActionsElements.CancelAction();
      super({
        title: fields.title,
        type: 'confirm',
        strict: fields.strict,
        message: fields.message,
        onClose: fields.onClose,
        actions: [...actions, confirmAction, cancelAction],
      });
    }
  }

  export class WarningAlert extends Alert {
    constructor(fields?: {
      title: string;
      message?: string;
      strict?: boolean;
      actions?: ActionsElements.Action[];
      onClose?: Array<() => void>;
    }) {
      const actions = fields.actions.filter(f => !!f) || [];

      const confirmAction =
        actions && actions.find(m => m.type === 'confirm')
          ? undefined
          : new ActionsElements.ConfirmAction({});
      super({
        title: fields.title,
        type: 'warning',
        strict: fields.strict,
        message: fields.message,
        onClose: fields.onClose,
        actions: [...actions, confirmAction],
      });
    }
  }

  export class SuccessAlert extends Alert {
    constructor(fields?: {
      title: string;
      message?: string;
      strict?: boolean;
      actions?: ActionsElements.Action[];
      onClose?: Array<() => void>;
    }) {
      const actions = fields.actions.filter(f => !!f) || [];
      const confirmAction =
        actions && actions.find(m => m.type === 'confirm')
          ? undefined
          : new ActionsElements.ConfirmAction({});
      super({
        title: fields.title || 'Opération réussie',
        type: 'success',
        strict: fields.strict,
        message: fields.message,
        onClose: fields.onClose,
        actions: [...actions, confirmAction],
      });
    }
  }

  export class ErrorAlert extends Alert {
    constructor(fields?: {
      title: string;
      message?: string;
      strict?: boolean;
      actions?: ActionsElements.Action[];
      onClose?: Array<() => void>;
    }) {
      const actions = fields.actions.filter(f => !!f) || [];
      const confirmAction =
        actions && actions.find(m => m.type === 'confirm')
          ? undefined
          : new ActionsElements.ConfirmAction({ text: 'Fermer' });
      super({
        title: fields.title || `Erreur de l'opération`,
        type: 'error',
        strict: fields.strict,
        message: fields.message,
        onClose: fields.onClose,
        actions: [...actions, confirmAction],
      });
    }
  }

  export class FormAlert extends Alert {
    constructor(fields?: {
      title: string;
      message?: string;
      strict?: boolean;
      formElement: formParam;
      onClose?: Array<() => void>;
    }) {
      const confirmAction = new ActionsElements.ConfirmAction({
        text: 'Valider',
        triggers: [
          () =>
            fields.formElement.submit.trigger({
              form: fields.formElement.form.getValues(),
              ...fields.formElement.submit.params,
            }),
        ],
      });

      super({
        title: fields.title || '',
        type: 'form',
        strict: fields.strict,
        formElement: fields.formElement,
        message: fields.message,
        onClose: fields.onClose,
        actions: [confirmAction, new ActionsElements.CancelAction()],
      });
    }
  }
}

type ActionType = 'confirm' | 'action' | 'cancel' | 'link';

interface ActionPayload {
  type?: ActionType;
  text: string;
  to?: { path: string } | { name: string; params?: { [x: string]: any } };
  trigger?: () => void;
  triggers?: Array<() => void>;
}

export namespace ActionsElements {
  export class Action {
    public type: ActionType;
    public text: string;
    public to?: { path: string } | { name: string; params?: { [x: string]: any } };
    public trigger?: () => void;
    public triggers?: Array<() => void>;
    public submitting?: boolean = false;

    constructor({ type = 'action', text, trigger, triggers, to }: ActionPayload) {
      this.text = text;
      this.type = type;
      this.trigger = trigger;
      this.triggers = triggers ? triggers.filter(f => !!f) : null;
      this.to = to;
    }
  }

  export class ConfirmAction extends Action {
    constructor({ text, triggers }: { text?: string; triggers?: Array<() => void> }) {
      super({
        text: text || 'Valider',
        type: 'confirm',
      });
      if (triggers) {
        this.triggers = [...triggers, AlertsModule.mutations.confirmAlert];
      } else {
        this.trigger = this.trigger = AlertsModule.mutations.confirmAlert;
      }
    }
  }

  export class LinkAction extends Action {
    constructor({
      text,
      to,
    }: {
      text: string;
      to: { path: string } | { name: string; params?: { [x: string]: any } };
    }) {
      super({
        text,
        to,
        type: 'link',
      });
    }
  }

  export class CancelAction extends Action {
    constructor(data?: { text: string }) {
      super({
        text: oc(data).text() || 'Annuler',
        type: 'cancel',
        trigger: AlertsModule.mutations.cancelAlert,
      });
    }
  }

  export const triggers = {
    close() {
      return AlertsModule.mutations.hideAlert();
    },
  };
}
