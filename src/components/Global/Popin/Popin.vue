<template>
  <Fragment>
    <!-- Popin wrapper -->
    <Portal v-if="rendered" to="Popup-Outlet">
      <transition name="fade-show">
        <div
          v-show="visible"
          ref="popup"
          :key="id"
          :style="getPopupStyle"
          class="Popup-Box / absolute"
          @click.stop
          @mouseenter.stop="handlePopupMouseEnter"
          @mouseleave="handlePopupMouseLeave"
        >
          <div
            v-if="arrow"
            ref="arrow"
            :src="getArrowSrc"
            :class="[PopupPlacement, alignement]"
            class="Arrow / absolute z-0"
          >
            <svg
              :height="10"
              :width="20"
              x="0px"
              y="0px"
              viewBox="0 0 26 13"
              style="enable-background: new 0 0 26 13"
              xml:space="preserve"
            >
              <g>
                <!-- <path
                class="st0"
                fill="var(--bg5)"
                d="M26,13h-1.5L13.53,1.71c-0.29-0.3-0.77-0.3-1.06,0L1.5,13H0L12.45,0.21c0.3-0.31,0.8-0.31,1.1,0L26,13z"
              /> -->
                <path
                  class="st1"
                  :fill="themeColor"
                  d="M24.5,13h-23L12.47,1.71c0.29-0.3,0.77-0.3,1.06,0L24.5,13z"
                />
              </g>
            </svg>
          </div>
          <div
            class="max-h-inh z-10 flex overflow-x-hidden overflow-y-auto"
            :class="[{ 'rounded-md': rounded }]"
            :style="{ backgroundColor: themeColor }"
          >
            <slot :alignement="alignement" name="content" />
          </div>
        </div>
      </transition>
    </Portal>

    <!-- Button wrapper -->
    <PopinButton
      @click="handleClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @element-init="initButtonRoot"
      :stopPropagation="stopPropagation"
      :mode="mode"
    >
      <slot :active="visible" name="button" />
    </PopinButton>
  </Fragment>
</template>

<script lang="ts">
import { Vue, Prop, Component, Emit } from 'nuxt-property-decorator';
import { EventBus, Events } from '@services';
import { nanoid } from 'nanoid';
import colorsModule from '@colors';
import { getPopupComputedOutputMesures, getScrollParent } from './utils';
import { PopupPlacement, PopupMode, PopupAlignement } from './types';
import PopinButton from './PopinButton';
const { Fragment } = require('vue-fragment');

@Component({
  components: {
    Fragment,
    PopinButton,
  },
})
export default class Popin extends Vue {
  @Prop({ type: [Number], required: false })
  width?: number;
  @Prop({ default: PopupMode.Click })
  mode!: PopupMode;
  @Prop({ required: false })
  container?: HTMLElement | Vue;
  @Prop({ default: false, type: Boolean })
  full!: boolean;
  @Prop({ default: false, type: Boolean })
  disabled!: boolean;
  @Prop({ default: true, type: Boolean }) arrow!: boolean;
  @Prop({ default: false, type: Boolean }) nested!: boolean;
  @Prop({ required: false }) nestedNamespace?: string;
  @Prop({ required: false }) nestedRoot?: string;
  @Prop({ default: '-1' }) tabindex!: string;
  @Prop({ default: true, type: Boolean }) rounded!: boolean;
  @Prop({ default: 0 }) offset!: number;
  @Prop({ default: PopupPlacement.Top }) placement!: PopupPlacement;
  @Prop({ required: false }) alignement?: PopupAlignement;
  @Prop({ default: false, type: Boolean }) inHeader?: boolean;
  @Prop({ required: false, type: Boolean }) debounce?: boolean;
  @Prop({ default: false, type: Boolean }) shadow!: boolean;
  @Prop({ default: true }) stopPropagation!: boolean;

  @Prop({ default: 'black' }) theme!: string;

  @Emit()
  focus(event: Event) {
    return event;
  }
  @Emit()
  blur(event: Event) {
    return event;
  }

  @Emit('open') emitOpen() {}
  @Emit('close') emitClose() {}

  $refs!: {
    popup: HTMLDivElement;
    arrow: HTMLElement;
  };
  button: HTMLElement | null = null;

