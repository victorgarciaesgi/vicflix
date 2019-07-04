<template>
  <div
    ref="popupRoot"
    class="popup-root"
    @mouseenter="togglePopup('hover', $event)"
    @mouseleave="togglePopup('hover', $event)"
  >
    <transition :name="mode === 'click' ? 'slide-top' : null">
      <div
        v-if="show"
        ref="popup"
        class="popup-box"
        :style="getWidth"
        :class="[
          PopupXYTypes.XType,
          PopupXYTypes.YType,
          theme,
          { active: show, selectMode, scroll, outside },
        ]"
        @click.stop
      >
        <div
          v-if="show && !selectMode"
          class="triangle"
          :style="trianglePosition"
          :class="[PopupXYTypes.XType, PopupXYTypes.YType, { active: show }]"
        ></div>
        <div class="popup-wrapper">
          <slot v-if="show" name="popup" :direction="PopupXYTypes.YType" />
        </div>
      </div>
    </transition>
    <button
      ref="button"
      class="button-popup"
      :class="{ active: show, shadow }"
      @click.stop.prevent="togglePopup('click', $event)"
    >
      <slot name="button" :active="show" />
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';

import { EventBus, Events } from '@services';
import { calculatePopupRelativePosition, calculatePopupPosition } from '@methods';

@Component({})
export default class Popup extends Vue {
  @Prop({ default: 'auto', type: [String, Number] })
  width: number | string;
  @Prop({ default: 'click' })
  mode: 'click' | 'hover';
  @Prop()
  container: HTMLElement;
  @Prop({ default: false })
  selectMode: boolean;
  @Prop({ default: true })
  scroll: boolean;
  @Prop({ default: false })
  disabled: boolean;
  @Prop({ default: 'dark' })
  theme: 'white' | 'dark';
  @Prop({ default: false })
  outside: boolean;
  @Prop({ default: true }) shadow: boolean;
  @Prop() onFocus: boolean;

  public show: boolean = false;
  public PopupXYTypes = {
    XType: null,
    YType: null,
  };
  public trianglePosition = null;

  $refs: {
    button: HTMLElement;
    popup: HTMLElement;
    popupRoot: HTMLElement;
  };

  get getWidth() {
    if (!this.width) return 'auto';
    return { width: this.width + 'px' };
  }

  async togglePopup(mode: 'click' | 'hover', event: Event) {
    if (mode === this.mode) {
      if (this.disabled) {
        return;
      }
      if (!this.show) {
        this.showPopup(event);
        EventBus.$emit(Events.CLOSE_POPUPS, this);
        window.addEventListener('resize', this.closePopup);
        window.addEventListener('scroll', this.closePopup);
        document.body.addEventListener('click', this.closePopup);
        document.body.addEventListener('touchstart', this.closePopup);
        this.$refs.popupRoot.addEventListener('touchstart', e => e.stopPropagation());
        if (this.getScrollParent(this.$refs.popupRoot)) {
          this.getScrollParent(this.$refs.popupRoot).addEventListener('scroll', this.closePopup);
        }

        EventBus.$on(Events.CLOSE_POPUPS, this.closePopup);
        this.$emit('open');
      } else {
        this.closePopup();
      }
    }
  }

  async showPopup(event?: Event): Promise<void> {
    this.show = true;
    await this.$nextTick();
    window.requestAnimationFrame(async () => {
      const origin = this.$refs.button.children[0] as HTMLElement;
      const target = this.$refs.popup;
      const Types = calculatePopupRelativePosition(origin, target, this.selectMode, this.container);
      if (this.outside) {
        const { left, top, bottom, triangleLeft } = calculatePopupPosition(
          origin,
          target,
          Types,
          this.selectMode
        );
        target.style.left = left as string;
        target.style.top = top as string;
        target.style.bottom = bottom as string;
        if (this.selectMode) {
          target.style.width = this.$refs.button.clientWidth + 'px';
        }

        if (Types.XType === 'center') {
          this.trianglePosition = {
            left: '50%',
          };
        } else {
          this.trianglePosition = {
            left: triangleLeft,
          };
        }
        this.PopupXYTypes = Types;
      } else {
        this.PopupXYTypes = Types;
        if (Types.XType === 'center') {
          this.trianglePosition = {
            left: '50%',
          };
        } else {
          this.trianglePosition = {
            [Types.XType]: origin.offsetWidth / 2 - 13 + 'px',
          };
        }
      }
      if (Types.XType === 'fill') {
        target.style.width =
          (this.container ? this.container.offsetWidth : window.innerWidth) - 20 + 'px';
      }

      if (Types.maxHeight) {
        target.style.maxHeight = Types.maxHeight + 'px';
      }
    });
  }

