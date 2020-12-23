<template>
  <div
    ref="calendar"
    :class="{ period: calendarType === 'period' }"
    class="calendar flex w-full"
    @click="closePopups"
  >
    <div v-if="calendarRef" class="calendar-view flex">
      <div class="header flex">
        <button type="button" class="change-month center flex-nowrap flex">
          <SvgIcon key="left" :size="26" pointer src="forms/arrow_left" @click="handleSubMonth" />
        </button>
        <div class="date-infos center flex">
          <Popin
            ref="popup"
            :width="200"
            :arrow="true"
            :nested="true"
            :container="calendarRef"
            nested-namespace="calendar"
          >
            <template #button="{ active }">
              <span :class="{ active }" class="month">{{ currentMonthDisplay }}</span>
            </template>
            <template #content>
              <div class="month-list">
                <div
                  v-for="(month, index) of listMonths"
                  :key="index"
                  class="month"
                  :class="{ selected: selectedMonth === index }"
                  @click="setMonth(index)"
                >
                  {{ month }}
                </div>
              </div>
            </template>
          </Popin>
          <Popin
            ref="popup"
            :width="200"
            :arrow="true"
            :nested="true"
            :container="calendarRef"
            nested-namespace="calendar"
            @open="handleOpenYearsPanel"
          >
            <template #button="{ active }">
              <span :class="{ active }" class="month ml-1">{{ currentYearDisplay }}</span>
            </template>
            <template #content>
              <div class="year-list flex-nowrap flex flex-col w-full">
                <div class="select flex justify-between px-2 py-1">
                  <button v-if="canGoPreviousYear" type="button" class="center nowrap flex">
                    <SvgIcon
                      key="left"
                      :size="22"
                      pointer
                      src="forms/arrow_left"
                      color="var(--text2)"
                      @click="previousListYear"
                    />
                  </button>
                  <button v-if="canGoNextYear" type="button" class="center flex">
                    <SvgIcon
                      key="right"
                      :size="22"
                      src="forms/arrow_right"
                      pointer
                      color="var(--text2)"
                      @click="nextListYear"
                    />
                  </button>
                </div>
                <div class="month-list">
                  <div
                    v-for="(year, index) of listYears"
                    :key="index"
                    :class="{ selected: selectedYear === Number(year) }"
                    class="year"
                    @click="currentYearDisplay = year"
                  >
                    {{ year }}
                  </div>
                </div>
              </div>
            </template>
          </Popin>
          <Popin
            v-if="time"
            ref="popup"
            :width="100"
            :arrow="false"
            :nested="true"
            :offset="4"
            :container="calendarRef"
            nested-namespace="calendar"
            @open="activeTimeInput"
          >
            <template #button="{ active }">
              <span :class="{ active }" class="month ml-1 cursor-pointer">{{
                currentTimeDisplay
              }}</span>
            </template>
            <template #content>
              <input
                ref="inputTime"
                v-model="currentTimeDisplay"
                class="w-full p-1 text-center text-black bg-white"
                type="time"
              />
            </template>
          </Popin>
        </div>
        <button type="button" class="change-month center flex">
          <SvgIcon key="right" :size="26" src="forms/arrow_right" pointer @click="handleAddMonth" />
        </button>
      </div>
      <div class="date-grid grid">
        <div v-for="day of weekDays" :key="day" class="week-day center flex">
          <span>{{ day }}</span>
        </div>
        <DateItem
          v-for="date of allDisplayDates"
          :key="date.toString()"
          :date="date"
          :current-month="currentMonth"
          :selected-date="value"
          :type="calendarType"
          :hovered-date="hoveredDate"
          v-bind="{ disabledDays, disabledWeekDays, min, max }"
          @select="handleDateSelect"
          @unselect:start="handleUnselectStart"
          @unselect:end="handleUnselectEnd"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'nuxt-property-decorator';
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
  isBefore,
  startOfYear,
  endOfYear,
  subYears,
  isValid,
  setHours,
  setMinutes,
  min,
} from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import { range, capitalize } from 'lodash-es';
import { EventBus, Events } from '@services';
import { formatHoursAndMinutes } from '@utils';
import Cleave from 'cleave.js';
import { CalendarType, ICalendarPeriodType, ICalendarValue } from '@constructors';
import Popin from '../../../Display/Popup/Popin.vue';
import DateItem from './DateItem.vue';

const timeRegex = /^([01]?[0-9]|2[0-3]){1}:([0-5][0-9]{1}){1}$/;

@Component({
  components: { DateItem },
})
export default class Calendar extends Vue {
  @Prop() value!: ICalendarValue;
  @Prop(String) calendarType!: CalendarType;
  @Prop() time?: boolean;
  @Prop() sideList?: boolean;
  @Prop() disabledDays?: Date[];
  @Prop() disabledWeekDays?: number[];
  @Prop() min?: Date;
  @Prop() max?: Date;

