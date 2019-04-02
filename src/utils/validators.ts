import { helpers } from 'vuelidate/lib/validators';
import isAfter from 'date-fns/is_after';
import isBefore from 'date-fns/is_before';
export namespace Validators {
  const Regs = {
    link: /(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?$@iS/,
  };

  export const LinkValidator = (value, component) => {
    return Regs.link.test(value);
  };
}

const hourRegex = /^([01]?[0-9]|2[0-3]){1}:([0-5][0-9]{1}){1}$/;

export interface IErrorValidators {
  required: string;
  email: string;
  minLength: ((params: any) => string) | string;
  maxLength: ((params: any) => string) | string;
  minValue: ((params: any) => string) | string;
  maxValue: ((params: any) => string) | string;
  minSize: ((params: any) => string) | string;
  maxSize: ((params: any) => string) | string;
  phone: string;
  sameAs: string;
  isMailUnique: string;
  isNameUnique: string;
  numeric: string;
  isCguChecked: string;
  date: string;
  minTagSize: string;
  isDateAfter: string;
  isDateAfterToday: string;
  userExists: string;
  iban: string;
  minSessions: string;
  [x: string]: any;
}

const defaultMessagesList = (params): IErrorValidators => ({
  required: 'Ce champs est requis',
  email: 'L\'adresse mail doit être valide',
  minLength: `${params.minLength ? params.minLength.min : ''} caractères minimum`,
  maxLength: `${params.maxLength ? params.maxLength.max : ''} caractères maximum`,
  minValue: `La valeur doit être supérieur à ${params.minValue ? params.minValue.min : ''}`,
  maxValue: `La valeur doit être inférieure à ${params.maxValue ? params.maxValue.max : ''}`,
  sameAs: 'Les mots de passe doivent être identiques',
  isMailUnique: 'Cet email est déjà utilisé',
  isNameUnique: 'Ce nom est déjà utilisé',
  phone: 'Le numéro de téléphone doit être valide',
  numeric: 'Ce champs doit être un nombre entier',
  decimal: 'Ce champs doit être un nombre décimal',
  isCguChecked: 'Les CGU doivent être acceptées',
  date: 'La date doit être valide',
  minTagSize: 'Il faut au moins un tag',
  isDateAfter: 'La date de fin doit être supérieure à la date de début',
  isDateAfterToday: 'La date ne peut pas être dans le passé',
  time: `L'heure doit être valide`,
  isTimeAfter: 'L\'heure de fin doit être supérieure à l\'heure de début',
  userExists: 'Ce client n\'éxiste pas',
  iban: 'Veuillez préciser un iban valide',
  minSize: `${params.minValue ? params.minValue.min : ''} éléments minimum`,
  maxSize: `${params.maxValue ? params.maxValue.max : ''} éléments maximum`,
  minSessions: 'Vous devez mettre au moins une session',
});

export const errorMessagesFormater = (vl, messages) => {
  if (messages) {
    const customMessages = Object.keys(messages);
    const defaultMessages = defaultMessagesList(vl.$params);
    customMessages.map(m => {
      if (Object.keys(defaultMessages).includes(m)) {
        if (typeof messages[m] == 'function') {
          defaultMessages[m] = messages[m](vl.$params);
        } else {
          defaultMessages[m] = messages[m];
        }
      } else {
        defaultMessages[m] = messages[m];
      }
    });
    return defaultMessages;
  } else {
    return defaultMessagesList(vl.$params);
  }
};

export const phoneValidator = (value: string) => {
  if (helpers.req(value)) {
    const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return regex.test(value);
  }
  return true;
};

export const isDateAfter = param =>
  helpers.withParams({ type: 'isDateAfter' }, (value, parentVm) => {
    return !helpers.req(value) || isAfter(value, helpers.ref(param, this, parentVm));
  });
export const isTimeAfter = param =>
  helpers.withParams({ type: 'isTimeAfter' }, (value, parentVm) => {
    return (
      !helpers.req(value) ||
      isAfter(
        new Date(`2018-01-01T${value}:00`),
        new Date(`2018-01-01T${helpers.ref(param, this, parentVm)}:00`)
      )
    );
  });

export const isDateAfterToday = param => {
  return isBefore(param, new Date());
};

export const dateValidator = value => {
  if (helpers.req(value)) {
    return !!Date.parse(value);
  }
  return true;
};

export const timeValidator = value => {
  if (helpers.req(value)) {
    return hourRegex.test(value);
  }
  return true;
};

export const ibanValidator = value => {
  const ibanXP = /[A-Z]{2}\d{2} ?\d{4} ?\d{4} ?\d{4} ?\d{4} ?[\d]{0,2}/gm;
  return ibanXP.test(value);
};
