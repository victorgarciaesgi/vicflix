import { ObjectLiteral } from '@models';
import { isObject } from '@utils';
import { isArray, isEmpty } from 'lodash-es';
import { DefaultFieldStruture } from './fields.base';
import {
  FormStructure,
  CleanFormFieldArgs,
  FormFieldsData,
  PureTree,
  ValueType,
  ResetableFieldArgs,
  protectedProperties,
  InitialValues,
  MaybeTree,
} from './form.types';

/** Only work with one level Array, [8, [7,0]] will not work for now */
export function areArrayEquals(
  array1: any[] | ReadonlyArray<any>,
  array2: any[] | ReadonlyArray<any>
) {
  if (array1.length !== array2.length) return false;
  return array1.every((value, index) => {
    return array1[index] === array2[index];
  });
}

type EntryFieldType<T> =
  | DefaultFieldStruture
  | FormStructure<T>
  | (FormStructure<T> | DefaultFieldStruture)[];

type EntryValueType<T> =
  | DefaultFieldStruture
  | InitialValues<T>
  | (InitialValues<T> | DefaultFieldStruture)[];

// Fields Recursive utils ---------------------------------------------------------

export function mapThroughFields<TForm, TReturn extends any>(
  _fields: FormStructure<TForm>,
  predicate: (key: string | number, value: DefaultFieldStruture) => any
): TReturn {
  return (Object.entries(_fields) as [string, EntryFieldType<TForm>][]).reduce<TReturn>(
    (acc, [key, value]) => {
      if (!value) return acc;
      if (value instanceof DefaultFieldStruture) {
        acc[key] = predicate(key, value);
      } else if (Array.isArray(value)) {
        acc[key] = value.map((element, index) => {
          if (element instanceof DefaultFieldStruture) {
            return predicate(index, element);
          } else {
            return mapThroughFields(element, predicate);
          }
        });
      } else if (typeof value === 'object') {
        acc[key] = mapThroughFields(value, predicate);
      }
      return acc;
    },
    {} as TReturn
  );
}

export function constructData<TForm>(fields: FormStructure<TForm>, edit: boolean) {
  return mapThroughFields<TForm, FormFieldsData<TForm>>(
    fields,
    (key, { value, editMode, ...data }) => {
      const processedData = Object.entries(data).reduce<ResetableFieldArgs>(
        (acc, [key, property]) => {
          if (key !== 'value') {
            if (typeof property === 'function' && !protectedProperties.includes(key as any)) {
              acc[key] = property();
            } else {
              acc[key] = property;
            }
          }
          return acc;
        },
        {} as ResetableFieldArgs
      );
      return { ...processedData, editMode: edit };
    }
  );
}

export function constructValues<TForm>(fields: FormStructure<TForm>) {
  return mapThroughFields<TForm, PureTree<TForm>>(fields, (key, { value }) => {
    if (typeof value === 'function') {
      return value();
    }
    return value;
  });
}

// Initial states recursive utils ---------------------------------------------------------

export function mapThroughInitialValuesOrData<
  TType extends 'values' | 'data',
  TForm = PureTree,
  TReturn = TType extends 'data' ? FormFieldsData<TForm> : PureTree<TForm>
>(
  _fields: FormStructure<TForm>,
  predicate: (
    key: string,
    value: TType extends 'values' ? ValueType : DefaultFieldStruture
  ) => (TType extends 'values' ? ValueType : CleanFormFieldArgs) | undefined | void,
  type?: TType
): TReturn {
  return Object.entries<any>(_fields).reduce<TReturn>((acc, [key, value]) => {
    if (value instanceof DefaultFieldStruture) {
      const predicateResult = predicate(key, type === 'values' ? value.value : (value as any));
      acc[key] = predicateResult;
    } else if (Array.isArray(value)) {
      acc[key] = value
        .map((element, index) => {
          return mapThroughInitialValuesOrData(element, predicate);
        })
        .filter((result) => !!result);
    } else if (typeof value === 'object') {
      const mapResult = mapThroughInitialValuesOrData(value, predicate);
      acc[key] = mapResult;
    }
    return acc;
  }, {} as TReturn);
}

export function resetFieldsValues<TForm>(fields: FormStructure<TForm>): PureTree<TForm> {
  return mapThroughInitialValuesOrData(
    fields,
    (key, value) => {
      if (typeof value === 'function') {
        return value();
      }
      return value;
    },
    'values'
  );
}

