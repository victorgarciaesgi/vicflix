<template>
  <div class="Slider-Root / relative w-full mt-2">
    <div
      class="Slider-Container / relative h-full overflow-x-hidden"
      :class="{ 'pb-16': bulletsPlacement === 'under' }"
    >
      <div ref="slider" :style="sliderStyle" class="Slider-Rail / h-full">
        <slot />
      </div>
      <div
        v-if="totalSlides && bullets"
        class="Bullet-Container / left-50p absolute z-10 flex flex-row flex-no-wrap items-center mb-5 transform -translate-x-1/2"
      >
        <div
          v-for="bullet of totalSlides"
          :key="bullet"
          class="Bullet / hover:bg-red bg-g90 w-3 h-3 mx-4 rounded-full shadow cursor-pointer"
          :class="{
            '!bg-red h-4 w-4 !cursor-default': bullet - 1 === currentIndex,
          }"
          @click="slideTo(bullet - 1)"
        >
        </div>
      </div>
    </div>
    <template v-if="arrows">
      <div
        class="Arrow-Left / absolute top-0 left-0 z-10 flex h-full pb-4"
        :style="{ width: `${slidePadding / 2 - childGap}px` }"
      >
        <div
          v-if="hasPreviousPage"
          class="center group -md:hover:bg-opacity-30 -md:hover:bg-black md:bg-black md:bg-opacity-30 flex w-full h-full text-white rounded-tr rounded-br cursor-pointer"
          @click="slidePrevious"
        >
          <SvgIcon
            pointer
            src="carrousel/arrow_back"
            class="-md:group-hover:block md:block hidden w-10 h-10"
          />
        </div>
      </div>
      <div
        class="Arrow-Right / absolute top-0 right-0 z-10 flex h-full pb-4"
        :style="{ width: `${slidePadding / 2 - childGap}px` }"
      >
        <div
          v-if="hasNextPage"
          class="center group -md:hover:bg-opacity-30 -md:hover:bg-black md:bg-black md:bg-opacity-30 flex w-full h-full text-white rounded-tl rounded-bl cursor-pointer"
          @click="slideNext"
        >
          <SvgIcon
            pointer
            src="carrousel/arrow_next"
            class="-md:group-hover:block md:block hidden w-10 h-10"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from 'nuxt-property-decorator';
import { BreakpointMixin } from '@mixins';

@Component({})
export default class Carrousel extends BreakpointMixin {
  @Prop({ required: false, default: 1, type: [Number, Array] }) itemsPerView!:
    | number
    | Array<[number, number] | number>;
  @Prop() bullets?: boolean;
  @Prop() arrows?: boolean;
  @Prop(Boolean) center?: boolean;
  @Prop({ type: String, default: 'bottom' }) bulletsPlacement!: 'bottom' | 'under';

  @Ref() slider!: HTMLDivElement;

  public currentIndex = 0;
  public totalItems = 0;
  public isDragging = false;
  public childGap = 3;
  public slidePadding = 100;

  public isReady = false;

  public startX = 0;
  public startY = 0;

  get calculatedItemsPerView(): number {
    if (Array.isArray(this.itemsPerView)) {
      const [defaultValue] = this.itemsPerView.filter((f): f is number => typeof f === 'number');
      const [breakpoint, value] = this.itemsPerView
        .filter((f): f is [number, number] => Array.isArray(f))
        .reduce(
          (acc, [breakpoint, value]) => {
            if (this.windowWidth < breakpoint && breakpoint < acc[0]) {
              return [breakpoint, value];
            }
            return acc;
          },
          [99999, defaultValue]
        );
      return value;
    } else {
      return this.itemsPerView;
    }
  }

  @Watch('currentIndex', { immediate: true }) indexChanged() {
    this.$emit('update:index', this.currentIndex);
  }
  @Watch('totalSlides', { immediate: true }) slidesChanged() {
    this.$emit('update:slides', this.totalSlides);
  }

  @Watch('windowWidth')
  windowChanged(value: number) {
    this.breakpointChanged(this.calculatedItemsPerView);
  }

  @Watch('calculatedItemsPerView')
  breakpointChanged(value: number) {
    if (this.center) {
      const slideWidth = (this.slider.clientWidth - this.slidePadding) / value - this.childGap * 2;
      this.slider.style.setProperty('--childBasis', `${slideWidth}px`);
      this.slider.style.setProperty('--childGap', `${this.childGap}px`);
    } else {
      this.slider.style.setProperty('--childBasis', `${100 / value}%`);
    }
    const { transform } = this.handleTransform();
    this.slider.style.transform = transform;
  }

