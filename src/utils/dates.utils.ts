import { setHours, setMinutes, setSeconds } from 'date-fns';

export function formatHoursAndMinutes(date: Date): Date {
  return setSeconds(setMinutes(setHours(date, 0), 0), 0);
}
