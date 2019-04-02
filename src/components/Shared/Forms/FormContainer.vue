<template>
  <div class="form-container-root flex">
    <component
      :is="value.component"
      v-for="(value, key) in fieldsData"
      :key="key"
      v-model="cloneFormValues[key]"
      :vl="vl ? vl[key] : null"
      :data="value"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { FormText, FormCheckBox, FormField, FormUpload, FormSelect } from './';
import { Forms } from '@constructors';

@Component({
  components: { FormText, FormCheckBox, FormField, FormUpload, FormSelect },
})
export default class FormContainer extends Vue {
  @Prop()
  form: Forms.Form<any>;
  @Prop()
  vl: any;

  get fieldsData() {
    return this.form.fieldsData;
  }

  private cloneFormValues = {};

  generateForm() {
    Object.keys(this.form.fieldsValues).map(key => {
      Object.defineProperty(this.cloneFormValues, key, {
        get: () => {
          if (typeof this.form.fieldsValues[key] === 'function') {
            return this.form.fieldsValues[key]();
          } else {
            return this.form.fieldsValues[key];
          }
        },
        set: value => {
          const newForm = this.form;
          newForm.fieldsValues[key] = value;
          this.$emit('update:form', newForm);
        },
      });
    });
  }

  created() {
    this.generateForm();
  }
}
</script>



<style lang='scss' scoped>
div.form-container-root {
  flex-flow: column wrap;
  width: 100%;
}
</style>

