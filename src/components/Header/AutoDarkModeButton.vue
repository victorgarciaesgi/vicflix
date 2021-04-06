<template>
  <div class="flex flex-row items-center justify-between">
    <Popin mode="hover" :width="200" :nested="true">
      <template #content>
        <span class="px-2 py-2 text-sm"
          >L'application basera le mode clair/sombre en fonction de vos réglages système</span
        >
      </template>
      <template #button>
        <span class="font-semibold">Auto</span>
      </template>
    </Popin>
    <Toggle v-model="value" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { DarkModeModule } from '@store';
import Toggle from '../Shared/Display/Toggle.vue';

@Component({
  components: {
    Toggle,
  },
})
export default class AutoDarkModeButton extends Vue {
  get value() {
    return DarkModeModule.state.autoTheme;
  }
  set value(value) {
    DarkModeModule.actions.toggleAutoTheme();
  }
}
</script>
