<template>
  <FormElementBase v-bind="baseProps">
    <div class="input-container">
      <div v-if="data.style && data.style.icon" class="icon">
        <SvgIcon :src="data.style.icon" :size="22" :color="iconColorProps" />
      </div>
      <input
        ref="input"
        v-model="inputField"
        v-bind="inputProps"
        class="input-form"
        tabindex="0"
        @input="itemError = false"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter.prevent="handleEnter"
      />
    </div>
    <span v-if="itemError" class="text-redError py-px text-xs">
      {{ itemErrorMessage }}
    </span>

    <ul :class="{ formError, formValid }" class="SelectedValues / flex items-center pb-1 pl-1 mt-1">
      <template v-if="value && value.length">
        <li
          v-for="(item, index) of value"
          :key="index"
          class="center text-bg1 flex flex-grow-0 py-1 pl-2 pr-1 mt-1 mr-1 font-bold rounded-md"
        >
          <span class="flex-grow text-xs">{{ item }}</span>
          <div v-if="!data.disabled" class="delete flex-shrink-0 ml-1 rounded-full">
            <SvgIcon :size="14" src="actions" @click="removeItem(index)" />
          </div>
        </li>
      </template>

      <span v-else class="center text-text8 flex w-full mt-1 text-sm">Aucun élément</span>
    </ul>
  </FormElementBase>
</template>

<script lang="ts">
import { Vue, Prop, Ref, Component } from 'nuxt-property-decorator';
import { Mixin, Mixins } from 'vue-mixin-decorator';
import { debounce } from 'lodash-es';
import { FormMixin } from '@mixins';
import { TextMultipleField, UnPackField } from '@constructors';
import Popin from '../../../Global/Popin/Popin.vue';

@Component
export default class TextMultipleElement extends FormMixin {
  readonly value!: string[];
  readonly data!: UnPackField<TextMultipleField>;
  @Prop() width?: number;

  @Ref() popup!: Popin;
  @Ref() input?: HTMLInputElement;

  public inputField = '';
  public itemError = false;
  public itemErrorMessage = 'La valeur ne remplie pas les critères';

  async handleEnter() {
    const textValue = this.inputField.trim();
    if (textValue) {
      const newValue = this.value;
      if (this.data.validator) {
        let isValidated = await this.data.validator(textValue);
        if (!isValidated) {
          this.itemError = true;
          return;
        }
      }
      newValue.push(textValue);
      this.updateValue(newValue);
      this.inputField = '';
    }
  }

  removeItem(index: number): void {
    const filteredValue = this.value;
    filteredValue.splice(index, 1);
    this.updateValue(filteredValue);
  }
}
</script>

<style lang="postcss" scoped>
ul.SelectedValues {
  border: 2px dashed var(--bg4);
  border-radius: 4px;
  color: white;
  li {
    border-radius: 5px;
    background-color: var(--text1);

    .delete {
      border-radius: 100%;
      padding: 1px;
      cursor: pointer;
    }
  }

  &.formError {
    border-color: var(--redError);
    color: var(--redError);
  }

  &.formValid {
    border-color: var(--green);
  }
}
</style>
