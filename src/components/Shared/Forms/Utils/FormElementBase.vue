<template>
  <div ref="inputBox" :class="getClass" :style="{ width: data.width }" class="input-box flex">
    <label
      v-if="label"
      :class="{
        '!text-blue': focus,
      }"
      :for="name"
      class="text-green leading-1 flex items-center justify-start pb-2 text-sm font-semibold"
    >
      <span>{{ label }}</span>
      <FormInfoPopup v-if="data.info" class="!ml-2">
        <span v-html="data.info"></span>
      </FormInfoPopup>
    </label>
    <!-- Form Content -->
    <slot />
    <FormError v-if="vl && data.error" :vl="vl" :data="data" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { FormFieldArgs, FormFieldsData } from '@constructors';
import FormInfoPopup from './FormInfoPopup.vue';
import FormError from './FormError.vue';

@Component({
  components: {
    FormInfoPopup,
    FormError,
  },
})
export default class FormElementBase extends Vue {
  @Prop({ required: true }) data!: FormFieldArgs;
  @Prop() formError!: boolean;
  @Prop() formValid!: boolean;
  @Prop() isPending!: boolean;
  @Prop() required!: boolean;
  @Prop() focus!: boolean;
  @Prop() label!: string;
  @Prop() vl: any;
  @Prop() name!: string;

  get getClass() {
    return [
      this.data.extendClass,
      {
        ...(this.data.style && {
          noMargin: this.data.style.noMargin,
          noBorder: this.data.style.noBorder,
          noRadius: this.data.style.noRadius,
          noBackground: this.data.style.noBackground,
        }),
        formError: this.formError,
        formValid: this.formValid,
        isPending: this.isPending,
        required: this.required,
        disabled: this.data.disabled,
        focus: this.focus,
      },
    ];
  }
}
</script>

<style lang="postcss">
div.input-box {
  flex-flow: column wrap;
  flex: 0 1 auto;
  min-width: 120px;
  max-width: 100%;
  min-height: 0;
  position: relative;
  margin: 8px 0;

  /* &.required {
    div.input-container::after {
      content: '';
      position: absolute;
      border-radius: 100%;
      right: 6px;
      height: 4px;
      width: 4px;
      background-color: var(--text1);
      top: 50%;
      transform: translateY(-50%);
    }
  } */
  div.input-container {
    display: flex;
    position: relative;
    flex-flow: row nowrap;
    border-radius: 2px;
    min-width: 0;
    min-height: 0;
    max-width: 100%;
    border: 1px solid var(--bg10);
    background-color: var(--bg5);
    font-size: 14px;
    padding: 0 5px;
    outline: none;

    @mixin light {
      background-color: var(--bg3);
    }

    @mixin dark {
      background-color: var(--bg5);
    }

    &.select .DisplayText {
      height: 40px;
    }

    &.upload .display-result {
      min-height: 50px;
      max-height: 100px;

      &.audio {
        max-height: 150px;
      }
    }

    div.icon {
      flex: 0 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
    }

    %input {
      border: none;
      height: 36px;
      color: var(--text1);
      line-height: 36px;
      font-size: 14px;
      outline: none;
      width: 100%;
      background: none;
      padding: 5px 5px;
      font-weight: 500;
    }

    input {
      @extend %input;
    }

    textarea {
      @extend %input;
      height: 100px;
      resize: none;
      line-height: 24px;
      padding-top: 5px;
    }

    input,
    textarea {
      &::placeholder {
        color: var(--bg10);
      }
    }

    .richText .editor {
      overflow: auto;
      div.ProseMirror {
        border: none;
        height: 250px;
        color: var(--text1);
        line-height: 36px;
        font-size: 14px;
        width: 100%;
        background: none;
        outline: none;
        padding: 10px 10px;
        font-weight: 600;
        resize: none;
      }
    }
  }

  &.noBackground div.input-container {
    background-color: transparent;
  }

  &.noBorder div.input-container {
    border: none;
  }
  &.noRadius div.input-container {
    border-radius: 0;
  }

  &.noMargin {
    margin: 0;
  }

  &.disabled {
    filter: grayscale(1);
    div.input-container {
      background-color: var(--bg6) !important;
      cursor: not-allowed !important;

      input {
        cursor: not-allowed !important;
      }
    }
    .selectedValues {
      cursor: not-allowed !important;
    }
  }

  &.formError {
    div.input-container {
      border-color: var(--redError);
      input,
      textarea,
      .value {
        color: var(--redError);
      }
    }
    div.avatar-mask {
      border-color: var(--redError);
    }
  }

  &.isPending {
    div.input-container {
      border-color: var(--yellow) !important;
      input,
      textarea,
      .value {
        /* color: var(--yellow) !important; */
      }
    }
    div.avatar-mask {
      /* border-color: var(--yellow) !important; */
    }
  }

  &.formValid {
    div.input-container {
      border-color: var(--greenValid);
      input,
      textarea,
      .value {
        /* color: var(--blue); */
      }
    }
    div.avatar-mask {
      border-color: var(--greenValid);
    }
  }

  &.focus {
    &:not(.noBorder) {
      div.input-container {
        /* border-color: var(--blue); */
      }
    }

    div.input-container {
      input,
      textarea,
      .DisplayText,
      .value {
        color: var(--text1);
      }
      div.avatar-mask {
        border-color: initial;
      }
    }
  }
}
</style>
