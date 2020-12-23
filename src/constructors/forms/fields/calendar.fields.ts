import { isTesting } from '@constants';
import { DefaultFieldStruture, FormFieldArgs } from '../fields.base';

// Calendar ---------------------------------------------------------

export type ICalendarValue = Date | ICalendarPeriodType;
export type ICalendarPeriodType = { start: Date | null; end: Date | null };
export enum CalendarType {
  'Default' = 'default',
  'Period' = 'period',
}

export interface ICalendarPayload<Type extends CalendarType = CalendarType.Default> {
  calendarType?: Type;
  type?: 'date' | 'datetime-local' | 'time';
  disabledDays?: Date[];
  disabledWeekDays?: number[];
  time?: boolean;
  min?: Date;
  max?: Date;
}

export class CalendarField<
  TValue extends Type extends CalendarType.Default ? Date : ICalendarPeriodType,
  Type extends CalendarType = CalendarType.Default
> extends DefaultFieldStruture<TValue> {
  public calendarType: Type;
  public sideList?: boolean;
  public disabledDays?: Date[];
  public disabledWeekDays?: number[];
  public time?: boolean;
  public min?: Date;
  public max?: Date;

  constructor({
    value,
    calendarType = CalendarType.Default as Type,
    ...fields
  }: FormFieldArgs<TValue> & ICalendarPayload<Type>) {
    super({ ...fields });
    this.component = 'CalendarElement';
    this.calendarType = calendarType;
    this.time = fields.time;
    this.disabledDays = fields.disabledDays;
    this.disabledWeekDays = fields.disabledWeekDays;
    this.min = fields.min;
    this.max = fields.max;

    let _value = value;

    if (isTesting && fields.testValue) {
      _value = fields.testValue as any;
    }
    if (this.calendarType === CalendarType.Period) {
      _value = {
        start: null,
        end: null,
        ...value,
      } as any;
    } else if (value) {
      _value = new Date(value);
    }
    this.value = _value;
  }
}
