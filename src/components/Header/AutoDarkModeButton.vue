<template>
  <div class="flex flex-row items-center justify-between">
    <Popin mode="hover" theme="g40" :width="200" :nested="true">
      <template #content>
        <span class="px-2 py-2 text-sm text-center text-white">{{
          $t($messages.Nav.AutoDescription)
        }}</span>
      </template>
      <template #button>
        <span>Auto</span>
      </template>
    </Popin>
    <Toggle v-model="value" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
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
