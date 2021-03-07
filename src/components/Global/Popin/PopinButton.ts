import { Component, Vue } from 'nuxt-property-decorator';
import { CreateElement } from 'vue';

@Component({})
export default class PopinButton extends Vue {
  clickEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.$emit('click', event);
  }
  mouseEnterEvent(event: Event) {
    this.$emit('mouseenter', event);
  }
  mouseLeaveEvent(event: Event) {
    this.$emit('mouseleave', event);
  }

  mounted() {
    const elRoot = this.$el;
    if (elRoot) {
      elRoot.addEventListener('click', this.clickEvent);
      elRoot.addEventListener('mouseenter', this.mouseEnterEvent);
      elRoot.addEventListener('mouseleave', this.mouseLeaveEvent);
      elRoot.classList.add('cursor-pointer');
      this.$emit('element-init', elRoot);
    } else {
      console.warn('No Popin slot content found');
    }
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
