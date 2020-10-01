import { Middleware } from '@nuxt/types';
import { AuthModule } from '@store';

const noauth: Middleware = async ({ redirect, route }) => {
  if (AuthModule.state.loggedIn) {
    AuthModule.actions.disconnect();
  }
};

export default noauth;
