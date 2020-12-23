<template>
  <FormElementBase v-bind="baseProps">
    <Popin
      ref="popin"
      :disabled="data.disabled"
      :full="true"
      :arrow="false"
      :offset="2"
      :nested="data.nested"
      @open="handleFocus"
      @close="handleBlur"
    >
      <template #content>
        <div class="flex-nowrap flex flex-col w-full h-full">
          <div v-if="isSearch" class="flex flex-grow-0 flex-shrink-0 w-full p-2">
            <SearchField
              v-model="searchValue"
              :full="true"
              size="md"
              @echap="handleEchap"
              @enter="handleEnter"
            />
          </div>
          <div class="flex flex-grow">
            <div :spinner-size="16" class="w-full">
              <ul v-if="dynamicOptionsFiltered.length" list class="OptionsList / flex flex-grow">
                <li
                  v-for="(option, index) of dynamicOptionsFiltered"
                  :key="option.value"
                  :title="option.text"
                  :class="{
                    selected: isSelected(option),
                    focused: resultSelected === index,
                    selecting,
                  }"
                  class="OptionItem / flex"
                  @mouseenter="selecting = false"
                  @click.stop="selectOption(option)"
                >
                  <div class="flex flex-row">
                    <div v-if="atLeastOneIcon" class="image bg-center bg-no-repeat bg-cover">
                      <VImg :src="option.icon" class="rounded" />
                    </div>
                    <span class="value ellipsis">{{ option.text }}</span>
                  </div>
                  <div v-if="isSelected(option)" class="icon">
                    <SvgIcon :size="22" src="forms/done" color="green" />
                  </div>
                </li>
              </ul>

              <div
                v-else-if="hasError"
                class="center text-redError flex w-full px-4 py-2 text-sm text-center"
                >Erreur lors de la récupération des données</div
              >
            </div>
          </div>
        </div>
      </template>

      <template #button>
        <div
          :id="formId"
          :tabindex="0"
          :disabled="data.disabled"
          :style="{ width: data.width }"
          class="input-container select w-full"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown.down.up.prevent.stop="updateSelectedResult"
          @keydown.esc.prevent="handleEchap"
          @keydown.enter.prevent="handleEnter"
        >
          <div class="DisplayText / flex">
            <div v-if="data.style && data.style.icon" class="icon">
              <SvgIcon :src="data.style.icon" :size="22" :color="iconColorProps" />
            </div>
            <div :class="{ top: !!getDisplayValue }" class="Infos / flex-nowrap flex flex-col">
              <span class="placeholder text-bg10 ellipsis">
                {{ placeholder }}
              </span>
              <div v-if="getDisplayValue" class="ellipsis flex-nowrap flex items-center">
                <span class="value ellipsis">{{ getDisplayValue }}</span>
              </div>
            </div>
            <div class="icon-collapse center flex">
              <SvgIcon :size="20" class="arrow" src="forms/unfold" />
            </div>
          </div>
        </div>
      </template>
    </Popin>
    <ul
      v-if="formatedDisplayedValues.length"
      :class="{ formError, formValid }"
      class="SelectedValues / flex items-center pb-1 pl-1 mt-1"
    >
      <li
        v-for="(item, index) of formatedDisplayedValues"
        :key="index"
        class="center text-bg1 flex flex-grow-0 py-1 pl-2 pr-1 mt-1 mr-1 font-semibold rounded-md"
      >
        <span class="flex-grow text-xs">{{ item.text }}</span>
        <div v-if="!data.disabled" class="delete / flex-shrink-0 ml-1 rounded-full">
          <SvgIcon :size="14" src="actions/close" @click="removeItem(item.value)" />
        </div>
      </li>
      <!-- <span v-else class="center text-text8 flex w-full pt-1 text-sm">Aucun élément</span> -->
    </ul>
  </FormElementBase>
</template>

<script lang="ts">
import { Vue, Prop, Ref, Component, Emit } from 'nuxt-property-decorator';
import { Mixin, Mixins } from 'vue-mixin-decorator';
import { debounce } from 'lodash-es';
import { PaginationType } from '@models';
import { FormMixin } from '@mixins';
import { SelectMultipleField, SelectOption, UnPackField } from '@constructors';
import Popin from '../../../Global/Popin/Popin.vue';
import SearchField from '../../Display/SearchField.vue';

@Component({
  components: {
    SearchField,
  },
})
export default class SelectMultipleElement extends FormMixin {
  readonly value!: any[] | null;
  readonly data!: UnPackField<SelectMultipleField>;

  @Ref() popin!: Popin;
  @Emit() emitUpdate(value: SelectOption) {
    return value;
  }

  paginationType = PaginationType.ShowMore;

