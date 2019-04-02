<template>
  <div class="errorMessage" v-if="error || isPending">
    <span v-if="isPending" class="pending">Verification...</span>
    <ul v-else-if="dirty" class="error">
      <li v-for="key in filterErrors" :key="key">
        <span>{{ errorMessages[key] }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { errorMessagesFormater } from '@validators';
import { Forms } from '@constructors';
import { oc } from 'ts-optchain';

@Component({})
export default class FormError extends Vue {
  @Prop({ required: true })
  vl;
  @Prop()
  data: Forms.FormPayload<any> | Forms.UploadForm;

  get filterErrors() {
    return this.vl ? Object.keys(this.vl.$params).filter(key => !this.vl[key]) : null;
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

  public errorMessages = null;

  mounted() {
    this.errorMessages = errorMessagesFormater(this.vl, oc(this.data).errorMessages());
  }
}
</script>



<style lang='scss' scoped>
.errorMessage {
  display: flex;
  position: relative;
  line-height: 20px;
  padding-top: 4px;
  flex-flow: column wrap;
  justify-content: flex-start;
  font-size: 11px;
  font-weight: bold;
  color: $red1;
  margin-left: 5px;

  .pending {
    color: $orange;
  }

  &.center {
    ul li {
      justify-content: center;
    }
  }

  ul {
    display: flex;
    flex-flow: column wrap;
  }
}
</style>

