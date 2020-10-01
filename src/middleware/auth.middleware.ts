import { Middleware } from '@nuxt/types';
import { AuthModule } from '@store';

const auth: Middleware = async ({ redirect, route }) => {
  if (!AuthModule.state.loggedIn) {
    redirect(`/login?nextRoute=${route.fullPath}`);
  } else {
    // await AuthModule.actions.reloadInfos();
  }
};

export default auth;
