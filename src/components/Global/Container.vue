<template>
  <div
    class="bg-bg1 flex-nowrap flex flex-col justify-start flex-shrink-0 m-2 rounded-lg shadow-md"
    :class="{ 'flex-grow': grow, 'px-4 py-5': !$slots.header, 'max-h-full': fit }"
  >
    <div v-if="$slots.header" class="flex-0 flex flex-col overflow-hidden">
      <slot name="header" />
    </div>
    <div v-if="$slots.title" class="--GradientText flex-0 mb-3 text-lg font-semibold">
      <slot name="title" />
    </div>

    <div class="flex flex-col flex-1" :class="{ 'px-4 py-5': $slots.header, 'flex-nowrap': fit }">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component({})
export default class Container extends Vue {
  @Prop({ required: false, default: false, type: Boolean }) grow!: boolean;
  @Prop({ default: false, type: Boolean }) fit!: boolean;
}
</script>
