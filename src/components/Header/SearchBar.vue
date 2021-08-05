<template>
  <div class="sm:flex-grow flex flex-row items-center justify-end h-8">
    <SvgIcon
      v-if="!showInput"
      class="IconSearch / z-10 mx-2"
      @click="toggleShowInput"
      button
      src="actions/search"
      :size="28"
    />
    <div
      ref="inputContainerRef"
      class=" InputContainer / w-72 sm:w-full max-w-none bg-opacity-95 -top-px flex-nowrap absolute z-0 flex flex-row p-1 mr-2 overflow-hidden text-white bg-black border border-white"
    >
      <SvgIcon class="IconSearch / sm:ml-1 mr-1" src="actions/search" :size="26" />
      <input
        ref="inputRef"
        @blur="toggleShowInput"
        @focus="handleFocus"
        class="text-md flex-1 text-white bg-transparent"
        :placeholder="$t($messages.Search.Placeholder)"
        type="text"
        @input="handleInput($event.target.value)"
        :value="searchValue"
        @keydown.enter="handleInput(searchValue)"
      />
      <SvgIcon
        v-if="searchValue.length"
        @click.native.prevent.stop="clearInput"
        class="top-2 right-1 absolute"
        :size="18"
        src="actions/cancel"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { BreakpointMixin } from '@mixins';
import { routerPagesNames } from '@models';
import { Component, Vue, Ref, Watch } from 'nuxt-property-decorator';
import { Route } from 'vue-router';

@Component({})
export default class SearchBar extends BreakpointMixin {
  @Ref() inputContainerRef?: HTMLDivElement;
  @Ref() inputRef?: HTMLInputElement;

  public searchValue = '';
  public showInput = false;
  public previousRoute: Route | null = null;
  public isFocused = false;

  public timeoutClose: NodeJS.Timeout | null = null;

  get isInSearchRoute() {
    return this.$route.name === routerPagesNames.search;
  }

  get routeName() {
    return this.$route.name;
  }

  @Watch('routeName') routeNameChanged(value: string) {
    if (value !== routerPagesNames.search && !this.isFocused) {
      this.hideInput();
    }
  }

  @Watch('isInSearchRoute') searchRouteChanged(value: boolean) {
    if (value) this.displayInput();
  }

  @Watch('$route', { deep: true, immediate: true }) routeChanged(value: Route) {
    if (this.isInSearchRoute) {
      this.displayInput();
      this.searchValue = this.$route.query.q as string;
    } else {
      this.previousRoute = this.$route;
    }
  }

  handleFocus() {
    this.isFocused = true;
  }

  clearInput() {
    this.handleInput('');
    this.inputRef?.focus();
  }

  handleInput(value: string) {
    this.searchValue = value;
    const currentQ = this.$route.query.q;
    this.$nextTick(() => {
      if ((value.length && typeof currentQ === 'string' && currentQ !== value) || !currentQ) {
        if (this.isInSearchRoute) {
          this.$router.replace({ query: { ...this.$route.query, q: value } });
        } else {
          this.$router.push({ name: routerPagesNames.search, query: { q: value } });
        }
      } else if (this.previousRoute && !value.length) {
        this.$router.push(this.previousRoute.fullPath);
      } else {
        this.$router.push('/');
      }
    });
  }

  displayInput(intent?: boolean) {
    this.showInput = true;
    if (this.timeoutClose) clearTimeout(this.timeoutClose);
    this.$nextTick(() => {
      if (this.inputContainerRef) {
        // this.inputContainerRef.style.display = 'flex';
        this.inputContainerRef.style.transform = 'scaleX(1)';
        this.inputContainerRef.style.opacity = '1';
        if (intent) {
          this.inputRef?.focus();
        }
      }
    });
  }

  hideInput() {
    if (this.inputContainerRef && !this.isInSearchRoute) {
      this.inputContainerRef.style.transform = 'scaleX(0.15)';
      this.inputContainerRef.style.opacity = '0';
      this.inputRef?.blur();
      this.timeoutClose = setTimeout(() => {
        // if (this.inputContainerRef) this.inputContainerRef.style.display = 'none';
        this.showInput = false;
      }, 290);
    }
  }

  toggleShowInput() {
    this.isFocused = false;
    if (!this.showInput) {
      this.displayInput(true);
    } else {
      this.hideInput();
    }
  }
}
</script>

<style lang="postcss" scoped>
div.InputContainer {
  transform: scaleX(0.15);
  opacity: 0;
  transform-origin: top right;
  will-change: transform;
  transition: transform 0.3s ease-in-out, opacity 0.3s;
}
</style>
