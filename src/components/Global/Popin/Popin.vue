<template>
  <Fragment @click.native="handleClick">
    <!-- Popin wrapper -->
    <Portal v-if="rendered" to="Popup-Outlet">
      <transition name="fade">
        <div
          v-show="visible"
          ref="popup"
          :key="id"
          :style="getPopupStyle"
          class="Popup-Box / absolute"
          @click.stop
          @mouseenter="handlePopupMouseEnter"
          @mouseleave="handlePopupMouseLeave"
        >
          <div
            v-if="arrow"
            ref="arrow"
            :src="getArrowSrc"
            :class="[PopupPlacement, alignement]"
            class="Arrow / absolute"
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
                  fill="black"
                  d="M24.5,13h-23L12.47,1.71c0.29-0.3,0.77-0.3,1.06,0L24.5,13z"
                />
              </g>
            </svg>
          </div>
          <div class="max-h-inh flex overflow-x-hidden overflow-y-auto bg-black">
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
    >
      <slot :active="visible" name="button" />
    </PopinButton>
  </Fragment>
</template>

<script lang="ts">
import { Vue, Prop, Component, Emit } from 'nuxt-property-decorator';
import { EventBus, Events } from '@services';
import { nanoid } from 'nanoid';
import { debounce } from 'lodash-es';
import { getPopupComputedOutputMesures, getScrollParent } from './utils';
import { PopupPlacement, PopupAlignement } from './types';
import PopinButton from './PopinButton';
const { Fragment } = require('vue-fragment');

enum PopupMode {
  Click = 'click',
  Hover = 'hover',
  Manual = 'manual',
}

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
  @Prop({ default: '--bg1' }) theme!: string;
  @Prop({ default: PopupPlacement.Top }) placement!: PopupPlacement;
  @Prop({ required: false }) alignement?: PopupAlignement;
  @Prop({ default: false, type: Boolean }) inHeader?: boolean;

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

  initButtonRoot(el: HTMLElement) {
    this.button = el;
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
    if (!this.width) return { width: 'max-content' };
    return { width: this.width + 'px' };
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
    if (!this.visible && this.mode === PopupMode.Click && !this.disabled) {
      this.showPopup(event);
    } else {
      this.closePopup();
    }
  }

  handleMouseEnter(event: UIEvent) {
    if (this.mode === PopupMode.Hover && !this.disabled) {
      if (this.timeout) clearTimeout(this.timeout);
      this.showPopup(event);
    }
  }

  handlePopupMouseEnter(event: UIEvent) {
    if (this.mode === PopupMode.Hover && !this.disabled && this.timeout) {
      clearTimeout(this.timeout);
      this.showPopup(event);
    }
  }

  debounceClosePopup() {
    this.timeout = setTimeout(() => {
      console.log(this.hovered);
      this.closePopup();
    }, 200);
  }

  handleMouseLeave() {
    if (this.mode === PopupMode.Hover && !this.disabled) {
      this.debounceClosePopup();
    }
  }
  handlePopupMouseLeave(event: UIEvent) {
    if (this.mode === PopupMode.Hover && !this.disabled) {
      this.debounceClosePopup();
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
    if (success && this.mode !== PopupMode.Hover) this.addListeners();
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
        console.log(Number(top.split('px')[0]));
        this.closePopup();
        return false;
      } else {
        const popupStyle = popupTarget.style;
        popupStyle.transform = `translate3d(${left}, ${top}, 0)`;
        popupStyle.maxHeight = `${maxHeight}px`;
        if (minWidth) popupStyle.minWidth = `${minWidth}px`;

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
    document.body.addEventListener('touchstart', this.closePopup);
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
    // if (this.$refs.button && this.$refs.button.parentElement) {
    //   const computedStyle = window.getComputedStyle(this.$refs.button.parentElement);
    //   Array.from(computedStyle)
    //     .filter((key: any) => acceptedClonedStyles.includes(key))
    //     .forEach((key) =>
    //       this.$refs.button.style.setProperty(
    //         key,
    //         computedStyle.getPropertyValue(key),
    //         computedStyle.getPropertyPriority(key)
    //       )
    //     );
    // }
  }

  beforeDestroy() {
    this.rendered = false;
    this.removeListeners();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}
</script>

<style lang="postcss">
$arrowHeight: 10px;

button.Button-Root {
  width: -webkit-fill-available;
  height: -webkit-fill-available;
}

div.Popup-Box {
  visibility: visible;
  position: absolute;
  margin: 0px;

  .Arrow {
    top: -1px;
    left: 0;
    position: absolute;
    z-index: 10;
    filter: drop-shadow(0 0 20px var(--shadow));
    &.Bottom {
      /* stylelint-disable-next-line */
      top: calc(-$arrowHeight + 1px);
    }
    &.Top {
      top: calc(100% - 1px);
    }
  }
}
</style>
