<template>
  <router-link
    to="/projects"
    class="slide-item"
    :style="getContainerStyle"
    ref="slideItem"
    @mouseenter.native="handleMouseEnter"
    @mouseleave.native="handleMouseLeave"
  >
    <img class="mask" src="~@images/blank.png" />
    <div class="content bg" ref="content" :style="getContentStyle" :class="{ hovered }">
      <img class="vicflix" src="~@images/vicflix.png" width="60px" />
      <transition name="fade">
        <div v-if="hovered" class="info-item flex pad10">
          <div class="infos column flex">
            <div class="play flex margb5">
              <div class="circle">
                <SvgIcon src="icons/actions/play.svg" color="red1" />
              </div>
            </div>
            <span class="title">{{ item.title }}</span>
            <div class="technos flex" v-if="item.type === 'Work Project'">
              <img
                v-for="techno of item.technos"
                :key="techno"
                :src="require(`@images/technos/${iconsPaths[techno]}`)"
              />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </router-link>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ISlideItem, ITechno } from '@models';
import { setTimeout, clearTimeout } from 'timers';
import { Dictionary } from 'vuex';

const icons: { [key in ITechno]?: string } = {
  Vue: 'vue.png',
  Graphql: 'graphql.png',
  Typescript: 'ts.png',
  Stripe: 'stripe.png',
  MapBox: 'mapbox.png',
  PWA: 'pwa.png',
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
        transform: 'scale(1.4)',
      };
    }
  }

  async handleMouseEnter() {
    window.requestAnimationFrame(() => {
      this.$emit('mouseenter', this.$refs.slideItem);
      this.hoverTimeout = setTimeout(() => {
        this.hovered = true;
        this.$refs.content.style.zIndex = '10';
      }, 400);
    });
  }
  handleMouseLeave() {
    window.requestAnimationFrame(() => {
      clearTimeout(this.hoverTimeout);
      this.$emit('mouseleave', this.$refs.slideItem);
      this.hovered = false;
      setTimeout(() => {
        this.$refs.content.style.zIndex = 'initial';
      }, 250);
    });
  }
}
</script>



<style lang="scss" scoped>
.slide-item {
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

    &.hovered {
      z-index: 3;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      z-index: 10;
      border: 1px solid black;
    }

    img.vicflix {
      position: absolute;
      left: 5px;
      top: 5px;
    }

    div.info-item {
      flex-flow: row nowrap;
      top: 1px;
      left: -1px;
      height: 100%;
      width: calc(100% + 2px);
      max-width: none;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));

      div.play {
        div.circle {
          border: 1px solid $w200;
          border-radius: 100%;
        }
      }

      div.infos {
        justify-content: flex-end;
        flex: 1 1 auto;

        span.title {
          color: $w220;
          font-size: 16px;
          font-weight: bold;
        }

        span.description {
          color: $w180;
          font-size: 12px;
          margin-top: 10px;
        }
      }

      div.technos {
        flex-flow: row wrap;
        padding: 5px 0;

        img {
          height: 15px;
          width: auto;
          &:not(:first-child) {
            margin-left: 5px;
          }
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
