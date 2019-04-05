<template>
  <div class="slider-root flex">
    <div class="title">
      <span>{{ title }}</span>
    </div>
    <div class="slider-container flex">
      <div class="slider-page-button left">
        <button class="flex center w100 h100" v-if="page > 1" @click="slideLeft">
          <SvgIcon src="icons/Forms/arrow_left.svg" color="white" size="50%" />
        </button>
      </div>
      <div class="slider-wrapper flex" key="slider">
        <ul class="slider-list flex" :style="getStyle" ref="slideList">
          <SlideItem
            v-for="item of slides"
            :key="item.id"
            :item="item"
            :perPage="slidePerPage"
            @mouseenter="setContainerFix"
            @mouseleave="freeContainer"
          />
        </ul>
      </div>
      <div class="slider-page-button right flex center">
        <button class="flex center w100 h100" v-if="page < pageLength" @click="slideRight">
          <SvgIcon src="icons/Forms/arrow_right.svg" color="white" size="50%" />
        </button>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ISlideItem } from '@models';
import SlideItem from './SlideItem.vue';
import { setTimeout, clearTimeout } from 'timers';

@Component({
  components: {
    SlideItem,
  },
})
export default class Slider extends Vue {
  @Prop({ required: true }) title: string;
  @Prop() slides: ISlideItem[];

  $refs: {
    slideList: HTMLElement;
  };

  private offset = 0;
  private slidePerPage = 4;
  private page = 1;
  private containerTimeout = null;

  get itemsOnNextPage(): number {
    const remaining = this.slides.length - this.page * this.slidePerPage;
    if (remaining > this.slidePerPage) {
      return this.slidePerPage;
    } else {
      return remaining;
    }
  }

  get itemsOnPreviousPage(): number {
    const remaining = -this.offset;
    if (remaining > this.slidePerPage) {
      return this.slidePerPage;
    } else {
      return remaining;
    }
  }

  get translateValue() {
    return +((this.offset / this.slidePerPage) * 100).toFixed(2);
  }

  slideRight() {
    this.offset -= this.itemsOnNextPage;
    this.page++;
  }
  slideLeft() {
    this.offset += +this.itemsOnPreviousPage;
    this.page--;
  }

  get pageLength() {
    return Math.ceil(this.slides.length / this.slidePerPage);
  }

  get getStyle() {
    return {
      transform: `translate3d(${this.translateValue + '%'}, 0, 0)`,
    };
  }

  setContainerFix() {
    clearTimeout(this.containerTimeout);
    this.$refs.slideList.style.maxHeight = this.$refs.slideList.clientHeight + 'px';
  }

  freeContainer() {
    clearTimeout(this.containerTimeout);
    this.containerTimeout = setTimeout(() => {
      this.$refs.slideList.style.maxHeight = 'none';
    }, 410);
  }

  checkItemPerPage() {
    const size = window.innerWidth;
    if (size < 700) {
      this.slidePerPage = 2;
    } else if (size < 1000) {
      this.slidePerPage = 3;
    } else if (size < 1300) {
      this.slidePerPage = 4;
    } else if (size < 1600) {
      this.slidePerPage = 5;
    }
  }

  created() {
    window.addEventListener('resize', this.checkItemPerPage);
    this.checkItemPerPage();
  }
}
</script>



<style lang="scss" scoped>
div.slider-root {
  width: 100%;
  flex-flow: column wrap;
  margin-top: 10px;
  margin-bottom: 20px;

  div.title {
    margin: 0 4% 10px 4%;
    font-weight: bold;
    color: $w230;
  }

  div.slider-container {
    flex-flow: row nowrap;
    div.slider-page-button {
      height: 100%;
      position: absolute;
      top: 0;
      width: 4%;
      z-index: 2;

      button {
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }
      }

      &.left {
        left: 0;
      }
      &.right {
        right: 0;
      }
    }
    div.slider-wrapper {
      padding: 0 4%;
      flex: 1 1 auto;

      ul.slider-list {
        position: relative;
        flex-flow: row nowrap;
        align-items: flex-start;
        justify-content: flex-start;
        flex: 0 0 auto;
        transition: transform 0.4s;
      }
    }
  }
}
</style>