  public userImage = require('@images/user.jpg');
  public resultSelected = 0;
  public selecting = true;
  public cachedDisplayValues: SelectOption[] = [];
  public hasError = false;
  public immediate = false;
  public search = '';

  get getDisplayValue() {
    if (this.value && this.value.length) {
      const isPlural = this.value.length > 1;
      return `${this.value.length} élement${isPlural ? 's' : ''} sélectionné${isPlural ? 's' : ''}`;
    }
    return null;
  }

  get isSearch() {
    return this.data.innerSearch;
  }

  get isSelected() {
    return (option: SelectOption): boolean => !!this.value?.includes(option.value);
  }

  get searchValue() {
    return this.search;
  }
  set searchValue(value: string) {
    this.search = value;
  }

  get atLeastOneIcon() {
    return (
      this.data?.options?.some((option) => option.icon) ||
      this.dynamicOptions.some((option) => option.icon)
    );
  }

  get dynamicOptions(): SelectOption[] {
    if (this.data.options) {
      return this.data.options;
    }
    return [];
  }

  get dynamicOptionsFiltered() {
    return this.dynamicOptions.filter((result) => {
      if (this.data.innerSearch) {
        return result.text?.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase());
      }
      return true;
    });
  }

  get formatedDisplayedValues(): SelectOption<any>[] {
    if (this.data.options) {
      return this.data.options?.filter((f) => !!this.value?.find((val) => f.value === val));
    } else {
      return [];
    }
  }

  handleEnter(event: KeyboardEvent): void {
    if (this.isFocused) {
      if (this.popin.visible && this.dynamicOptionsFiltered) {
        this.selectOption(this.dynamicOptionsFiltered[this.resultSelected]);
        this.popin.closePopup();
      }
    }
  }

  async handleFocus() {
    if (!this.data.disabled) {
      this.isFocused = true;
    }
  }

  handleEchap() {
    this.popin.closePopup();
  }

  updateSelectedResult(event: KeyboardEvent) {
    if (this.isFocused) {
      let touche = event.which - 39;
      this.selecting = true;
      if (
        this.resultSelected + touche >= 0 &&
        this.resultSelected + touche <= this.dynamicOptions.length - 1
      ) {
        this.resultSelected += touche;
      }
      this.selecting = true;
    }
  }

  selectOption(option: SelectOption) {
    if (!this.isSelected(option)) {
      this.cachedDisplayValues.push(option);
      const value = this.value ?? [];
      this.updateValue(value.concat([option.value]));
      this.emitUpdate(option);
      this.resultSelected = 0;
    } else {
      this.removeItem(option.value);
    }
  }

  removeItem(value: string) {
    if (!this.data.disabled && this.value) {
      const newValue = this.value.filter((f) => f !== value);
      this.cachedDisplayValues = this.cachedDisplayValues.filter((f) => f.value !== value);
      this.updateValue(newValue);
    }
  }

  created() {
    if (this.data.displayedValues) {
      this.cachedDisplayValues = this.data.displayedValues;
    }
  }
}
</script>

<style lang="postcss" scoped>
ul.OptionsList {
  flex-flow: column wrap;
  width: 100%;

  li.OptionItem {
    flex-flow: row nowrap;
    height: 36px;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.1s;
    text-align: left;
    justify-content: space-between;

    &:not(:last-child) {
      border-bottom: 1px solid var(--bg3);
    }

    span.value {
      padding-left: 10px;
      font-size: 14px;
      line-height: 32px;
      color: var(--text1);
      transition: color 0.1s;
    }

    div.image {
      border-radius: 4px;
      flex: 0 0 auto;
      margin-left: 10px;
      height: 25px;
      width: 25px;
      position: relative;
    }

    div.icon {
      flex: 0 0 auto;
      padding: 10px;
    }

    &.selecting.focused {
      background-color: var(--bg3);
    }

    &.selected {
      font-weight: 600;
      cursor: default;
    }

    &:not(.selecting):hover {
      background-color: var(--bg2);
    }
  }
}

div.DisplayText {
  height: 100%;
  width: 100%;
  flex-flow: row nowrap;
  text-align: left;

  div.Infos {
    flex: 1 1 auto;
    justify-content: center;
    padding-left: 5px;
    font-weight: 500;

    span.placeholder {
      font-weight: 500;
    }

    span.value {
      font-size: 13px;
    }

    &.top {
      padding: 2px 5px;
      justify-content: space-around;
      span.placeholder {
        font-size: 10px;
      }
    }
  }

  div.icon-collapse {
    flex: 0 0 auto;
    padding: 0 0 0 5px;
  }
}

ul.SelectedValues {
  border: 2px dashed var(--green);
  border-radius: 4px;
  color: white;
  li {
    border-radius: 5px;
    background-color: var(--green);

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