  getScrollParent(node: HTMLElement): HTMLElement {
    if (node == null) {
      return null;
    }
    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return this.getScrollParent(node.parentElement);
    }
  }

  closePopup(event?: Event): void {
    // if (event) event.preventDefault()
    this.PopupXYTypes = {
      XType: null,
      YType: null,
    };
    this.show = false;
    this.$emit('close');
    EventBus.$off(Events.CLOSE_POPUPS);
    window.removeEventListener('resize', this.closePopup);
    window.removeEventListener('scroll', this.closePopup);
    document.body.removeEventListener('click', this.closePopup);
    document.body.removeEventListener('touchstart', this.closePopup);

    if (this.getScrollParent(this.$refs.popupRoot))
      this.getScrollParent(this.$refs.popupRoot).removeEventListener('scroll', this.closePopup);
  }
}
</script>

<style lang="scss" scoped>
.popup-root {
  position: relative;
  flex: inherit;
  flex-flow: inherit;
  justify-content: inherit;
  align-items: inherit;
  max-width: 100%;
  width: inherit;
  flex: 0 0 auto;

  .popup-box {
    position: absolute;
    display: flex;
    align-items: stretch;
    background-color: white;
    box-shadow: 0 0 20px rgba(10, 10, 10, 0.2);
    height: auto;
    border-radius: 5px;
    min-height: 30px;
    min-width: 50px;
    width: auto;
    flex-flow: row nowrap;
    z-index: 10011;
    max-width: 100vw;

    &.outside {
      position: fixed;
    }

    .centerContent {
      display: flex;
      flex-flow: row nowrap;
      position: relative;
      justify-content: center;
      align-items: center;
      width: 100%;
      text-align: center;
    }

    &:not(.selectMode):not(.outside) {
      &.center {
        left: 50%;
        transform: translateX(-50%);
      }
      &.top {
        top: none;
        bottom: calc(100% + 15px);
      }

      &.bottom {
        bottom: none;
        top: calc(100% + 15px);
      }
      &.right:not(.outside) {
        right: 0;
      }
    }

    &.selectMode:not(.outside) {
      width: 100%;

      &.top {
        top: none;
        bottom: calc(100% + 2px);
      }

      &.bottom {
        bottom: none;
        top: calc(100% + 2px);
      }
    }

    div.popup-wrapper {
      display: flex;
      max-height: 100%;
      width: 100%;
      flex: 0 0 auto;
      white-space: nowrap;
      border-radius: 5px;
      overflow-y: hidden;
      overflow-x: hidden;
      z-index: 1000;
    }

    &.scroll .popup-wrapper {
      overflow-y: auto;
    }

    div.header {
      display: flex;
      flex-flow: column wrap;
      flex: 0 0 auto;
      height: 40px;
      padding-left: 10px;
      font-weight: bold;
      justify-content: center;
      border-bottom: 1px solid rgb(230, 230, 230);
    }

    div.content {
      display: flex;
      flex-flow: column wrap;
      flex: 1 1 auto;
      overflow: auto;
      padding: 10px;
    }

    div.footer {
      display: flex;
      flex-flow: row nowrap;
      flex: 0 0 auto;
      padding: 5px;
      height: 50px;
      align-items: center;
      align-content: center;
      justify-content: flex-end;
    }

    $triangleSize: 13px;
    $triangleColor: #fff;

    .triangle {
      position: absolute;
      z-index: 10009;
      width: 0;
      height: 0;
      border-left: $triangleSize solid transparent;
      border-right: $triangleSize solid transparent;
      border-top: $triangleSize solid $triangleColor;
      filter: drop-shadow(0px 6px 4px rgba(50, 50, 50, 0.1));

      &.left {
        left: 10px;
      }
      &.bottom {
        bottom: 100%;
        border-bottom: $triangleSize solid $triangleColor;
        border-top: $triangleSize solid transparent;
        filter: drop-shadow(0px -6px 4px rgba(50, 50, 50, 0.1));
      }
      &.top {
        top: 100%;
      }
      &.right {
        right: 10px;
      }
      &.center {
        left: 50%;
        transform: translateX(-50%);
      }
    }

    &.dark {
      background-color: rgb(60, 60, 60);

      .triangle {
        border-left: $triangleSize solid transparent;
        border-right: $triangleSize solid transparent;
        border-top: $triangleSize solid rgb(60, 60, 60);

        &.bottom {
          border-bottom: $triangleSize solid rgb(60, 60, 60);
          border-top: $triangleSize solid transparent;
        }
      }
    }
  }

  button.button-popup {
    position: relative;
    display: flex;
    flex-flow: inherit;
    justify-content: inherit;
    align-items: inherit;
    position: unset;
    height: 100%;
    width: 100%;
    flex: inherit;
    max-width: 100%;
    @include userselect;
    cursor: pointer;

    // &.shadow.active > * {
    //   transition: box-shadow 0.2s;
    //   box-shadow: 0 0 5px inset rgba(0, 0, 0, 0.15);
    // }
  }
}
</style>
