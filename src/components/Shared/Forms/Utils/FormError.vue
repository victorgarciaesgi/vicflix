<template>
  <div v-if="error" class="errorMessage">
    <!-- <span v-if="isPending" class="pending">Verification...</span> -->
    <ul v-if="!isPending && dirty && filterErrors" list class="error">
      <li v-for="key in filterErrors" :key="key">
        <span>• {{ errorMessages && errorMessages[key] }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator';
import {
  DefaultFieldStruture,
  UploadField,
  errorMessagesFormater,
  AvailableValidationsMessages,
} from '@constructors';
import { Validation } from 'vuelidate';

@Component({})
export default class FormError extends Vue {
  @Prop({ required: true })
  vl!: Validation;
  @Prop()
  data?: DefaultFieldStruture;

  get filterErrors() {
    return this.vl ? Object.keys(this.vl.$params).filter((key) => !this.vl[key]) : null;
  }
  get error() {
    return this.vl ? this.vl.$error : null;
  }
  get isPending() {
    return this.vl ? this.vl.$pending : null;
  }
  get dirty() {
    return this.vl ? this.vl.$dirty : null;
  }

  public errorMessages: AvailableValidationsMessages | null = null;

  created() {
    this.errorMessages = errorMessagesFormater(this.vl, this.data?.errorMessages);
  }
}
</script>

<style lang="postcss" scoped>
.errorMessage {
  display: flex;
  position: relative;
  flex-flow: column wrap;
  justify-content: flex-start;
  font-size: 11px;
  font-weight: bold;
  color: var(--redError);
  margin-left: 5px;
  margin-top: 2px;

  .pending {
    color: var(--yellow);
  }

  &.center {
    ul li {
      justify-content: center;
    }
  }
}
</style>
