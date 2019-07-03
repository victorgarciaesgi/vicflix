<template>
  <li
    class="slide-item"
    :style="getContainerStyle"
    ref="slideItem"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <img class="mask" src="~@images/blank.png" />
    <div class="content bg" ref="content" :style="getContentStyle">
      <img class="vicflix" src="~@images/vicflix.png" width="60px" />
      <transition name="fade">
        <div class="info-item flex">
          <div class="infos column flex">
            <span class="title">{{ item.title }}</span>
            <span class="description ellipsis">{{ item.description }}</span>
          </div>
          <div class="technos flex" v-if="item.type === 'Project'">
            <img
              v-for="techno of item.technos"
              :key="techno"
              :src="require(`@images/technos/${iconsPaths[techno]}`)"
            />
          </div>
        </div>
      </transition>
    </div>
  </li>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ISlideItem } from '@models';
import { setTimeout, clearTimeout } from 'timers';

const icons = {
  Vue: 'vue.png',
  Graphql: 'graphql.png',
  Typescript: 'ts.png',
  Stripe: 'stripe.png',
};

@Component({})
export default class SliderItem extends Vue {
  @Prop() item: ISlideItem;
  @Prop() perPage: number;

  private hovered = false;
  private hoverTimeout = null;
  private ratio = 240 / 136;

  private iconsPaths = icons;

  $refs: {
    slideItem: HTMLElement;
    content: HTMLElement;
  };

  get getContainerStyle() {
    return {
      width: `calc(100% / ${this.perPage})`,
    };
  }

  get getContentStyle() {
    if (!this.hovered) {
      return { backgroundImage: `url(${this.item.image})` };
    } else {
      return {
        backgroundImage: `url(${this.item.image})`,
        transform: 'scale(1.2)',
      };
    }
  }

  async handleMouseEnter() {
    this.$emit('mouseenter', this.$refs.slideItem);
    this.hoverTimeout = setTimeout(() => {
      this.hovered = true;
      this.$refs.content.style.zIndex = '10';
    }, 400);
  }
  handleMouseLeave() {
    clearTimeout(this.hoverTimeout);
    this.$emit('mouseleave', this.$refs.slideItem);
    this.hovered = false;
    setTimeout(() => {
      this.$refs.content.style.zIndex = 'initial';
    }, 250);
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
  transition: width ease-in-out 0.3s, height ease-in-out 0.3s;

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
    transition: transform ease-in-out 0.3s;

    img.vicflix {
      position: absolute;
      left: 5px;
      top: 5px;
    }

    div.info-item {
      flex-flow: row nowrap;
      height: 100%;
      width: 100%;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));

      div.infos {
        justify-content: flex-end;
        flex: 1 1 auto;
      }

      div.technos {
        flex-flow: column-reverse wrap;
        padding: 0 5px;

        img {
          height: 20px;
          width: 20px;
          margin-bottom: 5px;
        }
      }
    }
  }

  &:not(:first-child) div.content {
    left: 5px;
    width: calc(100% - 5px);
  }
}
</style>
