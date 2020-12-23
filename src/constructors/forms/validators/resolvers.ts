import { helpers } from 'vuelidate/lib/validators';
import { isAfter, isBefore } from 'date-fns';

const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
/** 6 charactères, 1 chiffre, 1 majuscule, 1 minuscule */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
const priceRegex = /^(\d*([.,](?=\d))?\d+)+((?!\2)[.,]\d\d)?$/;
const linkRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
const hourRegex = /^([01]?[0-9]|2[0-3]){1}:([0-5][0-9]{1}){1}$/;
const ibanRegex = /[A-Z]{2}\d{2} ?\d{4} ?\d{4} ?\d{4} ?\d{4} ?[\d]{0,2}/gm;

export const isPasswordValid = helpers.regex('isPasswordValid', passwordRegex);
export const priceValidator = helpers.regex('price', priceRegex);
export const linkValidator = helpers.regex('link', linkRegex);
export const ibanValidator = helpers.regex('iban', ibanRegex);

export const siretValidator = (value: string) => {
  if (helpers.req(value)) {
    const filteredValue = value.replace(/ /g, '').split('');
    // console.log(
    //   filteredValue.filter((f) => !isNaN(Number(f))).reduce((acc, value) => acc + Number(value), 0),
    //   filteredValue.length
    // );
    return filteredValue.length === 14;
  }
  return true;
};

export const isMailUnique = async (value: string) => {
  if (helpers.req(value) && emailRegex.test(value)) {
    // const valid = await sgts
    //   .checkEmailExists()
    //   .$args({ where: { email: value } })
    //   .$fetch();
    // return !valid;
  }
  return true;
};

export const richTextMaxLength = (param: number) => {
  return helpers.withParams({ type: 'maxLength', max: param }, (value: string) => {
    if (helpers.req(value)) {
      const element = document.createElement('div');
      element.innerHTML = value;
      const text = !!element.textContent && element.textContent.length < param;
      element.remove();
      return text;
    }
    return true;
  });
};

export const minPrice = (param: number) => {
  return helpers.withParams({ type: 'minPrice', value: param }, (value: string, parentVm: Vue) => {
    const price = Number(value.toString().replace(',', '.'));
    return !helpers.req(value) || (!isNaN(price) && price >= param);
  });
};

export const file = (value: any) => {
  return !helpers.req(value) || value instanceof File;
};

export const minSize = (param: number) => {
  return helpers.withParams({ type: 'minSize' }, (value: string, parentVm: Vue) => {
    return !helpers.req(value) || (Array.isArray(value) && value.length >= param);
  });
};

export const maxSize = (param: number) => {
  return helpers.withParams({ type: 'maxSize' }, (value: string, parentVm: Vue) => {
    return !helpers.req(value) || (Array.isArray(value) && value.length <= param);
  });
};

export const isDateAfterAs = (param: string) => {
  return helpers.withParams({ type: 'isDateAfterAs' }, (value: string, parentVm: Vue) => {
    return !helpers.req(value) || isAfter(new Date(value), helpers.ref(param, parentVm));
  });
};

export const isDateBeforeAs = (param: string) => {
  return helpers.withParams({ type: 'isDateBeforeAs' }, (value: string, parentVm: Vue) => {
    return !helpers.req(value) || isBefore(new Date(value), helpers.ref(param, parentVm));
  });
};
export const isTimeAfter = (param: string) => {
  return helpers.withParams({ type: 'isTimeAfter' }, (value: string, parentVm: Vue) => {
    return (
      !helpers.req(value) ||
      isAfter(
        new Date(`2018-01-01T${value}:00`),
        new Date(`2018-01-01T${helpers.ref(param, parentVm)}:00`)
      )
    );
  });
};

export const isDateAfterToday = (value: Date) => {
  return isAfter(value, new Date());
};
export const isDateBeforeToday = (value: Date) => {
  return isBefore(value, new Date());
};

export const isDateBefore = (param: Date) => {
  return helpers.withParams({ type: 'isDateBefore' }, function (value: string) {
    return !helpers.req(value) || isBefore(new Date(value), param);
  });
};

export const isDateAfter = (param: Date) => {
  return helpers.withParams({ type: 'isDateAfter' }, function (value: string) {
    return !helpers.req(value) || isAfter(new Date(value), param);
  });
};

export const dateValidator = (value: string) => {
  if (helpers.req(value)) {
    return !!Date.parse(value);
  }
  return true;
};

export const timeValidator = (value: string): boolean => {
  if (helpers.req(value)) {
    return hourRegex.test(value);
  }
  return true;
};
