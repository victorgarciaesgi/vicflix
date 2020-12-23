<template>
  <div ref="step" class="steps-root flex flex-col">
    <div v-if="showSteps && $scopedSlots.header" class="center flex py-8">
      <div
        v-for="(item, index) of steps"
        :key="index"
        :class="{ active: index === currentStep, pointer: index < currentStep }"
        class="StepItem / center flex flex-col"
        @click="setStep(index)"
      >
        <slot
          name="header"
          :active="index === currentStep"
          :item="item"
          :isPrev="index < currentStep"
          :isNext="index > currentStep"
        />
      </div>
    </div>
    <div v-if="$scopedSlots.banner && selectedStep" class="flex flex-col">
      <slot name="banner" :item="selectedStep" />
    </div>
    <transition-group :name="transitionName" mode="out-in">
      <div v-for="{ item, index } of filteredSteps" :key="item.label" class="flex flex-col w-full">
        <slot :name="`step${index}`" :step="item"> </slot>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';
import { IStep } from '@models';

@Component
export default class StepViews extends Vue {
  @Prop() steps!: IStep[];
  @Prop() currentStep!: number;
  @Prop() stepCount!: number;
  @Prop({ required: false }) showSteps?: boolean;
  @Prop() setStep!: (index: number) => void;

  $refs!: {
    step: HTMLDivElement;
  };

  get filteredSteps() {
    return this.steps
      .map((m, index) => ({ index, item: m }))
      .filter((f, index) => index === this.currentStep);
  }

  public transitionName = '';

  get selectedStep() {
    return this.steps[this.currentStep];
  }

  @Watch('currentStep') stepChanged(newValue: number, oldValue: number) {
    this.transitionName = newValue > oldValue ? 'slide-left' : 'slide-right';
    const position = this.$refs.step.getBoundingClientRect() as DOMRect;
    const [header] = getComputedStyle(document.documentElement)
      .getPropertyValue('--headerHeight')
      .split('px');

    document.documentElement.scrollTo({
      top: position.top + document.documentElement.scrollTop - Number(header),
      behavior: 'smooth',
    });
  }
}
</script>

<style lang="postcss" scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  position: absolute;
  transition: opacity 0.15s, transform 0.15s;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100px, 0, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100px, 0, 0);
}

div.StepItem {
  text-align: center;
  margin: 0 20px;
  color: var(--w120);

  div.step {
    border-radius: 100%;
    height: 35px;
    width: 35px;
    margin: 10px 0;
    font-size: 22px;
    background-color: var(--w120);
    color: white;
  }

  div.label {
    text-transform: uppercase;
    padding: 10px 0;
    font-size: 18px;
    border-top: 1px solid var(--w120);
    font-weight: bold;
  }

  &.active {
    div.step {
      background-color: var(--green);
      font-weight: bold;
      color: white;
    }
    div.label {
      color: var(--green);
      border-color: var(--green);
    }
  }
}
</style>
