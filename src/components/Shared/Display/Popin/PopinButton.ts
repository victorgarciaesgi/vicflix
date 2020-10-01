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
    elRoot.addEventListener('click', this.clickEvent);
    elRoot.addEventListener('mouseenter', this.mouseEnterEvent);
    elRoot.addEventListener('mouseleave', this.mouseLeaveEvent);
    elRoot.classList.add('cursor-pointer');
    this.$emit('element-init', elRoot);
  }

  render(h: CreateElement) {
    return this.$slots.default;
  }
}