  colorList = colorsModule;

  initButtonRoot(el: HTMLElement) {
    this.button = el;
  }

  get themeColor() {
    if (this.colorList[this.theme]) {
      return this.colorList[this.theme];
    } else return this.theme;
  }

  public rendered = false;
  public visible = false;
  public PopupPlacement: PopupPlacement | null = null;
  public PopupAlignement: PopupAlignement | null = null;
  public arrowPosition: string | null = null;
  public resizeObserver: ResizeObserver | null = null;
  readonly id = nanoid(6);
  public hovered = false;
  public timeout: NodeJS.Timeout | null = null;

  get getPopupStyle(): Partial<CSSStyleDeclaration> | null {
    return {
      width: this.width ? this.width + 'px' : 'max-content',
      maxWidth: '100vw',
      ...(this.shadow && {
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
      }),
      ...(!this.debounce &&
        this.mode === PopupMode.Hover && {
          pointerEvents: 'none',
        }),
    };
  }

  get isTop() {
    return this.PopupPlacement === PopupPlacement.Top;
  }
  get isBottom() {
    return this.PopupPlacement === PopupPlacement.Bottom;
  }

  get getArrowSrc(): string {
    return 'popup/arrow_bottom';
    // if (this.PopupPlacement === PopupPlacement.Top) {
    //   return 'icons/popup/arrow_top.svg';
    // } else {

    // }
  }

  handleClick(event: UIEvent) {
    if (this.mode === PopupMode.Click && !this.disabled) {
      if (!this.visible) {
        this.showPopup(event);
      } else {
        this.closePopup();
      }
    }
  }

  handleMouseEnter(event: UIEvent) {
    if (this.mode === PopupMode.Hover && !this.disabled) {
      if (this.timeout) clearTimeout(this.timeout);
      this.showPopup(event);
    }
  }

  handlePopupMouseEnter(event: UIEvent) {
    if (this.mode === PopupMode.Hover && !this.disabled) {
      if (this.timeout) clearTimeout(this.timeout);
      this.showPopup(event);
    }
  }

  debounceClosePopup() {
    this.timeout = setTimeout(() => {
      this.closePopup();
    }, 200);
  }

  handleMouseLeave() {
    if (this.mode === PopupMode.Hover && !this.disabled) {
      if (this.debounce) {
        this.debounceClosePopup();
      } else {
        this.closePopup();
      }
    }
  }
  handlePopupMouseLeave(event: UIEvent) {
    if (this.mode === PopupMode.Hover && !this.disabled) {
      if (this.debounce) {
        this.debounceClosePopup();
      } else {
        this.closePopup();
      }
    }
  }

  showPopup(event?: UIEvent): void {
    if (!this.visible) {
      this.rendered = true;
      this.visible = true;
      this.handlePopupDisplay(event);
      this.emitOpen();
    }
  }

  closePopup(event?: Event): void {
    this.PopupPlacement = null;
    this.PopupAlignement = null;
    this.arrowPosition = null;
    this.visible = false;
    if (this.nestedRoot) {
      EventBus.$emit(`${Events.CLOSE_POPUPS}-${this.nestedRoot}`);
    }
    this.removeListeners();
    this.emitClose();
  }

  async handlePopupDisplay(event?: Event) {
    await Vue.nextTick();
    const success = this.processPopupPlacement(event);
    await Vue.nextTick();
    if (success) this.addListeners();
  }

