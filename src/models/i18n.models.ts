import * as Locales from '@locales';
import { IConstant, ObjectLiteral } from './shared.model';

const defaultLocale = process.env.NUXT_ENV_I18N_LOCALE as AvailableLocales;
const { config, ...defaultMessages } = Locales.fr;

function formatMessages(language: LanguageConfig, parent: string) {
  const { config, ...messages } = language;
  return Object.entries(messages).reduce((acc, [key, value]) => {
    const newParent = `${parent ? `${parent}.` : ''}${key}`;
    if (typeof value === 'object' && value != null) {
      if (Array.isArray(value)) {
        acc[key] = value.map((val) => formatMessages(val, newParent));
      } else {
        acc[key] = formatMessages(value, newParent);
      }
    } else if (typeof value === 'string') {
      acc[key] = newParent;
    }
    return acc;
  }, {});
}

type DefaultMessages = typeof defaultMessages;

type FormatMessages<T> = {
  [K in keyof T]: T[K] extends string
    ? T[K]
    : T[K] extends Array<any>
    ? FormatMessages<T[K]>[]
    : FormatMessages<T[K]>;
};
export type LocalesMessages = FormatMessages<DefaultMessages>;
export type LanguageConfig = FormatMessages<DefaultMessages> & { config: IsoConfig };

export interface IsoConfig {
  code: string;
  iso: string;
}

export const formatedMessages = formatMessages(Locales.fr, '');

export type AvailableLocales = keyof typeof Locales;

export const LocalesConstant: IConstant<keyof typeof Locales> = {
  en: 'en',
  fr: 'fr',
};
