import { ObjectLiteral } from '@models';
import { createDecorator, VueDecorator } from 'vue-class-component';

const cacheValidationKey = '__validations__';

function validationCreator(this: Vue) {
  const VueConstructor = this.$vnode?.componentOptions?.Ctor as any;
  const validations = (VueConstructor.options as any) || {};
  const ret = {};
  for (const key in validations) {
    if (!Object.prototype.hasOwnProperty.call(validations, key)) continue;
    let val = validations[key];
    if (key === cacheValidationKey) {
      val = this[val];
    }
    if (typeof val === 'function') {
      val = val.call(this);
    }
    if (key === cacheValidationKey) {
      Object.assign(ret, val);
    } else {
      ret[key] = val;
    }
  }
  return ret;
}

export function Validations(): VueDecorator {
  return createDecorator((componentOptions: ObjectLiteral, k) => {
    if (!componentOptions.__validations) {
      componentOptions.__validations = {};
    }
    componentOptions.__validations[cacheValidationKey] = k;
    componentOptions.validations = validationCreator;
  });
}

export function Validate<T extends Vue>(rules: Record<keyof T, any>): VueDecorator {
  return createDecorator((componentOptions: ObjectLiteral, k) => {
    if (!componentOptions.__validations) {
      componentOptions.__validations = {};
    }
    componentOptions.__validations[k] = rules;
    componentOptions.validations = validationCreator;
  });
}
