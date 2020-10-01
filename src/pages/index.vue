<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { AuthModule } from '@store';
import { routerPagesNames } from '../models';

@Component({
  middleware: ({ redirect }) => {
    // if (AuthModule.state.loggedIn) {
    //   redirect({ name: routerPagesNames.admin.index });
    // } else {
    //   redirect({ name: routerPagesNames.login });
    // }
  },
})
export default class Index extends Vue {}
</script>