  processPopupPlacement(event?: Event): boolean {
    const buttonOrigin = this.button;
    const popupTarget = this.$refs.popup;

    if (popupTarget && buttonOrigin) {
      const {
        placement,
        alignement,
        left,
        top,
        minWidth,
        maxHeight,
        maxWidth,
        arrowPosition,
      } = getPopupComputedOutputMesures({
        buttonOrigin,
        popupTarget,
        full: this.full,
        arrow: this.arrow,
        container: this.container,
        offset: this.offset,
        placement: this.placement,
        alignement: this.alignement,
      });
      this.PopupPlacement = placement;
      this.PopupAlignement = alignement;
      this.arrowPosition = arrowPosition;

      const [headerHeight] = document.documentElement.style
        .getPropertyValue('--headerHeight')
        .split('px');

      if (
        !this.inHeader &&
        placement === PopupPlacement.Bottom &&
        !this.container &&
        Number(top.split('px')[0]) <= Number(headerHeight)
      ) {
        this.closePopup();
        return false;
      } else {
        const popupStyle = popupTarget.style;
        popupStyle.transform = `translate3d(${left}, ${top}, 0)`;
        popupStyle.maxHeight = `${maxHeight}px`;
        if (minWidth) popupStyle.minWidth = `${minWidth}px`;
        popupStyle.maxWidth = `${maxWidth}px`;
        if (this.arrow) {
          const arrow = this.$refs?.arrow as HTMLElement;
          arrow.style.transform = `translate3d(${arrowPosition}, 0, 0) ${
            placement === PopupPlacement.Top ? `rotate(180deg)` : ''
          }`;
        }
        return true;
      }
    }
    return false;
  }

  addListeners() {
    if (!this.nested) {
      EventBus.$emit(Events.CLOSE_POPUPS);
    } else if (this.nestedNamespace) {
      EventBus.$emit(`${Events.CLOSE_POPUPS}-${this.nestedNamespace}`);
    }
    window.addEventListener('resize', this.processPopupPlacement);
    window.addEventListener('scroll', this.processPopupPlacement);
    document.body.addEventListener('click', this.closePopup);
    // document.body.addEventListener('touchstart', this.closePopup);
    this.$refs.popup.addEventListener('touchstart', (e) => e.stopPropagation());
    this.addResizeObserver();

    const parentScrollNode = getScrollParent(this.$refs.popup);
    if (parentScrollNode && !parentScrollNode.isEqualNode(document.body)) {
      parentScrollNode.addEventListener('scroll', this.processPopupPlacement);
    }

    if (!this.nested) {
      EventBus.$on(Events.CLOSE_POPUPS, this.closePopup);
    } else if (this.nestedNamespace) {
      EventBus.$on(`${Events.CLOSE_POPUPS}-${this.nestedNamespace}`, this.closePopup);
    }
  }

  addResizeObserver() {
    if (this.resizeObserver && this.$refs.popup) {
      this.resizeObserver.observe(this.$refs.popup);
    }
  }

  removeResizeObserver() {
    if (this.resizeObserver && this.$refs.popup) {
      this.resizeObserver.unobserve(this.$refs.popup);
    }
  }

  removeListeners() {
    EventBus.$off(Events.CLOSE_POPUPS, this.closePopup);
    if (this.nestedNamespace) {
      EventBus.$off(`${Events.CLOSE_POPUPS}-${this.nestedNamespace}`);
    }
    window.removeEventListener('resize', this.processPopupPlacement);
    window.removeEventListener('scroll', this.processPopupPlacement);
    document.body.removeEventListener('click', this.closePopup);
    document.body.removeEventListener('touchstart', this.closePopup);
    if (this.$refs.popup) {
      this.$refs.popup.removeEventListener('touchstart', (e) => e.stopPropagation());
    }
    this.removeResizeObserver();

    const parentScrollNode = getScrollParent(this.$refs.popup);
    if (parentScrollNode && !parentScrollNode.isEqualNode(document.body))
      parentScrollNode.removeEventListener('scroll', this.processPopupPlacement);
  }

  mounted() {
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.processPopupPlacement();
      });
    });
  }

  beforeDestroy() {
    this.rendered = false;
    this.removeListeners();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}
</script>

<style lang="postcss">
button.Button-Root {
  width: -webkit-fill-available;
  height: -webkit-fill-available;
}

div.Popup-Box {
  visibility: visible;
  position: absolute;
  margin: 0px;
  --arrowHeight: 10px;

  .Arrow {
    top: -1px;
    left: 0;
    position: absolute;
    z-index: 10;
    filter: drop-shadow(0 0 20px var(--shadow));
    &.Bottom {
      /* stylelint-disable-next-line */
      top: calc(var(--arrowHeight) * -1 + 1px);
    }
    &.Top {
      top: calc(100% - 0.8px);
    }
  }
}

.fade-show-enter-active {
  transition: opacity 0.1s linear;
}

.fade-show-enter,
.fade-show-leave-to {
  opacity: 0;
}
</style>
