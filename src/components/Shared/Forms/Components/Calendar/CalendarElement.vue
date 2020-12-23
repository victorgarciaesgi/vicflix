<template>
  <FormElementBase v-bind="baseProps">
    <Popin
      ref="popup"
      :disabled="isDisabled"
      :on-focus="true"
      tabindex="-1"
      nested-root="calendar"
      @open="handleFocus"
      @close="handleBlur"
    >
      <template #content>
        <Calendar
          :value="value"
          :calendar-type="data.calendarType"
          :side-list="data.sideList"
          :time="data.time"
          :min="data.min"
          :max="data.max"
          :disabled-week-days="data.disabledWeekDays"
          :disabled-days="data.disabledDays"
          @input="handleCalendarSelect"
          @close="closeCalendar"
        />
      </template>

      <template #button>
        <div
          :id="formId"
          :style="{ width: data.width }"
          :disabled="data.disabled"
          class="input-container select w-full"
          tabindex="0"
          @focus="handleFocus"
          @blur="handleBlur"
        >
          <div class="display-text flex">
            <div v-if="data.style && data.style.icon" class="icon">
              <SvgIcon src="forms/date" :size="24" :color="iconColorProps" />
            </div>
            <div
              :class="{ top: !!getDisplayValue }"
              class="infos flex-nowrap flex flex-col h-full px-2"
            >
              <span class="placeholder ellipsis">
                {{ placeholder }}
              </span>
              <div v-if="getDisplayValue" class="value flex">
                <span v-if="isCalendarNormal(value)" class="ellipsis">
                  {{ getDisplayValue }}
                </span>
                <div
                  v-else-if="typeof getDisplayValue === 'object' && getDisplayValue != null"
                  class="center ellipsis flex-nowrap flex text-xs text-left"
                >
                  <span>{{ getDisplayValue.start || '-' }}</span>
                  <SvgIcon :size="14" src="forms/stick_arrow_right" class="mx" />
                  <span>{{ getDisplayValue.end || '-' }}</span>
                </div>
              </div>
            </div>
            <div class="center flex flex-shrink-0 pl-px">
              <SvgIcon
                v-if="getDisplayValue"
                :size="14"
                class="bg-text2 p-px rounded-full"
                src="actions/close"
                color="var(--bg1)"
                @click.native.stop="cancelValue"
              />
            </div>
          </div>
        </div>
      </template>
    </Popin>
  </FormElementBase>
</template>

<script lang="ts">
import { Component } from 'vue-mixin-decorator';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import { Ref } from 'nuxt-property-decorator';
import { FormMixin } from '@mixins';
import {
  CalendarField,
  CalendarType,
  ICalendarPeriodType,
  ICalendarValue,
  UnPackField,
} from '@constructors';
import Popin from '../../../../Global/Popin/Popin.vue';
import Calendar from './Calendar.vue';

type CalendarDisplay = string | { start: string | null; end: string | null } | null;

@Component({
  components: {
    Calendar,
  },
})
export default class CalendarElement extends FormMixin {
  readonly value!: ICalendarValue;
  readonly data!: UnPackField<CalendarField<any, any>>;

  @Ref() popup!: Popin;

  get getDisplayValue(): CalendarDisplay {
    if (this.value) {
      if (this.isCalendarNormal(this.value)) {
        const dateValue = new Date(this.value);
        if (this.data.time) {
          return format(dateValue, 'dd/MM/yyyy HH:mm', { locale: frLocale });
        } else {
          return format(dateValue, 'dd/MM/yyyy');
        }
      } else if (!this.value.start && !this.value.end) {
        return null;
      } else {
        return {
          start: this.value.start ? format(this.value.start, 'dd/MM/yyyy') : null,
          end: this.value.end ? format(this.value.end, 'dd/MM/yyyy') : null,
        };
      }
    } else {
      return null;
    }
  }

  get isDisabled() {
    return this.data.disabled as boolean;
  }

  isCalendarNormal(value: ICalendarValue): value is Date {
    return this.data.calendarType === CalendarType.Default;
  }
  isCalendarPeriod(value: ICalendarValue): value is ICalendarPeriodType {
    return this.data.calendarType === CalendarType.Period;
  }

  handleCalendarSelect(item: ICalendarValue) {
    this.updateValue(item);
  }

  closeCalendar() {
    this.popup.closePopup();
  }
}
</script>

<style lang="postcss" scoped>
div.display-text {
  height: 100%;
  width: 100%;
  flex-flow: row nowrap;
  text-align: left;

  div.infos {
    flex: 1 1 auto;
    justify-content: center;
    padding-left: 10px;
    font-weight: 600;

    span.placeholder {
      color: var(--text4);
    }

    span.value {
      font-size: 14px;
    }

    &.top {
      padding: 2px 5px;
      justify-content: space-around;
      span.placeholder {
        font-size: 10px;
      }
    }
  }

  div.icon-collapse {
    flex: 0 0 auto;
    padding: 10px;
  }
}
</style>
