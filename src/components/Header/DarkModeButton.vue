<template>
  <div class="flex items-center justify-between">
    <span>{{ $t($messages.Nav.Darkmode) }}</span>
    <Toggle v-model="value" :darkmode="true" />
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
export default class DarkModeButton extends Vue {
  get value() {
    return DarkModeModule.state.theme === 'dark';
  }
  set value(value: boolean) {
    const theme = value ? 'dark' : 'light';
    DarkModeModule.actions.setTheme(theme);
    localStorage.setItem('displayMode', theme);
    DarkModeModule.updateState(() => ({
      autoTheme: false,
    }));
    localStorage.setItem('autoTheme', 'false');
  }
}
</script>
