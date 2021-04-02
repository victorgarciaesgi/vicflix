import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
import { CreateElement } from 'vue';
import { PopupMode } from './types';

@Component({})
export default class PopinButton extends Vue {
  @Prop() stopPropagation!: boolean;
  @Prop() mode!: PopupMode;

  clickEvent(event: Event) {
    if (this.stopPropagation) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
    this.$emit('click', event);
  }
  mouseEnterEvent(event: Event) {
    this.$emit('mouseenter', event);
  }
  mouseLeaveEvent(event: Event) {
    this.$emit('mouseleave', event);
  }

  get defaultSlot() {
    return this.$slots.default;
  }

  @Watch('defaultSlot', { deep: true }) slotChanged() {
    this.$nextTick(this.mountSlotElement);
  }

  mountSlotElement() {
    const elRoot = this.$el;
    if (elRoot) {
      if (this.mode === PopupMode.Click) {
        elRoot.addEventListener('click', this.clickEvent);
      }
      elRoot.addEventListener('mouseenter', this.mouseEnterEvent);
      elRoot.addEventListener('mouseleave', this.mouseLeaveEvent);
      elRoot.classList.add('cursor-pointer');
      this.$emit('element-init', elRoot);
    } else {
      console.warn('No Popin slot content found');
    }
  }

  mounted() {
    this.mountSlotElement();
  }

  beforeDestroy() {
    const elRoot = this.$el;
    if (elRoot) {
      elRoot.removeEventListener('click', this.clickEvent);
      elRoot.removeEventListener('mouseenter', this.mouseEnterEvent);
      elRoot.removeEventListener('mouseleave', this.mouseLeaveEvent);
    }
  }

  render(h: CreateElement) {
    return this.$slots.default;
  }
}
