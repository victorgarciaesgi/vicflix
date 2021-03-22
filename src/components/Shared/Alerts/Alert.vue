<template>
  <div
    class="Alert-Window / to-animate flex"
    :style="getStyle"
    @click.stop="closePopups"
    @mousedown.stop
  >
    <div
      class="QuitIcon / p-2px bg-bg4 text-text6 top-3 right-3 absolute z-10 flex rounded-full cursor-pointer"
      @click="deleteAlert"
    >
      <SvgIcon src="toasts/error" :size="16" />
    </div>
    <div v-if="getIcon" class="center flex pt-12">
      <SvgIcon :src="getIcon" :size="100" />
    </div>
    <div
      class="header flex items-center flex-shrink-0 px-8 pb-4"
      :class="{ 'pt-12': !getIcon, 'pt-6': getIcon }"
    >
      <span class="flex-grow text-2xl font-semibold text-center">{{ title }}</span>
    </div>
    <div v-if="description || isForm" class="content scroll-y flex flex-grow px-6 pt-2 pb-6">
      <span v-if="description" class="description text-left whitespace-pre-line">
        {{ description }}
      </span>
      <form v-if="isForm" class="form column flex">
        <FormContainer :form="alert.form" />
      </form>
    </div>

    <div class="flex-nowrap flex justify-between flex-shrink-0 p-4">
      <div v-if="leftButtons" class="left-buttons flex flex-grow-0">
        <Action
          v-for="button of leftButtons"
          :key="button.id"
          :theme="getTheme(button)"
          :handler="() => button.handler(alert.id)"
          :shadow="true"
        >
          {{ button.content }}
        </Action>
      </div>
      <div v-if="rightButtons" class="right-buttons flex flex-grow-0">
        <Action
          v-for="button of rightButtons"
          :key="button.id"
          :theme="getTheme(button)"
          :handler="() => button.handler(alert.id)"
          :form="alert.form"
          :shadow="false"
        >
          {{ button.content }}
        </Action>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import { AlertsModule } from '@store';
import {
  ActionRoot,
  ActionType,
  AlertRoot,
  AlertType,
  createAlert,
  FormShape,
} from '@constructors';
import { EventBus, Events } from '@services';
import Colors from '@colors';
import { ButtonTheme } from '@models';
import { BreakpointMixin } from '@mixins';

@Component({})
export default class Alert extends BreakpointMixin {
  @Prop() readonly alert!: AlertRoot<any>;

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
    if (this.isMobile) {
      return { minWidth: '250px' };
    } else {
      return { minWidth: '400px' };
    }
  }
  get getIcon() {
    switch (this.alert.type) {
      case AlertType.Warning:
        return 'alerts/warning';
      case AlertType.Success:
        return 'alerts/success';
      default:
        return null;
    }
  }

  get getTheme() {
    return (button: ActionRoot): ButtonTheme => {
      if (button.theme) {
        return button.theme;
      } else if (button.type === ActionType.Confirm) {
        return ButtonTheme.Inverted;
      } else if (button.type === ActionType.Action || button.type === ActionType.Link) {
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
    if (this.alert.form && this.alert.form.dirty) {
      createAlert({
        title: 'Are you sure you want to leave the page',
        description: 'Some fields have not been saved',
        actions: ({ confirm }) => [confirm({})],
        type: AlertType.Confirm,
      });
    } else {
      AlertsModule.actions.deleteAlert(this.alert.id);
    }
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
  max-height: 80vh;
  overflow: hidden;

  max-width: 500px;

  @screen sm {
    max-width: 100vw;
  }

  @mixin dark {
    background-color: rgba(10, 10, 10, 1);
  }

  @mixin light {
    background-color: white;
  }
}
</style>
