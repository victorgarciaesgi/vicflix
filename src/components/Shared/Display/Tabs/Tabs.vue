<template>
  <div class="Tabs-Container / flex flex-row items-center justify-center py-3">
    <div
      ref="container"
      class="TabBar / bg-bg4 flex flex-row flex-no-wrap overflow-hidden"
      style="border-radius: 8px"
    >
      <NuxtLink
        v-for="tab of tabs"
        :key="tab.label"
        :to="tab.link"
        :exact="tab.exact"
        class="Tab-Link / p-2px z-10"
      >
        <!-- <TabLink
          :exact="tab.exact"
          v-bind="{ isActive, isExactActive, href, navigate }"
          class="text-text4 transition-colors duration-150"
          @active="setActiveLink(tab)"
        >
          
        </TabLink> -->
        <div class="Tab-Focus px-5 py-1" style="border-radius: 7px">
          {{ tab.label }}
        </div>
      </NuxtLink>
      <!-- <div ref="cursorRef" class="Cursor / p-2px absolute top-0 left-0 z-0 h-full">
        <div class="bg-bg1 w-full h-full shadow" style="border-radius: 7px"></div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, PropSync, Ref } from 'nuxt-property-decorator';
import { NavLink } from '@models';
import { RouterModule } from '@store';
import TabLink from './TabLink.vue';

@Component({
  components: {
    // TabLink,
  },
})
export default class Tabs extends Vue {
  @Prop() tabs!: NavLink[];
  @PropSync('selected', { required: false }) syncTab?: NavLink;

  // get getCursorStyle(): Partial<CSSStyleDeclaration> {
  //   if (this.isMounted) {
  //     const tabEl = this.selectedTabRef?.$el as HTMLElement;
  //     const tabRect = tabEl.getBoundingClientRect();
  //     const containerRect = this.container.getBoundingClientRect();
  //     const currentWidth = tabRect.width;
  //     const currentPosition = tabRect.x - containerRect.x;
  //     return {
  //       width: `${currentWidth}px`,
  //       transform: `translate3d(${currentPosition}px,0 , 0)`,
  //     };
  //   }
  //   return {};
  // }

  // resizeCursor(): void {
  //   if (this.isMounted && this.selectedTabRef) {
  //     const tabEl = this.selectedTabRef?.$el as HTMLElement;
  //     const tabRect = tabEl.getBoundingClientRect();
  //     const containerRect = this.container.getBoundingClientRect();
  //     const isLast = this.selectedTabIndex === this.tabs.length - 1;
  //     const currentWidth = Math.floor(tabRect.width);
  //     const currentPosition = Math.floor(tabRect.x - containerRect.x);
  //     Object.assign(this.cursorRef.style, {
  //       width: `${currentWidth}px`,
  //       transform: `translate3d(${currentPosition}px,0 , 0)`,
  //     });
  //   }
  // }

  // @Watch('activeLink', { immediate: true })
  // tabChanged(value: NavLink) {
  //   this.syncTab = value;
  //   this.resizeCursor();
  // }

  // mounted() {
  //   if (process.browser) {
  //     this.resizeCursor();
  //     window.addEventListener('resize', this.resizeCursor);
  //   }
  // }

  // destroyed() {
  //   window.removeEventListener('resize', this.resizeCursor);
  // }
}
</script>

<style lang="postcss" scoped>
div.Tabs-Container {
  width: auto;

  div.Cursor {
    transition-duration: 0.2s;
    transition-timing-function: ease-in;
    transition-property: width, transform;
  }

  .Tab-Link {
    flex: 0 0 auto;
    transition: background-color 0.2s, color 0.2s;

    @mixin dark {
      /* background-color: var(--bg2); */
    }
    @mixin light {
      /* background-color: var(--bg3); */
    }

    &:not(.nuxt-link-active):not(.list):hover {
      color: var(--text2);
    }

    &.nuxt-link-active {
      /* background-color: var(--blue) !important; */
      .Tab-Focus {
        @apply bg-bg1 w-full h-full shadow;
      }
    }
  }
}
</style>
