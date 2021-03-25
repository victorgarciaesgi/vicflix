<template>
  <div class="flex flex-row items-center justify-end h-8">
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
      class="InputContainer / w-72 max-w-none bg-opacity-95 -top-1 absolute z-0 flex flex-row p-1 mr-2 bg-black border border-white"
    >
      <SvgIcon class="IconSearch / mr-1" src="actions/search" :size="26" />
      <input
        ref="inputRef"
        @blur="toggleShowInput"
        class="flex-1 bg-transparent"
        placeholder="Titres, languages, genre"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'nuxt-property-decorator';

@Component({})
export default class SearchBar extends Vue {
  @Ref() inputContainerRef?: HTMLDivElement;
  @Ref() inputRef?: HTMLInputElement;

  public searchValue = '';
  public showInput = false;

  toggleShowInput() {
    if (!this.showInput) {
      this.showInput = true;
      this.$nextTick(() => {
        if (this.inputContainerRef) {
          // this.inputContainerRef.style.display = 'flex';
          this.inputContainerRef.style.transform = 'scaleX(1)';
          this.inputContainerRef.style.opacity = '1';

          this.inputRef?.focus();
        }
      });
    } else {
      if (this.inputContainerRef) {
        this.inputContainerRef.style.transform = 'scaleX(0.15)';
        this.inputContainerRef.style.opacity = '0';
        setTimeout(() => {
          // if (this.inputContainerRef) this.inputContainerRef.style.display = 'none';
          this.showInput = false;
        }, 290);
      }
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