  $refs!: {
    calendar: HTMLElement;
    popup: Popin;
    inputTime: HTMLInputElement;
  };

  private cleave: Cleave | null = null;
  public calendarRef: HTMLElement | null = null;

  public weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  public listMonths = [
    'Janv.',
    'Févr.',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil.',
    'Aout',
    'Sept.',
    'Octo.',
    'Novem.',
    'Décem.',
  ];

  public selectedMonth = 1;
  public selectedYear = 1;
  public selectedHour = 10;
  public selectedMinute = 0;
  public hoveredDate: Date | null = null;
  public yearPickerBase = 0;

  get listYears(): string[] {
    if (this.yearPickerBase) {
      const year = this.yearPickerBase;
      let list = [year.toString()];
      for (let i = 1; i < 5; i++) {
        list.push((year - i).toString());
        list.push((year + i).toString());
      }
      return list.sort();
    }
    return [];
  }

  get canGoNextYear() {
    return this.yearPickerBase && this.yearPickerBase + 9 < 2100;
  }

  get canGoPreviousYear() {
    if (this.yearPickerBase) return this.yearPickerBase - 9 > 1900;
    return false;
  }

  nextListYear() {
    if (this.yearPickerBase) {
      if (this.yearPickerBase + 9 >= 2100) {
        this.yearPickerBase = 2095;
      } else {
        this.yearPickerBase += 9;
      }
    }
  }

  previousListYear() {
    if (this.yearPickerBase) {
      if (this.yearPickerBase - 9 <= 1900) {
        this.yearPickerBase = 1905;
      } else {
        this.yearPickerBase -= 9;
      }
    }
  }

  get currentMonthDisplay(): string {
    return capitalize(format(this.currentMonth, 'MMMM', { locale: frLocale }));
  }
  get currentYearDisplay(): string {
    return format(this.currentMonth, 'yyyy');
  }
  set currentYearDisplay(value: string) {
    const date = new Date(value);
    if (isValid(date) && Number(value) < 2100 && Number(value) > 1900) {
      this.selectedYear = Number(value);
      if (this.isCalendarNormal(this.value) && this.value) {
        this.handleDateSelect(setYear(this.value, Number(value)), false);
      }
      this.closePopups();
    }
  }
  get currentTimeDisplay() {
    if (this.isCalendarNormal(this.value)) {
      const date = new Date(this.value);
      return format(date, 'HH:mm', { locale: frLocale });
    } else {
      return '';
    }
  }
  set currentTimeDisplay(value: string) {
    if (timeRegex.test(value)) {
      const [hour, minute] = value.split(':');
      this.selectedHour = Number(hour);
      this.selectedMinute = Number(minute);
      if (this.value && this.isCalendarNormal(this.value)) {
        this.handleDateSelect(
          setHours(setMinutes(this.value, this.selectedMinute), this.selectedHour),
          false
        );
      }
    }
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
    const withYear = setYear(today, this.selectedYear);
    const withMonth = setMonth(withYear, this.selectedMonth);
    const withHours = setHours(withMonth, this.selectedHour);
    return setMinutes(withHours, this.selectedMinute);
  }

  get previousMonth(): Date {
    return subMonths(this.currentMonth, 1);
  }
  get nextMonth(): Date {
    return addMonths(this.currentMonth, 1);
  }

  handleOpenYearsPanel() {
    this.yearPickerBase = this.selectedYear;
  }

  handleSubMonth() {
    const prevMonth = subMonths(this.currentMonth, 1);
    this.selectedMonth = getMonth(prevMonth);
    this.selectedYear = getYear(prevMonth);
  }
  handleAddMonth() {
    const nextMonth = addMonths(this.currentMonth, 1);
    this.selectedMonth = getMonth(nextMonth);
    this.selectedYear = getYear(nextMonth);
  }
  setMonth(month: number) {
    this.selectedMonth = month;
    if (this.isCalendarNormal(this.value) && this.value) {
      this.handleDateSelect(setMonth(this.value, month), false);
    }
    this.closePopups();
  }

  emitNewPeriod(value: any) {
    this.$emit('input', value);
  }

  handleDateSelect(value: Date, close = true) {
    if (this.isCalendarNormal(this.value)) {
      this.$emit('input', value);
      if (close) {
        this.$emit('close');
      }
    } else if (!this.value.start && !this.value.end) {
      this.emitNewPeriod({ start: value });
    } else if (this.value.start && isBefore(value, this.value.start)) {
      const newValue = {
        start: value,
        end: this.value.start,
      };
      this.emitNewPeriod(newValue);
    } else {
      this.emitNewPeriod({
        start: this.value.start,
        end: value,
      });
    }
  }

