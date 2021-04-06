<template>
  <div class="flex flex-col w-full min-h-screen">
    <NuxtChild />
    <FooterComponent />
  </div>
</template>

<script lang="ts">
import { authMiddleware } from '@middleware';
import { TransitionMixin } from '@mixins';
import { ButtonTheme, navRoutes, TransitionDirection, TransitionType } from '@models';
import { Component, Watch } from 'nuxt-property-decorator';
import { FooterComponent } from '@components';
import { VideoProgressModule } from '@store';
import { AlertType, createAlert } from '@constructors';

@Component({
  middleware: authMiddleware,
  components: {
    FooterComponent,
  },
  scrollToTop: true,
})
export default class IndexRoot extends TransitionMixin {
  transitionType = TransitionType.List;
  transitionDirection = TransitionDirection.Horizontal;
  listRoutes = navRoutes;

  mounted() {
    if (!VideoProgressModule.state.firstVisit) {
      createAlert({
        type: AlertType.Info,
        title: this.$t(this.$messages.Login.Welcome) as string,
        description: this.$t(this.$messages.Login.WelcomeDesc) as string,
        actions: ({ confirm }) => [
          confirm({
            theme: ButtonTheme.Red,
            content: this.$t(this.$messages.Actions.LetsGo) as string,
          }),
        ],
      });
      VideoProgressModule.updateState({ firstVisit: true });
    }
  }

  // async fetch() {
  //   const projects = await sgts.projects().$fetch();
  //   console.log(projects);
  // }

  // beforeEnter(el: HTMLDivElement) {
  //   // el.style.opacity = '0';
  //   document.body.style.overflowY = 'hidden';
  // }
  // enter(el: HTMLDivElement, done: () => void) {
  //   const origin = document.querySelector(`#${this.projectId}[data-show=true]`);
  //   if (origin) {
  //     this.cardOrigin = document.querySelector(`.ProjectPlaceholder[data-show=true]`);
  //     console.log(document.querySelector(`.ProjectPlaceholder[data-show=true]`));
  //     const originRect = origin.getBoundingClientRect();
  //     const childEl = el.children[0] as HTMLDivElement;
  //     const childRect = childEl.getBoundingClientRect();
  //     const scaleX = originRect.width / childRect.width;
  //     const scaleY = originRect.height / childRect.height;
  //     // top

  //     const pTop = childRect.top + (childRect.height - originRect.height) / 2;
  //     console.log({ pTop });

  //     const pLeft = childRect.left + (childRect.width - originRect.width) / 2;
  //     console.log({ pLeft });

  //     console.log(childRect.top + (childRect.height - originRect.height) / 2);
  //     childEl.style.transform = `scaleX(${scaleX}) scaleY(${scaleY}) translateX(${
  //       (originRect.left - pLeft) / scaleX
  //     }px) translateY(${(originRect.top - pTop) / scaleY}px) `;
  //     // anime({
  //     //   targets: el,
  //     //   opacity: 1,
  //     //   duration: 300,
  //     //   easing: 'cubicBezier(.5, .05, .1, .3)',
  //     // });
  //     anime({
  //       targets: childEl,
  //       translateX: 0,
  //       translateY: 0,
  //       scaleX: 1,
  //       scaleY: 1,
  //       easing: 'easeOutQuint',
  //       duration: 300,
  //       complete: done,
  //     });
  //   }
  // }

  // beforeLeave(el: HTMLDivElement) {}

  // leave(el: HTMLDivElement, done: () => void) {
  //   document.body.style.overflowY = 'auto';
  //   console.log(this.cardOrigin);
  //   if (this.cardOrigin) {
  //     const originRect = this.cardOrigin.getBoundingClientRect();
  //     const childEl = el.children[0] as HTMLDivElement;
  //     const childRect = childEl.getBoundingClientRect();
  //     const scaleX = originRect.width / childRect.width;
  //     const scaleY = originRect.height / childRect.height;
  //     // top

  //     const pTop = childRect.top + (childRect.height - originRect.height) / 2;

  //     const pLeft = childRect.left + (childRect.width - originRect.width) / 2;

  //     anime({
  //       targets: childEl,
  //       translateX: (originRect.left - pLeft) / scaleX,
  //       translateY: (originRect.top - pTop) / scaleY,
  //       scaleX,
  //       scaleY,
  //       easing: 'easeOutQuint',
  //       duration: 300,
  //       complete: done,
  //     });
  //   } else {
  //     done();
  //   }
  // }
}
</script>
