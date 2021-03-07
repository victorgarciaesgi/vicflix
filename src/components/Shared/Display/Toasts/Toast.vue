<template>
  <component
    :is="getComponentType"
    class="Toast / first:mb-4 flex-nowrap ring-1 ring-g70 flex flex-col w-full p-3 my-3 ml-4 rounded-lg shadow"
  >
    <div class="Header / flex-nowrap flex flex-row items-center justify-between">
      <div class="flex-nowrap flex flex-row items-center flex-1">
        <div :class="[getColor]" class="p-2px text-bg1 flex-0 rounded-full">
          <SvgIcon :src="getIcon" :size="12" />
        </div>
        <span class="text-bg12 flex-1 ml-2 text-sm uppercase">{{ getTitle }}</span>
      </div>
      <div
        class="QuitIcon / p-2px flex-0 bg-bg4 text-text6 rounded-full cursor-pointer"
        @click="deleteToast"
      >
        <SvgIcon src="toasts/error" :size="14" />
      </div>
    </div>
    <div class="text-text6 flex flex-col mt-2">
      <span class="py-2 text-sm font-semibold">{{ toast.message }}</span>
      <div v-if="isTesting && errorMessage" class="relative">
        <div class="right-2 bottom-2 bg-bg1 text-text1 absolute z-10 p-1 rounded-full shadow-lg">
          <SvgIcon
            title="Agrandir l'erreur"
            button
            src="actions/enlarge"
            :size="14"
            @click="showErrorModal = true"
          />
        </div>
        <div
          class="bg-bg3 flex flex-1 max-w-full mt-1 overflow-auto rounded"
          style="max-height: 150px"
        >
          <pre
            ref="errorPre"
            class="max-w-full px-2 py-1 text-sm leading-4 text-left break-all whitespace-pre-wrap"
            >{{ errorMessage.detail }}{{ errorMessage.error }}
          </pre>
        </div>
      </div>
    </div>
    <div v-if="toast.actions || toast.errorMessage" class="flex flex-row justify-end mt-2">
      <template v-if="toast.actions">
        <Action
          v-for="(action, index) of toast.actions"
          :key="index"
          size="md"
          :handler="action.handler"
          :to="action.to"
        >
          {{ action.text }}
        </Action>
      </template>
      <template v-if="toast.errorMessage && isTesting">
        <Action size="md" @click="copyError"> Copier l'erreur </Action>
      </template>
    </div>
    <Modal :only-content="true" :show.sync="showErrorModal">
      <div
        v-if="isTesting && errorMessage"
        class="bg-bg3 flex flex-1 max-w-full overflow-auto rounded"
        style="width: 800px"
      >
        <pre
          ref="errorPre"
          class="max-w-full px-4 py-4 text-sm leading-4 text-left break-all whitespace-pre-wrap"
          >{{ errorMessage.detail }}{{ errorMessage.error }}
          </pre
        >
      </div>
    </Modal>
  </component>
</template>

<script lang="ts">
import { IToastNotification, IToastNotificationType } from '@models';
import { Component, Prop, Ref, Vue } from 'nuxt-property-decorator';
import { isTesting } from '@constants';
import { ToastModule } from '@store';

@Component({})
export default class Toast extends Vue {
  @Prop() toast!: IToastNotification;
  @Prop({ type: Number, required: false }) index?: number;
  @Prop({ type: Boolean, required: false }) namespaced?: boolean;
  @Prop({ type: Number, required: false }) listLength?: number;

  @Ref() errorPre?: HTMLPreElement;

  public isTesting = isTesting;
  public showErrorModal = false;

  get getComponentType() {
    if (this.toast.link) {
      return 'nuxt-link';
    }
    return 'div';
  }

  get errorMessage(): { detail: string; error: any } | null {
    const errMessage = this.toast.errorMessage;
    if (errMessage) {
      console.log(errMessage);
      if (errMessage.gqlErrors && errMessage.gqlErrors?.length) {
        console.log(errMessage);
        let coreError = errMessage.gqlErrors[0];
        let output = ``;
        if (errMessage.variables) {
          output = `• Error on GraphQL query "${errMessage.query}".

• Variables: ${JSON.stringify(errMessage.variables, null, 2)}

`;
        }
        if (coreError?.statusCode && coreError.statusCode === 400) {
          output += `
${coreError.result?.errors?.map((m: any) => `• ${m.message}`).join('\n')}  
`;
        }
        return {
          detail: output,
          error: JSON.stringify(coreError, null, 2).replace(/\\/g, ''),
        };
      }
      return { detail: '', error: errMessage };
    }
    return null;
  }

  get getColor(): string {
    if (this.toast.type === IToastNotificationType.SUCCESS) {
      return 'bg-green';
    } else if (this.toast.type === IToastNotificationType.ERROR) {
      return 'bg-red';
    } else if (this.toast.type === IToastNotificationType.WARNING) {
      return 'bg-yellow';
    } else {
      return 'bg-text1';
    }
  }

  get getIcon(): string {
    if (this.toast.type === IToastNotificationType.SUCCESS) {
      return 'toasts/success';
    } else if (this.toast.type === IToastNotificationType.ERROR) {
      return 'toasts/error';
    } else if (this.toast.type === IToastNotificationType.WARNING) {
      return 'toasts/warning';
    } else {
      return 'toasts/info';
    }
  }

  get getTitle(): string {
    if (this.toast.title) {
      return this.toast.title;
    } else if (this.toast.type === IToastNotificationType.SUCCESS) {
      return 'Succès';
    } else if (this.toast.type === IToastNotificationType.ERROR) {
      const codeError = this.toast?.errorMessage?.statusCode
        ? this.toast.errorMessage.statusCode
        : '';
      return `Erreur ${codeError}`;
    } else if (this.toast.type === IToastNotificationType.WARNING) {
      return 'Warning';
    } else {
      return 'Info';
    }
  }

  deleteToast() {
    ToastModule.mutations.deleteToast(this.toast.id);
  }

  copyError() {
    try {
      if (navigator.clipboard && this.errorPre) {
        const text = this.errorPre.textContent;
        if (text) {
          navigator.clipboard.writeText(text);
          this.$toast.success('Erreur copiée! Envoie ça à ton développeur!');
          this.deleteToast();
        }
      } else throw new Error('Copy');
    } catch (e) {
      this.$toast.error({
        message: "Impossible de copier l'erreur, vérifiez vos paramètres",
        title: 'COPIER',
      });
      console.log(e);
    }
  }
}
</script>

<style lang="postcss" scoped>
div.Toast {
  width: 320px;
  @mixin light {
    background-color: rgba(255, 255, 255, 1);
  }
  @mixin dark {
    background-color: rgba(0, 0, 0, 1);
  }
}
</style>
