<template>
  <Popin :arrow="true">
    <template #content>
      <div class="txt-block max-w-300 p-4 text-sm leading-5" style="max-width: 300px">
        <slot />
      </div>
    </template>
    <template #button>
      <SvgIcon class="ml-2" src="forms/info" :size="16" />
    </template>
  </Popin>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component
export default class FormInfoPopup extends Vue {}
</script>
