<template>
  <div class="Switch">
    <Spinner v-if="loading" :size="22" />
    <div :class="{ checked: value, darkmode }" class="container p-2" @click="changeValue">
      <template v-if="darkmode">
        <img src="~@icons/header/sun.png" width="16" class="sun" />
        <img src="~@icons/header/moon.png" width="16" class="moon" />
      </template>
      <div class="boule"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'nuxt-property-decorator';

@Component({})
export default class Toggle extends Vue {
  @Prop({ required: true })
  value!: boolean;
  @Prop({ required: false })
  loading?: boolean;
  @Prop({ default: false, required: false }) darkmode!: boolean;
  @Prop({ default: true, required: false }) trueValue!: any;
  @Prop({ default: false, required: false }) falseValue!: any;

  changeValue() {
    if (!this.value) {
      this.$emit('input', this.trueValue);
      this.$emit('switch', this.trueValue);
    } else {
      this.$emit('input', this.falseValue);
      this.$emit('switch', this.falseValue);
    }
  }
}
</script>

<style lang="postcss" scoped>
$boule: 24px;

.Switch {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 5px;

  .container {
    display: flex;
    position: relative;
    width: 46px;
    height: $boule;
    border-radius: $boule;

    @mixin light {
      background-color: var(--bg3);
    }

    @mixin dark {
      background-color: var(--bg4);
    }

    transition: all 0.2s;
    cursor: pointer;

    .sun {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
    }

    .moon {
      position: absolute;
      left: 4px;
      top: 50%;
      transform: translateY(-50%);
    }

    .boule {
      position: absolute;
      height: 20px;
      width: 20px;
      border-radius: $boule;
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
        background-color: var(--red);
      }

      .boule {
        left: calc(100% - 22px);
      }
    }
  }
}
</style>
