import Vue from 'vue';
import { Mixin } from 'vue-mixin-decorator';
import {
  getMonth,
  getYear,
  setYear,
  setMonth,
  subMonths,
  addMonths,
  getDaysInMonth,
  startOfMonth,
  getDay,
  setDate,
  endOfMonth,
  format,
} from 'date-fns';
import { range, capitalize } from 'lodash-es';
import frLocale from 'date-fns/locale/fr';
import { formatHoursAndMinutes } from '@utils';

@Mixin({})
export default class CalendarMixin extends Vue {
  public weekDays: string[] = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche',
  ];
  public selectedMonth: number | null = null;
  public selectedYear: number | null = null;

  get currentMonthDisplay(): string {
    return capitalize(format(this.currentMonth, 'MMMM', { locale: frLocale }));
  }
  get previousMonthDisplay(): string {
    return capitalize(format(this.previousMonth, 'MMMM', { locale: frLocale }));
  }
  get nextMonthDisplay(): string {
    return capitalize(format(this.nextMonth, 'MMMM', { locale: frLocale }));
  }

  get currentYearDisplay(): string {
    return format(this.currentMonth, 'yyyy');
  }

  get allDisplayDates(): Date[] {
    return [...this.previousMonthDates, ...this.currentMonthDates, ...this.nextMonthDates];
  }

  get previousMonthDates(): Date[] {
    const previousMonthNumberOfDays = getDaysInMonth(this.previousMonth);
    const currentStartOfMonth = getDay(startOfMonth(this.currentMonth));
    return range(
      previousMonthNumberOfDays - (currentStartOfMonth === 0 ? 6 : currentStartOfMonth - 1),
      previousMonthNumberOfDays
    ).map((day) => {
      return formatHoursAndMinutes(setDate(this.previousMonth, day + 1));
    });
  }
  get currentMonthDates(): Date[] {
    const currentNumberOfDays = getDaysInMonth(this.currentMonth);
    return range(0, currentNumberOfDays).map((day) => {
      return formatHoursAndMinutes(setDate(this.currentMonth, day + 1));
    });
  }

  get nextMonthDates(): Date[] {
    const nextMonthLimit = 7 - getDay(endOfMonth(this.currentMonth));
    return range(0, nextMonthLimit === 7 ? 0 : nextMonthLimit).map((day) => {
      return formatHoursAndMinutes(setDate(this.nextMonth, day + 1));
    });
  }

  get currentMonth(): Date {
    const today = new Date();
    const withYear = setYear(today, this.selectedYear ?? getMonth(new Date()));
    const withMonth = setMonth(withYear, this.selectedMonth ?? getYear(new Date()));
    return withMonth;
  }
  get previousMonth(): Date {
    return subMonths(this.currentMonth, 1);
  }
  get nextMonth(): Date {
    return addMonths(this.currentMonth, 1);
  }

  async handleSubMonth() {
    const prevMonth = subMonths(this.currentMonth, 1);
    this.selectedMonth = getMonth(prevMonth);
    this.selectedYear = getYear(prevMonth);
  }
  async handleAddMonth() {
    const nextMonth = addMonths(this.currentMonth, 1);
    this.selectedMonth = getMonth(nextMonth);
    this.selectedYear = getYear(nextMonth);
  }

  created() {
    this.selectedMonth = getMonth(new Date());
    this.selectedYear = getYear(new Date());
  }
}
