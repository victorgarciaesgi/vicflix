import { RawLocation } from 'vue-router';
import { nanoid } from 'nanoid';
import { ObjectLiteral, IReadOnlyObject, ButtonTheme } from '@models';
import { AlertsModule } from '@store';

// export type PartialForm<F> = { [K in keyof F]?: F[K] extends Object ? string : F[K] };

export namespace Alerts {
  type ActionType = 'confirm' | 'cancel' | 'link' | 'action';

  interface ActionPayload {
    type?: ActionType;
    text?: string;
    handler?: (...args: any[]) => any;
    to?: RawLocation;
    theme?: ButtonTheme;
  }

  export class Action {
    public id: string;
    public type: ActionType;
    public text?: string;
    public to?: RawLocation;
    public handler!: (id: string) => any;
    public theme?: ButtonTheme;

    constructor({ type = 'action', handler, ...fields }: ActionPayload) {
      this.type = type;
      this.text = fields.text;
      this.theme = fields.theme;
      this.to = fields.to;
      this.id = nanoid(6);
      this.handler = async (id) => {
        if (handler && typeof handler === 'function') {
          await handler();
        }
        AlertsModule.actions.deleteAlert(id);
      };
    }
  }

  export class ConfirmAction extends Action {
    constructor({ type = 'confirm', text = 'Confirmer', ...fields }: ActionPayload) {
      super({ type, text, ...fields });
    }
  }

  export class CancelAction extends Action {
    constructor({ type = 'cancel', text = 'Annuler', ...fields }: ActionPayload) {
      super({ type, text, ...fields });
    }
  }

  export class LinkAction extends Action {
    constructor({ type = 'link', ...fields }: ActionPayload) {
      super({ type, ...fields });
    }
  }

  type AlertType = 'success' | 'confirm' | 'warning' | 'error' | 'info' | 'form';
  export interface FormPayload<T = ObjectLiteral, P = ObjectLiteral> {
    form: T;
    params: P;
  }

  export interface AlertPayload<T, E = any, P extends IReadOnlyObject = IReadOnlyObject> {
    [x: string]: any;
    type?: AlertType;
    title?: string;
    description?: string;
    strict?: boolean;
    actions?: Action[];
    onClose?: () => void;
  }

  export class Alert<T = ObjectLiteral, E = any, P extends IReadOnlyObject = IReadOnlyObject> {
    public id!: string;
    public type?: AlertType;
    public title: string;
    public description?: string;
    public strict?: boolean;
    public actions?: Action[];
    public onClose?: () => void;

    constructor({ actions, ...fields }: AlertPayload<T, E, P>) {
      this.id = nanoid(6);
      const filteredActions = actions?.filter((f) => !!f);
      this.actions = filteredActions;
      this.description = fields.description;
      this.strict = fields.strict;
      this.title = fields.title || 'OK';
      this.type = fields.type;
      this.onClose = fields.onClose;
      AlertsModule.actions.createAlert(this as Alert);
    }
  }

  export class ConfirmAlert<
    T = ObjectLiteral,
    E = never,
    P extends IReadOnlyObject = IReadOnlyObject
  > extends Alert<T, E, P> {
    constructor(fields?: AlertPayload<T, E, P>) {
      let actions: Action[] = [];
      if (fields?.actions) actions = fields.actions?.filter((f) => !!f);

      super({
        title: fields?.title,
        type: 'confirm',
        strict: fields?.strict,
        description: fields?.description,
        onClose: fields?.onClose,
        actions: [...actions, new CancelAction({})],
      });
    }
  }

  export class SuccessALert<
    T = ObjectLiteral,
    E = never,
    P extends IReadOnlyObject = IReadOnlyObject
  > extends Alert<T, E, P> {
    constructor(fields?: AlertPayload<T, E, P>) {
      let actions: Action[] = [];
      if (fields?.actions) actions = fields.actions?.filter((f) => !!f) || [];

      super({
        title: fields?.title,
        type: 'success',
        strict: fields?.strict,
        description: fields?.description,
        onClose: fields?.onClose,
        actions: [...actions, new ConfirmAction({})],
      });
    }
  }
}
