<template>
  <FormElementBase v-bind="baseProps">
    <Popin ref="popup" :full="true" :arrow="false" :offset="2" mode="manual">
      <template #content>
        <ul
          v-if="searchResultsFiltered.length && !loading"
          list
          class="list-results column w100 flex"
        >
          <li
            v-for="(result, index) of searchResultsFiltered"
            :key="result.text"
            :class="{ selected: index === resultSelected }"
            class="result nowrap h-center p-l-10 flex"
            @mousedown="selectOption(result)"
          >
            <span class="ellipsis">{{ result.text }}</span>
          </li>
        </ul>
        <div v-else-if="!loading" class="column center w100 p-h-5 flex">
          <SvgIcon :size="30" src="sad_face" />
          <strong class="m-t-5">Aucun résultat</strong>
        </div>
      </template>
      <template #button>
        <div class="input-container w100">
          <div v-if="data.style && data.style.icon" class="icon">
            <SvgIcon :src="data.style.icon" :size="22" :color="iconColorProps" />
          </div>
          <input
            :id="formId"
            ref="input"
            v-model="searchValue"
            :readonly="data.readonly"
            :placeholder="placeholder"
            :disabled="data.disabled"
            class="input-form"
            type="text"
            :name="name"
            @focus="handleFocus"
            @blur="handleBlur"
            @keydown.down.up.prevent="updateSelectedResult($event)"
            @keydown.esc.prevent="handleBlur"
            @keydown.enter.prevent="addSelectedResult"
            @input="handleInputUpdate($event.target.value)"
          />
          <div v-if="loading" class="noshrink p-w-10 h-center flex">
            <Spinner :size="18" color="blue" />
          </div>
        </div>
      </template>
    </Popin>
  </FormElementBase>
</template>

<script lang="ts">
import { Vue, Prop, Ref } from 'nuxt-property-decorator';
import { Component, Mixin, Mixins } from 'vue-mixin-decorator';
import { debounce } from 'lodash-es';
import Axios, { Canceler } from 'axios';
import { FormMixin } from '@mixins';
import { SelectField, SelectOption, ISearchResult, PlaceField } from '@constructors';
import Popin from '../../../Global/Popin/Popin.vue';
import SearchField from '../../Display/SearchField.vue';

const GEO_URL = 'https://geo.api.gouv.fr/communes';

const CancelToken = Axios.CancelToken;
let cancel: Canceler | null = null;

@Component({
  components: {
    SearchField,
  },
})
export default class PlaceElement extends FormMixin {
  readonly value!: any;
  readonly data!: PlaceField;

  @Ref() popup!: Popin;

  public resultSelected = 0;
  public searchValue = '';
  public searchResults: SelectOption[] = [];
  public loading = false;
  public filterSearch = '';
  public cachedDisplayValue = '';

  handleInputUpdate(value: string) {
    return debounce((value) => {
      console.log(value);
      if (value.length > 0) {
        this.handleSearch(value);
      } else if (value.length === 0) {
        this.popup.closePopup();
        this.searchResults = [];
        this.updateValue(null);
      }
    }, this.data.debounce)(value);
  }

  handleFocus() {
    if (this.searchResults.length) {
      this.popup.showPopup();
    } else if (this.searchValue) {
      this.handleSearch(this.searchValue);
    }
    this.isFocused = true;
  }

  handleBlur() {
    this.isFocused = false;
    this.$nextTick(() => this.popup.closePopup());
  }

  get searchResultsFiltered() {
    return this.searchResults.slice(0, 4);
  }

  async handleSearch(value: string) {
    try {
      this.loading = true;
      if (typeof cancel === 'function') {
        cancel();
      }

      const { data } = await Axios.get<ISearchResult[]>(GEO_URL, {
        params: {
          boost: 'population',
          limit: 4,
          geometry: 'centre',
          fields: 'centre,departement,codesPostaux',
          nom: value,
        },
        cancelToken: new CancelToken((c) => {
          cancel = c;
        }),
      });
      this.newContent(data);
    } finally {
      this.loading = false;
    }
  }

  newContent(content: ISearchResult[]) {
    if (this.data.formater) {
      this.searchResults = content.map(this.data.formater);
      this.popup.showPopup();
    }
  }

  addSelectedResult() {
    this.selectOption({
      ...this.searchResultsFiltered[this.resultSelected],
    });
  }

  updateSelectedResult(event: KeyboardEvent) {
    if (!this.isFocused) {
      if (this.searchResults.length || this.searchValue) {
        this.popup.showPopup();
      }
    } else {
      let touche = event.which - 39;
      if (
        this.resultSelected + touche >= 0 &&
        this.resultSelected + touche <= this.searchResultsFiltered.length - 1
      ) {
        this.resultSelected += touche;
      }
    }
  }

  created() {}

  async beforeMount() {
    if (this.data.displayValue) {
      this.searchValue = this.data.displayValue.text;
    }
  }

  selectOption(data: SelectOption) {
    if (data) {
      const newValue = data.value;
      this.updateValue(newValue);
      this.searchValue = data.text;
      this.searchResults = [];
      this.resultSelected = 0;
      this.popup.closePopup();
    }
  }
}
</script>

<style lang="postcss" scoped>
ul.list-results {
  li.result {
    height: 40px;
    background-color: white;
    cursor: pointer;

    &:not(.selected):hover {
      background-color: var(--w245);
    }
    &.selected {
      background-color: var(--blue);
      color: white;
    }
  }
}

ul.selectedValues {
  border: 2px dashed var(--w230);
  border-radius: 4px;
  padding-left: 5px;
  padding-bottom: 5px;
  li {
    border-radius: 4px;
    background-color: var(--blue) 2;
    margin: 5px 5px 0px 0px;

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