  handleMouseEnter(value: Date) {
    if (!this.isCalendarNormal(this.value)) {
      this.hoveredDate = value;
    }
  }
  handleMouseLeave(value: Date) {
    if (!this.isCalendarNormal(this.value)) {
      this.hoveredDate = null;
    }
  }

  handleUnselectStart() {
    if (this.isCalendarPeriod(this.value)) {
      const newValue = {
        start: this.value.end,
        end: null,
      };
      this.$emit('input', newValue);
      this.hoveredDate = null;
    }
  }
  handleUnselectEnd() {
    if (this.isCalendarPeriod(this.value)) {
      const newValue = this.value;
      newValue.end = null;
      this.$emit('input', newValue);
      this.hoveredDate = null;
    }
  }

  isCalendarNormal(value: ICalendarValue): value is Date {
    return this.calendarType === CalendarType.Default;
  }
  isCalendarPeriod(value: ICalendarValue): value is ICalendarPeriodType {
    return this.calendarType === CalendarType.Period;
  }

  closePopups() {
    EventBus.$emit(`${Events.CLOSE_POPUPS}-calendar`);
  }

  activeTimeInput() {
    if (this.$refs.inputTime) {
      this.cleave = new Cleave(this.$refs.inputTime, {
        time: true,
        timePattern: ['h', 'm'],
      });
    }
  }

  mounted() {
    this.calendarRef = this.$refs.calendar;
  }

  created() {
    if (!this.value) {
      this.selectedMonth = getMonth(new Date());
      this.selectedYear = getYear(new Date());
    } else if (this.isCalendarNormal(this.value)) {
      this.selectedMonth = getMonth(this.value as Date);
      this.selectedYear = getYear(this.value as Date);
    } else if (this.value.end) {
      this.selectedMonth = getMonth(this.value.end as Date);
      this.selectedYear = getYear(this.value.end as Date);
    } else if (this.value.start) {
      this.selectedMonth = getMonth(this.value.start as Date);
      this.selectedYear = getYear(this.value.start as Date);
    } else {
      this.selectedMonth = getMonth(new Date());
      this.selectedYear = getYear(new Date());
    }
  }
}
</script>

<style lang="postcss" scoped>
div.calendar {
  color: var(--text1);
  padding: 5px;
  user-select: none;
  flex-flow: row wrap;
  width: 300px;
  font-size: 14px;

  &.period {
    width: 400px;
  }

  div.calendar-view {
    flex-flow: column nowrap;
    flex: 1;
    min-width: 280px;
    div.header {
      flex: 0 0 auto;
      flex-flow: row nowrap;
      padding: 5px 0;
      border-bottom: 1px solid var(--bg4);

      button.change-month {
        flex: 0 0 auto;
        transition: transform 0.2s;

        &:active {
          transform: scale(0.96);
        }
      }

      div.date-infos {
        flex: 1 1 auto;
        text-align: center;

        span.month {
          padding: 3px 5px;
          border-radius: 4px;
          font-size: 14px;
          border: 1px solid var(--bg4);

          &.active {
            color: white;
            background-color: var(--primary);
            border: 1px solid var(--primary);
          }
        }

        input.year {
          outline: none;
          width: 40px;
          border-radius: 4px;
          text-align: center;
          padding: 3px 2px;
          margin-left: 5px;
          font-size: 14px;
          color: currentColor;
          border: 1px solid var(--bg4);
        }
      }
    }

    div.date-grid {
      grid-template-columns: repeat(7, minmax(40px, 1fr));

      div.week-day {
        font-size: 12px;
        color: var(--text2);
        height: 40px;
      }
    }
  }
  div.calendar-period {
    flex-flow: column wrap;
    padding: 5px;
    margin-left: 10px;
    flex: 1 1 auto;

    div.side-item {
      padding: 8px 10px;
      border-radius: 4px;
      font-size: 14px;
      background-color: var(--bg4);
      margin-bottom: 10px;
      cursor: pointer;

      &.selected {
        background-color: var(--primary);
        color: white;
      }

      &.withPadding {
        margin-bottom: 20px;
      }
    }
  }
}

div.month-list {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, minmax(calc(100% / 3), 1fr));
  grid-gap: 1px;

  div.month,
  div.year {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    box-shadow: 0 0 0 1px var(--bg4);
    color: var(--text1);

    &:not(.selected):hover {
      background-color: var(--bg4);
      cursor: pointer;
    }
    &.selected {
      background-color: var(--primary);
      color: white;
    }
  }
}
</style>
