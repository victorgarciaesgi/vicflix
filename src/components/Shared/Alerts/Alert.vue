<template>
  <div
    class="Alert-Window / to-animate flex"
    :style="getStyle"
    @click.stop="closePopups"
    @mousedown.stop
  >
    <div
      class="QuitIcon / p-2px bg-bg4 text-text6 absolute top-0 right-0 z-10 flex mt-2 mr-2 rounded-full cursor-pointer"
      @click="deleteAlert"
    >
      <SvgIcon src="icons/toasts/error.svg" :size="16" />
    </div>
    <div class="header flex flex-no-wrap items-start justify-between flex-shrink-0 px-6 pt-6 pb-4">
      <span class="flex-grow text-2xl font-semibold text-left">{{ title }}</span>
    </div>
    <div v-if="description || isForm" class="content scroll-y flex flex-grow px-6 pt-2 pb-6">
      <span v-if="description" class="description text-center">
        {{ description }}
      </span>
    </div>

    <div class="flex flex-no-wrap justify-between flex-shrink-0 p-4">
      <div v-if="leftButtons" class="left-buttons flex flex-grow-0">
        <Action
          v-for="button of leftButtons"
          :key="button.id"
          :theme="getTheme(button)"
          :handler="() => button.handler(alert.id)"
          :shadow="true"
        >
          {{ button.text }}
        </Action>
      </div>
      <div v-if="rightButtons" class="right-buttons flex flex-grow-0">
        <Action
          v-for="button of rightButtons"
          :key="button.id"
          :theme="getTheme(button)"
          :handler="() => button.handler(alert.id)"
          :shadow="false"
        >
          {{ button.text }}
        </Action>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import { AlertsModule } from '@store';
import { Alerts } from '@constructors';
import { EventBus, Events } from '@services';
import Colors from '@colors';
import { ButtonTheme } from '../../../models';

@Component
export default class Alert extends Vue {
  @Prop() readonly alert!: Alerts.Alert<any, any>;

  get isForm() {
    return this.alert.type === 'form';
  }

  get title() {
    return this.alert.title;
  }

  get getStyle() {
    if (this.isForm) {
      return { width: '500px' };
    }
    return { width: '400px' };
  }

  get getTheme() {
    return (button: Alerts.Action): ButtonTheme => {
      if (button.theme) {
        return button.theme;
      } else if (button.type === 'confirm') {
        return ButtonTheme.Inverted;
      } else if (button.type === 'action' || button.type === 'link') {
        return ButtonTheme.Default;
      } else {
        return ButtonTheme.Default;
      }
    };
  }

  get rightButtons() {
    return this.alert.actions?.filter((m) => !!m).filter((m) => m.type !== 'cancel');
  }
  get leftButtons() {
    return this.alert.actions?.filter((m) => !!m).filter((m) => m.type === 'cancel');
  }

  get description() {
    return this.alert.description;
  }

  closePopups() {
    EventBus.$emit(Events.CLOSE_POPUPS);
  }

  deleteAlert() {
    AlertsModule.actions.deleteAlert(this.alert.id);
  }
}
</script>

<style lang="postcss" scoped>
div.Alert-Window {
  flex-flow: column nowrap;
  border-radius: 6px;
  box-shadow: 0 0 20px var(--shadow);
  min-height: 100px;
  min-width: 250px;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;

  @mixin dark {
    background-color: rgba(30, 30, 30, 1);
  }

  @mixin light {
    background-color: white;
  }
}
</style>
