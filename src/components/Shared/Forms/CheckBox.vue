<template>
  <div class="checkbox">
    <div class='checkbox-wrap' :class='{big}'>
      <input :id='formId'
        :checked='formatedValue'
        @change="updateValue($event.target.checked)"
        :true-value='trueValue'
        :false-value='falseValue'      
        type="checkbox"/>
      <label :for="formId" class='button'></label>
      <label class='label' :for='formId' v-if="label && !labelLink">{{label}}</label>
      <router-link class='label' target='_blank' v-else-if='!!labelLink' :to='labelLink'>{{label}}</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import shortid from 'shortid';

@Component({})
export default class CheckBox extends Vue {
  @Prop()
  value!: any;
  @Prop()
  label: string;
  @Prop()
  trueValue: string;
  @Prop()
  falseValue: string;
  @Prop()
  big: boolean;
  @Prop()
  labelLink: string;

  private formId: string = null;

  get formatedValue() {
    if (this.trueValue && this.falseValue) {
      return this.value === this.trueValue;
    } else {
      return this.value;
    }
  }

  updateValue(value) {
    if (this.trueValue && this.falseValue) {
      this.$emit('input', value ? this.trueValue : this.falseValue);
    } else {
      this.$emit('input', value);
    }
  }

  mounted() {
    this.formId = shortid.generate();
  }
}
</script>



<style lang='scss' scoped>
$bgColor: $primary;

.checkbox {
  position: relative;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  padding: 10px 10px 10px 0;
  height: auto;
  @include userselect;

  .checkbox-wrap {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin-left: 5px;

    .label {
      font-size: 14px;
      font-weight: bold;
      margin-left: 5px;
      color: $g90;
    }
    a.label {
      text-decoration: underline;
    }

    label.button {
      position: relative;
      height: 17px;
      width: 17px;
      background-color: white;
      border-radius: 5px;
      margin-right: 5px;
      border: 1px solid $w200;
      @include bg-center;
      cursor: pointer;

      &:hover {
        border-color: $bgColor;
      }
    }

    input {
      position: absolute;
      opacity: 0;
      height: 0;
      width: 0;
      padding: 0;
      margin: 0;

      &:checked + label.button {
        background-color: $bgColor;
        background-image: url('~@icons/Forms/done_white.svg');
        border: 1px solid transparent;

        & ~ .label {
          color: $bgColor;
        }
      }
    }

    &.big {
      label.button {
        height: 24px;
        width: 24px;
      }

      .label {
        font-size: 20px;
        @media screen and (max-width: 500px) {
          font-size: 16px;
        }
      }
    }
  }
}
</style>

