<template>
  <div class="Tabs-Container / flex flex-col">
    <div
      ref="container"
      class="TabBar / grid overflow-hidden"
      :class="[`grid-cols-${tabs.length}`]"
    >
      <NuxtLink
        v-for="tab of tabs"
        :key="tab.label"
        :to="tab.link"
        :exact="tab.exact"
        class="Tab-Link / text-text10 flex items-center justify-center h-16 text-sm font-semibold text-center"
      >
        <div class="Tab-Focus px-5 py-1">
          {{ tab.label }}
        </div>
        <!-- <TabLink
          :exact="tab.exact"
          v-bind="{ isActive, isExactActive, href, navigate }"
          class="text-text4 transition-colors duration-150"
          @active="setActiveLink(tab)"
        >
          
        </TabLink> -->
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
  border-bottom: 1px solid var(--bg5);

  div.Cursor {
    transition-duration: 0.2s;
    transition-timing-function: ease-in;
    transition-property: width, transform;
  }

  .Tab-Link {
    transition: border-color 0.2s, color 0.2s;
    border-bottom: 3px solid transparent;

    @mixin dark {
      /* background-color: var(--bg2); */
    }
    @mixin light {
      /* background-color: var(--bg3); */
    }

    &:first-child {
      border-radius: 0.5rem 0 0 0;
    }
    &:last-child {
      border-radius: 0 0.5rem 0 0;
    }

    &:not(.nuxt-link-active):not(.list):hover {
      border-color: var(--green2);
    }

    &.nuxt-link-active {
      color: var(--green);
      border-color: var(--green);
      box-shadow: 0 0 5px inset rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
