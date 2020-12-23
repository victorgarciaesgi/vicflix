import { Validation } from 'vuelidate';
import { ObjectLiteral } from '@models';
import { isEmpty } from 'lodash-es';
import { defaultMessagesList } from './messages';

export const errorMessagesFormater = (vl: Validation, customMessages?: ObjectLiteral) => {
  const defaultMessages = defaultMessagesList(vl.$params);

  if (customMessages && !isEmpty(customMessages)) {
    Object.entries(customMessages).forEach(([key, value]) => {
      if (Object.keys(defaultMessages).includes(key)) {
        defaultMessages[key] = value;
      } else {
        defaultMessages[key] = value;
      }
    });
  }
  return defaultMessages;
};
