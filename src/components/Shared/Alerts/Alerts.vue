<template>
  <div ref="base" class="alert-base" @click.self="closeAlert(false)">
    <div class="alert-window to-animate" @click.stop="closePopups">
      <div class="content flex">
        <div
          v-if="alertType != 'form' && alertType != 'info'"
          :class="[alertType]"
          class="alert-icon flex center"
        >
          <SvgIcon v-if="alertType == 'success'" src="icons/notifications/success.svg" :size="60" />
          <SvgIcon
            v-else-if="alertType === 'error'"
            src="icons/notifications/error.svg"
            :size="60"
          />
          <SvgIcon
            v-else-if="alertType === 'warning'"
            src="icons/notifications/warning.svg"
            :size="60"
          />
          <SvgIcon v-else src="icons/notifications/infos.svg" color="blue" :size="60" />
        </div>
        <div class="title" :class="{ formMode: alertType === 'form' }">
          {{ alertState.alertData.title }}
        </div>
        <span v-if="alertState.alertData.message" class="message">
          {{ alertState.alertData.message }}
        </span>
        <div v-if="alertType == 'form'" class="form flex scroll">
          <FormContainer :form.sync="alertForm" />
        </div>
      </div>
      <div class="footer flex">
        <template v-if="alertState.alertData.actions">
          <div class="align-left">
            <AlertButton
              v-for="action in leftButtons"
              :key="action.text"
              :theme="getTheme(action.type)"
              @click="executeAction(action, false)"
              >{{ action.text }}</AlertButton
            >
          </div>
          <div class="align-right">
            <AlertButton
              v-for="action in rightButtons"
              :key="action.text"
              :disabled="isDisabled(action)"
              :link="action.type == 'link'"
              :submitting="action.submitting"
              :theme="getTheme(action.type)"
              :to="action.to"
              @click="executeAction(action, true)"
              @disabledClick="alertForm.$v.$touch()"
              >{{ action.text }}</AlertButton
            >
          </div>
        </template>
        <template v-else>
          <AlertButton theme="blue" @click="validAlert">Valider</AlertButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { AlertsModule } from '@modules';
import { AlertsElement, ActionsElements } from '@constructors';
import StarRating from '../StarRating/StarRating.vue';
import AlertButton from './AlertButton.vue';
import { FormContainer } from '../Forms';
import { oc } from 'ts-optchain';
import { EventBus, Events } from '@services';

@Component({
  components: {
    AlertButton,
    FormContainer,
  },
})
export default class Alerts extends Vue {
  public alertForm = null;

  $refs: {
    base: HTMLElement;
  };

  get alertState() {
    return AlertsModule.state;
  }
  get submitting() {
    return AlertsModule.state.submitting;
  }

  get isDisabled() {
    return (action: ActionsElements.Action) => {
      if (this.alertForm.$v) {
        if (action.type === 'confirm') {
          if (oc(this.alertState.alertData.formElement.form).editMode()) {
            return (
              this.alertForm.$v.$invalid ||
              !this.alertState.alertData.formElement.form.isFormModified
            );
          } else {
            return this.alertForm.$v.$invalid;
          }
        }
        return false;
      }
      return false;
    };
  }

  get alertType() {
    return this.alertState.alertData.type;
  }

  get getTheme() {
    return type => {
      switch (type) {
        case 'confirm':
          return 'blue';
        case 'cancel':
          return 'red';
        default:
          return undefined;
      }
    };
  }

  get rightButtons() {
    return this.alertState.alertData.actions.filter(m => m).filter(m => m.type !== 'cancel');
  }
  get leftButtons() {
    return this.alertState.alertData.actions.filter(m => m).filter(m => m.type === 'cancel');
  }

  closeAlert(exter: boolean) {
    if (!exter && oc(this.alertState).alertData.type() != 'form') {
      AlertsModule.mutations.confirmAlert();
    } else if (!this.alertState.alertData.strict) {
      AlertsModule.mutations.cancelAlert();
    }
  }

  closePopups() {
    EventBus.$emit(Events.CLOSE_POPUPS);
  }

  validAlert() {
    AlertsModule.mutations.confirmAlert();
  }

  async executeAction(action: ActionsElements.Action, value: boolean) {
    await AlertsModule.actions.executeAction({ action, value });
  }

  destroyed() {
    AlertsModule.resetState();
  }
  created() {
    if (this.alertState.alertData.formElement) {
      this.alertForm = this.alertState.alertData.formElement.form;
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-base {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: transparentize($g20, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  z-index: 11000;
  padding: 10px;

  .alert-window {
    display: flex;
    flex-flow: column nowrap;
    position: relative;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(20, 20, 20, 0.3);
    height: auto;
    width: auto;
    min-height: 100px;
    min-width: 300px;
    max-width: 600px;
    max-height: 80vh;
    align-items: center;
    overflow: hidden;

    div.content {
      flex-flow: column nowrap;
      width: 400px;
      min-width: 100%;
      justify-content: center;
      position: relative;
      flex: 1 1 auto;
      text-align: center;

      .alert-icon {
        display: flex;
        padding: 5px;
        border-radius: 100%;
        border: 5px solid transparent;
        flex: 0 0 auto;
        padding-top: 10px;

        &.success {
          border-color: $yellow;
        }
        &.error {
          border-color: $red1;
        }

        &.confirm {
          border: none;
        }
      }

      .title {
        font-weight: bold;
        font-size: 20px;
        padding: 10px;
        flex: 0 0 auto;

        &.formMode {
          padding: 0;
          border-bottom: 1px solid $w230;
          padding: 10px 5px;
          text-align: center;
          font-size: 16px;
        }
      }

      .message {
        max-width: 400px;
        padding: 20px 10px;
        flex: 1 1 auto;
      }

      .form {
        width: 100%;
        padding: 10px 20px;
        flex: 1 1 auto;
      }
    }

    div.footer {
      display: flex;
      flex-flow: row nowrap;
      flex: 0 0 auto;
      min-width: 100%;
      padding: 5px;
      height: 50px;
      align-items: center;
      align-content: center;
      border-top: 1px solid $w230;

      .align-left {
        flex: 1 0 auto;
        display: flex;
        flex-flow: row wrap;
      }

      .align-right {
        flex: 1 0 auto;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-end;
      }
    }
  }
}
</style>
