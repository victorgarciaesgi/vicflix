
<script lang="js">
import Vue from 'vue';
import { Component, Prop, Model } from 'vue-property-decorator';

@Component({
  props: ['limit']
})
export default class LimitRender extends Vue {

  render(h) {
    return <div class='paginationView-root'>
      {this.$slots.default.slice(0,this.limit)}
    </div>;
  }
}
</script>



<style lang='scss' scoped>
div.paginationView-root {
  display: flex;
  flex-flow: inherit;
  width: 100%;
  justify-content: inherit;
}
</style>

