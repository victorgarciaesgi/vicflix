import { AppTrads } from '@models';
import { setHours, setMinutes, setSeconds } from 'date-fns';
import { Vue } from 'vue-property-decorator';

export function formatHoursAndMinutes(date: Date): Date {
  return setSeconds(setMinutes(setHours(date, 0), 0), 0);
}

export function secondsToHoursAndMinutes(timestamp: number): string {
  const hours = Math.floor(timestamp / 60 / 60);
  const minutes = Math.floor(timestamp / 60) - hours * 60;
  var seconds = Math.floor(timestamp % 60);
  const formatted = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
  return formatted;
}

export function monthsToYearsAndMonths(value: number) {
  if (value === 0) {
    return `${window.$nuxt.$tc(AppTrads.Dates.months, 0)}`;
  } else {
    const years = Math.floor(value / 12);
    const months = Math.floor(value - years * 12);

    return `${years > 0 ? `${window.$nuxt.$tc(AppTrads.Dates.year, years)} ` : ''}${
      months > 0 ? `${window.$nuxt.$tc(AppTrads.Dates.months, months)} ` : ''
    }`;
  }
}
