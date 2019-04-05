<template>
  <li
    class="slide-item"
    :style="getStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <img class="mask" src="~@images/blank.png" alt="" />
    <div class="content bg" :style="{ backgroundImage: `url(${item.image})` }"></div>
  </li>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ISlideItem } from '@models';
import { setTimeout, clearTimeout } from 'timers';

@Component({})
export default class SliderItem extends Vue {
  @Prop() item: ISlideItem;
  @Prop() perPage: number;

  private hovered = false;
  private hoverTimeout = null;

  get getStyle() {
    if (!this.hovered) {
      return {
        width: `calc(100% / ${this.perPage})`,
      };
    } else {
      return {
        width: `calc(100% / ${this.perPage / 1.5})`,
        top: '50%',
        transform: `translate3d(0, -50%, 0)`,
      };
    }
  }

  async handleMouseEnter() {
    this.$emit('mouseenter');
    this.hoverTimeout = setTimeout(() => {
      this.hovered = true;
    }, 400);
  }
  handleMouseLeave() {
    clearTimeout(this.hoverTimeout);
    this.$emit('mouseleave');
    this.hovered = false;
  }
}
</script>



<style lang="scss" scoped>
li.slide-item {
  position: relative;
  flex: 0 0 auto;
  display: block;
  top: 0px;
  left: 0;
  transition: top ease-in-out 0.3s, width ease-in-out 0.3s, height ease-in-out 0.3s,
    transform ease-in-out 0.3s;

  img.mask {
    opacity: 0;
    width: 100%;
    height: auto;
  }

  div.content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  &:not(:first-child) div.content {
    left: 5px;
    width: calc(100% - 5px);
  }
}
</style>
