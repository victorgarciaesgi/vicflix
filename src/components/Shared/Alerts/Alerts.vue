<template>
  <div @click="closeAlert(false)" class="alert-base">
    <div @click.stop class="alert-window to-animate">
      <div class="content">
        <div
          :class="[alertState.alertData.type]"
          class="alert-icon"
          v-if="alertState.alertData.type != 'form' && alertState.alertData.type != 'info'"
        >
          <img
            src="~@icons/notifications/success.svg"
            v-if="alertState.alertData.type == 'success'"
          />
          <img
            src="~@icons/notifications/error.svg"
            v-else-if="alertState.alertData.type == 'error'"
          />
          <img
            src="~@icons/notifications/warning.svg"
            v-else-if="alertState.alertData.type == 'warning'"
          />
          <img
            src="~@icons/notifications/infos.svg"
            v-else-if="alertState.alertData.type == 'alert'"
          />
        </div>
        <div class="title">{{ alertState.alertData.title }}</div>
        <span class="message" v-if="alertState.alertData.message">
          {{ alertState.alertData.message }}
        </span>
        <div class="form" v-if="alertState.alertData.type == 'form'">
          <component
            :data="value"
            :is="value.component"
            :key="key"
            :vl="$v.alertForm ? $v.alertForm.fieldsValues[key] : null"
            v-for="(value, key) in alertState.alertData.formElement.form.fieldsData"
            v-model="alertForm.fieldsValues[key]"
          ></component>
        </div>
      </div>
      <div class="footer">
        <template v-if="alertState.alertData.actions">
          <div class="align-left">
            <AlertButton
              :key="action.text"
              :theme="getTheme(action.type)"
              @click="executeAction(action, false)"
              v-for="action in leftButtons"
              >{{ action.text }}</AlertButton
            >
          </div>
          <div class="align-right">
            <AlertButton
              :disabled="isDisabled"
              :key="action.text"
              :link="action.type == 'link'"
              :submitting="action.submitting"
              :theme="getTheme(action.type)"
              :to="action.to"
              @click="executeAction(action, true)"
              @disabledClick="$v.alertForm.fieldsValues.$touch()"
              v-for="action in rightButtons"
              >{{ action.text }}</AlertButton
            >
          </div>
        </template>
        <template v-else>
          <AlertButton @click="validAlert" theme="blue">Valider</AlertButton>
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
import { CheckBox, FormText, FormField, FormUpload } from '../Forms';
import { oc } from 'ts-optchain';

@Component({
  components: { AlertButton, CheckBox, FormText, FormField, FormUpload },
  validations() {
    const _this = this as any;
    if (_this.alertForm) {
      if (_this.formValidations) {
        return { alertForm: { fieldsValues: _this.formValidations } };
      } else {
        return false;
      }
    }
    return false;
  },
})
export default class Alerts extends Vue {
  public $v;

  public alertForm = null;
  public formValidations = null;

  get alertState() {
    return AlertsModule.state;
  }
  get submitting() {
    return AlertsModule.state.submitting;
  }
  get isDisabled() {
    return this.$v.alertForm ? this.$v.alertForm.$invalid : false;
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

  validAlert() {
    AlertsModule.mutations.confirmAlert();
  }

  async executeAction(action: ActionsElements.Action, value: boolean) {
    await AlertsModule.actions.executeAction({ action, value });
  }

  destroyed() {
    AlertsModule.mutations.hideAlert();
  }
  created() {
    if (this.alertState.alertData.formElement) {
      this.alertForm = this.alertState.alertData.formElement.form;
      this.formValidations = this.alertState.alertData.formElement.validations;
    }
  }
}
</script>



<style lang='scss' scoped>
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

  .alert-window {
    display: flex;
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
    flex-flow: column nowrap;
    align-items: center;
    overflow: hidden;

    div.content {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      flex: 0 0 auto;
      overflow: auto;
      text-align: center;
      width: 400px;
      padding: 20px 30px 20px 30px;

      .alert-icon {
        display: flex;
        padding: 5px;
        border-radius: 100%;
        border: 5px solid transparent;

        &.success {
          border-color: $yellow;
        }
        &.error {
          border-color: $red1;
        }

        &.confirm {
          padding: 0;
          border: none;
        }

        img {
          height: 50px;
          width: 50px;
        }
      }

      .title {
        display: flex;
        font-weight: bold;
        font-size: 20px;
        padding: 20px;
      }

      .message {
        max-width: 400px;
      }

      .form {
        width: 100%;
        margin-top: 20px;
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