  get totalSlides() {
    if (this.$slots?.default) {
      return Math.ceil(this.$slots.default.length / this.calculatedItemsPerView);
    }
    return 0;
  }

  get hasPreviousPage() {
    return this.currentIndex > 0;
  }
  get hasNextPage() {
    return this.currentIndex < this.totalSlides - 1;
  }

  get sliderStyle(): Partial<CSSStyleDeclaration> {
    const { transform } = this.handleTransform();
    return {
      flexBasis: `100%`,
      ...(!this.isDragging &&
        this.isReady && {
          transition: `transform 0.5s ease-in-out`,
        }),
      transform,
    };
  }

  slideTo(index: number) {
    this.currentIndex = index;
  }

  slidePrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
  slideNext() {
    if (this.totalSlides && this.currentIndex < this.totalSlides - 1) {
      this.currentIndex++;
    }
  }

  handleTransform(): { transform: string; rawValue: number } {
    let transform = ``;
    let rawValue = 0;
    let slideSizePercent = this.center ? 80 : 100;
    let slideSizeMargin = this.slidePadding || 0;
    let slideOffset = this.center ? 10 : 0;
    if (this.$slots?.default?.length) {
      if (this.currentIndex * this.calculatedItemsPerView >= this.$slots.default.length) {
        this.currentIndex--;
      }
    }
    if (this.isMounted && this.center) {
      const sliderWidth = this.slider.clientWidth;
      rawValue = -(this.currentIndex * (sliderWidth - slideSizeMargin)) + slideSizeMargin / 2;
      transform = `translate3d(${rawValue}px, 0 ,0)`;
    } else if (this.isMounted) {
      const sliderWidth = this.slider.clientWidth;
      rawValue = -(this.currentIndex * sliderWidth);
      transform = `translate3d(${rawValue}px, 0 ,0)`;
    }
    return { transform, rawValue };
  }

  handleTouchStart(event: TouchEvent) {
    const { pageX, pageY } = event.changedTouches[0];
    this.startX = pageX;
    this.startY = pageY;
    // event.preventDefault();
  }
  async handleTouchEnd(event: TouchEvent) {
    this.isDragging = false;

    const { pageX } = event.changedTouches[0];
    const distance = pageX - this.startX;
    const width = this.slider.clientWidth;
    await this.$nextTick();
    if (distance > 0 && distance > width / 3) {
      this.slidePrevious();
    } else if (distance < 0 && -distance > width / 3) {
      this.slideNext();
    } else {
      const { transform } = this.handleTransform();
      this.slider.style.transform = transform;
    }
  }

  handleTouchMove(event: TouchEvent) {
    this.isDragging = true;
    const { pageX, pageY } = event.changedTouches[0];
    const distanceX = pageX - this.startX;
    const distanceY = pageY - this.startY;
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      event.preventDefault();
      const { rawValue } = this.handleTransform();
      this.slider.style.transform = `translate3d(${rawValue + distanceX}px, 0, 0)`;
    }
  }

  mounted() {
    this.slider.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.slider.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    this.slider.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.breakpointChanged(this.calculatedItemsPerView);
    setTimeout(() => {
      this.isReady = true;
    }, 300);
  }

  beforeDestroy() {
    this.slider.removeEventListener('touchstart', this.handleTouchStart);
    this.slider.removeEventListener('touchend', this.handleTouchEnd);
    this.slider.removeEventListener('touchmove', this.handleTouchMove);
  }
}
</script>

<style lang="postcss">
div.Slider-Rail {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  backface-visibility: hidden;
  --childBasis: 100%;
  --childGap: 0px;
  will-change: transform;
  touch-action: pan-x pan-y;

  & > * {
    width: var(--childBasis);
    margin-left: var(--childGap);
    margin-right: var(--childGap);
    flex-grow: 0;
    flex-shrink: 0;
    user-select: none;
    height: 100%;
    outline: none;
    backface-visibility: hidden;
  }
}

div.Bullet-Container {
  bottom: 0;
  /* div.Bullet {
    transition: background-color 0.2s, height 0.2s, width 0.2s;
  } */
}
</style>
