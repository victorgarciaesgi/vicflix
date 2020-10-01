<template>
  <component
    :is="getComponentType"
    class="Toast / first:mt-4 flex flex-col flex-no-wrap w-full p-3 my-3 ml-4 rounded-lg shadow"
  >
    <div class="Header / flex flex-row items-center justify-between">
      <div class="flex flex-row items-center">
        <div :class="[getColor]" class="p-2px text-white rounded-full">
          <SvgIcon :src="getIcon" :size="12" />
        </div>
        <span class="text-bg12 ml-2 text-sm uppercase">{{ getTitle }}</span>
      </div>
      <div
        class="QuitIcon / p-2px bg-bg4 text-text6 rounded-full cursor-pointer"
        @click="deleteToast"
      >
        <SvgIcon src="icons/toasts/error.svg" :size="14" />
      </div>
    </div>
    <div class="text-text6 flex flex-col mt-2">
      <span class="text-sm font-semibold">{{ toast.message }}</span>
    </div>
    <div v-if="toast.actions || toast.errorMessage" class="flex flex-row justify-end mt-2">
      <template v-if="toast.actions">
        <Action
          v-for="(action, index) of toast.actions"
          :key="index"
          size="md"
          :handler="action.handler"
        >
          {{ action.text }}
        </Action>
      </template>
      <template v-if="toast.errorMessage">
        <Action size="md" @click="copyError"> Copier l'erreur </Action>
      </template>
    </div>
  </component>
</template>

<script lang="ts">
import { IToastNotification, IToastNotificationType } from '@models';
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { ToastModule } from '@store';

@Component({})
export default class Toast extends Vue {
  @Prop() toast!: IToastNotification;
  @Prop({ type: Number, required: false }) index?: number;
  @Prop({ type: Boolean, required: false }) namespaced?: boolean;
  @Prop({ type: Number, required: false }) listLength?: number;

  get getComponentType() {
    if (this.toast.link) {
      return 'nuxt-link';
    }
    return 'li';
  }

  // get isExposed() {
  //   if (this.namespaced) {
  //     return this.index! === this.listLength! - 1;
  //   }
  //   return false;
  // }

  // get getStyle(): Partial<CSSStyleDeclaration> | null {
  //   if (this.namespaced && this.index != null && this.listLength) {
  //     const isLast = this.index === 0;
  //     if (this.isExposed) {
  //       return {
  //         zIndex: `${5 + this.index}`,
  //         marginBottom: '0',
  //         top: '0',
  //       };
  //     } else {
  //       return {
  //         position: 'absolute',
  //         height: '100%',
  //         left: '0',
  //         zIndex: `${5 + this.index}`,
  //         top: `${(this.listLength - 1 - this.index) * 15}px`,
  //         margin: '0',
  //         border: '1px solid var(--bg3)',
  //         boxShadow: '0 1px 10px var(--shadow)',
  //       };
  //     }
  //   }
  //   return null;
  // }

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
      return 'icons/toasts/success.svg';
    } else if (this.toast.type === IToastNotificationType.ERROR) {
      return 'icons/toasts/error.svg';
    } else if (this.toast.type === IToastNotificationType.WARNING) {
      return 'icons/toasts/warning.svg';
    } else {
      return 'icons/toasts/info.svg';
    }
  }

  get getTitle(): string {
    if (this.toast.title) {
      return this.toast.title;
    } else if (this.toast.type === IToastNotificationType.SUCCESS) {
      return 'Succès';
    } else if (this.toast.type === IToastNotificationType.ERROR) {
      return 'Erreur';
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
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(this.toast.errorMessage));
      this.$toast.success('Erreur copiée! Envoie ça à ton développeur!');
      this.deleteToast();
    }
  }
}
</script>

<style lang="postcss" scoped>
li.Toast {
  width: 320px;
  backdrop-filter: blur(2px);
  @mixin light {
    background-color: rgba(255, 255, 255, 0.95);
  }
  @mixin dark {
    background-color: rgba(0, 0, 0, 0.95);
  }
}
</style>
