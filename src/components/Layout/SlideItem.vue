<template>
  <li class="slide-item" :style="getStyle">
    <img class="mask" src="~@images/blank.png" alt="" />
    <div class="content bg" :style="{ backgroundImage: `url(${item.image})` }"></div>
  </li>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ISlideItem } from '@models';

@Component({})
export default class SliderItem extends Vue {
  @Prop() item: ISlideItem;
  @Prop() perPage: number;

  get getStyle() {
    return {
      width: `calc(100% / ${this.perPage})`,
    };
  }
}
</script>



<style lang="scss" scoped>
li.slide-item {
  position: relative;
  width: calc(100% / 4);
  flex: 0 0 auto;
  display: block;

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
