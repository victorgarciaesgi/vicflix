<template>
  <div class='checkbox-list'>
    <div class="checkbox"
      v-for='item of formatedItems'
      :key='item.id'>
      <div class='checkbox-wrap' >
        <input type="checkbox"
          :id='item.formId'
          :value='item'
          :disabled='isDisabled(item)'
          v-model="selectedItems"
          />
        <label :for="item.formId" class='button' :class='{small}'></label>
        <span>{{item.label}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import shortid from 'shortid';

@Component({})
export default class CheckBoxList extends Vue {
  @Prop({ required: true })
  items!: any;
  @Prop() value!: Array<any>;
  @Prop() maxSelected: number;
  @Prop() small!: boolean;

  get selectedItems() {
    return this.value;
  }

  set selectedItems(value) {
    this.$emit('input', value);
  }

  get isSelected() {
    return item => this.selectedItems.find(m => m.id === item.id);
  }

  get isDisabled() {
    return item => !this.isSelected(item) && this.selectedItems.length >= this.maxSelected;
  }

  get formatedItems() {
    return this.items.map(m => {
      m.formId = shortid.generate();
      return m;
    });
  }
}
</script>



<style lang='scss' scoped>
$bgColor: $yellow;

div.checkbox-list {
  flex-flow: column wrap;
  width: 100%;

  .checkbox {
    position: relative;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    padding: 5px 10px 5px 5px;
    height: auto;
    width: 100%;
    @include userselect;

    .checkbox-wrap {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      margin-left: 5px;

      span {
        font-size: 14px;
        // font-weight: bold;
        margin-left: 5px;
        color: $g90;
      }

      label.button {
        position: relative;
        height: 17px;
        width: 17px;
        background-color: white;
        border-radius: 3px;
        margin-right: 5px;
        border: 1px solid $w200;
        transition: all 0.3s;
        @include bg-center;
        cursor: pointer;

        &.small {
          height: 15px;
          width: 15px;
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

          & ~ span {
            color: $bgColor;
          }
        }

        &:not(:disabled) + label.button:hover {
          border-color: $bgColor;
        }

        &:disabled {
          border-color: $w220;
          & + label.button {
            cursor: not-allowed;
            & ~ span {
              color: $w150;
            }
          }
        }
      }
    }
  }
}
</style>

