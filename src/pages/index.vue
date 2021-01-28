<template>
  <div class="flex flex-col w-full">
    <NuxtChild />
    <transition
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
      @before-leave="beforeLeave"
    >
      <ProjectPreview v-if="showPreview" :id="projectId" />
    </transition>
  </div>
</template>

<script lang="ts">
import { authMiddleware } from '@middleware';
import { TransitionMixin } from '@mixins';
import { navRoutes, TransitionDirection, TransitionType } from '@models';
import { Component, Vue, Watch } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { ProjectPreview } from '@components';
import anime from 'animejs';

@Component({
  middleware: authMiddleware,
  components: {
    ProjectPreview,
  },
})
export default class IndexRoot extends TransitionMixin {
  transitionType = TransitionType.List;
  transitionDirection = TransitionDirection.Horizontal;
  listRoutes = navRoutes;

  public showPreview = false;
  public projectId = '';

  beforeEnter(el: HTMLDivElement) {
    el.style.opacity = '0';
    document.body.style.overflowY = 'hidden';
  }
  enter(el: HTMLDivElement, done: () => void) {
    const origin = document.querySelector(`#${this.projectId}[data-show=true]`);
    if (origin) {
      const originRect = origin.getBoundingClientRect();
      const childEl = el.children[0] as HTMLDivElement;
      const childRect = childEl.getBoundingClientRect();
      const scaleX = originRect.width / childRect.width;
      const scaleY = originRect.height / childRect.height;
      // top
      const ph = originRect.height;
      const mt = (ph - childRect.height) / 2;
      const yPadding = (ph - childRect.height) / 2 - mt;
      const ty = childRect.top - yPadding;

      // left
      const pw = originRect.width;
      const ml = (ph - childRect.width) / 2;
      const xPadding = (pw - childRect.width) / 2 - ml;
      const tx = childRect.left - xPadding;
      console.log(originRect);
      // childEl.style.transform = `scaleX(${scaleX}) scaleY(${scaleY}) `;
      anime({
        targets: el,
        opacity: 1,
        duration: 300,
        easing: 'cubicBezier(.5, .05, .1, .3)',
      });
      done();
      // anime({
      //   targets: childEl,
      //   translateX: elRect.left,
      //   translateY: elRect.top,
      //   scaleX: 1,
      //   scaleY: 1,
      //   duration: 300,
      //   easing: 'cubicBezier(.5, .05, .1, .3)',
      //   complete: done,
      // });
    }
  }

  beforeLeave(el: HTMLDivElement) {}
  leave(el: HTMLDivElement, done: () => void) {
    document.body.style.overflowY = 'auto';
    done();
  }

  get routeParam() {
    return this.$route.query;
  }

  @Watch('routeParam', { deep: true, immediate: true }) routeChanged() {
    const jbv = this.$route.query.jbv;
    console.log(jbv);
    if (jbv && typeof jbv === 'string') {
      this.showPreview = true;
      this.projectId = jbv;
    } else {
      this.showPreview = false;
      this.projectId = '';
    }
  }
}
</script>
