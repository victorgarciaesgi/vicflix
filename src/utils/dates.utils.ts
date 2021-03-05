import { setHours, setMinutes, setSeconds } from 'date-fns';

export function formatHoursAndMinutes(date: Date): Date {
  return setSeconds(setMinutes(setHours(date, 0), 0), 0);
}

export function secondsToHoursAndMinutes(timestamp: number): string {
  const hours = Math.floor(timestamp / 60 / 60);
  const minutes = Math.floor(timestamp / 60) - hours * 60;
  var seconds = Math.round(timestamp % 60);
  const formatted = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
  return formatted;
}
