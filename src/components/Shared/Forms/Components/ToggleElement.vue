<template>
  <FormElementBase v-bind="baseProps">
    <div class="Switch my-2">
      <label class="mr-2 text-sm font-semibold">{{ placeholder }}</label>
      <div :class="{ checked: value }" class="Container p-2" @click="updateValue(!value)">
        <div class="Ball"></div>
      </div>
    </div>
  </FormElementBase>
</template>

<script lang="ts">
import { Component } from 'vue-mixin-decorator';
import { FormMixin } from '@mixins';

@Component
export default class ToggleElement extends FormMixin {}
</script>

<style lang="postcss" scoped>
$Ball: 24px;

.Switch {
  position: relative;
  display: flex;
  justify-content: flex-between;
  align-items: center;

  .Container {
    display: flex;
    position: relative;
    width: 46px;
    height: $Ball;
    border-radius: $Ball;

    @mixin light {
      background-color: var(--bg3);
    }

    @mixin dark {
      background-color: var(--bg4);
    }

    transition: all 0.2s;
    cursor: pointer;

    .Ball {
      position: absolute;
      height: 20px;
      width: 20px;
      border-radius: $Ball;
      background-color: white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      left: 2px;
      top: 2px;
      transition: left 0.2s;
    }

    &.checked {
      &:not(.darkmode) {
        background-color: var(--primary);
      }
      &.darkmode {
        background-color: #5882b7;
      }

      .Ball {
        left: calc(100% - 22px);
      }
    }
  }
}
</style>
