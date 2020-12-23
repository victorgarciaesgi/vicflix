<template>
  <div
    :class="[
      type,
      {
        isInCurrentMonth,
        isToday,
        isSelected,
        isBetween,
        isStart,
        isEnd,
        isPeriodCompleted,
        isStartOfWeek,
        isEndOfWeek,
        isDisabled,
      },
    ]"
    class="date-item center flex"
    @click="handleSelectEvent"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="date-wrapper center flex">
      <span>{{ formattedDate }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import {
  getDate,
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
  isMonday,
  isSunday,
  isWithinInterval,
  getDay,
} from 'date-fns';
import { CalendarType, ICalendarValue, ICalendarPeriodType } from '@constructors';

@Component({})
export default class DateItem extends Vue {
  @Prop({ required: true }) date!: Date;
  @Prop({ required: true }) currentMonth!: Date;
  @Prop({ type: [Object, Date, String] }) selectedDate?: ICalendarValue;
  @Prop(String) type!: CalendarType;
  @Prop() hoveredDate?: Date;
  @Prop() min?: Date;
  @Prop() max?: Date;
  @Prop() disabledDays?: Date[];
  @Prop() disabledWeekDays?: number[];

  get formattedDate(): number {
    return getDate(this.date);
  }

  get isSelected(): boolean {
    let selected = false;
    if (!this.selectedDate) return false;
    if (this.isCalendarNormal(this.selectedDate)) {
      selected = isSameDay(this.date, this.selectedDate);
    } else {
      if (this.selectedDate.start && isSameDay(this.date, this.selectedDate.start)) {
        selected = true;
      }
      if (this.selectedDate.end && isSameDay(this.date, this.selectedDate.end)) {
        selected = true;
      }
    }
    return selected;
  }

  get isDisabled(): boolean {
    let disabled = false;
    if (this.disabledWeekDays && this.disabledWeekDays.includes(getDay(this.date))) {
      disabled = true;
    }
    if (this.disabledDays && this.disabledDays.some((day) => isSameDay(this.date, day))) {
      disabled = true;
    }
    if (this.min && isBefore(this.date, this.min)) {
      disabled = true;
    }
    if (this.max && isAfter(this.date, this.max)) {
      disabled = true;
    }
    return disabled;
  }

  get isStart(): boolean {
    if (!this.selectedDate) return false;

    if (this.isCalendarNormal(this.selectedDate)) {
      return false;
    } else if (this.hoveredDate && this.isSelecting) {
      if (!this.isSelected && this.selectedDate.start) {
        return (
          isBefore(this.hoveredDate, this.selectedDate?.start) &&
          isSameDay(this.hoveredDate, this.date)
        );
      } else if (isSameDay(this.hoveredDate, this.date) && this.selectedDate?.start) {
        return isSameDay(this.date, this.selectedDate.start);
      } else if (this.selectedDate.start) {
        return (
          isBefore(this.selectedDate.start, this.hoveredDate) &&
          isSameDay(this.selectedDate.start, this.date)
        );
      } else if (this.selectedDate.end) {
        return (
          isBefore(this.selectedDate.end, this.hoveredDate) &&
          isSameDay(this.selectedDate.end, this.date)
        );
      }
      return false;
    } else if (this.selectedDate.start) {
      return isSameDay(this.date, this.selectedDate.start);
    }
    return false;
  }

  get isEnd(): boolean {
    if (!this.selectedDate) return false;

    if (this.isCalendarNormal(this.selectedDate)) {
      return false;
    } else if (this.hoveredDate && this.isSelecting) {
      if (!this.isSelected && this.selectedDate.start) {
        return (
          isAfter(this.hoveredDate, this.selectedDate.start) &&
          isSameDay(this.hoveredDate, this.date)
        );
      } else if (this.selectedDate.start && !this.selectedDate.end) {
        return (
          isAfter(this.selectedDate.start, this.hoveredDate) &&
          isSameDay(this.selectedDate.start, this.date)
        );
      } else if (this.selectedDate.end) {
        return (
          isAfter(this.selectedDate.end, this.hoveredDate) &&
          isSameDay(this.selectedDate.end, this.date)
        );
      }
      return false;
    } else if (this.selectedDate.end) {
      return isSameDay(this.date, this.selectedDate.end);
    }
    return false;
  }

  get isStartOfWeek(): boolean {
    return isMonday(this.date);
  }

  get isEndOfWeek(): boolean {
    return isSunday(this.date);
  }

  get isBetween(): boolean {
    if (!this.selectedDate) return false;

    if (this.isCalendarNormal(this.selectedDate)) {
      return false;
    } else if (
      this.hoveredDate &&
      this.isSelecting &&
      !isSameDay(this.date, this.hoveredDate) &&
      !this.isEnd &&
      !this.isStart
    ) {
      if (this.selectedDate.start) {
        if (isAfter(this.selectedDate.start, this.hoveredDate)) {
          return isWithinInterval(this.date, {
            start: this.hoveredDate,
            end: this.selectedDate?.start,
          });
        } else {
          return isWithinInterval(this.date, {
            start: this.selectedDate?.start,
            end: this.hoveredDate,
          });
        }
      } else if (this.selectedDate.end && isAfter(this.selectedDate.end, this.hoveredDate)) {
        return isWithinInterval(this.date, {
          start: this.hoveredDate,
          end: this.selectedDate?.end,
        });
      } else if (this.selectedDate.end) {
        return isWithinInterval(this.date, {
          start: this.selectedDate.end,
          end: this.hoveredDate,
        });
      }
      return false;
    } else if (this.selectedDate.start && this.selectedDate.end) {
      return (
        isWithinInterval(this.date, {
          start: this.selectedDate?.start,
          end: this.selectedDate?.end,
        }) &&
        !this.isEnd &&
        !this.isStart
      );
    }
    return false;
  }

  get isSelecting(): boolean {
    if (!this.selectedDate) return false;

    if (this.isCalendarNormal(this.selectedDate)) {
      return false;
    } else {
      return (
        (!!this.selectedDate.start && !this.selectedDate.end) ||
        (!this.selectedDate.start && !!this.selectedDate.end)
      );
    }
  }

  get isPeriodCompleted() {
    if (!this.selectedDate) return false;

    if (this.isCalendarNormal(this.selectedDate)) {
      return false;
    } else if (this.hoveredDate && this.isSelecting) {
      return (
        (!!this.selectedDate?.start || !!this.selectedDate?.end) &&
        !(isSameDay(this.hoveredDate, this.date) && this.isSelected)
      );
    } else {
      return !!this.selectedDate?.start && !!this.selectedDate?.end;
    }
  }

  get isToday() {
    return isSameDay(this.date, new Date());
  }

  get isInCurrentMonth() {
    return isSameMonth(this.date, this.currentMonth);
  }

  handleSelectEvent() {
    if (!this.isDisabled) {
      if (this.selectedDate && this.isCalendarNormal(this.selectedDate)) {
        this.$emit('select', this.date);
      } else if (this.isSelected) {
        this.$emit(`unselect:${this.isStart ? 'start' : 'end'}`);
      } else {
        this.$emit('select', this.date);
      }
    }
  }

  handleMouseEnter() {
    if (this.isSelecting) {
      this.$emit('mouseenter', this.date);
    }
  }
  handleMouseLeave() {
    if (this.isSelecting) {
      this.$emit('mouseleave', this.date);
    }
  }

  isCalendarNormal(value: ICalendarValue): value is Date {
    return this.type === CalendarType.Default;
  }
  isCalendarPeriod(value: ICalendarValue): value is ICalendarPeriodType {
    return this.type === CalendarType.Period;
  }
}
</script>

<style lang="postcss" scoped>
%overlay {
  content: '';
  position: absolute;
  left: 0;
  top: calc((100% - 30px) / 2);
  width: 100%;
  height: 30px;
  background-color: var(--bg4);
}

div.date-item {
  color: var(--text3);
  padding: 5px 0;
  cursor: pointer;
  user-select: none;

  div.date-wrapper {
    height: 30px;
    width: 30px;
    border-radius: 100%;
    font-size: 16px;
    transition: transform 0.2s;
  }

  &.isDisabled {
    color: var(--bg8) !important;
    cursor: not-allowed;
  }

  &:not(.isSelected) {
    &:not(.isDisabled):hover .date-wrapper {
      background-color: var(--bg4);
    }

    &.isInCurrentMonth {
      color: var(--text1);
      &:not(.isDisabled):hover .date-wrapper {
        background-color: var(--bg4);
      }
    }

    &.isToday {
      color: var(--blue);
    }
  }

  &.isBetween {
    &:before {
      @extend %overlay;
    }
    &.isStartOfWeek {
      &:before {
        width: calc(100% - 5px);
        left: 5px;
        border-radius: 30px 0 0 30px;
      }
    }
    &.isEndOfWeek {
      &:before {
        width: calc(100% - 5px);
        right: 5px;
        border-radius: 0 30px 30px 0;
      }
    }
  }

  &.isSelected {
    color: white;
    .date-wrapper {
      background-color: var(--primary);
    }
  }

  &.period.isPeriodCompleted {
    &.isStart:not(.isEndOfWeek) {
      &::before {
        @extend %overlay;
        width: 50%;
        left: 50%;
      }
    }
    &.isEnd:not(.isStartOfWeek) {
      &::before {
        @extend %overlay;
        width: 50%;
        right: 50%;
      }
    }
  }
  &:active {
    .date-wrapper {
      transform: scale(0.9);
    }
  }
}
</style>