export function resetFieldsData<TForm>(fields: FormStructure<TForm>) {
  return mapThroughInitialValuesOrData(
    fields,
    (key, data) => {
      return Object.entries(data).reduce<ResetableFieldArgs>((acc, [key, value]) => {
        if (key !== 'value') {
          if (typeof value === 'function' && !protectedProperties.includes(key as any)) {
            acc[key] = value(undefined);
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {} as ResetableFieldArgs);
    },
    'data'
  );
}

// Values mappers ---------------------------------------------------------

export function mapThroughValues<TForm extends ObjectLiteral, TReturn extends any>(
  values: MaybeTree<PureTree<TForm>>,
  fields: FormStructure<TForm>,
  predicate: (
    key: string | number,
    { fieldValue, value }: { fieldValue: ValueType; value: ValueType; data: DefaultFieldStruture }
  ) => any | undefined,
  reverse?: boolean
): TReturn {
  const mapper = reverse ? values : fields;
  return (Object.entries(mapper) as [string, EntryFieldType<TForm>][]).reduce<TReturn>(
    (acc, [key, field]) => {
      const valueKey = reverse ? (field as PureTree<TForm>) : values[key];
      const fieldKey = reverse ? (fields[key] as EntryFieldType<TForm>) : field;
      if (fieldKey instanceof DefaultFieldStruture) {
        if (valueKey) {
          acc[key] = predicate(key, {
            fieldValue: fieldKey.value,
            value: valueKey,
            data: fieldKey,
          });
        } else {
          acc[key] = fieldKey.value;
        }
      } else if (Array.isArray(fieldKey) && valueKey && Array.isArray(valueKey)) {
        acc[key] = fieldKey
          .map((element, index) => {
            if (element instanceof DefaultFieldStruture) {
              return predicate(index, {
                fieldValue: element.value,
                value: valueKey,
                data: element,
              });
            } else {
              return mapThroughValues(valueKey[index], element, predicate);
            }
          })
          .filter((result) => !!result);
      } else if (valueKey && isObject(valueKey) && isObject(fieldKey)) {
        acc[key] = mapThroughValues(valueKey, fieldKey as FormStructure<TForm[string]>, predicate);
      }
      return acc;
    },
    {} as TReturn
  );
}

export function cleanValues<T>(values: T, fields: FormStructure<any>): T {
  return mapThroughValues(
    values,
    fields,
    (key, { value, data }) => {
      if (value != null) {
        let _value = value;
        if (data.removeSpaces && typeof _value === 'string') {
          _value = _value.replace(/ /g, '');
        }
        if (typeof _value === 'string') {
          _value = _value.trim();
        }
        return _value;
      }
    },
    true
  );
}

// Form Data Wrappers ---------------------------------------------------------

export function mapAndCompareThroughData<TForm extends ObjectLiteral, TReturn extends any>(
  datas: MaybeTree<FormFieldsData<TForm>>,
  fields: FormStructure<TForm>,
  predicate: (
    key: string,
    { fieldData, data }: { fieldData: CleanFormFieldArgs; data: CleanFormFieldArgs }
  ) => CleanFormFieldArgs | undefined
): TReturn {
  return (Object.entries(fields) as [string, EntryFieldType<TForm>][]).reduce<TReturn>(
    (acc, [key, field]) => {
      const dataProperty = datas[key];
      if (field instanceof DefaultFieldStruture) {
        if (dataProperty != null) {
          const predicateResult = predicate(key, { fieldData: field, data: dataProperty });
          if (predicateResult) acc[key] = predicateResult;
        }
      } else if (Array.isArray(field) && Array.isArray(dataProperty)) {
        acc[key] = field
          .map((element, index) => {
            if (element instanceof DefaultFieldStruture) {
              return predicate(key, { fieldData: element, data: dataProperty[index] });
            } else {
              return mapAndCompareThroughData(dataProperty?.[index], element, predicate);
            }
          })
          .filter((result) => !!result);
      } else if (
        !(field instanceof DefaultFieldStruture) &&
        !isArray(field) &&
        dataProperty &&
        isObject(dataProperty) &&
        isObject(field)
      ) {
        const mapResult = mapAndCompareThroughData(
          datas[key] as FormFieldsData<TForm>,
          field,
          predicate
        );
        if (mapResult) acc[key] = mapResult;
      }
      return acc;
    },
    {} as TReturn
  );
}

// Modified mappers ---------------------------------------------------------

export function mapAndCompareInitialValues<TForm extends ObjectLiteral, TReturn extends any>(
  values: PureTree<TForm>,
  initialValues: PureTree<TForm>,
  fields: FormStructure<TForm>,
  predicate: <TValue extends ValueType>(
    key: string | number,
    { value, initialValue }: { value: TValue; initialValue: TValue }
  ) => any | undefined
): TReturn {
  return (Object.entries(values) as [string, any][]).reduce<TReturn>((acc, [key, value]) => {
    const field = fields[key] as EntryFieldType<TForm>;
    const initialValue = initialValues[key];
    if (field instanceof DefaultFieldStruture) {
      const predicateResult = predicate(key, { initialValue, value });
      if (predicateResult) acc[key] = predicateResult;
    } else if (Array.isArray(field)) {
      acc[key] = field.map((element, index) => {
        if (element instanceof DefaultFieldStruture) {
          return predicate(index, { initialValue: element.value, value: value[index] });
        } else {
          return mapAndCompareInitialValues(value[index], initialValue![index], element, predicate);
        }
      });
    } else if (typeof field === 'object' && field != null && initialValue != null) {
      acc[key] = mapAndCompareInitialValues(
        value,
        initialValue as PureTree<TForm>,
        field,
        predicate
      );
    }
    return acc;
  }, {} as TReturn);
}

export function extractModifiedValues<TForm extends ObjectLiteral>(
  values: PureTree<TForm>,
  initialValues: PureTree<TForm>,
  fields: FormStructure<TForm>
): PureTree<TForm, true> {
  return mapAndCompareInitialValues(
    values,
    initialValues,
    fields,
    (key, { initialValue, value }) => {
      if (value instanceof Date && initialValue instanceof Date) {
        if (new Date(initialValue).getTime() !== new Date(value).getTime()) {
          return value;
        }
      } else if (Array.isArray(value) && Array.isArray(initialValue)) {
        if (!areArrayEquals(value as any, initialValue)) {
          return value;
        }
      } else if (value !== initialValue) {
        return value;
      }
    }
  );
}
